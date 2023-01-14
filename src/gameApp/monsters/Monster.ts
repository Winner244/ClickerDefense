import sortBy from 'lodash/sortBy';

import {ImageHandler} from '../ImageHandler';

import {Draw} from '../gameSystems/Draw';
import {AudioSystem} from '../gameSystems/AudioSystem';

import {Labels} from '../labels/Labels';

import AnimationInfinite from '../../models/AnimationInfinite';

import {Modifier} from "../modifiers/Modifier";

import {Helper} from "../helpers/Helper";

import {Building} from '../buildings/Building';

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


/** Базовый класс для всех монстров */
export class Monster{
	readonly imageHandler: ImageHandler; //управление lazy загрузкой картинок и их готовности к отображению
	readonly animation: AnimationInfinite; //анимация движения монстра
	readonly attackAnimation: AnimationInfinite;  //анимация атаки монстра

	//поля свойства экземпляра
	readonly id: string;
	name: string;

	reduceHover: number; //на сколько пикселей уменьшить зону наведения?

	healthMax: number; //максимум хп
	health: number;
	damage: number; //урон (в секунду)
	speed: number; //скорость передвижения (пикселей в секунду)

	x: number;
	y: number;
	scaleSize: number; //1 - размер монстра по размеру картинки, 0.5 - монстр в 2 раза меньше картинки по высоте и ширине, 1.5 - монстр в 2 раза больше.

	isLeftSide: boolean; // с левой стороны движется?
	isLand: boolean; //наземный?

	modifiers: Modifier[]; //бафы/дебафы



	//технические поля экземпляра
	protected _buildingGoal: Building|null; //цель-здание для атаки

	protected readonly attackTimeWaitingMs: number; //частота атаки (выражается во времени ожидания после атаки в миллисекундах)
	_attackLeftTimeMs: number; //оставшееся время до следующей атаки (миллисекунды)

	protected readonly avrTimeSoundWaitMs: number; //среднее время ожидания следующего звука
	protected _leftTimeToPlaySoundMs: number; //оставшееся время до проигрывания звука монстра

	protected _isAttack: boolean; //атакует?

	
	constructor(
		x: number, 
		y: number, 
		scaleSize: number,
		isLeftSide: boolean, 
		isLand: boolean, 
		name: string, 

		image: HTMLImageElement, 
		frames: number, 
		animationDurationMs: number,

		attackImage: HTMLImageElement, 
		attackFrames: number, 
		attackAnimationDurationMs: number,

		reduceHover: number, 
		healthMax: number, 
		damage: number, 
		attackTimeWaitingMs: number,
		speed: number,
		imageHandler: ImageHandler,
		avrTimeSoundWaitMs: number)
	{
		this.id = Helper.generateUid();
		this.x = x;
		this.y = y;
		this.isLeftSide = isLeftSide; // с левой стороны движется?
		this.isLand = isLand; //наземный?
		this.scaleSize = scaleSize;
		this.name = name;

		this.animation = new AnimationInfinite(frames, animationDurationMs, image); //анимация бега
		this.attackAnimation = new AnimationInfinite(attackFrames, attackAnimationDurationMs, attackImage);  //анимация атаки

		this.reduceHover = reduceHover; //на сколько пикселей уменьшить зону наведения?

		this.healthMax = healthMax * scaleSize; //максимум хп
		this.health = healthMax * scaleSize;

		this.damage = damage * scaleSize; //урон за 1 раз
		this.attackTimeWaitingMs = attackTimeWaitingMs;
		this.speed = speed; //скорость (пикселей в секунду)

		this.imageHandler = imageHandler;


		this._isAttack = false; //атакует?
		this._buildingGoal = null;
		this.modifiers = [];
		this._attackLeftTimeMs = 0;
		this._leftTimeToPlaySoundMs = avrTimeSoundWaitMs / 2;
		this.avrTimeSoundWaitMs = avrTimeSoundWaitMs;
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

	public static loadHitSounds(){
		AudioSystem.load(Hit1Sound);
		AudioSystem.load(Hit2Sound);
		AudioSystem.load(Hit3Sound);
		AudioSystem.load(Hit4Sound);
		AudioSystem.load(Hit5Sound);
		AudioSystem.load(Hit6Sound);
		AudioSystem.load(Hit7Sound);
		AudioSystem.load(Hit8Sound);
		AudioSystem.load(Hit9Sound);
		AudioSystem.load(Hit10Sound);
		AudioSystem.load(Hit11Sound);
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], bottomBorder: number): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		//логика передвижения
		if(this._buildingGoal == null || this._buildingGoal.health <= 0){
			let buildingsGoal = buildings.filter(building => building.isLand == this.isLand);
			buildingsGoal = sortBy(buildingsGoal, [building => this.isLeftSide ? building.x : building.x + building.width]);
			this._buildingGoal = this.isLeftSide ? buildingsGoal[0] : buildingsGoal[buildingsGoal.length - 1];

			if(this._buildingGoal == null){
				return;
			}
		}

		this.modifiers.forEach(modifier => modifier.logic(this, drawsDiffMs, monsters));

		let speedMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.speedMultiplier);
		let speed = this.speed * (drawsDiffMs / 1000);
		speed += speed * speedMultiplier;

		if(this.isLeftSide) //если монстр идёт с левой стороны
		{
			let condition = this.isLand 
				? this.x + this.width < this._buildingGoal.x + this.width / 5
				: this._buildingGoal.width / 2 - this._buildingGoal.reduceHover < Helper.getDistance(this.centerX, this.centerY, this._buildingGoal.centerX, this._buildingGoal.centerY);

			if (condition) { //ещё не дошёл
				this.x += speed;

				if(!this.isLand){
					//this.y += (this._buildingGoal.centerY - this.centerY) / Helper.getDistance(this.centerX, this.centerY, this._buildingGoal.centerX, this._buildingGoal.centerY) * speed;
				}
				this._isAttack = false;
			}
			else //дошёл
			{
				if(this.isLand){
					this.x = this._buildingGoal.x - this.width + this.width / 5;
				}
				if(!this._isAttack){
					this.attackAnimation.restart();
				}
				this._isAttack = true; //атакует
			}
		}
		else 
		{
			let condition = this.isLand 
				? this.x > this._buildingGoal.x + this._buildingGoal.width - this.width / 5
				: this._buildingGoal.width / 2 - this._buildingGoal.reduceHover < Helper.getDistance(this.centerX, this.centerY, this._buildingGoal.centerX, this._buildingGoal.centerY);

			if (condition) { //ещё не дошёл
				this.x -= speed;

				if(!this.isLand){
					//this.y += (this._buildingGoal.centerY - this.centerY) / Helper.getDistance(this.centerX, this.centerY, this._buildingGoal.centerX, this._buildingGoal.centerY) * speed;
				}
				this._isAttack = false;
			}
			else //дошёл
			{
				if(this.isLand){
					this.x = this._buildingGoal.x + this._buildingGoal.width - this.width / 5;
				}
				if(!this._isAttack){
					this.attackAnimation.restart();
				}
				this._isAttack = true; //атакует
			}
		}

		//логика атаки
		if(this._attackLeftTimeMs > 0)
			this._attackLeftTimeMs -= drawsDiffMs;

		if(this._isAttack) //если атакует
		{
			//атака
			if(this._attackLeftTimeMs <= 0){
				let damageMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.damageMultiplier);
				let damage = this.damage + this.damage * damageMultiplier;
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

		this._leftTimeToPlaySoundMs -= drawsDiffMs;
		if(this._leftTimeToPlaySoundMs <= 0){
			this._leftTimeToPlaySoundMs = this.avrTimeSoundWaitMs + Helper.getRandom(-this.avrTimeSoundWaitMs / 2, this.avrTimeSoundWaitMs / 2);
			this.playSound();
		}
	}

	attack(damage: number): void{
		if(damage > 0 && this._buildingGoal != null){
			this._buildingGoal.applyDamage(damage, this, this.isLeftSide ? this.x + this.width - 10 : this.x - 12, this.y + this.height / 2); //монстр наносит урон
			this._attackLeftTimeMs = this.attackTimeWaitingMs;

			var size = this.width * this.height;
			var sizeVolumeScale = size / 3000;
			var volume = 0.1 * Math.sqrt(sizeVolumeScale) * Math.sqrt(damage);
			AudioSystem.playRandomV(this.centerX, [Hit1Sound, Hit2Sound, Hit3Sound, Hit4Sound, Hit5Sound, Hit6Sound, Hit7Sound, Hit8Sound, Hit9Sound, Hit10Sound, Hit11Sound], volume || 0.1, false, 1, true);
		}
	}

	onClicked(damage: number, x: number|null = null, y: number|null = null): void{
		this.health -= damage;
		Labels.createGamerDamageLabel(x || this.centerX, y || this.centerY, '-' + damage);
	}

	attacked(damage: number, x: number|null = null, y: number|null = null): void{
		this.health -= damage;
		Labels.createDamageLabel(x || this.centerX, y || this.centerY, '-' + damage.toFixed(1), 3000);
	}

	destroy(): void{}

	playSound(): void{}

	draw(drawsDiffMs: number, isGameOver: boolean): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		let isInvert = this.isLeftSide;
		let scale = isInvert ? -1 : 1;

		this.modifiers.forEach(modifier => modifier.drawBehindMonster(this, drawsDiffMs));

		if(isInvert){
			Draw.ctx.save();
			Draw.ctx.scale(-1, 1);
		}

		if(this._isAttack){
			//атака
			this.attackAnimation.draw(drawsDiffMs, isGameOver, scale * this.x, this.y, scale * this.attackWidth, this.attackHeight);
		}
		else{
			//передвижение
			this.animation.draw(drawsDiffMs, isGameOver, scale * this.x, this.y, scale * this.width, this.height);
		}

		if(isInvert){
			Draw.ctx.restore();
		}

		this.modifiers.forEach(modifier => modifier.drawAheadMonster(this, drawsDiffMs));

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