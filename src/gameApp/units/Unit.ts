import {Draw} from '../gameSystems/Draw';

import {UpgradebleObject} from '../../models/UpgradebleObject';

import {AudioSystem} from '../gameSystems/AudioSystem';

import {ImageHandler} from '../../gameApp/ImageHandler';

import {UnitButtons} from '../../reactApp/components/UnitButtons/UnitButtons';

import Animation from '../../models/Animation';
import AnimationInfinite from '../../models/AnimationInfinite';
import {AnimatedObject} from '../../models/AnimatedObject';

import {MovingObject} from '../../models/MovingObject';
import {Point} from '../../models/Point';

import {Helper} from '../helpers/Helper';

import {Coins} from '../coins/Coins';

import {Monster} from '../monsters/Monster';
import {Building} from '../buildings/Building';

import {WawesState} from '../gameSystems/WawesState';

import CreatingImage from '../../assets/img/units/creating.png'; 
import HeartImage from '../../assets/img/icons/health.png'; 
import StarImage from '../../assets/img/icons/star.png'; 

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
	protected readonly _fallEndAnimation: Animation; //анимация приземления юнита 
	protected readonly _fallImage: HTMLImageElement;
	protected readonly _startActiveWaitingAnimation: Animation; //анимация начала ожидания волны
	protected readonly _activeWaitingAnimation: AnimationInfinite; //анимация ожидания начала волны
	protected readonly _runAnimation: AnimationInfinite; //анимация бега
	protected readonly _joyAnimation: Animation; //анимация радости после завершения волны

	static readonly heartImage: HTMLImageElement = new Image(); //картинка для анимации лечения
	static readonly healingAnimationDurationMs: number = 1200; //продолжительность анимации лечения (миллисекунды)
	static readonly creatingNewHeartsPeriodMs: number = 50; //период создания новых сердечек (миллисекунды)
	static readonly heartDurationMs: number = 550; //продолжительность жизни сердечек
	static readonly heartDy: number = -10; //скорость подъёма сердечек (пикселей в секунду)
	protected _hearts: MovingObject[]; //сердца для анимации лечения
	protected _healingAnimationLeftTimeMs: number; //оставшееся время отображения анимации лечения (миллисекунды)
	protected _heartNewDurationMsLeft: number; //сколько осталось до создания нового сердечка (миллисекунды)

	static readonly starImage: HTMLImageElement = new Image(); //картинка для анимации звёздочек
	static readonly creatingNewStarPeriodMs: number = 350; //период создания новых звёздочек (миллисекунды)
	static readonly starDurationMs: number = 2000; //продолжительность жизни звездочки
	static readonly starSpeed: number = 10; //скорость движения звёздочек (пикселей в секунду)
	protected _stars: MovingObject[]; //звёздочик для привлечения внимания к оружию в земле (для воскрешения)
	protected _starsNewDurationMsLeft: number; //сколько осталось до создания новой звёздочки (миллисекунды)


	protected imageWeapon: HTMLImageElement; //изображение оружия
	protected _isDisplayWeaponInAir: boolean; //отображать оружие крутящуюся в воздухе?
	protected _isDisplayWeaponInEarch: boolean; //отображать оружие воткнутую в землю?
	protected _weaponRotateInAir: number; //угол вращения оружие в воздухе
	protected _rotateWeaponInEarch: number; //угол вращения оружие в Земле
	protected static readonly impulseWeapon: number = 34; //импульс придаваемый оружию после гибели юнита
	protected static readonly weaponRotateForce: number = 31; //сила вращения оружия в воздухе (градусы в секундах)
	protected _brightnessOfWeaponInEarch: number = 0.5; //фильтр для плавного мигания оружия в земле в мирное время (между волнами)
	protected _isIncreaseBrightnessOfWeaponInEarch: boolean = true; //увеличивать сейчас фильтр мигания оружия в земле?

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
		fallImage: HTMLImageElement, 
		fallEndAnimation: Animation,
		startActiveWaitingAnimation: Animation,
		activeWaitingAnimation: AnimationInfinite,
		runAnimation: AnimationInfinite,
		joyAnimation: Animation,
		rotateWeaponInEarch: number,
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

		this._fallImage = fallImage;
		this._fallEndAnimation = fallEndAnimation;
		this._startActiveWaitingAnimation = startActiveWaitingAnimation;
		this._activeWaitingAnimation = activeWaitingAnimation;
		this._runAnimation = runAnimation;
		this._joyAnimation = joyAnimation;

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
		this._rotateWeaponInEarch = rotateWeaponInEarch;

		this._hearts = [];
		this._healingAnimationLeftTimeMs = 0;
		this._heartNewDurationMsLeft = 0;

		this._stars = [];
		this._starsNewDurationMsLeft = 0;

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
		Unit.starImage.src = StarImage;
	}

	displayRecoveryAnimationLogic(drawsDiffMs: number){
		super.displayRecoveryAnimationLogic(drawsDiffMs);

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
		else if(!this._hearts.length && this._isDisplayRecoveryAnimation){
			this._isDisplayRecoveryAnimation = false;
		}
	}

	recovery(): boolean{
		let oldHealth = this._health;
		let result = super.recovery();
		if(result){
			Coins.playSoundGet(this.centerX);
			this._healingAnimationLeftTimeMs = Unit.healingAnimationDurationMs;

			if(this.goalY != 0 && oldHealth <= 0 && this._health > 0){
				this.y -= this.height / 3.5;
				this.goalY -= this.height / 3.5;
			}
	
			this._isDisplayWeaponInEarch = false;
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

		if(this._stars.length){
			this._stars.forEach(x => x.logic(drawsDiffMs));
			this._stars = this._stars.filter(x => x.leftTimeMs > 0);
		}

		//end 
		if(this._isDisplayWeaponInEarch){

			this._starsNewDurationMsLeft -= drawsDiffMs;
			if(this._starsNewDurationMsLeft <= 0){
				let x = Helper.getRandom(this.x + this.height / 5, this.x + this.width - this.height / 3);
				let y = Helper.getRandom(this.y + this.height / 5, this.y + this.height - this.height / 3);

				let dx = Unit.starSpeed * Math.sign(x - this.centerX);
				let dy = Unit.starSpeed * Math.sign(y - this.centerY);

				this._stars.push(new MovingObject(x, y, 15, 15, Unit.starDurationMs, dx, dy, 0));
				this._starsNewDurationMsLeft = Unit.creatingNewStarPeriodMs;
			}

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

	drawEarch(){}

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

			if(!this._isDisplayWeaponInAir){
				if(!WawesState.isWaveStarted){
					this._brightnessOfWeaponInEarch += (this._isIncreaseBrightnessOfWeaponInEarch ? 1 : -1) * 0.01;
					if(this._brightnessOfWeaponInEarch > 2){
						this._isIncreaseBrightnessOfWeaponInEarch = false;
					}
					else if(this._brightnessOfWeaponInEarch <= 0.5){
						this._isIncreaseBrightnessOfWeaponInEarch = true;
					}
					filter = 'brightness(' + this._brightnessOfWeaponInEarch + ')';
				}
			}

			Draw.ctx.setTransform(1, 0, 0, 1, this.x + this.width / 2, this.y + this.height / 2); 
			Draw.ctx.rotate((this._isDisplayWeaponInAir ? this._weaponRotateInAir : this._rotateWeaponInEarch) * Math.PI / 180);
			super.drawObject(drawsDiffMs, this.imageWeapon, isGameOver, 1, -this.width / 2, -this.height / 2, filter);
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);

			if(!this._isDisplayWeaponInAir){
				//display earch
				this.drawEarch();

				//искры/звёздочки для привлечения внимания
				if(!WawesState.isWaveStarted){
					this._stars.forEach(star => {
						Draw.ctx.globalAlpha = star.leftTimeMs / Unit.starDurationMs;
						Draw.ctx.drawImage(Unit.starImage, star.location.x, star.location.y, star.size.width, star.size.height);
						Draw.ctx.globalAlpha = 1;
					});
				}
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

	drawObject(drawsDiffMs: number, imageOrAnimation: AnimationInfinite|Animation|HTMLImageElement, isGameOver: boolean, invertSign: number = 1, x: number|null = null, y: number|null = null, filter: string|null = null){
		if(this._isFall){
			super.drawObject(drawsDiffMs, this._fallImage, isGameOver, invertSign, x, y, filter);
		}
		else if(this._fallEndAnimation.leftTimeMs > 0){
			super.drawObject(drawsDiffMs, this._fallEndAnimation, isGameOver, invertSign, x, y, filter);
		}
		else if(WawesState.isWaveStarted && WawesState.delayStartLeftTimeMs > 0) {
			if(this._startActiveWaitingAnimation.leftTimeMs > 0){
				super.drawObject(drawsDiffMs, this._startActiveWaitingAnimation, isGameOver, invertSign, x, y, filter);
			}
			else{
				super.drawObject(drawsDiffMs, this._activeWaitingAnimation, isGameOver, invertSign, x, y, filter);
			}
		}
		else if(WawesState.isWaveStarted){
			super.drawObject(drawsDiffMs, imageOrAnimation, isGameOver, invertSign, x, y, filter);
		}
		else if(WawesState.isWaveEnded && WawesState.delayEndLeftTimeMs > 0){
			super.drawObject(drawsDiffMs, this._joyAnimation, isGameOver, invertSign, x, y, filter);
		}
		else{ //passive waiting
			super.drawObject(drawsDiffMs, this.image, isGameOver, invertSign, x, y, filter);
		}
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