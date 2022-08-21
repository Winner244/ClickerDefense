import {Draw} from '../gameSystems/Draw';
import {Monster} from './Monster';
import ShopItem from '../../models/ShopItem';
import InfoItem from '../../models/InfoItem';
import {Gamer} from './Gamer';
import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

import {BuildingButtons} from '../../reactApp/components/BuildingButtons/BuildingButtons';

import RepairSoundUrl from '../../assets/sounds/buildings/repair.m4a'; 
import RepairHammerSoundUrl from '../../assets/sounds/buildings/repair_hammer.mp3'; 

import { AudioSystem } from '../gameSystems/AudioSystem';
import { Labels } from '../gameSystems/Labels';

import HammerImage from '../../assets/img/buttons/hammer.png';
import UpgradeAnimation from '../../assets/img/buildings/upgrade.png';

export class Building extends ShopItem{
	frames: number; //сколько изображений в image?
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

	protected _impulse: number; //импульс от сверх ударов и сотрясений
	protected _impulsePharos: number; //маятниковый импульс от сверх ударов и сотрясений (0 - середина, значение движется от Z образно между отрицательными и положительными велечинами в пределах максимального значения по abs)
	protected _impulsePharosSign: boolean; //знак маятникового импульса в данный момент (0 - уменьшение, 1 - увеличение), нужен для указания Z образного движение по мере затухания импульса
	protected _maxImpulse: number; //максимальное значение импульса для здания
	protected _impulseForceDecreasing: number; //сила уменьшения импульса
	protected _impulsePharosForceDecreasing: number; //сила уменьшения маятникового импульса
	
	protected _isDrawButtons: boolean; //нужно ли сейчас отрисовывать кнопки?

	protected _isDisplayRepairAnimation: boolean; //отображается ли сейчас анимация починки?
	protected _repairAnimationStart: number; //время начала отображения анимации починки
	protected _repairAnimationAngle: number; //угол поворота картинки в анимации
	protected _repairAnimationSign: boolean; //ударяет ли молоток? иначе возвращается обратно
	protected _isDisplayedUpgradeWindow: boolean; //открыто ли в данный момент окно по апгрейду данного здания? если да, то нужно подсвечивать данное здание
	protected _upgradeTimeStart: number; //время начала апгрейда
	
	static readonly repairImage: HTMLImageElement = new Image(); //картинка для анимации починки
	static readonly upgradeAnimation: HTMLImageElement = new Image(); //анимация апгрейда
	static readonly upgradeAnimationFrames = 90; //количество кадров анимации
	static readonly upgradeAnimationDuration = 3000; //время полной анимации в миллисекундах

	static readonly repairAnimationDurationMs: number = 1800; //продолжительность анимации починки в миллисекундах
	static readonly repairDiscount: number = 2; //во сколько раз будет дешевле восстановление здания по отношению к его стоимости

	constructor(
		x: number, 
		y: number, 
		isLeftSide: boolean, 
		isLand: boolean, 
		name: string, 
		image: HTMLImageElement, 
		frames: number, 
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

		this.name = name;
		this.image = image;
		this.frames = frames;
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

		this._impulse = this._impulsePharos = 0;
		this._impulsePharosSign = false;
		this._maxImpulse = 10;
		this._impulseForceDecreasing = 1;
		this._impulsePharosForceDecreasing = 5;

		this._isDrawButtons = false;
		this._isDisplayRepairAnimation = this._repairAnimationSign = false;
		this._repairAnimationStart = this._repairAnimationAngle = 0;

		this._isDisplayedUpgradeWindow = false;
		this._upgradeTimeStart = 0;

		this.infoItems = [
			new InfoItem('Здоровье', () => {
				let value = this.health != this.healthMax 
					? `${this.health} из ` 
					: '';
				value +=  this.healthMax;
				return value;
			})
		];
	}

	static init(isLoadImage: boolean = true): void{
		Building.repairImage.src = HammerImage;
		Building.upgradeAnimation.src = UpgradeAnimation;
	}


	set impulse(value: number){
		if(value > this._maxImpulse){
			value = this._maxImpulse;
		}
		if(value < this._maxImpulse * -1){
			value = this._maxImpulse * -1;
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
		this._upgradeTimeStart = Date.now();
	}
	get isDisplayedUpgradeWindow(): boolean{
		return this._isDisplayedUpgradeWindow;
	}

	mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isWaveStarted: boolean, isWaveEnded: boolean, isMouseIn: boolean): boolean {
		if(isWaveEnded && isMouseIn){
			let isDisplayRepairButton =  this.isSupportRepair && this.health < this.healthMax;
			if(isDisplayRepairButton || this.isSupportUpgrade && !this.isDisplayedUpgradeWindow){
				if(!this._isDrawButtons){
					this._isDrawButtons = true;
	
					let x = (this.x + this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
					let y = (this.y + this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
					let width = (this.width - 2 * this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
					let height = (this.height - 2 * this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
					let repairPrice = this.getRepairPrice();
					BuildingButtons.show(x, y, width, height, isDisplayRepairButton, this.isSupportUpgrade && !this.isDisplayedUpgradeWindow, repairPrice, this);
				}
			}
			else{
				this._isDrawButtons = false;
			}
		}
		else{
			this._isDrawButtons = false;
		}
		
		return false;
	}

	getRepairPrice() : number {
		return Math.ceil(this.price / Building.repairDiscount * ((this.healthMax - this.health) / this.healthMax));
	}

	isCanBeRepaired() : boolean {
		return Gamer.coins >= this.getRepairPrice();
	}

	repair(): boolean{
		let repairPrice = this.getRepairPrice();
		if(this.isCanBeRepaired()){
			Gamer.coins -= repairPrice;
			this.health = this.healthMax;
			AudioSystem.play(RepairSoundUrl, 1);
			AudioSystem.play(RepairHammerSoundUrl, 0.3);
			Labels.createCoinLabel(this.x + this.width, this.y + this.height / 3, '-' + repairPrice, 2000);
			this._isDisplayRepairAnimation = true;
			this._repairAnimationStart = Date.now();
			return true;
		}

		return false;
	}

	draw(millisecondsFromStart: number, isGameOver: boolean, isBuildingMode: boolean = false): void{
		let x = this.x;
		let y = this.y;

		if(this.isDisplayedUpgradeWindow){
			let frame = isGameOver ? 0 : Math.floor((Date.now() - this._upgradeTimeStart) % Building.upgradeAnimationDuration / (Building.upgradeAnimationDuration / Building.upgradeAnimationFrames));
			Draw.ctx.drawImage(Building.upgradeAnimation, 
				Building.upgradeAnimation.width / Building.upgradeAnimationFrames * frame, //crop from x
				0, //crop from y
				Building.upgradeAnimation.width / Building.upgradeAnimationFrames, //crop by width
				Building.upgradeAnimation.height,    //crop by height
				x - this.width / 2, //x
				y - this.height / 2,  //y
				this.width * 2, //displayed width 
				this.height * 2); //displayed height 
			Draw.ctx.filter = 'brightness(1.7)';
		}

		if(this.impulse > 0){
			Draw.ctx.setTransform(1, 0, 0, 1, this.x + this.width / 2, this.y + this.height); 
			Draw.ctx.rotate(this._impulsePharos * Math.PI / 180);
			x = -this.width / 2;
			y = -this.height;
		}

		if(this.frames > 1){
			let frame = isGameOver ? 0 : Math.floor((millisecondsFromStart % 1000) / (500 / this.frames)) % this.frames;
			Draw.ctx.drawImage(this.image, 
				this.image.width / this.frames * frame, //crop from x
				0, //crop from y
				this.image.width / this.frames, //crop by width
				this.image.height,    //crop by height
				x, //x
				y,  //y
				this.width, //displayed width 
				this.height); //displayed height 
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

	logic(millisecondsDifferent: number, monsters: Monster[], bottomShiftBorder: number){
		if(this._impulse > 1){
			this._impulse -= millisecondsDifferent / 1000 * (this._impulse * this._impulseForceDecreasing);
			this._impulsePharos -= (this._impulsePharosSign ? -1 : 1) * millisecondsDifferent / 1000 * (this._impulse * this._impulsePharosForceDecreasing);

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
			if(this._repairAnimationStart + Building.repairAnimationDurationMs < Date.now()){
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