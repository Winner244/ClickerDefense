import {Draw} from '../gameSystems/Draw';
import {Building} from './Building';
import sortBy from 'lodash/sortBy';
import {Modifier} from "./Modifier";
import {Helper} from "../helpers/Helper";
import { Labels } from '../gameSystems/Labels';
import { Barricade } from '../buildings/Barricade';
import { ImageHandler } from '../ImageHandler';

export class Monster{
	name: string;

	image: HTMLImageElement; //содержит несколько изображений для анимации
	attackImage: HTMLImageElement;  //содержит несколько изображений для анимации

	frames: number; //сколько изображений в image?
	attackFrames: number; //сколько изображений атаки в attackImage?

	reduceHover: number; //на сколько пикселей уменьшить зону наведения?

	healthMax: number; //максимум хп
	health: number;
	damage: number; //урон (в секунду)
	speed: number; //скорость передвижения (пикселей в секунду)
	speedAnimation: number; //скорость анимации
	speedAnimationAttack: number; //скорость анимации атаки

	x: number;
	y: number;
	scaleSize: number; //1 - размер монстра по размеру картинки, 0.5 - монстр в 2 раза меньше картинки по высоте и ширине, 1.5 - монстр в 2 раза больше.

	isAttack: boolean; //атакует?
	isLeftSide: boolean; // с левой стороны движется?
	isLand: boolean; //наземный?

	createdTime: number;

	buildingGoal: Building|null; //цель-здание для атаки

	modifiers: Modifier[]; //бафы/дебафы

	lastAttackedTime: number; //последнее время атаки (unixtime)
	attackTimeWaiting: number; //частота атаки (выражается вовремени ожидания после атаки)

	imageHandler: ImageHandler; //управление lazy загрузкой картинок и их готовности к отображению

	constructor(
		x: number, 
		y: number, 
		scaleSize: number,
		isLeftSide: boolean, 
		isLand: boolean, 
		name: string, 
		image: HTMLImageElement, 
		frames: number, 
		speedAnimation: number,
		imageAttack: HTMLImageElement, 
		attackFrames: number, 
		speedAnimationAttack: number,
		reduceHover: number, 
		healthMax: number, 
		damage: number, 
		attackTimeWaiting: number,
		speed: number,
		imageHandler: ImageHandler)
	{
		this.x = x;
		this.y = y;
		this.isLeftSide = isLeftSide; // с левой стороны движется?
		this.isLand = isLand; //наземный?
		this.scaleSize = scaleSize;
		this.name = name;

		this.image = image; //содержит несколько изображений для анимации
		this.frames = frames; //сколько изображений в image?
		this.speedAnimation = speedAnimation;

		this.attackImage = imageAttack;  //содержит несколько изображений для анимации
		this.attackFrames = attackFrames; //сколько изображений атаки в attackImage?
		this.speedAnimationAttack = speedAnimationAttack;

		this.reduceHover = reduceHover; //на сколько пикселей уменьшить зону наведения?

		this.healthMax = healthMax * scaleSize; //максимум хп
		this.health = healthMax * scaleSize;

		this.damage = damage * scaleSize; //урон (в секунду)
		this.attackTimeWaiting = attackTimeWaiting;
		this.speed = speed; //скорость (пикселей в секунду)

		this.imageHandler = imageHandler;


		this.isAttack = false; //атакует?
		this.buildingGoal = null;
		this.modifiers = [];
		this.lastAttackedTime = 0;
		this.createdTime = Date.now();
	}

	get height(): number {
		return this.width / this.widthFrame * this.image.height;
	}
	get attackHeight(): number {
		return this.attackWidth / this.attackWidthFrame * this.attackImage.height;
	}

	get widthFrame(): number {
		return this.image.width / this.frames;
	}
	get attackWidthFrame(): number {
		return this.attackImage.width / this.attackFrames;
	}

	get width(): number {
		return this.image.width / this.frames * this.scaleSize;
	}
	get attackWidth(): number {
		return this.attackImage.width / this.attackFrames * this.scaleSize;
	}

	get centerX(): number {
		return this.x + this.width / 2;
	}
	get centerY(): number {
		return this.y + this.height / 2;
	}

	logic(millisecondsDifferent: number, buildings: Building[], bottomBorder: number): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		//логика передвижения
		if(this.buildingGoal == null || this.buildingGoal.health <= 0){
			let buildingsGoal = buildings.filter(building => building.isLand == this.isLand);
			buildingsGoal = sortBy(buildingsGoal, [building => this.isLeftSide ? building.x : building.x + building.width]);
			this.buildingGoal = this.isLeftSide ? buildingsGoal[0] : buildingsGoal[buildingsGoal.length - 1];
		}

		var speedMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.speedMultiplier);
		var speed = this.speed * (millisecondsDifferent / 1000);
		speed += speed * speedMultiplier;

		this.isAttack = false;
		if(this.isLeftSide) //если монстр идёт с левой стороны
		{
			var condition = this.isLand 
				? this.x + this.width < this.buildingGoal.x + this.width / 5
				: this.buildingGoal.width / 2 - this.buildingGoal.reduceHover < Helper.getDistance(this.centerX, this.centerY, this.buildingGoal.centerX, this.buildingGoal.centerY);

			if (condition) { //ещё не дошёл
				this.x += speed;
			}
			else //дошёл
			{
				if(this.isLand){
					this.x = this.buildingGoal.x - this.width + this.width / 5;
				}
				this.isAttack = true; //атакует
			}
		}
		else 
		{
			var condition = this.isLand 
				? this.x > this.buildingGoal.x + this.buildingGoal.width - this.width / 5
				: this.buildingGoal.width / 2 - this.buildingGoal.reduceHover < Helper.getDistance(this.centerX, this.centerY, this.buildingGoal.centerX, this.buildingGoal.centerY);

			if (condition) { //ещё не дошёл
				this.x -= speed;
			}
			else //дошёл
			{
				if(this.isLand){
					this.x = this.buildingGoal.x + this.buildingGoal.width - this.width / 5;
				}
				this.isAttack = true; //атакует
			}
		}

		//логика атаки
		if(this.isAttack) //если атакует
		{
			//атака
			if(this.lastAttackedTime + this.attackTimeWaiting < Date.now()){
				var damageMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.damageMultiplier);
				var damage = this.damage * (millisecondsDifferent / 1000);
				damage += damage * damageMultiplier;
				this.attack(damage);
			}

			//гравитация
			if(this.isLand){
				if(this.y > bottomBorder - this.attackHeight + 2){
					this.y-=3;
				}
				else if(this.y < bottomBorder - this.attackHeight){
					this.y++;
				}
			}
		}
		else {
			//гравитация
			if(this.isLand){
				if(this.y > bottomBorder - this.height + 2){
					this.y-=3;
				}
				else if(this.y < bottomBorder - this.height){
					this.y++;
				}
			}
		}
	}

	attack(damage: number): void{
		if(damage > 0 && this.buildingGoal != null){
			this.buildingGoal.health -= damage; //монстр наносит урон
			this.lastAttackedTime = Date.now();
			Labels.createMonsterDamageLabel(this.isLeftSide ? this.x + this.width - 10 : this.x - 12, this.y + this.height / 2, '-' + damage.toFixed(1), 3000);

			if(this.buildingGoal instanceof  Barricade){
				var mirrorDamage = damage / 100 * Barricade.damageMirrorPercentage;
				this.health -= mirrorDamage;
				Labels.createMonsterDamageLabel(this.x + this.width / 2 + (this.isLeftSide ? 0: -17), this.y + this.height / 2, '-' + mirrorDamage.toFixed(1), 3000);
			}
		}
	}

	onClicked(): void{}

	draw(isGameOver: boolean): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		let isInvert = this.isLeftSide;
		let scale = isInvert ? -1 : 1;

		if(isInvert){
			Draw.ctx.save();
			Draw.ctx.scale(-1, 1);
		}

		if(this.isAttack){
			//атака
			let currentFrame = isGameOver ? 0 : Math.floor(((Date.now() - this.createdTime) % 1000 * this.speedAnimationAttack) / (1000 / this.attackFrames)) % this.attackFrames;
			Draw.ctx.drawImage(this.attackImage, 
				this.attackWidthFrame * currentFrame, //crop from x
				0, //crop from y
				this.attackWidthFrame, 		  //crop by width
				this.attackImage.height,  //crop by height
				scale * this.x,  //x
				this.y,  		 //y
				scale * this.attackWidth, //displayed width 
				this.attackHeight); //displayed height
		}
		else{
			//передвижение
			let currentFrame = isGameOver ? 0 : Math.floor(((Date.now() - this.createdTime) % 1000 * this.speedAnimation) / (1000 / this.frames)) % this.frames;
			Draw.ctx.drawImage(this.image, 
				this.widthFrame * currentFrame, //crop from x
				0, //crop from y
				this.widthFrame, 	   //crop by width
				this.image.height, //crop by height
				scale * this.x,  //x
				this.y,  		 //y
				scale * this.width, //displayed width 
				this.height); //displayed height
		}

		if(isInvert){
			Draw.ctx.restore();
		}

		this.drawHealth();
	}

	drawHealth(){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this.health != this.healthMax){
			Draw.drawHealth(this.x + 10, this.y - 2, this.width - 20, this.healthMax, this.health);
		}
	}
}