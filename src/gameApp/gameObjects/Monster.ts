import {Draw} from '../gameSystems/Draw';
import {Building} from './Building';

export class Monster{
	name: string;

	image: HTMLImageElement; //содержит несколько изображений для анимации
	attackImage: HTMLImageElement;  //содержит несколько изображений для анимации

	frames: number; //сколько изображений в image?
	attackFrames: number; //сколько изображений атаки в attackImage?

	width: number; //ширина image
	attackWidth: number; //ширина attack image
	reduceHover: number; //на сколько пикселей уменьшить зону наведения?

	healthMax: number; //максимум хп
	health: number;
	damage: number; //урон (в секунду)
	speed: number; //скорость (пикселей в секунду)

	x: number;
	y: number;

	isAttack: boolean; //атакует?
	isLeftSide: boolean; // с левой стороны движется?
	isLand: boolean; //наземный?

	createdTime: number;

	constructor(
		x: number, 
		y: number, 
		isLeftSide: boolean, 
		isLand: boolean, 
		name: string, 
		image: HTMLImageElement, 
		frames: number, 
		width: number, 
		imageAttack: HTMLImageElement, 
		attackFrames: number, 
		attackWidth: number, 
		reduceHover: number, 
		healthMax: number, 
		damage: number, 
		speed: number)
	{
		this.name = name;

		this.image = image; //содержит несколько изображений для анимации
		this.attackImage = imageAttack;  //содержит несколько изображений для анимации

		this.frames = frames; //сколько изображений в image?
		this.attackFrames = attackFrames; //сколько изображений атаки в attackImage?

		this.width = width; //ширина image
		this.attackWidth = attackWidth; //ширина attack image
		this.reduceHover = reduceHover; //на сколько пикселей уменьшить зону наведения?

		this.healthMax = healthMax; //максимум хп
		this.health = healthMax;
		this.damage = damage; //урон (в секунду)
		this.speed = speed; //скорость (пикселей в секунду)

		this.x = x;
		this.y = y;

		this.isAttack = false; //атакует?
		this.isLeftSide = isLeftSide; // с левой стороны движется?
		this.isLand = isLand; //наземный?

		this.createdTime = Date.now();
	}

	logic(millisecondsDifferent: number, buildings: Building[]): void{
		//логика передвижения
		let buildingsGoal = buildings.filter(building => building.isLand == this.isLand);
		buildingsGoal.sortByField(building => building.x);
		var buildingGoal = this.isLeftSide ? buildingsGoal.first() : buildingsGoal.last();

		this.isAttack = false;
		if(this.isLeftSide) //если монстр идёт с левой стороны
		{
			if (this.x + this.width < buildingGoal.x + this.width / 5) { //ещё не дошёл
				this.x += this.speed * (millisecondsDifferent / 1000);
			}
			else //дошёл
			{
				this.x = buildingGoal.x - this.width + this.width / 5;
				this.isAttack = true; //атакует
			}
		}
		else 
		{
			if (this.x > buildingGoal.x + buildingGoal.width - this.width / 5) { //ещё не дошёл
				this.x -= this.speed * (millisecondsDifferent / 1000);
			}
			else //дошёл
			{
				this.x = buildingGoal.x + buildingGoal.width - this.width / 5;
				this.isAttack = true; //атакует
			}
		}

		//логика атаки
		if(this.isAttack) //если атакует
		{
			var damage = this.damage * (millisecondsDifferent / 1000);
			if(damage > 0){
				buildingGoal.health -= damage; //наносим урон
			}
		}
	}

	draw(isGameOver: boolean): void{
		let isInvert = this.isLeftSide;
		let scale = isInvert ? -1 : 1;

		if(isInvert){
			Draw.ctx.save();
			Draw.ctx.scale(-1, 1);
		}

		if(this.isAttack){
			//атака
			let currentFrame = isGameOver ? 0 : Math.floor(((Date.now() - this.createdTime) % 1000) / (1000 / this.attackFrames)) % this.attackFrames;
			Draw.ctx.drawImage(this.attackImage, 
				this.attackWidth * currentFrame, //crop from x
				0, //crop from y
				this.attackWidth, 		  //crop by width
				this.attackImage.height,  //crop by height
				scale * this.x,  //draw from x
				this.y,  		 //draw from y
				scale * this.attackWidth, //draw by width 
				this.attackImage.height); //draw by height
		}
		else{
			//передвижение
			let currentFrame = isGameOver ? 0 : Math.floor(((Date.now() - this.createdTime) % 1000) / (1000 / this.frames)) % this.frames;
			Draw.ctx.drawImage(this.image, 
				this.width * currentFrame, //crop from x
				0, //crop from y
				this.width, 	   //crop by width
				this.image.height, //crop by height
				scale * this.x,  //draw from x
				this.y,  		 //draw from y
				scale * this.width, //draw by width 
				this.image.height); //draw by height
		}

		if(isInvert){
			Draw.ctx.restore();
		}

		if(this.health != this.healthMax){
			Draw.drawHealth(this.x + 10, this.y - 2, this.width - 20, this.healthMax, this.health);
		}
	}
}