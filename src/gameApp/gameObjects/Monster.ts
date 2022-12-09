import sortBy from 'lodash/sortBy';

import {Draw} from '../gameSystems/Draw';
import { Labels } from '../gameSystems/Labels';

import Animation from '../../models/Animation';

import {Building} from './Building';
import {Modifier} from "./Modifier";
import {Helper} from "../helpers/Helper";
import { Barricade } from '../buildings/Barricade';
import { ImageHandler } from '../ImageHandler';
import { AudioSystem } from '../gameSystems/AudioSystem';

import Hit1Sound from '../../assets/sounds/monsters/hit1.mp3'; 
import Hit2Sound from '../../assets/sounds/monsters/hit2.mp3'; 
import Hit3Sound from '../../assets/sounds/monsters/hit3.mp3'; 
import Hit4Sound from '../../assets/sounds/monsters/hit4.mp3'; 
import Hit5Sound from '../../assets/sounds/monsters/hit5.mp3'; 
import Hit6Sound from '../../assets/sounds/monsters/hit6.mp3'; 
import Hit7Sound from '../../assets/sounds/monsters/hit7.mp3'; 
import Hit8Sound from '../../assets/sounds/monsters/hit8.mp3'; 
import Hit9Sound from '../../assets/sounds/monsters/hit9.mp3'; 
import Hit10Sound from '../../assets/sounds/monsters/hit10.mp3'; 
import Hit11Sound from '../../assets/sounds/monsters/hit11.mp3'; 

export class Monster{
	id: string;
	name: string;

	animation: Animation; //содержит несколько изображений для анимации
	attackAnimation: Animation;  //содержит несколько изображений для анимации

	reduceHover: number; //на сколько пикселей уменьшить зону наведения?

	healthMax: number; //максимум хп
	health: number;
	damage: number; //урон (в секунду)
	speed: number; //скорость передвижения (пикселей в секунду)

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
		animationDuration: number,

		attackImage: HTMLImageElement, 
		attackFrames: number, 
		attackAnimationDuration: number,

		reduceHover: number, 
		healthMax: number, 
		damage: number, 
		attackTimeWaiting: number,
		speed: number,
		imageHandler: ImageHandler)
	{
		this.id = Helper.generateUid();
		this.x = x;
		this.y = y;
		this.isLeftSide = isLeftSide; // с левой стороны движется?
		this.isLand = isLand; //наземный?
		this.scaleSize = scaleSize;
		this.name = name;

		this.animation = new Animation(frames, animationDuration, image); //анимация бега
		this.attackAnimation = new Animation(attackFrames, attackAnimationDuration, attackImage);  //анимация атаки

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
		return this.width / (this.animation.image.width / this.animation.frames) * this.animation.image.height;
	}
	get attackHeight(): number {
		return this.attackWidth / (this.attackAnimation.image.width / this.attackAnimation.frames) * this.attackAnimation.image.height;
	}

	get width(): number {
		return this.animation.image.width / this.animation.frames * this.scaleSize;
	}
	get attackWidth(): number {
		return this.attackAnimation.image.width / this.attackAnimation.frames * this.scaleSize;
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

			if(this.buildingGoal == null){
				return;
			}
		}

		let speedMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.speedMultiplier);
		let speed = this.speed * (millisecondsDifferent / 1000);
		speed += speed * speedMultiplier;

		if(this.isLeftSide) //если монстр идёт с левой стороны
		{
			let condition = this.isLand 
				? this.x + this.width < this.buildingGoal.x + this.width / 5
				: this.buildingGoal.width / 2 - this.buildingGoal.reduceHover < Helper.getDistance(this.centerX, this.centerY, this.buildingGoal.centerX, this.buildingGoal.centerY);

			if (condition) { //ещё не дошёл
				this.x += speed;

				if(!this.isLand){
					//this.y += (this.buildingGoal.centerY - this.centerY) / Helper.getDistance(this.centerX, this.centerY, this.buildingGoal.centerX, this.buildingGoal.centerY) * speed;
				}
				this.isAttack = false;
			}
			else //дошёл
			{
				if(this.isLand){
					this.x = this.buildingGoal.x - this.width + this.width / 5;
				}
				if(!this.isAttack){
					this.attackAnimation.timeCreated = Date.now();
				}
				this.isAttack = true; //атакует
			}
		}
		else 
		{
			let condition = this.isLand 
				? this.x > this.buildingGoal.x + this.buildingGoal.width - this.width / 5
				: this.buildingGoal.width / 2 - this.buildingGoal.reduceHover < Helper.getDistance(this.centerX, this.centerY, this.buildingGoal.centerX, this.buildingGoal.centerY);

			if (condition) { //ещё не дошёл
				this.x -= speed;

				if(!this.isLand){
					//this.y += (this.buildingGoal.centerY - this.centerY) / Helper.getDistance(this.centerX, this.centerY, this.buildingGoal.centerX, this.buildingGoal.centerY) * speed;
				}
				this.isAttack = false;
			}
			else //дошёл
			{
				if(this.isLand){
					this.x = this.buildingGoal.x + this.buildingGoal.width - this.width / 5;
				}
				if(!this.isAttack){
					this.attackAnimation.timeCreated = Date.now();
				}
				this.isAttack = true; //атакует
			}
		}

		//логика атаки
		if(this.isAttack) //если атакует
		{
			//атака
			if(this.lastAttackedTime + this.attackTimeWaiting < Date.now()){
				let damageMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.damageMultiplier);
				let damage = this.damage * (millisecondsDifferent / 1000);
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
			const realDamage = this.buildingGoal.applyDamage(damage); //монстр наносит урон
			this.lastAttackedTime = Date.now();
			Labels.createMonsterDamageLabel(this.isLeftSide ? this.x + this.width - 10 : this.x - 12, this.y + this.height / 2, '-' + realDamage.toFixed(1), 3000);
			AudioSystem.playRandom(this.centerX, [Hit1Sound, Hit2Sound, Hit3Sound, Hit4Sound, Hit5Sound, Hit6Sound, Hit7Sound, Hit8Sound, Hit9Sound, Hit10Sound, Hit11Sound], 
				[0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2], false, 1, true);

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
			this.attackAnimation.draw(isGameOver, scale * this.x, this.y, scale * this.attackWidth, this.attackHeight);
		}
		else{
			//передвижение
			this.animation.draw(isGameOver, scale * this.x, this.y, scale * this.width, this.height);
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