import {Draw} from '../gameSystems/Draw';
import {Monster} from './Monster';
import ShopItem from '../../models/ShopItem';
import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

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

	protected _impulse: number; //импульс от сверх ударов и сотрясений
	protected _impulsePharos: number; //маятниковый импульс от сверх ударов и сотрясений (0 - середина, значение движется от Z образно между отрицательными и положительными велечинами в пределах максимального значения по abs)
	protected _impulsePharosSign: boolean; //знак маятникового импульса в данный момент (0 - уменьшение, 1 - увеличение), нужен для указания Z образного движение по мере затухания импульса
	protected _maxImpulse: number; //максимальное значение импульса для здания
	protected _impulseForceDecreasing: number; //сила уменьшения импульса
	protected _impulsePharosForceDecreasing: number; //сила уменьшения маятникового импульса
	protected _isDrawButtonRepair: boolean;
	protected _isDrawButtonUpgrade: boolean;

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
		this._isDrawButtonRepair = this._isDrawButtonUpgrade = false;
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

	mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isWaveStarted: boolean, isWaveEnded: boolean, isMouseIn: boolean): boolean {
		this._isDrawButtonRepair = this._isDrawButtonUpgrade = false;
		
		if(isWaveEnded && isMouseIn){
			if(this.isSupportRepair){
				this._isDrawButtonRepair = true;
			}

			if(this.isSupportUpgrade){
				this._isDrawButtonUpgrade = true;
			}
		}
		
		return false;
	}

	draw(millisecondsFromStart: number, isGameOver: boolean, isBuildingMode: boolean = false): void{
		let x = this.x;
		let y = this.y;
		let isDrawButtons = this._isDrawButtonRepair || this._isDrawButtonUpgrade;
		
		if(isDrawButtons){
			Draw.ctx.filter = 'blur(3px)';
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

		if(isDrawButtons){
			Draw.ctx.filter = 'none';
			let countDisplayedButtons = (+this._isDrawButtonRepair) + (+this._isDrawButtonUpgrade);

			if(this._isDrawButtonRepair){
				
			}
	
			if(this._isDrawButtonUpgrade){
				
			}
		}
	}

	drawHealth(): void{
		if(this.health < this.healthMax && this.health > 0){
			Draw.drawHealth(this.x + 15, this.y - 10, this.width - 30, this.healthMax, this.health);
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
	}
}