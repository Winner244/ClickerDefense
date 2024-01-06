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

//TODO: import PickImage from '../../assets/img/units/collector/pick.png'; 
import CollectorShopImage from '../../assets/img/units/collector/shopImage.png'
import CollectorFallImage from '../../assets/img/units/collector/fall.png'; 
import CollectorFallEndImage from '../../assets/img/units/collector/fallEnd.png'; 
/*import CollectorActiveWaitImage from '../../assets/img/units/collector/activeWait.png'; 
import CollectorDiggingImage from '../../assets/img/units/collector/digging.png'; 
import CollectorStartActiveWaitImage from '../../assets/img/units/collector/startActiveWait.png'; */
import CollectorPassiveWaitingImage from '../../assets/img/units/collector/passiveWaiting.png'; 
import CollectorRunImage from '../../assets/img/units/collector/run.png'; 
/*import CollectorJoyImage from '../../assets/img/units/collector/joy.png'; 

import WoodArmorImage from '../../assets/img/units/collector/woodArmor.png'; 
import CollectorFallEndWoodArmorImage from '../../assets/img/units/collector/woodArmor/fallEnd.png'; 
import CollectorDiggingWoodArmorImage from '../../assets/img/units/collector/woodArmor/digging.png'; 
import CollectorPassiveWait1WoodArmorImage from '../../assets/img/units/collector/woodArmor/passiveWait1.png'; 
import CollectorStartActiveWaitWoodArmorImage from '../../assets/img/units/collector/woodArmor/startActiveWait.png'; 
import CollectorActiveWaitWoodArmorImage from '../../assets/img/units/collector/woodArmor/activeWait.png'; 
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
	//TODO: private static readonly startActiveWaitImage: HTMLImageElement = new Image(); 
	//TODO: private static readonly activeWaitImage: HTMLImageElement = new Image(); 
	//TODO: private static readonly collectImage: HTMLImageElement = new Image(); 
	private static readonly runImage: HTMLImageElement = new Image(); 
	//TODO: private static readonly joyImage: HTMLImageElement = new Image(); 

	//TODO: private static readonly pickImage: HTMLImageElement = new Image(); 

	//TODO: private static readonly rotateWeaponInEarch: number = 172;

	private static readonly initialSpeed: number = 75;

	static readonly shopItem: ShopItem = new ShopItem('Золотособиратель', Collector.shopImage, 50, 'Собирает монетки', ShopCategoryEnum.UNITS, 10);

	//TODO: private readonly _collectingAnimation: AnimationInfinite; //анимация собирания монеток
	//TODO: private readonly _collectingArmorAnimation: AnimationInfinite; //для апгрейда брони - анимация собирания монеток
	private _isCollecting: boolean; //Собирает монеты сейчас? 
	private _wasCollected: boolean; //Сбор уже состоялся за текущий цикл анимации collecting ?

	constructor(x: number, y: number) {
		super(x, y, 3, 
			Collector.shopImage, 	//image
			Collector.shopImage, 											//TODO: Collector.pickImage,   			//image weapon
			null,	//attack 
			new AnimationInfinite(6, 6 * 350, Collector.passiveWaitingImage), 	//passive waiting
			Collector.fallImage,												//fall image
			new Animation(18, 18 * 80, Collector.fallEndImage), 				//fall end animation
			new Animation(6, 6 * 350, Collector.passiveWaitingImage), 			//TODO: new Animation(5, 5 * 75, Collector.startActiveWaitImage), 		//startActiveWaitingAnimation
			new AnimationInfinite(6, 6 * 350, Collector.passiveWaitingImage), 	//TODO: new AnimationInfinite(4, 4 * 75, Collector.activeWaitImage), 	//activeWaitingAnimation
			new AnimationInfinite(5, 5 * 100, Collector.runImage),  		    //run animation
			new Animation(6, 6 * 350, Collector.passiveWaitingImage), 			//TODO: new Animation(21, 21 * 110, Collector.joyImage),  				//joy animation
			0, 															    //TODO: Collector.rotateWeaponInEarch, 
			Collector.name, 
			Collector.imageHandler, 0, 0, 
			Collector.shopItem.price, 
			Collector.initialSpeed, 
			0, //damage
			0, //attackTimeWaitingMs
			Collector.scaleSize, 
			true, //isLand
			0, //reduceHover
			true, //isSupportHealing
			true); //isSupportUpgrade
		
		//this._collectingAnimation = new AnimationInfinite(9, 9 * 75, Collector.collectImage);
		//this._collectingArmorAnimation = new AnimationInfinite(this._collectingAnimation.frames, this._collectingAnimation.durationMs); //пока апгрейда нету

		this._isCollecting = true;
		this._wasCollected = false;
		this.isLeftSide = this.x < Buildings.flyEarth.centerX;
		this.isRunRight = true;

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
			//TODO: Collector.imageHandler.new(Collector.startActiveWaitImage).src = CollectorStartActiveWaitImage;
			//TODO: Collector.imageHandler.new(Collector.activeWaitImage).src = CollectorActiveWaitImage;
			//TODO: Collector.imageHandler.new(Collector.diggingImage).src = CollectorDiggingImage;
			Collector.imageHandler.new(Collector.runImage).src = CollectorRunImage;
			//TODO: Collector.imageHandler.new(Collector.joyImage).src = CollectorJoyImage;
			//TODO: Collector.imageHandler.new(Collector.pickImage).src = PickImage;
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

		//TODO:var newDurationDigging = Collector.initialSpeed / this.speed * this._collectingAnimation.initialDurationMs;
		//TODO:this._collectingAnimation.changeDuration(newDurationDigging);
		//TODO:this._collectingArmorAnimation.changeDuration(newDurationDigging);
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

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logic(drawsDiffMs, buildings, monsters, units, bottomShiftBorder);
		

		//end 
		if(this._isDisplayWeaponInEarch){
			return;
		}
		
		//игра пошла
		if(this.health > 0 && WawesState.isWaveStarted && WawesState.delayStartLeftTimeMs <= 0){
			if(this._isCollecting){ //собирание монеток
				/*if(this._collectingAnimation.displayedTimeMs % this._collectingAnimation.durationMs > this._collectingAnimation.durationMs * 0.75){
					if(!this._wasCollected){
					}
				}
				else{
					this._wasCollected = false;
				}*/
			}
			else{ //убегать от нападения 
				//убегаем
				let speedMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.speedMultiplier);
				let speed = this.speed * (drawsDiffMs / 1000);
				speed += speed * speedMultiplier;
	
				//TODO: logic

				if(this.isRunRight){
					this.x += speed;
				}
				else{
					this.x -= speed;
				}
				this.isLeftSide = this.x < Buildings.flyEarth.centerX;
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
		}

		//убегаем от урона - даже если его нету
		if(this._isCollecting){
			this.isRunRight = (x || 0) < this.centerX;
			this._isCollecting = false;
		}

		return damage;
	}
	

	drawObjects(drawsDiffMs: number, 
		imageOrAnimation: AnimationInfinite|Animation|HTMLImageElement, 
		imageOrAnimationArmor: AnimationInfinite|Animation|HTMLImageElement, 
		imageOrAnimationWeapon: AnimationInfinite|Animation|HTMLImageElement, 
		isGameOver: boolean, invertSign: number = 1, x: number|null = null, y: number|null = null, filter: string|null = null)
	{
		/*TODO:
		if(WawesState.isWaveStarted){
			imageOrAnimation = this._isCollecting 
				? this._collectingAnimation 
				: this._runAnimation;

			imageOrAnimationArmor = this._isCollecting 
				? this._collectingArmorAnimation 
				: this._runArmorAnimation;
		}*/

		super.drawObjects(drawsDiffMs, imageOrAnimation, imageOrAnimationArmor, imageOrAnimationWeapon, isGameOver, invertSign, x, y, filter);
	}

}
Object.defineProperty(Collector, "name", { value: 'Collector', writable: false }); //fix production minification class names