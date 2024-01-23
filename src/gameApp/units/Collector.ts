import {ImageHandler} from '../ImageHandler';

import {AudioSystem} from '../gameSystems/AudioSystem';
import {Draw} from '../gameSystems/Draw';
import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

import {Modifier} from '../modifiers/Modifier';

import {Monster} from '../monsters/Monster';

import {Buildings} from '../buildings/Buildings';
import {Building} from '../buildings/Building';

import {FlyEarth} from '../buildings/FlyEarth';

import Animation from '../../models/Animation';
import AnimationInfinite from '../../models/AnimationInfinite';
import ShopItem from '../../models/ShopItem';

import {AttackedObject} from '../../models/AttackedObject';

import {Helper} from '../helpers/Helper';

import {Unit} from './Unit';

import {Coin} from '../coins/Coin';
import {Coins} from '../coins/Coins';

import {WawesState} from '../gameSystems/WawesState';

import ParameterItem from '../../models/ParameterItem';
import Improvement from '../../models/Improvement';
import ImprovementParameterItem from '../../models/ImprovementParameterItem';

import sortBy from 'lodash/sortBy';

import WeaponImage from '../../assets/img/units/collector/cap.png'; 
import CollectorShopImage from '../../assets/img/units/collector/shopImage.png'
import CollectorFallImage from '../../assets/img/units/collector/fall.png'; 
import CollectorFallEndImage from '../../assets/img/units/collector/fallEnd.png'; 
import CollectorCollectImage from '../../assets/img/units/collector/collect.png'; 
import CollectorPassiveWaitingImage from '../../assets/img/units/collector/passiveWaiting.png'; 
import CollectorRunImage from '../../assets/img/units/collector/run.png'; 
/*import CollectorJoyImage from '../../assets/img/units/collector/joy.png'; 

import WoodArmorImage from '../../assets/img/units/collector/woodArmor.png'; 
import CollectorFallEndWoodArmorImage from '../../assets/img/units/collector/woodArmor/fallEnd.png'; 
import CollectorDiggingWoodArmorImage from '../../assets/img/units/collector/woodArmor/digging.png'; 
import CollectorPassiveWait1WoodArmorImage from '../../assets/img/units/collector/woodArmor/passiveWait1.png'; 
import CollectorRunWoodArmorImage from '../../assets/img/units/collector/woodArmor/run.png'; 
import CollectorJoyWoodArmorImage from '../../assets/img/units/collector/woodArmor/joy.png'; 
*/
import speedIcon from '../../assets/img/icons/speed.png';  
import coinIcon from '../../assets/img/coin.png';  

import SoundAttacked1 from '../../assets/sounds/units/miner/attacked1.mp3'; 
import SoundAttacked2 from '../../assets/sounds/units/miner/attacked2.mp3'; 
import SoundAttacked3 from '../../assets/sounds/units/miner/attacked3.mp3'; 


/** Собиратель монет - тип юнитов пользователя */
export class Collector extends Unit{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly scaleSize: number = 0.75;
	private static readonly shopImage: HTMLImageElement = new Image();
	private static readonly passiveWaitingImage: HTMLImageElement = new Image();
	private static readonly fallImage: HTMLImageElement = new Image();
	private static readonly fallEndImage: HTMLImageElement = new Image(); 
	private static readonly collectImage: HTMLImageElement = new Image(); 
	private static readonly runImage: HTMLImageElement = new Image(); 
	//TODO: private static readonly joyImage: HTMLImageElement = new Image(); 

	private static readonly weaponImage: HTMLImageElement = new Image();

	private static readonly initialSpeed: number = 30;

	static readonly shopItem: ShopItem = new ShopItem('Золотособиратель', Collector.shopImage, 50, 'Собирает монетки', ShopCategoryEnum.UNITS, 10);

	private readonly _collectingAnimation: Animation; //анимация собирания монеток
	private readonly _collectingArmorAnimation: Animation; //для апгрейда брони - анимация собирания монеток
	private readonly _collectingWeaponAnimation: Animation; //для апгрейда оружия - анимация собирания монеток
	private _isCollecting: boolean; //Собирает монеты сейчас? 
	private _isRunFromMonster: boolean; //бежит от монстра сейчас?
	private _wasCollected: boolean; //Сбор уже состоялся за текущий цикл анимации collecting ?

	protected _goalCoin: Coin|null; //цель-монетка для сбора

	constructor(x: number, y: number) {
		super(x, y, 
			3, //health
			Collector.shopImage, 	//image
			Collector.weaponImage, 	//image weapon
			null,	//attack 
			new AnimationInfinite(6, 6 * 350, Collector.passiveWaitingImage), 	//passive waiting
			Collector.fallImage,												//fall image
			new Animation(18, 18 * 80, Collector.fallEndImage), 				//fall end animation
			new Animation(6, 6 * 350, Collector.passiveWaitingImage), 			//startActiveWaitingAnimation
			new AnimationInfinite(6, 6 * 350, Collector.passiveWaitingImage), 	//activeWaitingAnimation
			new AnimationInfinite(4, 4 * 200, Collector.runImage),  		    //run animation
			new Animation(6, 6 * 350, Collector.passiveWaitingImage), 	//TODO: new Animation(21, 21 * 110, Collector.joyImage),  				//joy animation
			0, //rotateWeaponInEarch
			Collector.name, 
			Collector.imageHandler, 
			0, //frames
			0, //animation durations Ms
			Collector.shopItem.price, 
			Collector.initialSpeed, 
			0, //damage
			0, //attackTimeWaitingMs
			Collector.scaleSize, 
			true, //isLand
			0, //reduceHover
			true, //isSupportHealing
			true); //isSupportUpgrade
		
		this._collectingAnimation = new Animation(9, 9 * 150, Collector.collectImage);
		this._collectingArmorAnimation = new Animation(this._collectingAnimation.frames, this._collectingAnimation.durationMs); //пока апгрейда нету
		this._collectingWeaponAnimation = new Animation(this._collectingAnimation.frames, this._collectingAnimation.durationMs); //пока апгрейда нету
		this._collectingAnimation.leftTimeMs = 0;

		this._isCollecting = true;
		this._wasCollected = false;
		this._isRunFromMonster = false;
		this.isLeftSide = this.x < Buildings.flyEarth.centerX;
		this.isRunRight = true;
		this._goalCoin = null;
		this._shiftYWeaponInEarch = this.height / 2 - 10;

		this.shopItemName = Collector.shopItem.name;

        Collector.init(true); //reserve init
	}

	public static get imageWidth() : number{
		return Collector.shopImage.width * Collector.scaleSize;
	}

	public static get imageHeight() : number{
		return Collector.shopImage.height * Collector.scaleSize;
	}

	static initForShop(): void{
		Collector.shopImage.src = CollectorShopImage;
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && Collector.imageHandler.isEmpty){
			Collector.imageHandler.new(Collector.shopImage).src = CollectorShopImage;
			Collector.imageHandler.new(Collector.passiveWaitingImage).src = CollectorPassiveWaitingImage;
			Collector.imageHandler.new(Collector.fallImage).src = CollectorFallImage;
			Collector.imageHandler.new(Collector.fallEndImage).src = CollectorFallEndImage;
			Collector.imageHandler.new(Collector.collectImage).src = CollectorCollectImage;
			Collector.imageHandler.new(Collector.runImage).src = CollectorRunImage;
			//TODO: Collector.imageHandler.new(Collector.joyImage).src = CollectorJoyImage;
			Collector.imageHandler.new(Collector.weaponImage).src = WeaponImage;
		}
	}

	loadedResourcesAfterBuild(){
		super.loadedResourcesAfterBuild();

		this.infoItems = this.infoItems.filter(x => x.label != 'Защита');
		this.infoItems.splice(1, 0, new ParameterItem('Скорость', () => this.speed, speedIcon, 22, Collector.shopItem.price * 0.2, () => this.improveSpeed()));

		//TODO: this.improvements.push(new Improvement('Деревянная броня', Collector.shopItem.price * 2, WoodArmorImage, () => this.improveToWoodArmor(), [
		//TODO: 	new ImprovementParameterItem(`+`, shieldIcon)
		//TODO: ]));
	}

	/*//TODO: improveToWoodArmor(){
		this.defense += 0.1;
		this._diggingArmorAnimation.image.src = CollectorDiggingWoodArmorImage;
		this._passiveWaitingArmorAnimation.image.src = CollectorPassiveWait1WoodArmorImage;
		this._fallEndArmorAnimation.image.src = CollectorFallEndWoodArmorImage;
		this._startActiveWaitingArmorAnimation.image.src = CollectorStartActiveWaitWoodArmorImage;
		this._activeWaitingArmorAnimation.image.src = CollectorActiveWaitWoodArmorImage;
		this._runArmorAnimation.image.src = CollectorRunWoodArmorImage;
		this._joyArmorAnimation.image.src = CollectorJoyWoodArmorImage;
	}*/

	improveSpeed(){
		this.speed += 10;

		var newDurationDigging = Collector.initialSpeed / this.speed * this._collectingAnimation.initialDurationMs;
		this._collectingAnimation.changeDuration(newDurationDigging);
		this._collectingArmorAnimation.changeDuration(newDurationDigging);
		this._collectingWeaponAnimation.changeDuration(newDurationDigging);

		var newDurationRun = Collector.initialSpeed / this.speed * this._runAnimation.initialDurationMs;
		this._runAnimation.changeDuration(newDurationRun);
		this._runArmorAnimation.changeDuration(newDurationRun);
		this._runWeaponAnimation.changeDuration(newDurationRun);
	}

	recovery(): boolean{
		let oldHealth = this._health;
		let result = super.recovery();
		if(result && oldHealth <= 0){
			this._isCollecting = true;
			this.isLeftSide = this.x < Buildings.flyEarth.centerX;
		}

		return result;
	}


	logicMoving(drawsDiffMs: number, speed: number){
		if(this._isCollecting){ //период сбора монет
			if(this._goalCoin && this._collectingAnimation.leftTimeMs <= 0){ //есть цель монетка и сбор предыдущей уже окончен
				if(this._goalCoin.centerX < this.centerX) //если монетка слева
				{
					let condition = this.x > this._goalCoin.centerX - this.width / 5;
					if (condition) { //ещё не дошёл
						this.x -= speed;
					}
					else //дошёл
					{
						this._collectingAnimation.restart();
					}
				}
				else 
				{
					let condition = this.x + this.width < this._goalCoin.centerX + this.width / 5;
					if (condition) { //ещё не дошёл
						this.x += speed;
					}
					else //дошёл
					{
						this._collectingAnimation.restart();
					}
				}
			}
		}
		else {
			if(this.isRunRight){
				this.x += speed;
			}
			else{
				this.x -= speed;
			}

			this.isLeftSide = this.x < Buildings.flyEarth.centerX;
		}
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logic(drawsDiffMs, buildings, monsters, units, bottomShiftBorder);
		

		//end 
		if(this._isDisplayWeaponInEarch){
			this.imageWeapon = Collector.weaponImage;
			return;
		}
		
		//игра пошла
		if(this.health > 0 && WawesState.isWaveStarted && WawesState.delayStartLeftTimeMs <= 0){
			if(this._isCollecting){ //период сбора монеток

				//если нет монетки - ищем ближайшую монетку
				if(!this._goalCoin || this._goalCoin.lifeTimeLeftMs <= 0){
					this._goalCoin = null;

					var coins = Coins.all.filter(x => x.impulseY == 0 && x.lifeTimeLeftMs > 0);
					if (coins.length){ 
						//монетку не должен загораживать монстр
						var leftMonsters = sortBy(monsters.filter(x => x.isLand && x.isLeftSide), x => x.centerX);
						var rightMonsters = sortBy(monsters.filter(x => x.isLand && !x.isLeftSide), x => x.centerX);

						if(leftMonsters.length){
							var closerMonsterLeft = leftMonsters[leftMonsters.length - 1];
							coins = coins.filter(x => x.x > closerMonsterLeft.x + closerMonsterLeft.width);
						}

						if(rightMonsters.length){
							var closerMonsterRight = rightMonsters[0];
							coins = coins.filter(x => x.x < closerMonsterRight.x);
						}

						if(coins.length){
							this._goalCoin = sortBy(coins, x => Math.abs(this.centerX - x.centerX))[0];
							this.isRunRight = this._goalCoin.centerX > this.x + this.width / 2;
						}
					}

					//следим за монстрами - пора ли убегать? 
					if(!this._goalCoin && monsters.length) {
						var closerMonster = monsters.find(x => x.isLand && Math.abs(x.isLeftSide ? (x.x + x.width) - this.x : x.x - (this.x + this.width)) < this.width);
						if (closerMonster && this._collectingAnimation.leftTimeMs <= this._collectingAnimation.durationMs / 5){
							this._isCollecting = false;
							this.isRunRight = closerMonster.isLeftSide;
							this._isRunFromMonster = true;
						}
					}
				}
				else{
					//logic in logicMoving
				}

				//сбор монетки
				if(this._collectingAnimation.leftTimeMs > 0 && this._collectingAnimation.leftTimeMs < this._collectingAnimation.durationMs * 0.45){
					if(!this._wasCollected && this._goalCoin){
						var i = Coins.all.indexOf(this._goalCoin);
						Coins.collect(i, this._goalCoin.centerX, this._goalCoin.centerY);
						this._goalCoin = null;
						this._wasCollected = true;
					}
				}
				else{
					this._wasCollected = false;
				}
			}
			else{ //убегать от нападения 
				//logic in logicMoving

				//рядом больше нет монстров
				var closerMonster = monsters.find(x => x.isLand && Math.abs(x.isLeftSide ? (x.x + x.width) - this.x : x.x - (this.x + this.width)) < this.width);
				if (!closerMonster){
					this._isCollecting = true;
					this._isRunFromMonster = false;
				}
				else{
					this._collectingAnimation.leftTimeMs = 0;
					//TODO: со всех сторон монстры
				}
			}
		}
		else if(WawesState.isWaveEnded && WawesState.delayEndLeftTimeMs > 0 && !this.isRunRight){
			this.isRunRight = true;
		}
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null, attackingObject: AttackedObject|null = null): number{
		var damage = super.applyDamage(damage, x, y);
		if(damage > 0){
			AudioSystem.playRandom(this.centerX, [SoundAttacked1, SoundAttacked2, SoundAttacked3], [-1, -1, -1, -1], false, 1, true);

			if(this.health <= 0){
				if(damage >= this.healthMax){
					this.imageWeapon = Collector.fallImage;
					this._weaponRotateInAir = 0;
				}
				else{
					this.imageWeapon = Collector.weaponImage;
					this._weaponRotateInAir = 180;
				}
			}
		}

		//убегаем от урона - даже если его нету
		if(this._isCollecting){
			this.isRunRight = (x || 0) < this.centerX;
			this._isCollecting = false;
			this._isRunFromMonster = true;
			this._collectingAnimation.leftTimeMs = 0;
		}

		return damage;
	}
	

	drawObjects(drawsDiffMs: number, 
		imageOrAnimation: AnimationInfinite|Animation|HTMLImageElement, 
		imageOrAnimationArmor: AnimationInfinite|Animation|HTMLImageElement, 
		imageOrAnimationWeapon: AnimationInfinite|Animation|HTMLImageElement, 
		isGameOver: boolean, invertSign: number = 1, x: number|null = null, y: number|null = null, filter: string|null = null)
	{
		if(WawesState.isWaveStarted){
			imageOrAnimation = this._isCollecting && this._collectingAnimation.leftTimeMs > 0
				? this._collectingAnimation 
				: this._goalCoin && this._goalCoin.lifeTimeLeftMs > 0 || this._isRunFromMonster 
					? this._runAnimation
					: this._passiveWaitingAnimation;

			imageOrAnimationArmor = this._isCollecting && this._collectingArmorAnimation.leftTimeMs > 0
				? this._collectingArmorAnimation 
				: this._goalCoin && this._goalCoin.lifeTimeLeftMs > 0 || this._isRunFromMonster
					? this._runArmorAnimation
					: this._passiveWaitingArmorAnimation;

			imageOrAnimationWeapon = this._isCollecting && this._collectingWeaponAnimation.leftTimeMs > 0
				? this._collectingWeaponAnimation 
				: this._goalCoin && this._goalCoin.lifeTimeLeftMs > 0 || this._isRunFromMonster
					? this._runWeaponAnimation
					: this._passiveWaitingWeaponAnimation;
		}

		super.drawObjects(drawsDiffMs, imageOrAnimation, imageOrAnimationArmor, imageOrAnimationWeapon, isGameOver, invertSign, x, y, filter);
	}

}
Object.defineProperty(Collector, "name", { value: 'Collector', writable: false }); //fix production minification class names