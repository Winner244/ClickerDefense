import {Gamer} from '../gamer/Gamer';

import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';

import ParameterItem from '../../models/ParameterItem';
import AnimationInfinite from '../../models/AnimationInfinite';
import Improvement from '../../models/Improvement';
import {AttackedObject} from '../../models/AttackedObject';

import {Labels} from '../labels/Labels';

import {ImageHandler} from '../ImageHandler';

import {Draw} from '../gameSystems/Draw';
import {AudioSystem} from '../gameSystems/AudioSystem';

import {BuildingButtons} from '../../reactApp/components/BuildingButtons/BuildingButtons';

import RepairSoundUrl from '../../assets/sounds/buildings/repair.m4a'; 
import RepairHammerSoundUrl from '../../assets/sounds/buildings/repair_hammer.mp3'; 

import HammerImage from '../../assets/img/buttons/hammer.png';
import UpgradeAnimation from '../../assets/img/buildings/upgrade.png';
import HealthIcon from '../../assets/img/icons/health.png';
import ShieldIcon from '../../assets/img/icons/shield.png';

/** Базовый класс для всех зданий */
export class Building extends AttackedObject{
	static readonly repairImage: HTMLImageElement = new Image(); //картинка для анимации починки
	static readonly upgradeAnimation: AnimationInfinite = new AnimationInfinite(90, 3000); //анимация апгрейда

	static readonly repairAnimationDurationMs: number = 1800; //продолжительность анимации починки (миллисекунды)
	static readonly repairDiscount: number = 2; //во сколько раз будет дешевле восстановление здания по отношению к его стоимости

	static readonly improveHealthLabel: string = 'Здоровье'; //нужно для добавления кнопки ремонта в окне апгрейда строения рядом с этой характеристикой

	//поля свойства экземпляра
	price: number;

	isSupportRepair: boolean; //можно ли ремонтировать строение? (при наведении будет отображаться кнопка ремонта между волнами)
	isSupportUpgrade: boolean; //поддерживает ли модернизацию? (при наведении будет отображаться кнопка модернизации между волнами)

	infoItems: ParameterItem[];  //информация отображаемая в окне строения
	improvements: Improvement[]; //улучшения здания

	repairPricePerHealth: number; //сколько стоит 1 хп починить

	//технические поля экземпляра
	protected _impulsePharos: number; //маятниковый импульс от сверх ударов и сотрясений (0 - середина, значение движется от Z образно между отрицательными и положительными велечинами в пределах максимального значения по abs)
	protected _impulsePharosSign: boolean; //знак маятникового импульса в данный момент (0 - уменьшение, 1 - увеличение), нужен для указания Z образного движение по мере затухания импульса
	protected _impulsePharosForceDecreasing: number; //сила уменьшения маятникового импульса
	
	protected _isDisplayRepairAnimation: boolean; //отображается ли сейчас анимация починки?
	protected _repairAnimationLeftTimeMs: number; //оставшееся время отображения анимации починки (миллисекунды)
	protected _repairAnimationAngle: number; //угол поворота картинки в анимации
	protected _repairAnimationSign: boolean; //ударяет ли молоток? иначе возвращается обратно
	protected _isDisplayedUpgradeWindow: boolean; //открыто ли в данный момент окно по апгрейду данного здания? если да, то нужно подсвечивать данное здание

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
		isSupportRepair: boolean,
		isSupportUpgrade: boolean,
		imageHandler: ImageHandler)
	{
		super(x, y, healthMax, scaleSize, image, isLeftSide, isLand, reduceHover, name, imageHandler, frames, animationDurationMs);

		this.price = price;

		this.isSupportRepair = isSupportRepair;
		this.isSupportUpgrade = isSupportUpgrade;

		this.maxImpulse = 10;
		this.impulseForceDecreasing = 1;
		
		this._impulsePharos = 0;
		this._impulsePharosSign = false;
		this._impulsePharosForceDecreasing = 5;

		this._isDisplayRepairAnimation = this._repairAnimationSign = false;
		this._repairAnimationLeftTimeMs = this._repairAnimationAngle = 0;

		this._isDisplayedUpgradeWindow = false;

		this.repairPricePerHealth = this.price / this.healthMax / Building.repairDiscount;

		this.infoItems = [];

		this.improvements = [];
	}

	static loadRepairResources(): void{
		Building.repairImage.src = HammerImage;
		AudioSystem.load(RepairSoundUrl);
		AudioSystem.load(RepairHammerSoundUrl);
	}

	static loadUpgradeResources(): void{
		Building.upgradeAnimation.image.src = UpgradeAnimation;
	}

	loadedResourcesAfterBuild(){
		this.infoItems = [
			new ParameterItem(Building.improveHealthLabel, this.improveHealthGetValue.bind(this), HealthIcon, this.price - this.price / 5, () => this.improveHealth(this.initialHealthMax)),

			new ParameterItem('Защита', () => this.defense.toFixed(1), ShieldIcon, this.price * 2, () => this.defense += 0.1)
		];
	}


	public set impulseX(value: number){
		if(value > this.maxImpulse){
			value = this.maxImpulse;
		}
		if(value < this.maxImpulse * -1){
			value = this.maxImpulse * -1;
		}

		this._impulsePharosSign = value < 0 ? true : false;
		this._impulsePharos = value;
		this._impulseX = value <= 1 ? 0 : value;
	}
	public get impulseX(): number{
		if(this._impulseX <= 1){
			return 0;
		}

		return this._impulseX;
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
			let isDisplayRepairButton =  this.isSupportRepair && this.health < this.healthMax;
			if(isDisplayRepairButton || this.isSupportUpgrade && !this.isDisplayedUpgradeWindow){
				if(!BuildingButtons.isEnterMouse){
					let x = (this.x + this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
					let y = (this.y + this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
					let width = (this.width - 2 * this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
					let height = (this.height - 2 * this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
					let repairPrice = this.getRepairPrice();
					BuildingButtons.show(x, y, width, height, isDisplayRepairButton, this.isSupportUpgrade && !this.isDisplayedUpgradeWindow, repairPrice, this);
				}
			}
		}
		
		return false;
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number, isWaveStarting: boolean){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logicBase(drawsDiffMs, buildings, monsters, units, bottomShiftBorder);
		
		if(this._impulseX > 1){
			this._impulsePharos -= (this._impulsePharosSign ? -1 : 1) * drawsDiffMs / 1000 * (this._impulseX * this._impulsePharosForceDecreasing);

			if(this._impulsePharos < -this._impulseX){
				this._impulsePharosSign = !this._impulsePharosSign;
				this._impulsePharos = -this._impulseX;
			}

			if(this._impulsePharos > this._impulseX){
				this._impulsePharosSign = !this._impulsePharosSign;
				this._impulsePharos = this._impulseX;
			}
		}

		if(this._isDisplayRepairAnimation){
			this._repairAnimationLeftTimeMs -= drawsDiffMs;
			if(this._repairAnimationLeftTimeMs <= 0){
				this._isDisplayRepairAnimation = this._repairAnimationSign = false;
				this._repairAnimationAngle = 0;
			}
			else{
				if(this._repairAnimationSign){
					this._repairAnimationAngle += 23;

					if(this._repairAnimationAngle > 90){
						this._repairAnimationSign = false;
					}
				}
				else{
					this._repairAnimationAngle-=8;

					if(this._repairAnimationAngle < 0){
						this._repairAnimationSign = true;
					}
				}
			}
		}

		if(this.y + this.height - bottomShiftBorder > Draw.canvas.height){
			this.y = Draw.canvas.height - this.height;
		}
	}

	getRepairPrice() : number {
		return Math.ceil((this.healthMax - this.health) * this.repairPricePerHealth);
	}

	isCanBeRepaired() : boolean {
		return Gamer.coins >= this.getRepairPrice();
	}

	repair(): boolean{
		let repairPrice = this.getRepairPrice();
		if(this.isCanBeRepaired()){
			Gamer.coins -= repairPrice;
			this.health = this.healthMax;
			AudioSystem.play(this.centerX, RepairSoundUrl, 0.4, 1, false, true);
			AudioSystem.play(this.centerX, RepairHammerSoundUrl, 0.2, 1, false, true);
			Labels.createCoinLabel(this.x + this.width, this.y + this.height / 3, '-' + repairPrice, 2000);
			this._isDisplayRepairAnimation = true;
			this._repairAnimationLeftTimeMs = Building.repairAnimationDurationMs;
			return true;
		}

		return false;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, isBuildingMode: boolean = false, isAnotherBuildingHereInBuildingMode: boolean = false): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		let x = this.x;
		let y = this.y;

		if(this.isDisplayedUpgradeWindow){
			//Building.upgradeAnimation.draw(drawsDiffMs, isGameOver, x - this.width / 2, y - Building.upgradeAnimation.image.height / 2, this.width * 2, Building.upgradeAnimation.image.height)
			Building.upgradeAnimation.draw(drawsDiffMs, isGameOver, x - this.width / 10, y - this.height / 10, this.width + this.width / 10 * 2, this.height + this.height / 10)
		}

		if(this.impulseX > 0){
			Draw.ctx.setTransform(1, 0, 0, 1, this.x + this.width / 2, this.y + this.height); 
			Draw.ctx.rotate(this._impulsePharos * Math.PI / 180);
			x = -this.width / 2;
			y = -this.height;
		}

		let filter: string|null = null;
		if (this.isDisplayedUpgradeWindow) {
			filter = 'brightness(1.7)';
		}
		else if (isAnotherBuildingHereInBuildingMode) {
			filter = 'grayscale(1)';
		}

		super.drawBase(drawsDiffMs, isGameOver, x, y, filter);

		if(this.impulseX > 0){
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);
		}
	}

	drawHealth(): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.drawHealthBase(this.x + 15, this.y - 10, this.width - 30);
	}

	drawRepairingAnimation(): void{
		if(this._isDisplayRepairAnimation){
			Draw.ctx.setTransform(1, 0, 0, 1, this.x + 50, this.y + this.height / 2 + 50 / 2); 
			Draw.ctx.rotate((this._repairAnimationAngle - 45) * Math.PI / 180);
			Draw.ctx.drawImage(Building.repairImage, -25, -50, 50, 50);
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);
		}
	}
}