import {ImageHandler} from '../ImageHandler';

import {AudioSystem} from '../gameSystems/AudioSystem';
import {Draw} from '../gameSystems/Draw';
import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

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

import MinerFallImage from '../../assets/img/units/miner/fall.png'; 
import MinerFallEndImage from '../../assets/img/units/miner/fallEnd.png'; 
import MinerActiveWaitImage from '../../assets/img/units/miner/activeWait.png'; 
import MinerDiggingImage from '../../assets/img/units/miner/digging.png'; 
import MinerStartActiveWaitImage from '../../assets/img/units/miner/startActiveWait.png'; 
import MinerPassiveWait1Image from '../../assets/img/units/miner/passiveWait1.png'; 

//import SoundAttacked1 from '../../assets/sounds/units/miner/attacked1.mp3'; 


/** Шахтёр - тип юнитов пользователя */
export class Miner extends Unit{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly passiveWait1Image: HTMLImageElement = new Image();
	private static readonly fallImage: HTMLImageElement = new Image();
	private static readonly fallEndImage: HTMLImageElement = new Image(); 
	private static readonly startActiveWaitImage: HTMLImageElement = new Image(); 
	private static readonly activeWaitImage: HTMLImageElement = new Image(); 
	private static readonly diggingImage: HTMLImageElement = new Image(); 

	static readonly shopItem: ShopItem = new ShopItem('Золотодобытчик', Miner.passiveWait1Image, 50, 'Добывает монетки', ShopCategoryEnum.UNITS, 20);

	public goalY: number;

	private readonly _fallEndAnimation: Animation;
	private _isFall: boolean;

	private readonly _startActiveWaitAnimation: Animation;
	private readonly _activeWaitAnimation: AnimationInfinite;
	private readonly _diggingAnimation: AnimationInfinite;
	private _isDiging: boolean; //Копает сейчас?
	private _wasPickHit: boolean; //Удар уже состоялся по земле при копании за текущий цикл анимации digging ?

	constructor(x: number, y: number, goalY: number) {
		super(x, y, 3, Miner.passiveWait1Image, Miner.name, Miner.imageHandler, 0, 0, Miner.shopItem.price, false); 

		this._fallEndAnimation = new Animation(31, 31 * 75, Miner.fallEndImage);
		this._startActiveWaitAnimation = new Animation(5, 5 * 75, Miner.startActiveWaitImage);
		this._activeWaitAnimation = new AnimationInfinite(4, 4 * 75, Miner.activeWaitImage);
		this._diggingAnimation = new AnimationInfinite(9, 9 * 75, Miner.diggingImage);

		this._isFall = false;
		this._isDiging = true;
		this._wasPickHit = false;
		this.isLeftSide = false;

		this.goalY = goalY;
		this.shopItemName = Miner.shopItem.name;

        Miner.init(true); //reserve init
		FlyEarth.loadSeparateCrystals(); //reserve init
	}

	get width(): number{
		return Miner.imageWidth;
	}

	get height(): number{
		return Miner.imageHeight;
	}

	public static get imageWidth() : number{
		return 75;
	}

	public static get imageHeight() : number{
		return 77;
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
		}
	}


	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number, isWaveStarted: boolean){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logicBase(drawsDiffMs, buildings, monsters, units, bottomShiftBorder);
		
		//gravitations
		if(this.y + this.height < this.goalY){
			this.y+=1.5;
			this._isFall = true;
		}
		else{
			this._isFall = false;
		}
		
		if(isWaveStarted){
			if(this._isDiging){
				if(this._diggingAnimation.displayedTimeMs % this._diggingAnimation.durationMs > 500){
					if(!this._wasPickHit){
						let flyEarth = buildings.find(x => x.name == FlyEarth.name);
						if(flyEarth){
							let coinX = flyEarth.x + flyEarth.reduceHover + Math.random() * (flyEarth.width - flyEarth.reduceHover * 2);
							let coinY = flyEarth.y + flyEarth.height / 2;
							Coins.create(coinX, Math.max(coinY, this.y + this.height));
							FlyEarth.playSoundPick(this.x + this.width, 0.001);
							this._wasPickHit = true;
						}
					}
				}
				else{
					this._wasPickHit = false;
				}
			}
			else{
				//TODO: убегать или обороняться от нападения летучих мышей

				//TODO: если угроза миновала - this._isDiging = true;
			}
		}
	}

	pushUpFromCrystals(isOnlyGoal: boolean = false){
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
					this.y -= (crystal.location.y - this.goalY);
					this.goalY = crystal.location.y;
				}
			}
		});
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null): number{
		var damage = super.applyDamage(damage, x, y);
		if(damage > 0){
			//AudioSystem.playRandom(this.centerX, 
			//	[SoundAttacked1], 
			//	[0.05], false, 1, true);
			this._isDiging = false;
		}
		return damage;
	}


	draw(drawsDiffMs: number, isGameOver: boolean, isWaveStarted: boolean, waveDelayStartLeftTimeMs: number): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this._isFall){
			Draw.ctx.drawImage(Miner.fallImage, this.x, this.y, this.width, this.height);
		}
		else if(this._fallEndAnimation.leftTimeMs > 0){
			this._fallEndAnimation.draw(drawsDiffMs, isGameOver, this.x, this.y, this.width, this.height);
		}
		else if(isWaveStarted && waveDelayStartLeftTimeMs > 0) {
			if(this._startActiveWaitAnimation.leftTimeMs > 0){
				this._startActiveWaitAnimation.draw(drawsDiffMs, isGameOver, this.x, this.y, this.width, this.height);
			}
			else{
				this._activeWaitAnimation.draw(drawsDiffMs, isGameOver, this.x, this.y, this.width, this.height);
			}
		}
		else if(isWaveStarted){
			if(this._isDiging){
				this._diggingAnimation.draw(drawsDiffMs, isGameOver, this.x, this.y, this.width, this.height);
			}
			else{

			}
		}
		else{
			super.draw(drawsDiffMs, isGameOver, isWaveStarted, waveDelayStartLeftTimeMs);
		}
	}

}