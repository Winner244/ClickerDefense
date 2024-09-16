import ParameterItem from './ParameterItem';
import AnimationInfinite from './AnimationInfinite';
import Improvement from './Improvement';
import {AttackedObject} from './AttackedObject';
import {IUpgradableObject} from './IUpgradableObject';

import {Gamer} from '../gameApp/gamer/Gamer';

import {Labels} from '../gameApp/labels/Labels';

import {ImageHandler} from '../gameApp/ImageHandler';

import UpgradeAnimation from '../assets/img/buildings/upgrade.png';
import HealthIcon from '../assets/img/icons/health.png';
import ShieldIcon from '../assets/img/icons/shield.png';

/** Базовый класс для объектов, которые можно прокачать (Строения, Юниты) */
export class UpgradableAttackedObject extends AttackedObject implements IUpgradableObject{
	static readonly upgradeAnimation: AnimationInfinite = new AnimationInfinite(90, 3000); //анимация апгрейда

	static readonly improveHealthLabel: string = 'Здоровье'; //нужно для добавления кнопки ремонта в окне апгрейда строения рядом с этой характеристикой

	static readonly recoveryDiscount: number = 2; //во сколько раз будет дешевле восстановление по отношению к его стоимости

	//поля свойства экземпляра
	price: number;

	isSupportUpgrade: boolean; //поддерживает ли модернизацию? (при наведении будет отображаться кнопка модернизации между волнами)
	isSupportRecovery: boolean; //можно ли ремонтировать строение? (при наведении будет отображаться кнопка ремонта между волнами)

	recoveryPricePerHealth: number; //сколько стоит 1 хп починить

	infoItems: ParameterItem[];  //информация отображаемая в окне 
	improvements: Improvement[]; //улучшения объекта

	//технические поля экземпляра
	protected _isDisplayedUpgradeWindow: boolean; //открыто ли в данный момент окно по апгрейду данного объекта? если да, то нужно подсвечивать данный объект
	protected _isDisplayRecoveryAnimation: boolean; //отображается ли сейчас анимация восстанволения (починки для зданий / лечения для юнитов)?

	constructor(
		x: number, 
		y: number, 
		isLeftSide: boolean, 
		isLand: boolean, 
		name: string, 
		scaleSize: number,
		image: HTMLImageElement, 
		frames: number, 
		animationDurationMs: number,
		reduceHover: number, 
		healthMax: number,
		price: number,
		isSupportRecovery: boolean,
		isSupportUpgrade: boolean,
		imageHandler: ImageHandler)
	{
		super(x, y, healthMax, scaleSize, image, isLeftSide, isLand, reduceHover, name, imageHandler, frames, animationDurationMs);

		this.price = price;

		this.isSupportRecovery = isSupportRecovery;
		this.isSupportUpgrade = isSupportUpgrade;

		this.recoveryPricePerHealth = this.price / this.healthMax / UpgradableAttackedObject.recoveryDiscount;

		this._isDisplayRecoveryAnimation = false;
		this._isDisplayedUpgradeWindow = false;

		this.infoItems = [];

		this.improvements = [];
	}

	static loadUpgradeResources(): void{
		UpgradableAttackedObject.upgradeAnimation.changeImage(UpgradeAnimation);
	}

	loadedResourcesAfterBuild(){
		this.infoItems = [
			new ParameterItem(UpgradableAttackedObject.improveHealthLabel, this.improveHealthGetValue.bind(this), HealthIcon, 13, () => this.price - this.price / 5, () => this.improveHealth(this.initialHealthMax)),

			new ParameterItem('Защита', () => this.defense.toFixed(1), ShieldIcon, 13, () => this.price * (this.defense + 1), () => this.defense += 1)
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

	getRecoveryPrice() : number {
		return Math.ceil((this.healthMax - this.health) * this.recoveryPricePerHealth);
	}

	isCanBeRecovered() : boolean {
		return Gamer.coins >= this.getRecoveryPrice();
	}

	recovery(): boolean{
		let recoveryPrice = this.getRecoveryPrice();
		if(this.isCanBeRecovered()){
			Gamer.coins -= recoveryPrice;
			this.health = this.healthMax;
			Labels.createCoinLabel(this.x + this.width, this.y + this.height / 3, '-' + recoveryPrice, 2000);
			this._isDisplayRecoveryAnimation = true;
			return true;
		}

		return false;
	}

	logicBase(drawsDiffMs: number){
		super.logicBase(drawsDiffMs);

		if(this._isDisplayRecoveryAnimation){
			this.displayRecoveryAnimationLogic(drawsDiffMs);
		}
	}

	displayRecoveryAnimationLogic(drawsDiffMs: number){}

	mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isWaveStarted: boolean, isWaveEnded: boolean, isMouseIn: boolean, isBuilderActive: boolean): boolean {
		if(isWaveEnded && isMouseIn && !isBuilderActive){
			let isDisplayRecoveryButton =  this.isSupportRecovery && this.health < this.healthMax;
			if(isDisplayRecoveryButton || this.isSupportUpgrade && !this.isDisplayedUpgradeWindow){
				this.buttonsLogic(isDisplayRecoveryButton);
			}
		}
		
		return false;
	}

	buttonsLogic(isDisplayRecoveryButton: boolean){}

	drawBase(drawsDiffMs: number, isGameOver: boolean, x: number|null = null, y: number|null = null, filter: string|null = null){
		x = x ?? this.x;
		y = y ?? this.y;

		if(this.isDisplayedUpgradeWindow){
			UpgradableAttackedObject.upgradeAnimation.draw(drawsDiffMs, isGameOver, this.x - this.width / 10, this.y - this.height / 10, this.width + this.width / 10 * 2, this.height + this.height / 10)
		}

		super.drawBase(drawsDiffMs, isGameOver, x, y, filter);
	}
}