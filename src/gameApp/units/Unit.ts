import {Draw} from '../gameSystems/Draw';

import {AttackedObject} from '../../models/AttackedObject';
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

import SmokeImage from '../../assets/img/smoke.png'; 

import {Modifier} from '../modifiers/Modifier';

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
	protected readonly _passiveWaitingAnimation: AnimationInfinite; //анимация ожидания в мирное время (между волнами)
	protected readonly _fallEndAnimation: Animation; //анимация приземления юнита 
	protected readonly _fallImage: HTMLImageElement;
	protected readonly _startActiveWaitingAnimation: Animation; //анимация начала ожидания волны
	protected readonly _activeWaitingAnimation: AnimationInfinite; //анимация ожидания начала волны
	protected readonly _runAnimation: AnimationInfinite; //анимация бега
	protected readonly _joyAnimation: Animation; //анимация радости после завершения волны
	protected readonly _attackAnimation: AnimationInfinite; //анимация атаки

	//to upgrade weapon
	protected readonly _passiveWaitingWeaponAnimation: AnimationInfinite; //для апгрейда оружия - анимация ожидания в мирное время (между волнами)
	protected readonly _fallEndWeaponAnimation: Animation; //для апгрейда оружия - анимация приземления юнита 
	protected readonly _startActiveWaitingWeaponAnimation: Animation; //для апгрейда оружия - анимация начала ожидания волны
	protected readonly _activeWaitingWeaponAnimation: AnimationInfinite; //для апгрейда оружия - анимация ожидания начала волны
	protected readonly _runWeaponAnimation: AnimationInfinite; //для апгрейда оружия - анимация бега
	protected readonly _joyWeaponAnimation: Animation; //для апгрейда оружия - анимация радости после завершения волны
	protected readonly _attackWeaponAnimation: AnimationInfinite; //для апгрейда оружия - анимация атаки

	//to upgrade armor
	protected readonly _passiveWaitingArmorAnimation: AnimationInfinite; //для апгрейда брони - анимация ожидания в мирное время (между волнами)
	protected readonly _fallEndArmorAnimation: Animation; //для апгрейда брони - анимация приземления юнита 
	protected readonly _startActiveWaitingArmorAnimation: Animation; //для апгрейда брони - анимация начала ожидания волны
	protected readonly _activeWaitingArmorAnimation: AnimationInfinite; //для апгрейда брони - анимация ожидания начала волны
	protected readonly _runArmorAnimation: AnimationInfinite; //для апгрейда брони - анимация бега
	protected readonly _joyArmorAnimation: Animation; //для апгрейда брони - анимация радости после завершения волны
	protected readonly _attackArmorAnimation: AnimationInfinite; //для апгрейда брони - анимация атаки
	protected readonly _fallArmorImage: HTMLImageElement;

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


	protected readonly attackTimeWaitingMs: number; //частота атаки (выражается во времени ожидания после атаки в миллисекундах)
	protected _attackLeftTimeMs: number; //оставшееся время до следующей атаки (миллисекунды)
	protected _goal: AttackedObject|null; //цель (монстр) для атаки

	protected imageWeapon: HTMLImageElement|OffscreenCanvas; //изображение оружия
	protected _isDisplayWeaponInAir: boolean; //отображать оружие крутящуюся в воздухе?
	protected _isDisplayWeaponInEarch: boolean; //отображать оружие воткнутую в землю?
	protected _weaponRotateInAir: number; //угол вращения оружие в воздухе
	protected _rotateWeaponInEarch: number; //угол вращения оружие в Земле
	protected _shiftYWeaponInEarch: number; //сдвиг по y для отображения оружия в земле
	protected static readonly impulseWeapon: number = 34; //импульс придаваемый оружию после гибели юнита
	protected static readonly weaponRotateForce: number = 31; //сила вращения оружия в воздухе (градусы в секундах)
	protected _brightnessOfWeaponInEarch: number = 0.5; //фильтр для плавного мигания оружия в земле в мирное время (между волнами)
	protected _isIncreaseBrightnessOfWeaponInEarch: boolean = true; //увеличивать сейчас фильтр мигания оружия в земле?

	public isRunRight: boolean; //юнит бежит вправо?
	public isRun: boolean; //юнит бежит?
	protected _isFall: boolean; //юнит падает?
	public goalY: number; //куда юнит должен приземлиться по оси Y (это либо место на летающей земле, либо bottomShiftBorder если goalY не указан), а так же место возврата юнита после волны (если на летающей земле)
	public goalX: number; //куда должен юнит стремится вернуться после окончания волны (либо во время волны - центр притяжения юнита)

	protected _isAttack: boolean; //атакует?

	//поля свойства экземпляра
	damage: number; //урон (в секунду)
	speed: number; //скорость передвижения/атаки/добычи монеток (пикселей в секунду - для передвижения)
	protected readonly initialSpeed: number; //изначальная скорость (пикселей в секунду)

	readonly endingAnimation: AnimatedObject; //анимация появления юнита

	readonly smokeAnimation: Animation = new Animation(10, 1000);  


	constructor(x: number, y: number, 
		healthMax: number, 
		image: HTMLImageElement, 
		imageWeapon: HTMLImageElement,
		attackAnimation: AnimationInfinite|null,
		passiveWaitingAnimation: AnimationInfinite,
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
		damage: number,
		attackTimeWaitingMs: number,
		scaleSize: number,
		isLand: boolean = true, 
		reduceHover: number = 0,
		isSupportHealing: boolean = true,
		isSupportUpgrade: boolean = true)
	{
		super(x, y, true, isLand, name, scaleSize, image, frames, animationDurationMs, reduceHover, healthMax, price, isSupportHealing, isSupportUpgrade, imageHandler);

		this._attackAnimation = attackAnimation ?? new AnimationInfinite(0, 0);
		this._passiveWaitingAnimation = passiveWaitingAnimation;
		this._fallImage = fallImage;
		this._fallEndAnimation = fallEndAnimation;
		this._startActiveWaitingAnimation = startActiveWaitingAnimation;
		this._activeWaitingAnimation = activeWaitingAnimation;
		this._runAnimation = runAnimation;
		this._joyAnimation = joyAnimation;


		//to upgrade weapon
		this._attackWeaponAnimation = new AnimationInfinite(this._attackAnimation.frames, this._attackAnimation.durationMs);
		this._passiveWaitingWeaponAnimation = new AnimationInfinite(passiveWaitingAnimation.frames, passiveWaitingAnimation.durationMs);
		this._fallEndWeaponAnimation = new Animation(fallEndAnimation.frames, fallEndAnimation.durationMs);
		this._startActiveWaitingWeaponAnimation = new Animation(startActiveWaitingAnimation.frames, startActiveWaitingAnimation.durationMs);
		this._activeWaitingWeaponAnimation = new AnimationInfinite(activeWaitingAnimation.frames, activeWaitingAnimation.durationMs); 
		this._runWeaponAnimation = new AnimationInfinite(runAnimation.frames, runAnimation.durationMs);
		this._joyWeaponAnimation = new Animation(joyAnimation.frames, joyAnimation.durationMs); 

		//to upgrade armor
		this._attackArmorAnimation = new AnimationInfinite(this._attackAnimation.frames, this._attackAnimation.durationMs);
		this._passiveWaitingArmorAnimation = new AnimationInfinite(passiveWaitingAnimation.frames, passiveWaitingAnimation.durationMs);
		this._fallEndArmorAnimation = new Animation(fallEndAnimation.frames, fallEndAnimation.durationMs);
		this._startActiveWaitingArmorAnimation = new Animation(startActiveWaitingAnimation.frames, startActiveWaitingAnimation.durationMs);
		this._activeWaitingArmorAnimation = new AnimationInfinite(activeWaitingAnimation.frames, activeWaitingAnimation.durationMs); 
		this._runArmorAnimation = new AnimationInfinite(runAnimation.frames, runAnimation.durationMs);
		this._joyArmorAnimation = new Animation(joyAnimation.frames, joyAnimation.durationMs); 
		this._fallArmorImage = new Image();


		this._goal = null;
	
		this.imageWeapon = imageWeapon;

		this.initialSpeed = this.speed = speed;
		this.damage = damage;
		this.attackTimeWaitingMs = attackTimeWaitingMs;
		this._attackLeftTimeMs = 0;
		this.isRunRight = true;
		this.isRun = false;

		this.endingAnimation = new AnimatedObject(x, y, this.width, this.height, true, new Animation(6, 600)); //анимация появления юнита
		this.endingAnimation.animation.image.src = CreatingImage;

		this._isFall = true;
		this.goalY = 0;
		this.goalX = x;

		this._isAttack = false;

		this._isDisplayWeaponInAir = false;
		this._isDisplayWeaponInEarch = false;
		this._weaponRotateInAir = 0;
		this._rotateWeaponInEarch = rotateWeaponInEarch;
		this._shiftYWeaponInEarch = 0;

		this._hearts = [];
		this._healingAnimationLeftTimeMs = 0;
		this._heartNewDurationMsLeft = 0;

		this._stars = [];
		this._starsNewDurationMsLeft = 0;

		this.smokeAnimation.image.src = SmokeImage;
		this.smokeAnimation.leftTimeMs = 0;

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

	static upgradeUnit(unit: Unit){
		unit.smokeAnimation.restart();
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

			if(oldHealth <= 0 && this.health > 0){
				this.isRunRight = true;
				this._fallEndAnimation.leftTimeMs = 
				this._fallEndWeaponAnimation.leftTimeMs = 
				this._fallEndArmorAnimation.leftTimeMs = this._fallEndAnimation.durationMs;
				this._isFall = true;

				if(this.isLand){
					this.y -= this._shiftYWeaponInEarch + 15;
				}
				else if(this.goalY != 0){
					this.y -= this.height / 3.5;
				}
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


	logicMoving(drawsDiffMs: number, speed: number){
		if(this.health > 0){

			if(this._goal){
				if(this._goal.isLeftSide) //если монстр идёт с левой стороны
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
							this._attackAnimation.restart();
						}
						this._isAttack = true; //атакует
					}
				}
				else 
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
							this._attackAnimation.restart();
						}
						this._isAttack = true; //атакует
					}
				}
			}

			//волна окончена
			if(WawesState.isWaveEnded && WawesState.delayEndLeftTimeMs <= 0 && !this._isFall && this._fallEndAnimation.leftTimeMs <= 0){
				this.isRun = false;

				if(this.goalX && Math.abs(this.x - this.goalX) > speed){
					this.isRunRight = this.goalX > this.x;
					this.x -= Math.sign(this.x - this.goalX) * speed;
					this.isRun = true;
				}

				if(this.goalY && Math.abs(this.y - this.goalY + this.height) > speed){
					this.y -= Math.sign(this.y - this.goalY + this.height) * speed;
					this.isRun = true;
				}
			}
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

		//логика передвижения
		if(this.health > 0){
			let speedMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.speedMultiplier);
			let speed = this.speed * (drawsDiffMs / 1000);
			speed += speed * speedMultiplier;
			this.logicMoving(drawsDiffMs, speed);
		}


		//gravitations
		if(this._isDisplayWeaponInAir){
			this.y += 15 / drawsDiffMs / (this._impulseY / 10);
			this._isFall = true;

			this._weaponRotateInAir += Unit.weaponRotateForce / drawsDiffMs;
			if(this._impulseY < 10 && this.y + this.height >= (this.isLand ? Draw.canvas.height - bottomShiftBorder + this._shiftYWeaponInEarch : this.goalY + this.height / 3.5)){
				this._impulseY = 0;
				this._isDisplayWeaponInAir = false;
				this._isDisplayWeaponInEarch = true;
				this._isFall = false;
			}
		}
		else if(!this._isDisplayWeaponInEarch){
			if(this._isFall) {
				if(this.y + this.height < (this.goalY || Draw.canvas.height - bottomShiftBorder)){
					this.y += 15 / drawsDiffMs;
				}
				else{
					this._isFall = false;
	
					if(this.y + this.height > Draw.canvas.height){
						//this.y = Draw.canvas.height - this.height;
					}
				}
			}
		}

		super.logicBase(drawsDiffMs);
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null): number{
		var damage = super.applyDamage(damage, x, y);
		if(damage > 0){
			if(this.health <= 0){
				this.endingAnimation.animation.restart();
				this.endingAnimation.location = new Point(this.x, this.y);
				this._isDisplayWeaponInAir = true;
				this._impulseY = Unit.impulseWeapon;
				
				AudioSystem.play(this.centerX, CreatingSound);
				AudioSystem.playRandomV(this.centerX, [End1Sound, End2Sound, End3Sound, End4Sound, End5Sound, End6Sound, End7Sound], 0);
			}
		}
		return damage;
	}

	get isInvertDraw(): boolean{
		return !this.isRunRight;
	}

	drawEarchForWeaponInEarch(){}

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
				this.drawEarchForWeaponInEarch();

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

	
	drawObjectBase(drawsDiffMs: number, imageOrAnimation: AnimationInfinite|Animation|HTMLImageElement, 
		isGameOver: boolean, invertSign: number = 1, x: number|null = null, y: number|null = null, filter: string|null = null,
		isInvertAnimation: boolean = false)
	{
		super.drawObject(drawsDiffMs, imageOrAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
	}

	drawObject(drawsDiffMs: number, imageOrAnimation: AnimationInfinite|Animation|HTMLImageElement, isGameOver: boolean, invertSign: number = 1, x: number|null = null, y: number|null = null, filter: string|null = null){
		this.drawObjects(drawsDiffMs, imageOrAnimation, imageOrAnimation, imageOrAnimation, isGameOver, invertSign, x, y, filter);

		if(this.smokeAnimation.leftTimeMs > 0){
			let smokeWidth = this.width * 2;
			let newHeight = this.smokeAnimation.image.height * (smokeWidth / (this.smokeAnimation.image.width / this.smokeAnimation.frames));
			const x = this.x - this.width / 2;
			const y = this.y + this.height - newHeight;
			this.smokeAnimation.draw(drawsDiffMs, isGameOver, x, y, smokeWidth, newHeight);
		}
	}

	drawObjects(drawsDiffMs: number, 
		imageOrAnimation: AnimationInfinite|Animation|HTMLImageElement, 
		imageOrAnimationArmor: AnimationInfinite|Animation|HTMLImageElement, 
		imageOrAnimationWeapon: AnimationInfinite|Animation|HTMLImageElement, 
		isGameOver: boolean, invertSign: number = 1, x: number|null = null, y: number|null = null, filter: string|null = null,
		isInvertAnimation: boolean = false)
	{
		if(this._isFall){
			super.drawObject(drawsDiffMs, this._fallImage, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObject(drawsDiffMs, this._fallArmorImage, isGameOver, invertSign, x, y, filter, isInvertAnimation);
		}
		else if(this._fallEndAnimation.leftTimeMs > 0){
			super.drawObject(drawsDiffMs, this._fallEndAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObject(drawsDiffMs, this._fallEndArmorAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObject(drawsDiffMs, this._fallEndWeaponAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
		}
		else if(WawesState.isWaveStarted && WawesState.delayStartLeftTimeMs > 0) {
			if(this._startActiveWaitingAnimation.leftTimeMs > 0){
				super.drawObject(drawsDiffMs, this._startActiveWaitingAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
				super.drawObject(drawsDiffMs, this._startActiveWaitingArmorAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
				super.drawObject(drawsDiffMs, this._startActiveWaitingWeaponAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			}
			else{
				super.drawObject(drawsDiffMs, this._activeWaitingAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
				super.drawObject(drawsDiffMs, this._activeWaitingArmorAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
				super.drawObject(drawsDiffMs, this._activeWaitingWeaponAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			}
		}
		else if(this.isRun){
			super.drawObject(drawsDiffMs, this._runAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObject(drawsDiffMs, this._runArmorAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObject(drawsDiffMs, this._runWeaponAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
		}
		else if(WawesState.isWaveStarted){
			super.drawObject(drawsDiffMs, imageOrAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObject(drawsDiffMs, imageOrAnimationArmor, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObject(drawsDiffMs, imageOrAnimationWeapon, isGameOver, invertSign, x, y, filter, isInvertAnimation);
		}
		else if(WawesState.isWaveEnded && WawesState.delayEndLeftTimeMs > 0){
			super.drawObject(drawsDiffMs, this._joyAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObject(drawsDiffMs, this._joyArmorAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObject(drawsDiffMs, this._joyWeaponAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
		}
		else{ 
			super.drawObject(drawsDiffMs, this._passiveWaitingAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObject(drawsDiffMs, this._passiveWaitingArmorAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObject(drawsDiffMs, this._passiveWaitingWeaponAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
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