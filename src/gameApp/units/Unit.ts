import {Draw} from '../gameSystems/Draw';

import {UpgradebleObject} from '../../models/UpgradebleObject';

import {AudioSystem} from '../gameSystems/AudioSystem';

import {ImageHandler} from '../../gameApp/ImageHandler';

import {UnitButtons} from '../../reactApp/components/UnitButtons/UnitButtons';

import Animation from '../../models/Animation';
import {AnimatedObject} from '../../models/AnimatedObject';

import {MovingObject} from '../../models/MovingObject';
import {Point} from '../../models/Point';

import {Helper} from '../helpers/Helper';

import {Coins} from '../coins/Coins';

import {Monster} from '../monsters/Monster';
import {Building} from '../buildings/Building';

import CreatingImage from '../../assets/img/units/creating.png'; 
import HeartImage from '../../assets/img/icons/health.png'; 

import CreatingSound from '../../assets/sounds/units/creating.mp3'; 
import End1Sound from '../../assets/sounds/units/end1.mp3'; 
import End2Sound from '../../assets/sounds/units/end2.mp3'; 
import End3Sound from '../../assets/sounds/units/end3.mp3'; 
import End4Sound from '../../assets/sounds/units/end4.mp3'; 
import End5Sound from '../../assets/sounds/units/end5.mp3'; 
import End6Sound from '../../assets/sounds/units/end6.mp3';
import End7Sound from '../../assets/sounds/units/end7.mp3';


/** Базовый класс для всех Юнитов пользователя */
export class Unit extends UpgradebleObject {
	static readonly heartImage: HTMLImageElement = new Image(); //картинка для анимации лечения
	static readonly healingAnimationDurationMs: number = 1200; //продолжительность анимации лечения (миллисекунды)
	static readonly creatingNewHeartsPeriodMs: number = 50; //период создания новых сердечек (миллисекунды)
	static readonly heartDurationMs: number = 550; //продолжительность жизни сердечек
	static readonly heartDy: number = -10; //скорость подъёма сердечек (пикселей в секунду)

	protected imageWeapon: HTMLImageElement; //изображение оружия
	protected _isDisplayWeaponInAir: boolean; //отображать оружие крутящуюся в воздухе?
	protected _isDisplayWeaponInEarch: boolean; //отображать оружие воткнутую в землю?
	protected _weaponRotateInAir: number; //угол вращения оружие в воздухе
	protected static readonly impulseWeapon: number = 34; //импульс придаваемый оружию после гибели юнита
	protected static readonly weaponRotateForce: number = 31; //сила вращения оружия в воздухе (градусы в секундах)

	protected _healingAnimationLeftTimeMs: number; //оставшееся время отображения анимации лечения (миллисекунды)
	protected _heartNewDurationMsLeft: number; //сколько осталось до создания нового сердечка (миллисекунды)
	protected _hearts: MovingObject[]; //сердца для анимации лечения

	public isRunRight: boolean; //юнит бежит вправо?
	protected _isFall: boolean; //юнит падает?
	public goalY: number; //y куда юнит должен приземлиться (это либо место на летающей земле, либо bottomShiftBorder)

	//поля свойства экземпляра
	speed: number; //скорость передвижения (пикселей в секунду)

	readonly endingAnimation: AnimatedObject; //анимация появления юнита


	constructor(x: number, y: number, 
		healthMax: number, 
		image: HTMLImageElement, 
		imageWeapon: HTMLImageElement, 
		name: string, 
		imageHandler: ImageHandler,
		frames: number, 
		animationDurationMs: number,
		price: number, 
		speed: number,
		scaleSize: number,
		isLand: boolean = true, 
		reduceHover: number = 0,
		isSupportHealing: boolean = true,
		isSupportUpgrade: boolean = true)
	{
		super(x, y, true, isLand, name, scaleSize, image, frames, animationDurationMs, reduceHover, healthMax, price, isSupportHealing, isSupportUpgrade, imageHandler);

		this.imageWeapon = imageWeapon;

		this.speed = speed;
		this.isRunRight = true;

		this.endingAnimation = new AnimatedObject(x, y, this.width, this.height, true, new Animation(6, 600)); //анимация появления юнита
		this.endingAnimation.animation.image.src = CreatingImage;

		this._isFall = false;
		this.goalY = 0;

		this._isDisplayWeaponInAir = false;
		this._isDisplayWeaponInEarch = false;
		this._weaponRotateInAir = 0;

		this._healingAnimationLeftTimeMs = 0;
		this._heartNewDurationMsLeft = 0;
		this._hearts = [];

		AudioSystem.load(CreatingSound);
		AudioSystem.load(End1Sound);
		AudioSystem.load(End2Sound);
		AudioSystem.load(End3Sound);
		AudioSystem.load(End4Sound);
		AudioSystem.load(End5Sound);
		AudioSystem.load(End6Sound);
		AudioSystem.load(End7Sound);
	}

	
	static loadHealingResources(): void{
		Unit.heartImage.src = HeartImage;
	}

	displayRecoveryAnimationLogic(drawsDiffMs: number){
		if(this._hearts.length){
			this._hearts.forEach(x => x.logic(drawsDiffMs));
			this._hearts = this._hearts.filter(x => x.leftTimeMs > 0);
		}

		if(this._healingAnimationLeftTimeMs > 0){
			this._healingAnimationLeftTimeMs -= drawsDiffMs;

			this._heartNewDurationMsLeft -= drawsDiffMs;
			if(this._heartNewDurationMsLeft <= 0){
				let left = this.isRunRight ? this.width / 20 : this.width / 4;
				let right = this.isRunRight ? this.width / 4 : this.width / 20;

				let x = Helper.getRandom(this.x + left, this.x + this.width - right);
				let y = Helper.getRandom(this.y + this.height / 10, this.y + this.height - this.height / 10);
				this._hearts.push(new MovingObject(x, y, 0, 0, Unit.heartDurationMs, 0, Unit.heartDy, 0));
				this._heartNewDurationMsLeft = Unit.creatingNewHeartsPeriodMs;
				AudioSystem.playRandomTone(x, 0.2, 7000, 8000);
			}
		}
	}

	recovery(): boolean{
		let oldHealth = this._health;
		let result = super.recovery();
		if(result){
			Coins.playSoundGet(this.centerX, 0);
			this._healingAnimationLeftTimeMs = Unit.healingAnimationDurationMs;

			if(this.goalY != 0 && oldHealth <= 0 && this._health > 0){
				this.y -= this.height / 3.5;
				this.goalY -= this.height / 3.5;
			}
	
		}

		return result;
	}

	buttonsLogic(isDisplayRecoveryButton: boolean){
		if(!UnitButtons.isEnterMouse){
			let x = (this.x + this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
			let y = (this.y + this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
			let width = (this.width - 2 * this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
			let height = (this.height - 2 * this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
			let repairPrice = this.getRecoveryPrice();
			let isDisplayUpgradeButton = this.isSupportUpgrade && !this.isDisplayedUpgradeWindow && this.health > 0;
			UnitButtons.show(x, y, width, height, isDisplayRecoveryButton, isDisplayUpgradeButton, repairPrice, this);
		}
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		//gravitations
		if(this.y + this.height < (this.goalY || bottomShiftBorder)){
			if(this._isDisplayWeaponInAir){
				this.y += 15 / drawsDiffMs / (this._impulseY / 10);
			}
			else{
				this.y += 15 / drawsDiffMs;
			}
			this._isFall = true;
		}
		else{
			this._isFall = false;
		}

		//start ending
		if (this.health <= 0) {
			this._weaponRotateInAir += Unit.weaponRotateForce / drawsDiffMs;
			if(this._impulseY < 10 && this.y + this.height >= this.goalY){
				this._impulseY = 0;
				this._isDisplayWeaponInAir = false;
				this._isDisplayWeaponInEarch = true;
			}

			if(this.endingAnimation.animation.leftTimeMs == this.endingAnimation.animation.durationMs){
				AudioSystem.play(this.centerX, CreatingSound);
				AudioSystem.playRandomV(this.centerX, [End1Sound, End2Sound, End3Sound, End4Sound, End5Sound, End6Sound, End7Sound], 0);
			}
		}

		super.logicBase(drawsDiffMs);

		if(this.y + this.height > Draw.canvas.height){
			this.y = Draw.canvas.height - this.height;
		}
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null): number{
		var damage = super.applyDamage(damage, x, y);
		if(damage > 0){
			if(this.health <= 0){
				this.endingAnimation.location = new Point(this.x, this.y);
				this._isDisplayWeaponInAir = true;
				this._impulseY = Unit.impulseWeapon;

				if(this.goalY != 0){
					this.goalY += this.height / 3.5;
				}
			}
		}
		return damage;
	}

	get isInvertDraw(): boolean{
		return !this.isRunRight;
	}

	//draw метод - это система отрисовки всего что связано с юнитом
	draw(drawsDiffMs: number, isGameOver: boolean): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		let filter: string|null = null;
		if(this.health <= 0){
			if(this.endingAnimation.animation.leftTimeMs > 0){
				this.endingAnimation.draw(drawsDiffMs, isGameOver);
			}

			return;
		}

		let x = this.x;
		let y = this.y;

		if (this.isDisplayedUpgradeWindow) {
			filter = 'brightness(1.3)';
		}

		super.drawBase(drawsDiffMs, isGameOver, x, y, filter);
	}

	drawHealth(): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.drawHealthBase(this.x + 15, this.y - 10, this.width - 30);
	}


	drawHealingingAnimation(drawsDiffMs: number): void{
		this._hearts.forEach(heart => {
			Draw.ctx.globalAlpha = heart.leftTimeMs / Unit.heartDurationMs;
			Draw.ctx.drawImage(Unit.heartImage, heart.location.x, heart.location.y);
			Draw.ctx.globalAlpha = 1;
		});
	}
}