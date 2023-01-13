import sortBy from 'lodash/sortBy';

import {Draw} from '../gameSystems/Draw';
import {AudioSystem} from '../gameSystems/AudioSystem';

import {Building} from './Building';

import {Monster} from '../monsters/Monster';

import ParameterItem from '../../models/ParameterItem';
import Improvement from '../../models/Improvement';
import {Arrow} from '../../models/Arrow';
import ImprovementParameterItem from '../../models/ImprovementParameterItem';
import AnimationInfinite from '../../models/AnimationInfinite';

import { Helper } from '../helpers/Helper';

import towerImage from '../../assets/img/buildings/tower/tower.png';  
import arrowImage from '../../assets/img/buildings/tower/arrow.png';  

import fireArrowImproveImage from '../../assets/img/buildings/tower/fire/fireArrowImprove.png';  
import brazierImage from '../../assets/img/buildings/tower/fire/brazier.png'; 
import fireImage from '../../assets/img/buildings/tower/fire/fire.png'; 

import dynamitArrowImproveImage from '../../assets/img/buildings/tower/dynamit/dynamitArrowImprove.png'; 
import dynamitPackImage from '../../assets/img/buildings/tower/dynamit/dynamitPack.png'; 
import dynamitImage from '../../assets/img/buildings/tower/dynamit/dynamit.png'; 

import fireIcon from '../../assets/img/icons/fire.png';  
import swordIcon from '../../assets/img/icons/sword.png';  
import bowmanIcon from '../../assets/img/icons/bow.png';  
import rechargeIcon from '../../assets/img/icons/recharge.png';  
import radiusIcon from '../../assets/img/icons/radius.png';  
import boomIcon from '../../assets/img/icons/boom.png';  

import arrowStrikeSound from '../../assets/sounds/buildings/tower/arrow_strike.mp3';   

/** Башня - тип здания - стреляет стрелами по монстрам */
export class Tower extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 200 * 0.7;
	static readonly height: number = 425 * 0.7;

	static readonly imageArrow: HTMLImageElement = new Image();
	static readonly price: number = 50; //цена здания
	static readonly initArrowSpeed: number = 500; 

	//поля свойства экземпляра
	bowmans: number = 1; //кол-во лучников
	damage: number = 1; //урон от одной атаки
	arrowSpeed: number = Tower.initArrowSpeed; //скорость полёта стрелы (в пикселях за секунду)
	radiusAttack: number = 400; //радиус атаки
	rechargeTimeMs: number = 1000; //время перезарядки (миллисекунды)

	isHasFireArrows: boolean = false; //имеет ли огненные стрелы?
	private _brazierAnimation: AnimationInfinite = new AnimationInfinite(6, 900); //отображается на башне после улучшения до огненных стрел
	private _fireAnimation: AnimationInfinite = new AnimationInfinite(35, 1000); //отображается на стреле после улучшения до огненных стрел

	isHasDynamitArrows: boolean = false; //имеет ли взрывающиеся стрелы с динамитом?
	private _dyamitPackImage: HTMLImageElement = new Image(); //отображается на башне после улучшения до взрывных стрел
	private _dyamitImage: HTMLImageElement = new Image(); //отображается на стреле после улучшения до взрывных стрел

	//технические поля экземпляра
	private _rechargeLeftTimeMs: number = 0; //сколько осталось времени перезарядки (миллисекунды)
	private _arrows: Arrow[] = [];
	private _bowmansWaiting: number = 0; //сколько стрелков ещё не отстрелялось?
	private _bowmansDelayLeftTimeMs: number = 0; //сколько осталось времени до стрельбы следующего лучника (миллисекунды)
	private _isDisplayRadius: boolean = false; //рисовать радиус атаки? 

	constructor(x: number) {
		super(x, 
			(Draw.canvas ? Draw.canvas.height : 0) - Tower.height + 10, 
			false,
			true, //isLand
			'Сторожевая башня', 
			Tower.image, 0, 0, Tower.width, Tower.height, 15, 
			100, //health max
			Tower.price, // price
			'Стреляет по монстрам в радиусе действия.',
			true, true);

		this.maxImpulse = 5;
		this.impulseForceDecreasing = 5;

		Tower.init(true); //reserve
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			this.image.src = towerImage; 
		}
	}
	
	static loadResourcesAfterBuild() {
		this.imageArrow.src = arrowImage; 

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
	}

	improveToDynamitArrows(){
		this.isHasDynamitArrows = true;
		this._dyamitPackImage.src = dynamitPackImage;
		this._dyamitImage.src = dynamitImage;
	}

	get centerY(){
		return this.y + this.height / 4;
	}

	displayRadius(){
		this._isDisplayRadius = true;
	}

	hideRadius(){
		this._isDisplayRadius = false;
	}

	logic(drawsDiffMs: number, monsters: Monster[], bottomShiftBorder: number)
	{
		super.logic(drawsDiffMs, monsters, bottomShiftBorder);

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

			//delete
			if(arrow.location.x + arrow.size.width < 0 || arrow.location.x > Draw.canvas.width || 
				arrow.location.y + arrow.size.height < 0 || arrow.location.y > Draw.canvas.height ||
				arrow.leftTimeMs < 0)
			{
				this._arrows.splice(i, 1);
				i--;
			}
			else if(!endMoving){
				let arrowCenterX = arrow.location.x + arrow.size.width / 2;
				let arrowCenterY = arrow.location.y + arrow.size.height / 2;
				let monsterGoal = monsters.find(monster => 
					arrowCenterX > monster.x && arrowCenterX < monster.x + monster.width && 
					arrowCenterY > monster.y && arrowCenterY < monster.y + monster.animation.image.height);
				if(monsterGoal){
					monsterGoal.health -= this.damage;
					this._arrows.splice(i, 1);
					i--;
				}
			}
			else if(endMoving){
				arrow.isFire = false;
				if(this.isHasDynamitArrows){
					//TOOD: boom
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

		this._arrows.push(new Arrow(x1, y1, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 20, dx, dy, rotate, this.isHasFireArrows, this.isHasDynamitArrows));
		AudioSystem.play(this.centerX, arrowStrikeSound, 1, this.arrowSpeed / Tower.initArrowSpeed, true);

		if(this._rechargeLeftTimeMs <= 0){
			this._rechargeLeftTimeMs = this.rechargeTimeMs;
		}
		this._bowmansDelayLeftTimeMs = this.rechargeTimeMs / 10 / this.bowmans;
		this._bowmansWaiting--;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, isBuildingMode: boolean = false): void{
		//стрелы
		for(let i = 0; i < this._arrows.length; i++)
		{
			let arrow = this._arrows[i];

			Draw.ctx.setTransform(1, 0, 0, 1, arrow.location.x + arrow.size.width / 2, arrow.location.y + arrow.size.height / 2); 
			Draw.ctx.rotate(arrow.rotate * Math.PI / 180);
			Draw.ctx.drawImage(Tower.imageArrow, -arrow.size.width / 2, -arrow.size.height / 2, arrow.size.width, arrow.size.height);
			if(arrow.isDynamit && this._dyamitImage.complete){
				Draw.ctx.drawImage(this._dyamitImage, -this._dyamitImage.width / 2, -this._dyamitImage.height / 2, this._dyamitImage.width, this._dyamitImage.height);
			}
			if(arrow.isFire && this._fireAnimation.image.complete){ 
				Draw.ctx.rotate(-90 * Math.PI / 180);
				this._fireAnimation.draw(drawsDiffMs, isGameOver, -arrow.size.height * 1.5, -arrow.size.width, arrow.size.height * 3, arrow.size.width * 2);
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

		if(this.isHasDynamitArrows && this._dyamitPackImage.complete){
			Draw.ctx.drawImage(this._dyamitPackImage, this.x + 35, this.y + 115, this._dyamitPackImage.width, this._dyamitPackImage.height);
		}

		if(this.isHasFireArrows && this._brazierAnimation.image.complete){
			this._brazierAnimation.draw(drawsDiffMs, isGameOver, this.x + 80, this.y + 110)
		}
	}
}