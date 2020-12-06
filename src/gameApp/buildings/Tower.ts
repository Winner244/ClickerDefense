import sortBy from 'lodash/sortBy';

import {Draw} from '../gameSystems/Draw';
import {AudioSystem} from '../gameSystems/AudioSystem';

import {ImageHandler} from '../ImageHandler';

import {Building} from './Building';

import {Monster} from '../monsters/Monster';

import {Unit} from '../units/Unit';

import {FireModifier} from '../modifiers/FireModifier';

import {MovingObjects} from '../movingObjects/MovingObjects';
import {MovingObject} from '../../models/objects/MovingObject';
import {Arrow} from '../movingObjects/Arrow';

import AnimationInfinite from '../../models/animations/AnimationInfinite';
import Improvement from '../../models/shop/Improvement';
import ParameterItem from '../../models/shop/ParameterItem';
import ImprovementParameterItem from '../../models/shop/ImprovementParameterItem';
import ShopItem from '../../models/shop/ShopItem';

import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

import {Helper} from '../helpers/Helper';

import {WavesState} from '../WavesState';

import towerImage from '../../assets/img/buildings/tower/tower.png';  

import fireArrowImproveImage from '../../assets/img/buildings/tower/fire/fireArrowImprove.png';  
import brazierImage from '../../assets/img/buildings/tower/fire/brazier.png'; 

import dynamitArrowImproveImage from '../../assets/img/buildings/tower/dynamit/dynamitArrowImprove.png'; 
import dynamitPackImage from '../../assets/img/buildings/tower/dynamit/dynamitPack.png'; 

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


/** Башня - тип здания - стреляет стрелами по монстрам */
export class Tower extends Building{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	static readonly image: HTMLImageElement = new Image();

	static readonly initArrowSpeed: number = 500; 

	static readonly shopItem: ShopItem = new ShopItem('Сторожевая башня', Tower.image, 40, 'Стреляет по монстрам в радиусе действия.', ShopCategoryEnum.BUILDINGS, 20);

	public static readonly FIRE_ARROWS_IMPROVEMENT = 'fire_arrows_improvement';
	public static readonly DYNAMIT_ARROWS_IMPROVEMENT = 'dynamit_arrows_improvement';

	public static readonly DAMAGE_PARAMETER = 'tower_damage_parameter';
	public static readonly BOWMANS_PARAMETER = 'tower_bowmans_parameter';
	public static readonly RECHARGE_PARAMETER = 'tower_recharge_parameter';
	public static readonly RADIUS_PARAMETER = 'tower_radius_parameter';
	public static readonly ARROW_SPEED_PARAMETER = 'tower_arrow_speed_parameter';
	public static readonly FIRE_DAMAGE_PARAMETER = 'tower_fire_damage_parameter';
	public static readonly FIRE_MINIMAL_PARAMETER = 'tower_fire_minimal_parameter';
	public static readonly FIRE_DURATION_PARAMETER = 'tower_fire_duration_parameter';
	public static readonly DYNAMIT_RADIUS_PARAMETER = 'tower_dynamit_radius_parameter';
	public static readonly DYNAMIT_DAMAGE_PARAMETER = 'tower_dynamit_damage_parameter';

	//поля свойства экземпляра
	bowmans: number = 1; //кол-во лучников
	damage: number = 1; //урон от одной атаки
	arrowSpeed: number = Tower.initArrowSpeed; //скорость полёта стрелы (в пикселях за секунду)
	radiusAttack: number = 400; //радиус атаки
	rechargeTimeMs: number = 1000; //время перезарядки (миллисекунды)

	//огненные стрелы
	isHasFireArrows: boolean = false; //имеет ли огненные стрелы?
	fireDamageInSecondPercentage: number = 5; //урона от огня стрел в секунду (В процентах от максимальных хп монстра)
	fireDamageInSecondMinimal: number = 0.3; //урона от огня стрел в секунду (минимальный)
	fireDurationMs: number = 7000; //время горения монстров
	private _brazierAnimation: AnimationInfinite = new AnimationInfinite(6, 900); //отображается на башне после улучшения до огненных стрел
	private _isLastArrowWasFire: boolean = false; //последняя стрела была огненной? (если одновременно стоит динамитные стрелы и огненные, то они чередоваться должны)


	//стрелы с динамитом
	isHasDynamitArrows: boolean = false; //имеет ли взрывающиеся стрелы с динамитом?
	dynamitRadius: number = 50; //радиус взрыва динамита
	dynamitDamage: number = 1; //урона от взрыва динамита 
	private _dynamitPackImage: HTMLImageElement = new Image(); //отображается на башне после улучшения до взрывных стрел
	private _isDisplayDynamitRadius: boolean = false; //рисовать радиус взрыва динамита? 

	//технические поля экземпляра
	private _rechargeLeftTimeMs: number = 0; //сколько осталось времени перезарядки (миллисекунды)
	private _bowmansWaiting: number = 0; //сколько стрелков ещё не отстрелялось?
	private _bowmansDelayLeftTimeMs: number = 0; //сколько осталось времени до стрельбы следующего лучника (миллисекунды)
	private _isDisplayRadius: boolean = false; //рисовать радиус атаки? 

	constructor(x: number) {
		super(x, 
			(Draw.canvas ? Draw.canvas.height : 0) - Tower.image.height * 0.7 + 10, 
			false,
			true, //isLand
			Tower.name, 
			Tower.shopItem.name, 
			0.7,
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
		if(isLoadResources && Tower.imageHandler.isEmpty){
			Tower.imageHandler.new(Tower.image).src = towerImage;
		}
	}
	
	static loadResourcesAfterBuild() {
		Arrow.init(); 
		AudioSystem.load(arrowStrikeSound);
	}

	loadedResourcesAfterBuild(){
		super.loadedResourcesAfterBuild();

		this.infoItems.splice(1, 0, new ParameterItem(Tower.DAMAGE_PARAMETER, 'Урон', () => this.damage, swordIcon, 13, () => 40, () => this.damage += 1));
		this.infoItems.splice(2, 0, new ParameterItem(Tower.BOWMANS_PARAMETER, 'Лучников', () => this.bowmans, bowmanIcon, 13, () => 55, () => this.bowmans += 1));
		this.infoItems.splice(3, 0, new ParameterItem(Tower.RECHARGE_PARAMETER, 'Перезарядка', () => (this.rechargeTimeMs / 1000).toFixed(2) + ' сек', rechargeIcon, 13, () => 25 / (this.rechargeTimeMs / 1000), () => this.rechargeTimeMs *= 0.9));
		this.infoItems.splice(4, 0, new ParameterItem(Tower.RADIUS_PARAMETER, 'Радиус атаки', () => this.radiusAttack, radiusIcon, 18, () => 20, () => this.radiusAttack += 50, this.displayRadius.bind(this), this.hideRadius.bind(this) ));
		this.infoItems.splice(5, 0, new ParameterItem(Tower.ARROW_SPEED_PARAMETER, 'Скорость стрел', () => this.arrowSpeed, '', 0, () => 10, () => this.arrowSpeed += 150));

		this.improvements.push( new Improvement(Tower.FIRE_ARROWS_IMPROVEMENT, 'Огненные стрелы', 100, fireArrowImproveImage, () => this.improveToFireArrows(), [
			new ImprovementParameterItem('+', fireIcon)
		]));
		this.improvements.push( new Improvement(Tower.DYNAMIT_ARROWS_IMPROVEMENT, 'Взрывные стрелы', 100, dynamitArrowImproveImage, () => this.improveToDynamitArrows(), [
			new ImprovementParameterItem('+', boomIcon)
		]));
	}

	improveToFireArrows(){
		this.isHasFireArrows = true;
		this._brazierAnimation.changeImage(brazierImage);
		AudioSystem.load(arrowFireStrikeSound);
		this.infoItems.push(new ParameterItem(Tower.FIRE_DAMAGE_PARAMETER, 'Урон огня', () => this.fireDamageInSecondPercentage + '%/сек', fireIcon, 13, () => this.price / 2, () => this.fireDamageInSecondPercentage += 1));
		this.infoItems.push(new ParameterItem(Tower.FIRE_MINIMAL_PARAMETER, 'Урон огня', () => this.fireDamageInSecondMinimal.toFixed(1) + 'хп/сек', fireIcon, 13, () => this.price / 2, () => this.fireDamageInSecondMinimal += 0.1));
		this.infoItems.push(new ParameterItem(Tower.FIRE_DURATION_PARAMETER, 'Горение', () => (this.fireDurationMs / 1000).toFixed(0) + 'сек', timerIcon, 13, () => this.price / 2, () => this.fireDurationMs += 1000));
		FireModifier.loadResources();
		Arrow.initFire();

		let t = this.improvements.find(x => x.id == Tower.FIRE_ARROWS_IMPROVEMENT);
		if(t) t.isImproved = true;
	}

	improveToDynamitArrows(){
		this.isHasDynamitArrows = true;
		this._dynamitPackImage.src = dynamitPackImage;
		AudioSystem.load(arrowDynamitStrikeSound);
		this.infoItems.push(new ParameterItem(Tower.DYNAMIT_RADIUS_PARAMETER, 'Радиус взрыва', () => this.dynamitRadius, '', 0, () => this.price / 2, () => this.dynamitRadius += 20, this.displayDynamitRadius.bind(this), this.hideDynamitRadius.bind(this)));
		this.infoItems.push(new ParameterItem(Tower.DYNAMIT_DAMAGE_PARAMETER, 'Урон взрыва', () => this.dynamitDamage.toFixed(1), boomIcon, 13, () => this.price, () => this.dynamitDamage += 0.5));
		Arrow.initDynamit();

		let t = this.improvements.find(x => x.id == Tower.DYNAMIT_ARROWS_IMPROVEMENT);
		if(t) t.isImproved = true;
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

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number)
	{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logic(drawsDiffMs, buildings, monsters, units, bottomShiftBorder);

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
					if(this.bowmans > 1 && this.bowmans <= monstersInRadius.length){
						const landMonsters = sortBy(monstersInRadius.filter(x => x.isLand), [monster => Helper.getDistance(this.centerX, this.centerY, monster.centerX, monster.centerY)]);
						const flyMonsters = sortBy(monstersInRadius.filter(x => !x.isLand), [monster => Helper.getDistance(this.centerX, this.centerY, monster.centerX, monster.centerY)]);
						let i = 0;
						while(sortedMonstersByDistance.length <= skipCount){
							let monster = i++ % 2 == 0 ? flyMonsters.shift() : landMonsters.shift();
							if (monster)
								sortedMonstersByDistance.push(monster);
						}
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

		if(WavesState.isWaveStarted && (this._isDisplayRadius || this._isDisplayDynamitRadius)){
			this._isDisplayRadius = false;
			this._isDisplayDynamitRadius = false;
		}
	}

	attack(monsterGoalCenterX: number, monsterGoalCenterY: number): void {
		var arrowImage = Arrow.imageArrow;
		let x1 = this.centerX - arrowImage.width / 2;
		let y1 = this.centerY - arrowImage.height / 2;
		let x2 = monsterGoalCenterX - arrowImage.width / 2;
		let y2 = monsterGoalCenterY - arrowImage.height / 2;

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
		var movingObject = new MovingObject(x1, y1, arrowImage.width, arrowImage.height, 1000 * 10, dx, dy, rotate);
		var arrow = new Arrow(movingObject, isFireArrow, isDynamitArrow, this.damage, 
			this.fireDamageInSecondMinimal, 
			this.fireDamageInSecondPercentage, 
			this.fireDurationMs,
			this.dynamitRadius,
			this.dynamitDamage
		);
		MovingObjects.all.push(arrow);
		if(isDynamitArrow){
			AudioSystem.play(this.centerX, arrowDynamitStrikeSound, -17, this.arrowSpeed / Tower.initArrowSpeed, true);
		}
		AudioSystem.play(this.centerX, arrowStrikeSound, 0, this.arrowSpeed / Tower.initArrowSpeed, true);
		if(isFireArrow){
			AudioSystem.play(this.centerX, arrowFireStrikeSound, -15, this.arrowSpeed / Tower.initArrowSpeed, true);
		}

		if(this._rechargeLeftTimeMs <= 0){
			this._rechargeLeftTimeMs = this.rechargeTimeMs;
		}
		this._bowmansDelayLeftTimeMs = this.rechargeTimeMs / 10 / this.bowmans;
		this._bowmansWaiting--;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, isBuildingMode: boolean = false, isAnotherBuildingHereInBuildingMode: boolean = false): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		//display radius attack
		if(isBuildingMode && !isAnotherBuildingHereInBuildingMode || this._isDisplayRadius){
			Draw.ctx.beginPath();
			Draw.ctx.arc(this.centerX, this.centerY, this.radiusAttack, 0, 2 * Math.PI, false);
			Draw.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
			Draw.ctx.fill();
			Draw.ctx.lineWidth = 2;
			Draw.ctx.strokeStyle = 'rgb(0, 255, 0)';
			Draw.ctx.stroke();
		}

		super.draw(drawsDiffMs, isGameOver, isBuildingMode, isAnotherBuildingHereInBuildingMode);

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
Object.defineProperty(Tower, "name", { value: 'Tower', writable: false }); //fix production minification class names