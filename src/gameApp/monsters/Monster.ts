import sortBy from 'lodash/sortBy';

import {AttackedObject} from '../../models/AttackedObject';
import {WaveData} from '../../models/WaveData';

import {ImageHandler} from '../ImageHandler';

import {AudioSystem} from '../gameSystems/AudioSystem';

import AnimationInfinite from '../../models/AnimationInfinite';

import {Modifier} from "../modifiers/Modifier";

import {Helper} from "../helpers/Helper";

import {Building} from '../buildings/Building';
import {Unit} from '../units/Unit';

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
export class Monster extends AttackedObject{
	readonly attackAnimation: AnimationInfinite;  //анимация атаки монстра

	//поля свойства экземпляра
	damage: number; //урон (в секунду)
	speed: number; //скорость передвижения (пикселей в секунду)


	//технические поля экземпляра
	protected _goal: AttackedObject|null; //цель (здание или юнит) для атаки

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
		super(x, y, healthMax * scaleSize, scaleSize, image, isLeftSide, isLand, reduceHover, name, imageHandler, frames, animationDurationMs);

		this.attackAnimation = new AnimationInfinite(attackFrames, attackAnimationDurationMs, attackImage);  //анимация атаки

		this.damage = damage * scaleSize; //урон за 1 раз
		this.attackTimeWaitingMs = attackTimeWaitingMs;
		this.speed = speed; //скорость (пикселей в секунду)


		this._isAttack = false; //атакует?
		this._goal = null;
		this._attackLeftTimeMs = 0;
		this._leftTimeToPlaySoundMs = avrTimeSoundWaitMs / 2;
		this.avrTimeSoundWaitMs = avrTimeSoundWaitMs;
	}

	get attackHeight(): number {
		return this.attackWidth / (this.attackAnimation.image.width / this.attackAnimation.frames) * this.attackAnimation.image.height;
	}
	get attackWidth(): number {
		return this.attackAnimation.image.width / this.attackAnimation.frames * this.scaleSize;
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

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomBorder: number, waveLevel: WaveData[]): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		//логика передвижения
		if(this._goal == null || this._goal.health <= 0){
			//TODO: process units, but if it is unit, need to check sometimes - maybe it has moved further than some building, OR vice versa got closer than the some building
			//моно сделать для левой и правой стороны по списку, которые обновляются при перемещении юнита - там будут юниты и здания ближайшие к монстрам, что бы им не искать цель, 
			//а просто брать первого из списка + при уничтожении здания будет проще
			let goal: AttackedObject[] = [];
			goal = goal.concat(buildings).concat(units).filter(x => x.isLand == this.isLand && x.health > 0);
			goal = sortBy(goal, [x => this.isLeftSide ? x.x : x.x + x.width]);
			this._goal = this.isLeftSide ? goal[0] : goal[goal.length - 1];

			if(this._goal == null){
				return;
			}
		}

		super.logicBase(drawsDiffMs);

		let speedMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.speedMultiplier);
		let speed = this.speed * (drawsDiffMs / 1000);
		speed += speed * speedMultiplier;

		if(this.isLeftSide) //если монстр идёт с левой стороны
		{
			let condition = this.isLand 
				? this.x + this.width < this._goal.x + this.width / 5
				: this._goal.width / 2 - this._goal.reduceHover < Helper.getDistance(this.centerX, this.centerY, this._goal.centerX, this._goal.centerY);

			if (condition) { //ещё не дошёл
				this.x += speed;

				if(!this.isLand){
					//this.y += (this._goal.centerY - this.centerY) / Helper.getDistance(this.centerX, this.centerY, this._goal.centerX, this._goal.centerY) * speed;
				}
				this._isAttack = false;
			}
			else //дошёл
			{
				if(this.isLand){
					this.x = this._goal.x - this.width + this.width / 5;
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
				? this.x > this._goal.x + this._goal.width - this.width / 5
				: this._goal.width / 2 - this._goal.reduceHover < Helper.getDistance(this.centerX, this.centerY, this._goal.centerX, this._goal.centerY);

			if (condition) { //ещё не дошёл
				this.x -= speed;

				if(!this.isLand){
					//this.y += (this._goal.centerY - this.centerY) / Helper.getDistance(this.centerX, this.centerY, this._goal.centerX, this._goal.centerY) * speed;
				}
				this._isAttack = false;
			}
			else //дошёл
			{
				if(this.isLand){
					this.x = this._goal.x + this._goal.width - this.width / 5;
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
				let damageMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.damageOutMultiplier);
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
		if(damage > 0 && this._goal != null){
			this._goal.applyDamage(damage, this.isLeftSide ? this.x + this.width - 10 : this.x - 12, this.y + this.height / 2, this); //монстр наносит урон
			this._attackLeftTimeMs = this.attackTimeWaitingMs;

			var size = this.width * this.height;
			var sizeVolumeScale = size / 3000;
			var volume = -5 + 1 * Math.sqrt(sizeVolumeScale) * Math.sqrt(Math.sqrt(Math.pow(damage, 3)));
			AudioSystem.playRandomV(this.centerX, [Hit1Sound, Hit2Sound, Hit3Sound, Hit4Sound, Hit5Sound, Hit6Sound, Hit7Sound, Hit8Sound, Hit9Sound, Hit10Sound, Hit11Sound], volume || -18, false, 1, true);
		}
	}

	onClicked(damage: number, x: number|null = null, y: number|null = null): void{
		this.applyDamage(damage, x, y);
	}

	playSound(): void{}

	draw(drawsDiffMs: number, isGameOver: boolean): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.drawBase(drawsDiffMs, isGameOver);

		this.drawHealth();
	}

	drawObject(drawsDiffMs: number, isGameOver: boolean, invertSign: number = 1){
		if(this._isAttack){
			//атака
			this.attackAnimation.draw(drawsDiffMs, isGameOver, invertSign * this.x, this.y, invertSign * this.attackWidth, this.attackHeight);
		}
		else{
			//передвижение
			super.drawObject(drawsDiffMs, isGameOver, invertSign);
		}
	}

	drawHealth(){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.drawHealthBase(this.x + 10, this.y - 2, this.width - 20);
	}
}