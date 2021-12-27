import {Draw} from '../gameSystems/Draw';
import {Building} from './Building';
import sortBy from 'lodash/sortBy';
import {Modifier} from "./Modifier";
import {Helper} from "../helpers/Helper";
import { Labels } from '../gameSystems/Labels';

export class Monster{
	name: string;

	image: HTMLImageElement; //содержит несколько изображений для анимации
	attackImage: HTMLImageElement;  //содержит несколько изображений для анимации

	frames: number; //сколько изображений в image?
	attackFrames: number; //сколько изображений атаки в attackImage?

	width: number; //текущая ширина
	widthFrame: number; //ширина кадра
	height: number; //текущая высота (расчитывается по текущей ширине)

	attackWidth: number; //текущая ширина attack
	attackWidthFrame: number; //ширина attack фрейма
	attackHeight: number; //текущая высота attack (расчитывается по текущей ширине attack)

	reduceHover: number; //на сколько пикселей уменьшить зону наведения?

	healthMax: number; //максимум хп
	health: number;
	damage: number; //урон (в секунду)
	speed: number; //скорость передвижения (пикселей в секунду)
	speedAnimation: number; //скорость анимации
	speedAnimationAttack: number; //скорость анимации атаки

	x: number;
	y: number;

	isAttack: boolean; //атакует?
	isLeftSide: boolean; // с левой стороны движется?
	isLand: boolean; //наземный?

	createdTime: number;

	buildingGoal: Building|null; //цель-здание для атаки

	modifiers: Modifier[]; //бафы/дебафы

	lastAttackedTime: number; //последнее время атаки (unixtime)
	attackTimeWaiting: number; //частота атаки (выражается вовремени ожидания после атаки)

	constructor(
		x: number, 
		y: number, 
		isLeftSide: boolean, 
		isLand: boolean, 
		name: string, 
		image: HTMLImageElement, 
		frames: number, 
		width: number,
		speedAnimation: number,
		imageAttack: HTMLImageElement, 
		attackFrames: number, 
		attackWidth: number,
		speedAnimationAttack: number,
		reduceHover: number, 
		healthMax: number, 
		damage: number, 
		attackTimeWaiting: number,
		speed: number)
	{
		this.name = name;

		this.image = image; //содержит несколько изображений для анимации
		this.frames = frames; //сколько изображений в image?
		this.width = width; //ширина image
		this.widthFrame = image.width / frames;
		this.height = this.width / this.widthFrame * this.image.height;
		this.speedAnimation = speedAnimation;

		this.attackImage = imageAttack;  //содержит несколько изображений для анимации
		this.attackFrames = attackFrames; //сколько изображений атаки в attackImage?
		this.attackWidth = attackWidth; //ширина attack image
		this.attackWidthFrame = imageAttack.width / attackFrames;
		this.attackHeight = this.attackWidth / this.attackWidthFrame * this.attackImage.height;
		this.speedAnimationAttack = speedAnimationAttack;

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

		this.buildingGoal = null;
		this.modifiers = [];

		this.lastAttackedTime = 0;
		this.attackTimeWaiting = attackTimeWaiting;
	}

	get centerX(){
		return this.x + this.width / 2;
	}
	get centerY(){
		return this.y + this.height / 2;
	}

	logic(millisecondsDifferent: number, buildings: Building[], bottomBorder: number): void{
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
			if (this.x + this.width < this.buildingGoal.x + this.width / 5) { //ещё не дошёл
				this.x += speed;
			}
			else //дошёл
			{
				this.x = this.buildingGoal.x - this.width + this.width / 5;
				this.isAttack = true; //атакует
			}
		}
		else 
		{
			if (this.x > this.buildingGoal.x + this.buildingGoal.width - this.width / 5) { //ещё не дошёл
				this.x -= speed;
			}
			else //дошёл
			{
				this.x = this.buildingGoal.x + this.buildingGoal.width - this.width / 5;
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
				if(this.y > bottomBorder - this.attackHeight){
					this.y--;
				}
				else if(this.y < bottomBorder - this.attackHeight){
					this.y+=2;
				}
			}
		}
		else {
			//гравитация
			if(this.isLand){
				if(this.y > bottomBorder - this.height){
					this.y--;
				}
				else if(this.y < bottomBorder - this.height){
					this.y+=2;
				}
			}
		}
	}

	attack(damage: number): void{
		if(damage > 0 && this.buildingGoal != null){
			this.buildingGoal.health -= damage; //наносим урон
			this.lastAttackedTime = Date.now();
			Labels.createRed(this.isLeftSide ? this.x + this.width : this.x, this.y + this.height / 2, '-' + damage.toFixed(1), 100);
		}
	}

	onClicked(): void{}

	draw(isGameOver: boolean): void{
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
		if(this.health != this.healthMax){
			Draw.drawHealth(this.x + 10, this.y - 2, this.width - 20, this.healthMax, this.health);
		}
	}
}