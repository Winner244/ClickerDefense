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

import {Helper} from '../helpers/Helper';

import {Unit} from './Unit';

import {Coins} from '../coins/Coins';

import {WawesState} from '../gameSystems/WawesState';

import ParameterItem from '../../models/ParameterItem';
import Improvement from '../../models/Improvement';
import ImprovementParameterItem from '../../models/ImprovementParameterItem';

import PickImage from '../../assets/img/units/miner/pick.png'; 
import MinerFallImage from '../../assets/img/units/miner/fall.png'; 
import MinerFallEndImage from '../../assets/img/units/miner/fallEnd.png'; 
import MinerActiveWaitImage from '../../assets/img/units/miner/activeWait.png'; 
import MinerDiggingImage from '../../assets/img/units/miner/digging.png'; 
import MinerStartActiveWaitImage from '../../assets/img/units/miner/startActiveWait.png'; 
import MinerPassiveWait1Image from '../../assets/img/units/miner/passiveWait1.png'; 
import MinerRunImage from '../../assets/img/units/miner/run.png'; 
import MinerJoyImage from '../../assets/img/units/miner/joy.png'; 

import PickGoldImage from '../../assets/img/units/miner/pickGold.png'; 
import MinerFallEndGoldPickImage from '../../assets/img/units/miner/goldPick/fallEnd.png'; 
import MinerActiveWaitGoldPickImage from '../../assets/img/units/miner/goldPick/activeWait.png'; 
import MinerDiggingGoldPickImage from '../../assets/img/units/miner/goldPick/digging.png'; 
import MinerStartActiveWaitGoldPickImage from '../../assets/img/units/miner/goldPick/startActiveWait.png'; 
import MinerPassiveWait1GoldPickImage from '../../assets/img/units/miner/goldPick/passiveWait1.png'; 
import MinerRunGoldPickImage from '../../assets/img/units/miner/goldPick/run.png'; 
import MinerJoyGoldPickImage from '../../assets/img/units/miner/goldPick/joy.png'; 

import speedIcon from '../../assets/img/icons/speed.png';  
import coinIcon from '../../assets/img/coin.png';  

import SoundAttacked1 from '../../assets/sounds/units/miner/attacked1.mp3'; 
import SoundAttacked2 from '../../assets/sounds/units/miner/attacked2.mp3'; 
import SoundAttacked3 from '../../assets/sounds/units/miner/attacked3.mp3'; 


/** Шахтёр - тип юнитов пользователя */
export class Miner extends Unit{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly scaleSize: number = 0.75;
	private static readonly passiveWait1Image: HTMLImageElement = new Image();
	private static readonly fallImage: HTMLImageElement = new Image();
	private static readonly fallEndImage: HTMLImageElement = new Image(); 
	private static readonly startActiveWaitImage: HTMLImageElement = new Image(); 
	private static readonly activeWaitImage: HTMLImageElement = new Image(); 
	private static readonly diggingImage: HTMLImageElement = new Image(); 
	private static readonly runImage: HTMLImageElement = new Image(); 
	private static readonly joyImage: HTMLImageElement = new Image(); 

	private static readonly pickImage: HTMLImageElement = new Image(); 

	private static readonly rotateWeaponInEarch: number = 172;

	private static readonly initialSpeed: number = 75;

	static readonly shopItem: ShopItem = new ShopItem('Золотодобытчик', Miner.passiveWait1Image, 50, 'Добывает монетки', ShopCategoryEnum.UNITS, 20);

	private readonly _diggingAnimation: AnimationInfinite; //анимация добывания монеток
	private readonly _diggingWeaponAnimation: AnimationInfinite; //для апгрейда кирки - анимация добывания монеток
	private _isDiging: boolean; //Копает сейчас?
	private _countCoinsDiging: number; //сколько монет за раз добывает?
	private _wasPickHit: boolean; //Удар уже состоялся по земле при копании за текущий цикл анимации digging ?

	public static readonly timeStopRunning: number = 1000; //(в миллисекундах) спустя это время от последнего получения урона майнер остановиться и продолжит копать 
	private timeStopRunningLeft: number; //(в миллисекундах) сколько времени осталось что бы остановиться?

	public isTurnOnPushUpFromCrystals: boolean; //включена лоигка выталкивания майнеров с кристаллов?

	constructor(x: number, y: number, goalY: number, test: number = 0) {
		super(x, y, 3, 
			Miner.passiveWait1Image, 	//image
			Miner.pickImage,   			//image weapon
			new AnimationInfinite(1, 1 * 75, Miner.passiveWait1Image), 	//passive waiting
			Miner.fallImage,			//fall image
			new Animation(31, 31 * 75, Miner.fallEndImage), 			//fall end animation
			new Animation(5, 5 * 75, Miner.startActiveWaitImage), 		//startActiveWaitingAnimation
			new AnimationInfinite(4, 4 * 75, Miner.activeWaitImage), 	//activeWaitingAnimation
			new AnimationInfinite(5, 5 * 100, Miner.runImage),  		//run animation
			new Animation(21, 21 * 110, Miner.joyImage),  				//joy animation
			Miner.rotateWeaponInEarch, 
			Miner.name, Miner.imageHandler, 0, 0, Miner.shopItem.price, Miner.initialSpeed, Miner.scaleSize, false, 0, true, true); 
		
		this._diggingAnimation = new AnimationInfinite(9, 9 * 75, Miner.diggingImage);
		this._diggingWeaponAnimation = new AnimationInfinite(this._diggingAnimation.frames, this._diggingAnimation.durationMs); //пока апгрейда нету
		this._diggingAnimation.displayedTimeMs = Helper.getRandom(0, this._diggingAnimation.durationMs); //random starting animation
		this._diggingWeaponAnimation.displayedTimeMs = this._diggingAnimation.displayedTimeMs;

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
		return Miner.passiveWait1Image.width * Miner.scaleSize;
	}

	public static get imageHeight() : number{
		return Miner.passiveWait1Image.height * Miner.scaleSize;
	}

	static initForShop(): void{
		Miner.passiveWait1Image.src = MinerPassiveWait1Image;
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && Miner.imageHandler.isEmpty){
			Miner.imageHandler.new(Miner.passiveWait1Image).src = MinerPassiveWait1Image;
			Miner.imageHandler.new(Miner.fallImage).src = MinerFallImage;
			Miner.imageHandler.new(Miner.fallEndImage).src = MinerFallEndImage;
			Miner.imageHandler.new(Miner.startActiveWaitImage).src = MinerStartActiveWaitImage;
			Miner.imageHandler.new(Miner.activeWaitImage).src = MinerActiveWaitImage;
			Miner.imageHandler.new(Miner.diggingImage).src = MinerDiggingImage;
			Miner.imageHandler.new(Miner.runImage).src = MinerRunImage;
			Miner.imageHandler.new(Miner.joyImage).src = MinerJoyImage;
			Miner.imageHandler.new(Miner.pickImage).src = PickImage;
		}
	}

	loadedResourcesAfterBuild(){
		super.loadedResourcesAfterBuild();

		this.infoItems.splice(2, 0, new ParameterItem('Скорость', () => this.speed, speedIcon, 25, 10, () => this.improveSpeed()));

		this.improvements.push(new Improvement('Золотая кирка', 100, PickGoldImage, () => this.improveToGoldPick(), [
			new ImprovementParameterItem(`x2`, coinIcon)
		]));
	}

	improveToGoldPick(){
		this.imageWeapon.src = PickGoldImage;
		this._countCoinsDiging = 2;
		this._diggingWeaponAnimation.image.src = MinerDiggingGoldPickImage;
		this._passiveWaitingWeaponAnimation.image.src = MinerPassiveWait1GoldPickImage;
		this._fallEndWeaponAnimation.image.src = MinerFallEndGoldPickImage;
		this._startActiveWaitingWeaponAnimation.image.src = MinerStartActiveWaitGoldPickImage;
		this._activeWaitingWeaponAnimation.image.src = MinerActiveWaitGoldPickImage;
		this._runWeaponAnimation.image.src = MinerRunGoldPickImage;
		this._joyWeaponAnimation.image.src = MinerJoyGoldPickImage;
	}

	improveSpeed(){
		this.speed += 10;
		var newDuration = Miner.initialSpeed / this.speed * this._diggingAnimation.initialDurationMs;
		this._diggingAnimation.changeDuration(newDuration);
		this._diggingWeaponAnimation.changeDuration(newDuration);
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

	applyDamage(damage: number, x: number|null = null, y: number|null = null): number{
		var damage = super.applyDamage(damage, x, y);
		if(damage > 0){
			AudioSystem.playRandom(this.centerX, [SoundAttacked1, SoundAttacked2, SoundAttacked3], [-1, -1, -1, -1], false, 1, true);

			if(this.health <= 0){
				this.isTurnOnPushUpFromCrystals = false;
			}
		}

		//убегаем от урона - даже если его нету
		if(this._isDiging){ 
			this.isRunRight = (x || 0) < this.centerX;
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
		imageOrAnimationWeapon: AnimationInfinite|Animation|HTMLImageElement, 
		isGameOver: boolean, invertSign: number = 1, x: number|null = null, y: number|null = null, filter: string|null = null)
	{
		if(WawesState.isWaveStarted){
			imageOrAnimation = this._isDiging 
				? this._diggingAnimation 
				: this._runAnimation;
			imageOrAnimationWeapon = this._isDiging 
				? this._diggingWeaponAnimation 
				: this._runWeaponAnimation;
		}

		super.drawObjects(drawsDiffMs, imageOrAnimation, imageOrAnimationWeapon, isGameOver, invertSign, x, y, filter);
	}

}
Object.defineProperty(Miner, "name", { value: 'Miner', writable: false }); //fix production minification class names