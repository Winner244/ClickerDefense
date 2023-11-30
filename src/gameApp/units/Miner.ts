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

import {Coins} from '../coins/Coins';

import {WawesState} from '../gameSystems/WawesState';

import ParameterItem from '../../models/ParameterItem';
import Improvement from '../../models/Improvement';
import ImprovementParameterItem from '../../models/ImprovementParameterItem';

import PickImage from '../../assets/img/units/miner/pick.png'; 
import MinerShopImage from '../../assets/img/units/miner/shopImage.png'
import MinerFallImage from '../../assets/img/units/miner/fall.png'; 
import MinerFallEndImage from '../../assets/img/units/miner/fallEnd.png'; 
import MinerActiveWaitImage from '../../assets/img/units/miner/activeWait.png'; 
import MinerDiggingImage from '../../assets/img/units/miner/digging.png'; 
import MinerStartActiveWaitImage from '../../assets/img/units/miner/startActiveWait.png'; 
import MinerPassiveWait1Image from '../../assets/img/units/miner/passiveWait1.png'; 
import MinerRunImage from '../../assets/img/units/miner/run.png'; 
import MinerJoyImage from '../../assets/img/units/miner/joy.png'; 
import MinerAttackImage from '../../assets/img/units/miner/attack.png'; 


import PickGoldImage from '../../assets/img/units/miner/pickGold.png'; 
import MinerFallEndGoldPickImage from '../../assets/img/units/miner/goldPick/fallEnd.png'; 
import MinerActiveWaitGoldPickImage from '../../assets/img/units/miner/goldPick/activeWait.png'; 
import MinerDiggingGoldPickImage from '../../assets/img/units/miner/goldPick/digging.png'; 
import MinerStartActiveWaitGoldPickImage from '../../assets/img/units/miner/goldPick/startActiveWait.png'; 
import MinerPassiveWait1GoldPickImage from '../../assets/img/units/miner/goldPick/passiveWait1.png'; 
import MinerRunGoldPickImage from '../../assets/img/units/miner/goldPick/run.png'; 
import MinerJoyGoldPickImage from '../../assets/img/units/miner/goldPick/joy.png'; 
import MinerAttackGoldPickImage from '../../assets/img/units/miner/goldPick/attack.png'; 

import PickDiamondImage from '../../assets/img/units/miner/pickDiamond.png'; 
import MinerFallEndDiamondPickImage from '../../assets/img/units/miner/diamonPick/fallEnd.png'; 
import MinerDiggingDiamondPickImage from '../../assets/img/units/miner/diamonPick/digging.png'; 
import MinerPassiveWait1DiamondPickImage from '../../assets/img/units/miner/diamonPick/passiveWait1.png'; 
import MinerStartActiveWaitDiamondPickImage from '../../assets/img/units/miner/diamonPick/startActiveWait.png'; 
import MinerActiveWaitDiamondPickImage from '../../assets/img/units/miner/diamonPick/activeWait.png'; 
import MinerRunDiamondPickImage from '../../assets/img/units/miner/diamonPick/run.png'; 
import MinerJoyDiamondPickImage from '../../assets/img/units/miner/diamonPick/joy.png'; 
import MinerAttackDiamondPickImage from '../../assets/img/units/miner/diamonPick/attack.png'; 


import WoodArmorImage from '../../assets/img/units/miner/woodArmor.png'; 
import MinerFallEndWoodArmorImage from '../../assets/img/units/miner/woodArmor/fallEnd.png'; 
import MinerDiggingWoodArmorImage from '../../assets/img/units/miner/woodArmor/digging.png'; 
import MinerPassiveWait1WoodArmorImage from '../../assets/img/units/miner/woodArmor/passiveWait1.png'; 
import MinerStartActiveWaitWoodArmorImage from '../../assets/img/units/miner/woodArmor/startActiveWait.png'; 
import MinerActiveWaitWoodArmorImage from '../../assets/img/units/miner/woodArmor/activeWait.png'; 
import MinerRunWoodArmorImage from '../../assets/img/units/miner/woodArmor/run.png'; 
import MinerJoyWoodArmorImage from '../../assets/img/units/miner/woodArmor/joy.png'; 
import MinerAttackWoodArmorImage from '../../assets/img/units/miner/woodArmor/attack.png'; 

import swordIcon from '../../assets/img/icons/sword.png';  
import shieldAndSwordsIcon from '../../assets/img/icons/shieldAndSwords.png';  
import shieldIcon from '../../assets/img/icons/shieldContrast.png';  
import speedIcon from '../../assets/img/icons/speed.png';  
import coinIcon from '../../assets/img/coin.png';  

import SoundAttacked1 from '../../assets/sounds/units/miner/attacked1.mp3'; 
import SoundAttacked2 from '../../assets/sounds/units/miner/attacked2.mp3'; 
import SoundAttacked3 from '../../assets/sounds/units/miner/attacked3.mp3'; 


/** Шахтёр - тип юнитов пользователя */
export class Miner extends Unit{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly scaleSize: number = 0.75;
	private static readonly shopImage: HTMLImageElement = new Image();
	private static readonly passiveWait1Image: HTMLImageElement = new Image();
	private static readonly fallImage: HTMLImageElement = new Image();
	private static readonly fallEndImage: HTMLImageElement = new Image(); 
	private static readonly startActiveWaitImage: HTMLImageElement = new Image(); 
	private static readonly activeWaitImage: HTMLImageElement = new Image(); 
	private static readonly diggingImage: HTMLImageElement = new Image(); 
	private static readonly runImage: HTMLImageElement = new Image(); 
	private static readonly joyImage: HTMLImageElement = new Image(); 
	private static readonly attackImage: HTMLImageElement = new Image(); 

	private static readonly pickImage: HTMLImageElement = new Image(); 

	private static readonly rotateWeaponInEarch: number = 172;

	private static readonly initialSpeed: number = 75;

	static readonly shopItem: ShopItem = new ShopItem('Золотодобытчик', Miner.shopImage, 50, 'Добывает монетки', ShopCategoryEnum.UNITS, 20);

	private readonly _diggingAnimation: AnimationInfinite; //анимация добывания монеток
	private readonly _diggingWeaponAnimation: AnimationInfinite; //для апгрейда кирки - анимация добывания монеток
	private readonly _diggingArmorAnimation: AnimationInfinite; //для апгрейда брони - анимация добывания монеток
	private _isDiging: boolean; //Копает сейчас?
	private _countCoinsDiging: number; //сколько монет за раз добывает?
	private _wasPickHit: boolean; //Удар уже состоялся по земле при копании за текущий цикл анимации digging ?

	public static readonly timeStopRunning: number = 1000; //(в миллисекундах) спустя это время от последнего получения урона майнер остановиться и продолжит копать 
	private timeStopRunningLeft: number; //(в миллисекундах) сколько времени осталось что бы остановиться?

	public isTurnOnPushUpFromCrystals: boolean; //включена лоигка выталкивания майнеров с кристаллов?

	constructor(x: number, y: number, goalY: number, test: number = 0) {
		super(x, y, 3, 
			Miner.shopImage, 	//image
			Miner.pickImage,   			//image weapon
			new AnimationInfinite(4, 4 * 75, Miner.attackImage), 	//attack 
			new AnimationInfinite(7, 7 * 300, Miner.passiveWait1Image), 	//passive waiting
			Miner.fallImage,			//fall image
			new Animation(31, 31 * 75, Miner.fallEndImage), 			//fall end animation
			new Animation(5, 5 * 75, Miner.startActiveWaitImage), 		//startActiveWaitingAnimation
			new AnimationInfinite(4, 4 * 75, Miner.activeWaitImage), 	//activeWaitingAnimation
			new AnimationInfinite(5, 5 * 100, Miner.runImage),  		//run animation
			new Animation(21, 21 * 110, Miner.joyImage),  				//joy animation
			Miner.rotateWeaponInEarch, 
			Miner.name, 
			Miner.imageHandler, 0, 0, 
			Miner.shopItem.price, 
			Miner.initialSpeed, 
			0, //damage
			2 * 75, //attackTimeWaitingMs
			Miner.scaleSize, 
			false, //isLand
			0, //reduceHover
			true, //isSupportHealing
			true); //isSupportUpgrade
		
		this._diggingAnimation = new AnimationInfinite(9, 9 * 75, Miner.diggingImage);
		this._diggingWeaponAnimation = new AnimationInfinite(this._diggingAnimation.frames, this._diggingAnimation.durationMs); //пока апгрейда нету
		this._diggingArmorAnimation = new AnimationInfinite(this._diggingAnimation.frames, this._diggingAnimation.durationMs); //пока апгрейда нету
		this._diggingAnimation.displayedTimeMs = 
		this._diggingWeaponAnimation.displayedTimeMs = 
		this._diggingArmorAnimation.displayedTimeMs = Helper.getRandom(0, this._diggingAnimation.durationMs); //random starting animation

		this._isDiging = true;
		this._wasPickHit = false;
		this.isLeftSide = this.x < Buildings.flyEarth.centerX;
		this.isRunRight = true;

		this.goalY = goalY;
		this.shopItemName = Miner.shopItem.name;
		this.timeStopRunningLeft = 0;

		this.isTurnOnPushUpFromCrystals = false;

		this._countCoinsDiging = 1;

        Miner.init(true); //reserve init
		FlyEarth.loadSeparateCrystals(); //reserve init

		if(test == 1){
			this._health = 0;
			this._isDisplayWeaponInEarch = true;
			this.endingAnimation.animation.leftTimeMs = 0;
		}
		else if(test == 2){
			this._health -= this._health / 2;
		}
	}

	public static get imageWidth() : number{
		return Miner.shopImage.width * Miner.scaleSize;
	}

	public static get imageHeight() : number{
		return Miner.shopImage.height * Miner.scaleSize;
	}

	static initForShop(): void{
		Miner.shopImage.src = MinerShopImage;
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && Miner.imageHandler.isEmpty){
			Miner.imageHandler.new(Miner.shopImage).src = MinerShopImage;
			Miner.imageHandler.new(Miner.passiveWait1Image).src = MinerPassiveWait1Image;
			Miner.imageHandler.new(Miner.fallImage).src = MinerFallImage;
			Miner.imageHandler.new(Miner.fallEndImage).src = MinerFallEndImage;
			Miner.imageHandler.new(Miner.startActiveWaitImage).src = MinerStartActiveWaitImage;
			Miner.imageHandler.new(Miner.activeWaitImage).src = MinerActiveWaitImage;
			Miner.imageHandler.new(Miner.diggingImage).src = MinerDiggingImage;
			Miner.imageHandler.new(Miner.runImage).src = MinerRunImage;
			Miner.imageHandler.new(Miner.joyImage).src = MinerJoyImage;
			Miner.imageHandler.new(Miner.pickImage).src = PickImage;
			Miner.imageHandler.new(Miner.attackImage).src = MinerAttackImage;
		}
	}

	loadedResourcesAfterBuild(){
		super.loadedResourcesAfterBuild();

		this.infoItems = this.infoItems.filter(x => x.label != 'Защита');
		this.infoItems.splice(1, 0, new ParameterItem('Скорость', () => this.speed, speedIcon, 22, Miner.shopItem.price * 0.2, () => this.improveSpeed()));

		this.improvements.push(new Improvement('Самооборона', Miner.shopItem.price * 2, shieldAndSwordsIcon, () => this.improveToSelfDefense(), [
			new ImprovementParameterItem(`+`, swordIcon)
		]));

		this.improvements.push(new Improvement('Деревянная броня', Miner.shopItem.price * 2, WoodArmorImage, () => this.improveToWoodArmor(), [
			new ImprovementParameterItem(`+`, shieldIcon)
		]));

		this.improvements.push(new Improvement('Золотая кирка', Miner.shopItem.price * 0.8, PickGoldImage, () => this.improveToGoldPick(), [
			new ImprovementParameterItem(`x2`, coinIcon)
		]));

		this.improvements.push(new Improvement('Алмазная кирка', Miner.shopItem.price * 0.8, PickDiamondImage, () => this.improveToDiamondPick(), [
			new ImprovementParameterItem(`x3`, coinIcon)
		], true));
	}

	improveToGoldPick(){
		this.imageWeapon = new Image();
		this.imageWeapon.src = PickGoldImage;
		this._countCoinsDiging = 2;
		this._diggingWeaponAnimation.image.src = MinerDiggingGoldPickImage;
		this._passiveWaitingWeaponAnimation.image.src = MinerPassiveWait1GoldPickImage;
		this._fallEndWeaponAnimation.image.src = MinerFallEndGoldPickImage;
		this._startActiveWaitingWeaponAnimation.image.src = MinerStartActiveWaitGoldPickImage;
		this._activeWaitingWeaponAnimation.image.src = MinerActiveWaitGoldPickImage;
		this._runWeaponAnimation.image.src = MinerRunGoldPickImage;
		this._joyWeaponAnimation.image.src = MinerJoyGoldPickImage;
		this._attackWeaponAnimation.image.src = MinerAttackGoldPickImage;
	}

	improveToDiamondPick(){
		this.imageWeapon = new Image();
		this.imageWeapon.src = PickDiamondImage;
		this._countCoinsDiging = 3;
		this._diggingWeaponAnimation.image.src = MinerDiggingDiamondPickImage;
		this._passiveWaitingWeaponAnimation.image.src = MinerPassiveWait1DiamondPickImage;
		this._fallEndWeaponAnimation.image.src = MinerFallEndDiamondPickImage;
		this._startActiveWaitingWeaponAnimation.image.src = MinerStartActiveWaitDiamondPickImage;
		this._activeWaitingWeaponAnimation.image.src = MinerActiveWaitDiamondPickImage;
		this._runWeaponAnimation.image.src = MinerRunDiamondPickImage;
		this._joyWeaponAnimation.image.src = MinerJoyDiamondPickImage;
		this._attackWeaponAnimation.image.src = MinerAttackDiamondPickImage;
	}

	improveToWoodArmor(){
		this.defense += 0.1;
		this._diggingArmorAnimation.image.src = MinerDiggingWoodArmorImage;
		this._passiveWaitingArmorAnimation.image.src = MinerPassiveWait1WoodArmorImage;
		this._fallEndArmorAnimation.image.src = MinerFallEndWoodArmorImage;
		this._startActiveWaitingArmorAnimation.image.src = MinerStartActiveWaitWoodArmorImage;
		this._activeWaitingArmorAnimation.image.src = MinerActiveWaitWoodArmorImage;
		this._runArmorAnimation.image.src = MinerRunWoodArmorImage;
		this._joyArmorAnimation.image.src = MinerJoyWoodArmorImage;
		this._attackArmorAnimation.image.src = MinerAttackWoodArmorImage;
	}

	improveToSelfDefense(){
		this.damage = 0.1;
		this.infoItems.splice(2, 0, new ParameterItem('Урон', () => this.damage.toFixed(1), swordIcon, 13, Miner.shopItem.price, () => this.damage += 0.1));
	}

	improveSpeed(){
		this.speed += 10;

		var newDurationDigging = Miner.initialSpeed / this.speed * this._diggingAnimation.initialDurationMs;
		this._diggingAnimation.changeDuration(newDurationDigging);
		this._diggingWeaponAnimation.changeDuration(newDurationDigging);

		var newDurationAttack = Miner.initialSpeed / this.speed * this._attackAnimation.initialDurationMs;
		this._attackAnimation.changeDuration(newDurationAttack);
		this._attackWeaponAnimation.changeDuration(newDurationAttack);
	}

	recovery(): boolean{
		let oldHealth = this._health;
		let result = super.recovery();
		if(result && oldHealth <= 0){
			this._isDiging = true;
			this.isLeftSide = this.x < Buildings.flyEarth.centerX;
			this.isRunRight = true;
			this._fallEndAnimation.leftTimeMs = 
			this._fallEndWeaponAnimation.leftTimeMs = 
			this._fallEndArmorAnimation.leftTimeMs = this._fallEndAnimation.durationMs;
		}

		return result;
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logic(drawsDiffMs, buildings, monsters, units, bottomShiftBorder);
		

		//end 
		if(this._isDisplayWeaponInEarch){
			return;
		}

		//gravitations
		if(this.y + this.height < this.goalY){
			this.isTurnOnPushUpFromCrystals = false;
		}
		else{
			//выталкивание из кристаллов
			if(this.isTurnOnPushUpFromCrystals){
				this.isTurnOnPushUpFromCrystals = !this.pushUpFromCrystals();
			}
		}
		
		//игра пошла
		if(this.health > 0 && WawesState.isWaveStarted && WawesState.delayStartLeftTimeMs <= 0){
			if(this._isDiging){ //добывание монеток
				if(this._diggingAnimation.displayedTimeMs % this._diggingAnimation.durationMs > this._diggingAnimation.durationMs * 0.75){
					if(!this._wasPickHit){
						let flyEarth = Buildings.flyEarth;
						if(flyEarth){ //создание монетки
							for(var i = 0; i < this._countCoinsDiging; i++){
								let coinX = flyEarth.x + flyEarth.reduceHover + Math.random() * (flyEarth.width - flyEarth.reduceHover * 2);
								let coinY = flyEarth.y + flyEarth.height / 2;
								Coins.create(coinX, Math.max(coinY, this.y + this.height));
								FlyEarth.playSoundPick(this.x + this.width, -30);
							}
							this._wasPickHit = true;
						}
					}
				}
				else{
					this._wasPickHit = false;
				}
			}
			else if(this.damage > 0){ //самооборона
				this._attackLeftTimeMs -= drawsDiffMs;

				//атака
				if(this._attackLeftTimeMs <= 0){
					let damageMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.damageOutMultiplier);
					let damage = this.damage + this.damage * damageMultiplier;
					this.attack(damage);
				}
			}
			else{ //убегать от нападения летучих мышей
				this.isTurnOnPushUpFromCrystals = false;
				this.timeStopRunningLeft -= drawsDiffMs;
				if(this.timeStopRunningLeft <= 0){ //давно никто не атаковал майнера
					this._isDiging = true;
					this.isTurnOnPushUpFromCrystals = true;
					return;
				}
			
				//убегаем
				let speedMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.speedMultiplier);
				let speed = this.speed * (drawsDiffMs / 1000);
				speed += speed * speedMultiplier;
	
				if(this.isRunRight){
					this.x += speed;

					const xMax = Buildings.flyEarth.x + Buildings.flyEarth.width - this.width - 10;
					if(this.x > xMax){
						this.isRunRight = !this.isRunRight;
					}
				}
				else{
					this.x -= speed;
					
					const xMin = Buildings.flyEarth.x;
					if(this.x < xMin){
						this.isRunRight = !this.isRunRight;
					}
				}
				this.isLeftSide = this.x < Buildings.flyEarth.centerX;

				
				//рандомное перемещение по y
				let flyEarth = Buildings.flyEarth;
				if(flyEarth){
					this.y += (Math.random() - 0.5);

					var yMin = flyEarth.centerY - (flyEarth.width - Math.abs(flyEarth.centerX - this.x - this.width / 2)) / 6 + 32 - this.height;
					var yMax = flyEarth.centerY + (flyEarth.width - Math.abs(flyEarth.centerX - this.x - this.width / 2)) / 7 - 32 - this.height;
					if(this.y > yMax){
						this.y = yMax;
					}
					else if(this.y < yMin){
						this.y = yMin;
					}
					this.goalY = this.y + this.height;
				}
			}
		}
		else if(WawesState.isWaveEnded && WawesState.delayEndLeftTimeMs > 0 && !this.isRunRight){
			this.isRunRight = true;
		}
	}

	attack(damage: number): void{
		if(damage > 0 && this._goal != null){
			this._goal.applyDamage(damage, this.isRunRight ? this.x + this.width - 10 : this.x - 12, this.y + this.height / 2, this); //наносит урон
			this._attackLeftTimeMs = this.attackTimeWaitingMs * (this.initialSpeed / this.speed);
			this.isRunRight = (this._goal.centerX || 0) > this.centerX;
			if(this._goal.health <= 0){
				this._goal = null;
				this._isDiging = true;
				//this.isRunRight = true;
			}
		}
	}

	pushUpFromCrystals(isOnlyGoal: boolean = false): boolean{
		let isOk = true;
		var crystal1 = Buildings.flyEarth.crystal1PositionBlocking;
		var crystal2 = Buildings.flyEarth.crystal2PositionBlocking;
		var crystal3 = Buildings.flyEarth.crystal3PositionBlocking;
		var crystal4 = Buildings.flyEarth.crystal4PositionBlocking;
		
		var crystals = [crystal1, crystal2, crystal3, crystal4];
		crystals.forEach(crystal => {
			if (Helper.isInsideEllipse(crystal.centerX, crystal.centerY, crystal.size.width + this.width / 4, crystal.size.height, this.centerX, this.goalY)) 
			{
				if(isOnlyGoal){
					this.goalY = crystal.location.y;
				}
				else{
					this.y -= (this.goalY - crystal.location.y);
					this.goalY = crystal.location.y;
				}
				isOk = false;
			}
		});

		return isOk;
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null, attackingObject: AttackedObject|null = null): number{
		var damage = super.applyDamage(damage, x, y);
		if(damage > 0){
			AudioSystem.playRandom(this.centerX, [SoundAttacked1, SoundAttacked2, SoundAttacked3], [-1, -1, -1, -1], false, 1, true);

			if(this.health <= 0){
				this.isTurnOnPushUpFromCrystals = false;
			}
		}


		if(this.damage > 0){ //самооборона
			if(!this._goal || this._isDiging){
				this.isRunRight = (x || 0) > this.centerX;
				this._goal = attackingObject;
				this._attackLeftTimeMs = this.attackTimeWaitingMs * (this.initialSpeed / this.speed);
			}
		}
		else{ //убегаем от урона - даже если его нету
			if(this._isDiging){
				this.isRunRight = (x || 0) < this.centerX;
			}
		}

		this._isDiging = false;
		this.timeStopRunningLeft = Miner.timeStopRunning;

		return damage;
	}
	
	drawEarch(): void {
		Draw.ctx.lineWidth = 1;
		Draw.ctx.strokeStyle = '#833526';
		Draw.ctx.beginPath(); 
		for(let i = 0, w = 14; w > 0; w-=2, i++){
			Draw.ctx.moveTo(this.centerX + i - 5, this.y + this.height - i - 20);
			Draw.ctx.lineTo(this.centerX + i + w - 5, this.y + this.height - i - 20)
		}
		Draw.ctx.stroke(); 
	}

	drawObjects(drawsDiffMs: number, 
		imageOrAnimation: AnimationInfinite|Animation|HTMLImageElement, 
		imageOrAnimationArmor: AnimationInfinite|Animation|HTMLImageElement, 
		imageOrAnimationWeapon: AnimationInfinite|Animation|HTMLImageElement, 
		isGameOver: boolean, invertSign: number = 1, x: number|null = null, y: number|null = null, filter: string|null = null)
	{
		if(WawesState.isWaveStarted){
			imageOrAnimation = this._isDiging 
				? this._diggingAnimation 
				: this.damage > 0
					? this._attackAnimation
					: this._runAnimation;

			imageOrAnimationArmor = this._isDiging 
				? this._diggingArmorAnimation 
				: this.damage > 0
					? this._attackArmorAnimation
					: this._runArmorAnimation;
					
			imageOrAnimationWeapon = this._isDiging 
				? this._diggingWeaponAnimation 
				: this.damage > 0
					? this._attackWeaponAnimation
					: this._runWeaponAnimation;
		}

		super.drawObjects(drawsDiffMs, imageOrAnimation, imageOrAnimationArmor, imageOrAnimationWeapon, isGameOver, invertSign, x, y, filter);
	}

}
Object.defineProperty(Miner, "name", { value: 'Miner', writable: false }); //fix production minification class names