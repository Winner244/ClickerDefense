import {Draw} from '../gameSystems/Draw';

import {ImageHandler} from '../../gameApp/ImageHandler';
import {AttackedObject} from '../../models/AttackedObject';
import AnimationInfinite from '../../models/AnimationInfinite';
import ParameterItem from '../../models/ParameterItem';
import Improvement from '../../models/Improvement';

import {Labels} from '../labels/Labels';

import {Gamer} from '../gamer/Gamer';

import {Monster} from '../monsters/Monster';
import {Building} from '../buildings/Building';

import UpgradeAnimation from '../../assets/img/buildings/upgrade.png';
import HealthIcon from '../../assets/img/icons/health.png';
import ShieldIcon from '../../assets/img/icons/shield.png';


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
		isLand: boolean = true, 
		reduceHover: number = 0,
		isSupportHealing: boolean = true,
		isSupportUpgrade: boolean = true)
	{
		super(x, y, healthMax, 1, image, true, isLand, reduceHover, name, imageHandler, frames, animationDurationMs);

		this.price = price;

		this.isSupportHealing = isSupportHealing;
		this.isSupportUpgrade = isSupportUpgrade;

		this._isDisplayHealingAnimation = false;
		this._healingAnimationLeftTimeMs = 0;

		this._isDisplayedUpgradeWindow = false;

		this.healingPricePerHealth = this.price / this.healthMax / Unit.healingDiscount;

		this.infoItems = [];

		this.improvements = [];
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
			let isDisplayRepairButton =  this.isSupportHealing && this.health < this.healthMax;
			if(isDisplayRepairButton || this.isSupportUpgrade && !this.isDisplayedUpgradeWindow){
				/*if(!UnitsButtons.isEnterMouse){
					let x = (this.x + this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
					let y = (this.y + this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
					let width = (this.width - 2 * this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
					let height = (this.height - 2 * this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
					let healingPrice = this.getHealingPrice();
					UnitsButtons.show(x, y, width, height, isDisplayRepairButton, this.isSupportUpgrade && !this.isDisplayedUpgradeWindow, healingPrice, this);
				}*/
			}
		}
		
		return false;
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number, isWaveStarted: boolean){
		if(!this.imageHandler.isImagesCompleted){
			return;
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

	isCanBeRepaired() : boolean {
		return Gamer.coins >= this.getHealingPrice();
	}

	healing(): boolean{
		let healingPrice = this.getHealingPrice();
		if(this.isCanBeRepaired()){
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

	draw(drawsDiffMs: number, isGameOver: boolean): void{
		if(!this.imageHandler.isImagesCompleted){
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

	drawRepairingAnumation(): void{
		if(this._isDisplayHealingAnimation){
			//Draw.ctx.setTransform(1, 0, 0, 1, this.x + 50, this.y + this.height / 2 + 50 / 2); 
			//Draw.ctx.drawImage(Building.healingImage, -25, -50, 50, 50);
			//Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
		}
	}
}