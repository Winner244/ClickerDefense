import sortBy from 'lodash/sortBy';

import {Draw} from '../gameSystems/Draw';
import {AudioSystem} from '../gameSystems/AudioSystem';
import {AnimationsSystem} from '../gameSystems/AnimationsSystem';

import {ImageHandler} from '../ImageHandler';

import {Building} from './Building';

import {Monster} from '../monsters/Monster';

import {FireModifier} from '../modifiers/FireModifier';

import {Arrow} from '../../models/Arrow';
import {AnimatedObject} from '../../models/AnimatedObject';
import Animation from '../../models/Animation';
import AnimationInfinite from '../../models/AnimationInfinite';
import Improvement from '../../models/Improvement';
import ParameterItem from '../../models/ParameterItem';
import ImprovementParameterItem from '../../models/ImprovementParameterItem';
import ShopItem from '../../models/ShopItem';

import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

import {Helper} from '../helpers/Helper';

import towerImage from '../../assets/img/buildings/tower/tower.png';  
import arrowImage from '../../assets/img/buildings/tower/arrow.png';  

import fireArrowImproveImage from '../../assets/img/buildings/tower/fire/fireArrowImprove.png';  
import brazierImage from '../../assets/img/buildings/tower/fire/brazier.png'; 
import fireImage from '../../assets/img/buildings/tower/fire/fire.png'; 

import dynamitArrowImproveImage from '../../assets/img/buildings/tower/dynamit/dynamitArrowImprove.png'; 
import dynamitPackImage from '../../assets/img/buildings/tower/dynamit/dynamitPack.png'; 
import dynamitImage from '../../assets/img/buildings/tower/dynamit/dynamit.png'; 
import dynamitExplosionImage from '../../assets/img/explosionBomb.png'; 

import fireIcon from '../../assets/img/icons/fire.png';  
import swordIcon from '../../assets/img/icons/sword.png';  
import bowmanIcon from '../../assets/img/icons/bow.png';  
import rechargeIcon from '../../assets/img/icons/recharge.png';  
import radiusIcon from '../../assets/img/icons/radius.png';  
import boomIcon from '../../assets/img/icons/boom.png';  
import timerIcon from '../../assets/img/icons/timer.png';  

import arrowStrikeSound from '../../assets/sounds/buildings/tower/arrow_strike.mp3'; 
import arrowFireStrikeSound from '../../assets/sounds/buildings/tower/fire_arrow_strike.mp3'; 
import arrowDynamitStrikeSound from '../../assets/sounds/buildings/tower/dynamit_arrow_strike.mp3'; 

import explosionDynamitSound from '../../assets/sounds/explosionBomb.mp3'; 
import explosionDynamit2Sound from '../../assets/sounds/explosionBomb2.mp3'; 


/** Башня - тип здания - стреляет стрелами по монстрам */
export class Tower extends Building{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	static readonly image: HTMLImageElement = new Image();

	static readonly imageArrow: HTMLImageElement = new Image();
	static readonly initArrowSpeed: number = 500; 

	static readonly shopItem: ShopItem = new ShopItem('Сторожевая башня', Tower.image, 50, 'Стреляет по монстрам в радиусе действия.', ShopCategoryEnum.BUILDINGS);

	//поля свойства экземпляра
	bowmans: number = 1; //кол-во лучников
	damage: number = 1; //урон от одной атаки
	arrowSpeed: number = Tower.initArrowSpeed; //скорость полёта стрелы (в пикселях за секунду)
	radiusAttack: number = 400; //радиус атаки
	rechargeTimeMs: number = 1000; //время перезарядки (миллисекунды)

	//огненные стрелы
	isHasFireArrows: boolean = false; //имеет ли огненные стрелы?
	fireDamageInSecond: number = 0.3; //урона от огня стрел в секунду
	fireDurationMs: number = 7000; //время горения монстров
	private _brazierAnimation: AnimationInfinite = new AnimationInfinite(6, 900); //отображается на башне после улучшения до огненных стрел
	private _fireAnimation: AnimationInfinite = new AnimationInfinite(35, 1000); //отображается на стреле после улучшения до огненных стрел
	private _isLastArrowWasFire: boolean = false; //последняя стрела была огненной? (если одновременно стоит динамитные стрелы и огненные, то они чередоваться должны)


	//стрелы с динамитом
	isHasDynamitArrows: boolean = false; //имеет ли взрывающиеся стрелы с динамитом?
	dynamitRadius: number = 50; //радиус взрыва динамита
	dynamitDamage: number = 1; //урона от взрыва динамита 
	private _dynamitPackImage: HTMLImageElement = new Image(); //отображается на башне после улучшения до взрывных стрел
	private _dynamitImage: HTMLImageElement = new Image(); //отображается на стреле после улучшения до взрывных стрел
	private _isDisplayDynamitRadius: boolean = false; //рисовать радиус взрыва динамита? 
	private _dynamitExplosionImage: HTMLImageElement = new Image(); //анимация взрыва динамита

	//технические поля экземпляра
	private _rechargeLeftTimeMs: number = 0; //сколько осталось времени перезарядки (миллисекунды)
	private _arrows: Arrow[] = [];
	private _bowmansWaiting: number = 0; //сколько стрелков ещё не отстрелялось?
	private _bowmansDelayLeftTimeMs: number = 0; //сколько осталось времени до стрельбы следующего лучника (миллисекунды)
	private _isDisplayRadius: boolean = false; //рисовать радиус атаки? 

	constructor(x: number) {
		super(x, 
			(Draw.canvas ? Draw.canvas.height : 0) - Tower.image.height * 0.7 + 10, 
			false,
			true, //isLand
			Tower.name, 0.7,
			Tower.image, 0, 0, 15, 
			100, //health max
			Tower.shopItem.price,
			true, true,
			Tower.imageHandler);

		this.maxImpulse = 5;
		this.impulseForceDecreasing = 5;

		Tower.init(true); //reserve
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			Tower.imageHandler.new(Tower.image).src = towerImage;
		}
	}
	
	static loadResourcesAfterBuild() {
		Tower.imageArrow.src = arrowImage; 

		AudioSystem.load(arrowStrikeSound);
	}

	loadedResourcesAfterBuild(){
		super.loadedResourcesAfterBuild();

		this.infoItems.splice(1, 0, new ParameterItem('Урон', () => this.damage, swordIcon, 40, () => this.damage += 1));
		this.infoItems.splice(2, 0, new ParameterItem('Лучников', () => this.bowmans, bowmanIcon, 40 * 2, () => this.bowmans += 1));
		this.infoItems.splice(3, 0, new ParameterItem('Перезарядка', () => (this.rechargeTimeMs / 1000).toFixed(2) + ' сек', rechargeIcon, 40, () => this.rechargeTimeMs *= 0.9));
		this.infoItems.splice(4, 0, new ParameterItem('Радиус атаки', () => this.radiusAttack, radiusIcon, 40, () => this.radiusAttack += 100, this.displayRadius.bind(this), this.hideRadius.bind(this) ));
		this.infoItems.splice(5, 0, new ParameterItem('Скорость стрел', () => this.arrowSpeed, '', 10, () => this.arrowSpeed += 150));

		this.improvements.push( new Improvement('Огненные стрелы', 100, fireArrowImproveImage, () => this.improveToFireArrows(), [
			new ImprovementParameterItem('+', fireIcon)
		]));
		this.improvements.push( new Improvement('Взрывные стрелы', 100, dynamitArrowImproveImage, () => this.improveToDynamitArrows(), [
			new ImprovementParameterItem('+', boomIcon)
		]));
	}

	improveToFireArrows(){
		this.isHasFireArrows = true;
		this._brazierAnimation.image.src = brazierImage;
		this._fireAnimation.image.src = fireImage;
		AudioSystem.load(arrowFireStrikeSound);
		this.infoItems.push(new ParameterItem('Урон огня', () => this.fireDamageInSecond.toFixed(1) + '/сек', fireIcon, this.price / 2, () => this.fireDamageInSecond += 0.1));
		this.infoItems.push(new ParameterItem('Время жизни огня', () => (this.fireDurationMs / 1000).toFixed(0) + 'сек', timerIcon, this.price / 2, () => this.fireDurationMs += 1000));
		FireModifier.loadResources();
	}

	improveToDynamitArrows(){
		this.isHasDynamitArrows = true;
		this._dynamitPackImage.src = dynamitPackImage;
		this._dynamitImage.src = dynamitImage;
		AudioSystem.load(arrowDynamitStrikeSound);
		AudioSystem.load(explosionDynamitSound);
		AudioSystem.load(explosionDynamit2Sound);
		this.infoItems.push(new ParameterItem('Радиус взрыва', () => this.dynamitRadius, '', this.price / 2, () => this.dynamitRadius += 20, this.displayDynamitRadius.bind(this), this.hideDynamitRadius.bind(this)));
		this.infoItems.push(new ParameterItem('Урон взрыва', () => this.dynamitDamage.toFixed(1), boomIcon, this.price, () => this.dynamitDamage += 0.5));
		this._dynamitExplosionImage.src = dynamitExplosionImage;
	}

	get centerY(){
		return this.y + this.height / 4;
	}

	private displayRadius(){
		this._isDisplayRadius = true;
	}

	private hideRadius(){
		this._isDisplayRadius = false;
	}

	private displayDynamitRadius(){
		this._isDisplayDynamitRadius = true;
	}

	private hideDynamitRadius(){
		this._isDisplayDynamitRadius = false;
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], bottomShiftBorder: number, isWaveStarted: boolean)
	{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logic(drawsDiffMs, buildings, monsters, bottomShiftBorder, isWaveStarted);

		if(this._rechargeLeftTimeMs > 0){ //перезарядка
			this._rechargeLeftTimeMs -= drawsDiffMs;
			this._bowmansDelayLeftTimeMs -= drawsDiffMs;
		}
		else{
			this._bowmansWaiting = this.bowmans;
		}

		if(this._bowmansDelayLeftTimeMs <= 0 && this._bowmansWaiting > 0) {
			if(monsters.length){
				let monstersInRadius = monsters.filter(monster => Helper.getDistance(this.centerX, this.centerY, monster.centerX, monster.centerY) < this.radiusAttack);
				if (monstersInRadius.length){

					const skipCount = this.bowmans <= monstersInRadius.length 
						? this.bowmans - this._bowmansWaiting 
						: (this.bowmans - this._bowmansWaiting) % monstersInRadius.length;

					let sortedMonstersByDistance: Monster[] = [];
					if(this.bowmans > 1){
						const landMonsters = sortBy(monstersInRadius.filter(x => x.isLand), [monster => Helper.getDistance(this.centerX, this.centerY, monster.centerX, monster.centerY)]);
						const flyMonsters = sortBy(monstersInRadius.filter(x => !x.isLand), [monster => Helper.getDistance(this.centerX, this.centerY, monster.centerX, monster.centerY)]);
						sortedMonstersByDistance = (skipCount % 2 == 0 ? landMonsters : flyMonsters).concat((skipCount % 2 == 0 ? flyMonsters : landMonsters));
					}
					else{
						sortedMonstersByDistance = sortBy(monstersInRadius, [monster => Helper.getDistance(this.centerX, this.centerY, monster.centerX, monster.centerY)]);
					}
					
					const monsterGoal = sortedMonstersByDistance[skipCount];
					if(monsterGoal){ //в радиусе атаки
						this.attack(monsterGoal.centerX, monsterGoal.centerY);
					}
				}
			}
		}

		if(isWaveStarted && (this._isDisplayRadius || this._isDisplayDynamitRadius)){
			this._isDisplayRadius = false;
			this._isDisplayDynamitRadius = false;
		}

		for(let i = 0; i < this._arrows.length; i++)
		{
			let arrow = this._arrows[i];
			let endMoving = true;
			arrow.leftTimeMs -= drawsDiffMs;

			//moving
			if(arrow.location.y + arrow.size.height < Draw.canvas.height - bottomShiftBorder - 10){
				arrow.location.x -= arrow.dx * (drawsDiffMs / 1000);
				arrow.location.y -= arrow.dy * (drawsDiffMs / 1000);
				endMoving = false;
			}

			//delete - выход за границу экрана или по истечению времени жизни стрелы
			if(arrow.location.x + arrow.size.width < 0 || arrow.location.x > Draw.canvas.width || 
				arrow.location.y + arrow.size.height < 0 || arrow.location.y > Draw.canvas.height ||
				arrow.leftTimeMs < 0)
			{
				this._arrows.splice(i, 1);
				i--;
			}
			else if(!endMoving){
				let monsterGoal = monsters.find(monster => 
					arrow.centerX > monster.x && arrow.centerX < monster.x + monster.width && 
					arrow.centerY > monster.y && arrow.centerY < monster.y + monster.height);

				//попадание в цель
				if(monsterGoal){ 
					monsterGoal.applyDamage(this.damage);
					this._arrows.splice(i, 1);
					i--;

					if(arrow.isDynamit){
						this.dynamitExplosion(arrow.centerX - arrow.dx / 20, arrow.centerY - arrow.dy / 20, monsters);
					}
					else if(arrow.isFire){
						const fireModifier = new FireModifier(this.fireDamageInSecond, this.fireDurationMs);
						monsterGoal.addModifier(fireModifier);
						//даже если стрела убьёт, то хотя бы подожгёт рядом стоящих монстров
						fireModifier.logicSpread(monsterGoal, monsters, true);
						//TODO: add animation of fire ball
					}
				}
			}
			else if(endMoving){
				arrow.isFire = false;
				if(this.isHasDynamitArrows){
					this.dynamitExplosion(arrow.centerX, arrow.centerY, monsters);
					this._arrows.splice(i, 1);
					i--;
				}
			}
		}
	}

	attack(monsterGoalCenterX: number, monsterGoalCenterY: number): void {
		let x1 = this.centerX - Tower.imageArrow.width / 2;
		let y1 = this.centerY - Tower.imageArrow.height / 2;
		let x2 = monsterGoalCenterX - Tower.imageArrow.width / 2;
		let y2 = monsterGoalCenterY - Tower.imageArrow.height / 2;

		let rotate = Helper.getRotateAngle(x1, y1, x2, y2);
		let distance = Helper.getDistance(x1, y1, x2, y2);
		let dx = (x1 - x2) / (distance / this.arrowSpeed);
		let dy = (y1 - y2) / (distance / this.arrowSpeed);

		let isFireArrow = this.isHasFireArrows;
		let isDynamitArrow = this.isHasDynamitArrows;
		if(this.isHasDynamitArrows && this.isHasFireArrows){
			if(this._isLastArrowWasFire && isFireArrow){
				isFireArrow = false;
			}
			else if(isFireArrow) {
				isDynamitArrow = false;
			}
			else if (isDynamitArrow){
				isFireArrow = false;
			}
		}
		this._isLastArrowWasFire = isFireArrow;
		this._arrows.push(new Arrow(x1, y1, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 20, dx, dy, rotate, isFireArrow, isDynamitArrow));
		if(isDynamitArrow){
			AudioSystem.play(this.centerX, arrowDynamitStrikeSound, 0.1, this.arrowSpeed / Tower.initArrowSpeed, true);
		}
		AudioSystem.play(this.centerX, arrowStrikeSound, 1, this.arrowSpeed / Tower.initArrowSpeed, true);
		if(isFireArrow){
			AudioSystem.play(this.centerX, arrowFireStrikeSound, 0.1, this.arrowSpeed / Tower.initArrowSpeed, true);
		}

		if(this._rechargeLeftTimeMs <= 0){
			this._rechargeLeftTimeMs = this.rechargeTimeMs;
		}
		this._bowmansDelayLeftTimeMs = this.rechargeTimeMs / 10 / this.bowmans;
		this._bowmansWaiting--;
	}

	dynamitExplosion(centerX: number, centerY: number, monsters: Monster[]){
		AnimationsSystem.add(new AnimatedObject(centerX - this.dynamitRadius, centerY - this.dynamitRadius, this.dynamitRadius * 2, this.dynamitRadius * 2, true, 
			new Animation(8, 500, this._dynamitExplosionImage))); 
		monsters
			.forEach(monster => {
				const distance = Helper.getDistance(monster.centerX, monster.centerY, centerX, centerY);
				if(distance <= this.dynamitRadius){
					monster.applyDamage(this.dynamitDamage);
				}
				else if(distance < this.dynamitRadius * 1.5){
					const damage = this.dynamitDamage * ((this.dynamitRadius * 1.5 - distance) / this.dynamitRadius);
					monster.applyDamage(damage);
				}
			})
		
		AudioSystem.playRandomV(centerX, [explosionDynamitSound, explosionDynamit2Sound], 0.1, false, 1, true);
	}

	draw(drawsDiffMs: number, isGameOver: boolean, isBuildingMode: boolean = false): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		//стрелы
		for(let i = 0; i < this._arrows.length; i++)
		{
			let arrow = this._arrows[i];

			Draw.ctx.setTransform(1, 0, 0, 1, arrow.location.x + arrow.size.width / 2, arrow.location.y + arrow.size.height / 2); 
			Draw.ctx.rotate(arrow.rotate * Math.PI / 180);
			Draw.ctx.drawImage(Tower.imageArrow, -arrow.size.width / 2, -arrow.size.height / 2, arrow.size.width, arrow.size.height);
			if(arrow.isDynamit && this._dynamitImage.complete){
				Draw.ctx.drawImage(this._dynamitImage, -this._dynamitImage.width / 2, -this._dynamitImage.height / 2, this._dynamitImage.width, this._dynamitImage.height);
			}
			if(arrow.isFire && this._fireAnimation.image.complete){ 
				Draw.ctx.rotate(-90 * Math.PI / 180);
				this._fireAnimation.draw(drawsDiffMs, isGameOver, -arrow.size.height / 2, -arrow.size.width / 2, arrow.size.height, arrow.size.width);
			}
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);
		}

		//display radius attack
		if(isBuildingMode || this._isDisplayRadius){
			Draw.ctx.beginPath();
			Draw.ctx.arc(this.centerX, this.centerY, this.radiusAttack, 0, 2 * Math.PI, false);
			Draw.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
			Draw.ctx.fill();
			Draw.ctx.lineWidth = 2;
			Draw.ctx.strokeStyle = 'rgb(0, 255, 0)';
			Draw.ctx.stroke();
		}

		super.draw(drawsDiffMs, isGameOver, isBuildingMode);

		if(this.isHasDynamitArrows && this._dynamitPackImage.complete){
			Draw.ctx.drawImage(this._dynamitPackImage, this.x + 35, this.y + 115, this._dynamitPackImage.width, this._dynamitPackImage.height);
		}

		if(this.isHasFireArrows && this._brazierAnimation.image.complete){
			this._brazierAnimation.draw(drawsDiffMs, isGameOver, this.x + 80, this.y + 110)
		}

		if(this._isDisplayDynamitRadius){
			Draw.ctx.beginPath();
			Draw.ctx.arc(this.centerX + (this.isLeftSide ? -1 : 1) * 200, this.y + this.height - 50, this.dynamitRadius, 0, 2 * Math.PI, false);
			Draw.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
			Draw.ctx.fill();
			Draw.ctx.lineWidth = 2;
			Draw.ctx.strokeStyle = 'rgb(0, 255, 0)';
			Draw.ctx.stroke();
		}
	}
}