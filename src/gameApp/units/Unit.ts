import {Draw} from '../gameSystems/Draw';

import {AudioSystem} from '../gameSystems/AudioSystem';

import {ImageHandler} from '../../gameApp/ImageHandler';
import {AttackedObject} from '../../models/AttackedObject';
import AnimationInfinite from '../../models/AnimationInfinite';
import ParameterItem from '../../models/ParameterItem';
import Improvement from '../../models/Improvement';

import Animation from '../../models/Animation';

import {Labels} from '../labels/Labels';

import {Gamer} from '../gamer/Gamer';

import {Monster} from '../monsters/Monster';
import {Building} from '../buildings/Building';

import UpgradeAnimation from '../../assets/img/buildings/upgrade.png';
import HealthIcon from '../../assets/img/icons/health.png';
import ShieldIcon from '../../assets/img/icons/shield.png';

import CreatingImage from '../../assets/img/units/creating.png'; 

import CreatingSound from '../../assets/sounds/units/creating.mp3'; 
import End1Sound from '../../assets/sounds/units/end1.mp3'; 
import End2Sound from '../../assets/sounds/units/end2.mp3'; 
import End3Sound from '../../assets/sounds/units/end3.mp3'; 
import End4Sound from '../../assets/sounds/units/end4.mp3'; 
import End5Sound from '../../assets/sounds/units/end5.mp3'; 
import End6Sound from '../../assets/sounds/units/end6.mp3';
import End7Sound from '../../assets/sounds/units/end7.mp3';


/** Базовый класс для всех Юнитов пользователя */
export class Unit extends AttackedObject {
	static readonly healingImage: HTMLImageElement = new Image(); //картинка для анимации лечения
	static readonly upgradeAnimation: AnimationInfinite = new AnimationInfinite(90, 3000); //анимация апгрейда

	static readonly healingAnimationDurationMs: number = 1800; //продолжительность анимации лечения (миллисекунды)
	static readonly healingDiscount: number = 2; //во сколько раз будет дешевле лечение по отношению к его стоимости


	static readonly improveHealthLabel: string = 'Здоровье'; //нужно для добавления кнопки лечения в окне апгрейда юнита рядом с этой характеристикой

	//поля свойства экземпляра
	price: number;

	isSupportHealing: boolean; //можно ли лечить? (при наведении будет отображаться кнопка лечения между волнами)
	isSupportUpgrade: boolean; //поддерживает ли апгрейд? (при наведении будет отображаться кнопка апгрейда между волнами)

	infoItems: ParameterItem[];  //информация отображаемая в окне юнита
	improvements: Improvement[]; //улучшения юнита

	healingPricePerHealth: number; //сколько стоит 1 хп вылечить

	speed: number; //скорость передвижения (пикселей в секунду)

	readonly endingAnimation: Animation = new Animation(6, 600); //анимация появления юнита

	//технические поля экземпляра
	protected _isDisplayHealingAnimation: boolean; //отображается ли сейчас анимация лечения?
	protected _healingAnimationLeftTimeMs: number; //оставшееся время отображения анимации починки (миллисекунды)
	protected _isDisplayedUpgradeWindow: boolean; //открыто ли в данный момент окно по апгрейду данного здания? если да, то нужно подсвечивать данного юнита


	constructor(x: number, y: number, 
		healthMax: number, 
		image: HTMLImageElement, 
		name: string, 
		imageHandler: ImageHandler,
		frames: number, 
		animationDurationMs: number,
		price: number, 
		speed: number,
		isLand: boolean = true, 
		reduceHover: number = 0,
		isSupportHealing: boolean = true,
		isSupportUpgrade: boolean = true)
	{
		super(x, y, healthMax, 1, image, true, isLand, reduceHover, name, imageHandler, frames, animationDurationMs);

		this.price = price;

		this.isSupportHealing = isSupportHealing;
		this.isSupportUpgrade = isSupportUpgrade;
		this.speed = speed;

		this._isDisplayHealingAnimation = false;
		this._healingAnimationLeftTimeMs = 0;

		this._isDisplayedUpgradeWindow = false;

		this.healingPricePerHealth = this.price / this.healthMax / Unit.healingDiscount;

		this.infoItems = [];

		this.improvements = [];

		this.endingAnimation.image.src = CreatingImage;
		AudioSystem.load(CreatingSound);
		AudioSystem.load(End1Sound);
		AudioSystem.load(End2Sound);
		AudioSystem.load(End3Sound);
		AudioSystem.load(End4Sound);
		AudioSystem.load(End5Sound);
		AudioSystem.load(End6Sound);
		AudioSystem.load(End7Sound);
	}

	
	static loadHealingResources(): void{
		//Unit.healingImage.src = HealingImage;
		//AudioSystem.load(HealingSoundUrl);
	}

	static loadUpgradeResources(): void{
		Unit.upgradeAnimation.image.src = UpgradeAnimation;
	}

	loadedResourcesAfterBuild(){
		this.infoItems = [
			new ParameterItem(Unit.improveHealthLabel, this.improveHealthGetValue.bind(this), HealthIcon, this.price - this.price / 5, () => this.improveHealth(this.initialHealthMax)),

			new ParameterItem('Защита', () => this.defense.toFixed(1), ShieldIcon, this.price * 2, () => this.defense += 0.1)
		];
	}




	set isDisplayedUpgradeWindow(value: boolean){
		this._isDisplayedUpgradeWindow = value;
	}
	get isDisplayedUpgradeWindow(): boolean{
		return this._isDisplayedUpgradeWindow;
	}

	improveHealthGetValue() : string {
		let value = this.health != this.healthMax 
			? `${this.health.toFixed(0)}<span> из ${this.healthMax}</span>` 
			: this.healthMax;

		return value + '';
	}

	improveHealth(improvePoints: number) : void {
		this.health += improvePoints;
		this.healthMax += improvePoints;
	}


	mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isWaveStarted: boolean, isWaveEnded: boolean, isMouseIn: boolean, isBuilderActive: boolean): boolean {
		if(isWaveEnded && isMouseIn && !isBuilderActive){
			let isDisplayHealingButton =  this.isSupportHealing && this.health < this.healthMax;
			if(isDisplayHealingButton || this.isSupportUpgrade && !this.isDisplayedUpgradeWindow){
				/*if(!UnitsButtons.isEnterMouse){
					let x = (this.x + this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
					let y = (this.y + this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
					let width = (this.width - 2 * this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
					let height = (this.height - 2 * this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
					let healingPrice = this.getHealingPrice();
					UnitsButtons.show(x, y, width, height, isDisplayHealingButton, this.isSupportUpgrade && !this.isDisplayedUpgradeWindow, healingPrice, this);
				}*/
			}
		}
		
		return false;
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number, isWaveStarted: boolean){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this.health <= 0){
			if(this.endingAnimation.leftTimeMs == this.endingAnimation.durationMs){
				AudioSystem.play(this.centerX, CreatingSound);
				AudioSystem.playRandomV(this.centerX, [End1Sound, End2Sound, End3Sound, End4Sound, End5Sound, End6Sound, End7Sound], 0);
			}
		}

		super.logicBase(drawsDiffMs, buildings, monsters, units, bottomShiftBorder);
		
		if(this._impulse > 1){
			this._impulse -= drawsDiffMs / 1000 * (this._impulse * this.impulseForceDecreasing);
		}

		if(this._isDisplayHealingAnimation){
			this._healingAnimationLeftTimeMs -= drawsDiffMs;
			if(this._healingAnimationLeftTimeMs <= 0){
				this._isDisplayHealingAnimation = false;
			}
		}

		if(this.y + this.height > Draw.canvas.height){
			this.y = Draw.canvas.height - this.height;
		}
	}

	getHealingPrice() : number {
		return Math.ceil((this.healthMax - this.health) * this.healingPricePerHealth);
	}

	isCanBeHealing() : boolean {
		return Gamer.coins >= this.getHealingPrice();
	}

	healing(): boolean{
		let healingPrice = this.getHealingPrice();
		if(this.isCanBeHealing()){
			Gamer.coins -= healingPrice;
			this.health = this.healthMax;
			//AudioSystem.play(this.centerX, HealingSoundUrl, 0.4, 1, false, true);
			Labels.createCoinLabel(this.x + this.width, this.y + this.height / 3, '-' + healingPrice, 2000);
			this._isDisplayHealingAnimation = true;
			this._healingAnimationLeftTimeMs = Unit.healingAnimationDurationMs;
			return true;
		}

		return false;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, isWaveStarted: boolean, waveDelayStartLeftTimeMs: number): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this.health <= 0){
			if(this.endingAnimation.leftTimeMs > 0){
				this.endingAnimation.draw(drawsDiffMs, false, this.x, this.y, this.width, this.height, true);
			}
			return;
		}

		let x = this.x;
		let y = this.y;

		if(this.isDisplayedUpgradeWindow){
			Building.upgradeAnimation.draw(drawsDiffMs, isGameOver, x - this.width / 10, y - this.height / 10, this.width + this.width / 10 * 2, this.height + this.height / 10)
		}

		let filter: string|null = null;
		if (this.isDisplayedUpgradeWindow) {
			filter = 'brightness(1.7)';
		}

		super.drawBase(drawsDiffMs, isGameOver, x, y, filter);
	}

	drawHealth(): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.drawHealthBase(this.x + 15, this.y - 10, this.width - 30);
	}

	drawHealingingAnimation(): void{
		if(this._isDisplayHealingAnimation){
			//Draw.ctx.setTransform(1, 0, 0, 1, this.x + 50, this.y + this.height / 2 + 50 / 2); 
			//Draw.ctx.drawImage(Building.healingImage, -25, -50, 50, 50);
			//Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
		}
	}
}