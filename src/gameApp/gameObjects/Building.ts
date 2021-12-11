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
		description: string)
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
	}

	get centerX(){
		return this.x + this.width / 2;
	}
	get centerY(){
		return this.y + this.height / 2;
	}

	draw(millisecondsFromStart: number, isGameOver: boolean, isBuildingMode: boolean = false): void{
		if(this.frames > 1){
			let frame = isGameOver ? 0 : Math.floor((millisecondsFromStart % 1000) / (500 / this.frames)) % this.frames;
			Draw.ctx.drawImage(this.image, 
				this.image.width / this.frames * frame, //crop from x
				0, //crop from y
				this.image.width / this.frames, //crop by width
				this.image.height,    //crop by height
				this.x, //x
				this.y,  //y
				this.width, //displayed width 
				this.height); //displayed height 
		}
		else{
			if(this.width > 0 && this.height > 0){
				Draw.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
			}
			else{
				Draw.ctx.drawImage(this.image, this.x, this.y);
			}
		}
	}

	drawHealth(): void{
		if(this.health < this.healthMax && this.health > 0){
			Draw.drawHealth(this.x + 15, this.y - 10, this.width - 30, this.healthMax, this.health);
		}
	}

	logic(millisecondsDifferent: number, monsters: Monster[], bottomShiftBorder: number){}
}