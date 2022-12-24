import {Gamer} from '../gamer/Gamer';

import {Monster} from '../monsters/Monster';

import ShopItem from '../../models/ShopItem';
import InfoItem from '../../models/InfoItem';
import Animation from '../../models/Animation';
import AnimationInfinite from '../../models/AnimationInfinite';
import Improvement from '../../models/Improvement';

import {Labels} from '../labels/Labels';

import {Draw} from '../gameSystems/Draw';
import {AudioSystem} from '../gameSystems/AudioSystem';

import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

import {BuildingButtons} from '../../reactApp/components/BuildingButtons/BuildingButtons';

import RepairSoundUrl from '../../assets/sounds/buildings/repair.m4a'; 
import RepairHammerSoundUrl from '../../assets/sounds/buildings/repair_hammer.mp3'; 

import HammerImage from '../../assets/img/buttons/hammer.png';
import UpgradeAnimation from '../../assets/img/buildings/upgrade.png';
import HealthIcon from '../../assets/img/icons/health.png';
import ShieldIcon from '../../assets/img/icons/shield.png';

export class Building extends ShopItem{
	animation: AnimationInfinite;
	width: number;  //ширина image
	height: number; //высота image
	reduceHover: number; //на сколько пикселей уменьшить зону наведения?
	
	healthMax: number; //максимум хп
	health: number;

	x: number;
	y: number;

	isLeftSide: boolean; // с левой стороны ? (если это не центральное здание)
	isLand: boolean; //наземное? (иначе - воздушное)

	isSupportRepair: boolean; //можно ли ремонтировать строение? (при наведении будет отображаться кнопка ремонта между волнами)
	isSupportUpgrade: boolean; //поддерживает ли модернизацию? (при наведении будет отображаться кнопка модернизации между волнами)

	infoItems: InfoItem[];  //информация отображаемая в окне строения
	improvements: Improvement[]; //улучшения здания

	repairPricePerHealth: number; //сколько стоит 1 хп починить

	defense: number = 0; //защита (уменьшает урон)

	maxImpulse: number; //максимальное значение импульса для здания
	impulseForceDecreasing: number; //сила уменьшения импульса

	protected _impulse: number; //импульс от сверх ударов и сотрясений
	protected _impulsePharos: number; //маятниковый импульс от сверх ударов и сотрясений (0 - середина, значение движется от Z образно между отрицательными и положительными велечинами в пределах максимального значения по abs)
	protected _impulsePharosSign: boolean; //знак маятникового импульса в данный момент (0 - уменьшение, 1 - увеличение), нужен для указания Z образного движение по мере затухания импульса
	protected _impulsePharosForceDecreasing: number; //сила уменьшения маятникового импульса
	
	protected _isDisplayRepairAnimation: boolean; //отображается ли сейчас анимация починки?
	protected _repairAnimationLeftTimeMs: number; //оставшееся время отображения анимации починки (миллисекунды)
	protected _repairAnimationAngle: number; //угол поворота картинки в анимации
	protected _repairAnimationSign: boolean; //ударяет ли молоток? иначе возвращается обратно
	protected _isDisplayedUpgradeWindow: boolean; //открыто ли в данный момент окно по апгрейду данного здания? если да, то нужно подсвечивать данное здание
	
	static readonly repairImage: HTMLImageElement = new Image(); //картинка для анимации починки
	static readonly upgradeAnimation: Animation = new Animation(90, 3000); //анимация апгрейда

	static readonly repairAnimationDurationMs: number = 1800; //продолжительность анимации починки (миллисекунды)
	static readonly repairDiscount: number = 2; //во сколько раз будет дешевле восстановление здания по отношению к его стоимости

	static readonly improveHealthLabel: string = 'Здоровье'; //нужно для добавления кнопки ремонта в окне апгрейда строения рядом с этой характеристикой

	constructor(
		x: number, 
		y: number, 
		isLeftSide: boolean, 
		isLand: boolean, 
		name: string, 
		image: HTMLImageElement, 
		frames: number, 
		animationDurationMs: number,
		width: number, 
		height: number, 
		reduceHover: number, 
		healthMax: number,
		price: number,
		description: string,
		isSupportRepair: boolean,
		isSupportUpgrade: boolean)
	{
		super(name, image, price, description, ShopCategoryEnum.BUILDINGS);

		this.animation = new AnimationInfinite(frames, animationDurationMs, image);
		this.image = image;
		this.name = name;
		this.width = width;
		this.height = height;
		this.reduceHover = reduceHover; 

		this.healthMax = healthMax; 
		this.health = healthMax;

		this.x = x;
		this.y = y;

		this.isLeftSide = isLeftSide; 
		this.isLand = isLand; 

		this.isSupportRepair = isSupportRepair;
		this.isSupportUpgrade = isSupportUpgrade;

		this.maxImpulse = 10;
		this.impulseForceDecreasing = 1;
		
		this._impulse = this._impulsePharos = 0;
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
			new InfoItem(Building.improveHealthLabel, this.improveHealthGetValue.bind(this), HealthIcon, this.price - this.price / 5, () => this.improveHealth(this.healthMax)),

			new InfoItem('Защита', () => this.defense, ShieldIcon)
		];
	}


	set impulse(value: number){
		if(value > this.maxImpulse){
			value = this.maxImpulse;
		}
		if(value < this.maxImpulse * -1){
			value = this.maxImpulse * -1;
		}

		this._impulsePharosSign = value < 0 ? true : false;
		this._impulsePharos = value;
		this._impulse = Math.abs(value);
	}
	get impulse(): number{
		if(this._impulse <= 1){
			return 0;
		}

		return this._impulse;
	}

	get centerX(){
		return this.x + this.width / 2;
	}
	get centerY(){
		return this.y + this.height / 2;
	}

	set isDisplayedUpgradeWindow(value: boolean){
		this._isDisplayedUpgradeWindow = value;
	}
	get isDisplayedUpgradeWindow(): boolean{
		return this._isDisplayedUpgradeWindow;
	}

	applyDamage(damage: number): number{
		const realDamage = Math.max(0, Math.abs(damage) - this.defense);
		this.health -= realDamage;
		return realDamage;
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

	mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isWaveStarted: boolean, isWaveEnded: boolean, isMouseIn: boolean): boolean {
		if(isWaveEnded && isMouseIn){
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
			AudioSystem.play(this.centerX, RepairSoundUrl, 0.4, false, 1, false, true);
			AudioSystem.play(this.centerX, RepairHammerSoundUrl, 0.2, false, 1, false, true);
			Labels.createCoinLabel(this.x + this.width, this.y + this.height / 3, '-' + repairPrice, 2000);
			this._isDisplayRepairAnimation = true;
			this._repairAnimationLeftTimeMs = Building.repairAnimationDurationMs;
			return true;
		}

		return false;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, isBuildingMode: boolean = false): void{
		let x = this.x;
		let y = this.y;

		if(this.isDisplayedUpgradeWindow){
			Building.upgradeAnimation.draw(drawsDiffMs, isGameOver, x - this.width / 2, y - Building.upgradeAnimation.image.height / 2, this.width * 2, Building.upgradeAnimation.image.height)
			Draw.ctx.filter = 'brightness(1.7)';
		}

		if(this.impulse > 0){
			Draw.ctx.setTransform(1, 0, 0, 1, this.x + this.width / 2, this.y + this.height); 
			Draw.ctx.rotate(this._impulsePharos * Math.PI / 180);
			x = -this.width / 2;
			y = -this.height;
		}

		if(this.animation.frames > 1){
			this.animation.draw(drawsDiffMs, isGameOver, x, y, this.width, this.height);
		}
		else{
			if(this.width > 0 && this.height > 0){
				Draw.ctx.drawImage(this.image, x, y, this.width, this.height);
			}
			else{
				Draw.ctx.drawImage(this.image, x, y);
			}
		}

		if(this.impulse > 0){
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);
		}

		
		if(this.isDisplayedUpgradeWindow){
			Draw.ctx.filter = 'none';
		}
	}

	drawHealth(): void{
		if(this.health < this.healthMax && this.health > 0){
			Draw.drawHealth(this.x + 15, this.y - 10, this.width - 30, this.healthMax, this.health);
		}
	}

	drawRepairingAnumation(): void{
		if(this._isDisplayRepairAnimation){
			Draw.ctx.setTransform(1, 0, 0, 1, this.x + 50, this.y + this.height / 2 + 50 / 2); 
			Draw.ctx.rotate((this._repairAnimationAngle - 45) * Math.PI / 180);
			Draw.ctx.drawImage(Building.repairImage, -25, -50, 50, 50);
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);
		}
	}

	logic(drawsDiffMs: number, monsters: Monster[], bottomShiftBorder: number){
		if(this._impulse > 1){
			this._impulse -= drawsDiffMs / 1000 * (this._impulse * this.impulseForceDecreasing);
			this._impulsePharos -= (this._impulsePharosSign ? -1 : 1) * drawsDiffMs / 1000 * (this._impulse * this._impulsePharosForceDecreasing);

			if(this._impulsePharos < -this._impulse){
				this._impulsePharosSign = !this._impulsePharosSign;
				this._impulsePharos = -this._impulse;
			}

			if(this._impulsePharos > this._impulse){
				this._impulsePharosSign = !this._impulsePharosSign;
				this._impulsePharos = this._impulse;
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
	}
}