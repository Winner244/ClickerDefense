import * as Tone from 'tone';

import {Helper} from '../helpers/Helper';

import {Draw} from '../gameSystems/Draw';

import {ImageHandler} from '../ImageHandler';

import {AudioSystem} from '../gameSystems/AudioSystem';
import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

import {Modifier} from '../modifiers/Modifier';

import {Monster} from '../monsters/Monster';

import {Buildings} from '../buildings/Buildings';
import {Building} from '../buildings/Building';

import Animation from '../../models/Animation';
import AnimationInfinite from '../../models/AnimationInfinite';
import ShopItem from '../../models/ShopItem';

import {AttackedObject} from '../../models/AttackedObject';

import {Unit} from './Unit';

import {Coin} from '../coins/Coin';
import {Coins} from '../coins/Coins';

import {WavesState} from '../gameSystems/WavesState';

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
import CollectorDefenseImage from '../../assets/img/units/collector/defense.png'; 
import CollectorDefenseStartImage from '../../assets/img/units/collector/defenseStart.png'; 
import CollectorJoyImage from '../../assets/img/units/collector/joy.png'; 


import WoodArmorImage from '../../assets/img/units/woodArmor.png'; 
import CollectorFallEndWoodArmorImage from '../../assets/img/units/collector/woodArmor/fallEnd.png'; 
import CollectorCollectWoodArmorImage from '../../assets/img/units/collector/woodArmor/collect.png'; 
import CollectorDefenseWoodArmorImage from '../../assets/img/units/collector/woodArmor/defense.png'; 
import CollectorDefenseStartWoodArmorImage from '../../assets/img/units/collector/woodArmor/defenseStart.png'; 
import CollectorPassiveWait1WoodArmorImage from '../../assets/img/units/collector/woodArmor/passiveWaiting.png'; 
import CollectorRunWoodArmorImage from '../../assets/img/units/collector/woodArmor/run.png'; 
import CollectorJoyWoodArmorImage from '../../assets/img/units/collector/woodArmor/joy.png'; 
import CollectorFallWoodArmorImage from '../../assets/img/units/collector/woodArmor/fall.png'; 

import VacuumImage from '../../assets/img/units/collector/vacuum/vacuum.png'; 
import CollectorCollectVacuumImage from '../../assets/img/units/collector/vacuum/collect.png'; 
import CollectorPassiveWaitingVacuumImage from '../../assets/img/units/collector/vacuum/passiveWaiting.png'; 
import CollectorRunVacuumImage from '../../assets/img/units/collector/vacuum/run.png'; 
import CollectorJoyVacuumImage from '../../assets/img/units/collector/vacuum/joy.png'; 
import CollectorFallEndVacuumImage from '../../assets/img/units/collector/vacuum/fallEnd.png'; 
import CollectorStartCollectingVacuumImage from '../../assets/img/units/collector/vacuum/startCollecting.png'; 
import CollectorDefenseVacuumImage from '../../assets/img/units/collector/vacuum/defense.png'; 
import CollectorDefenseStartVacuumImage from '../../assets/img/units/collector/vacuum/defenseStart.png'; 

import CollectorCollectVacuumWoodArmorImage from '../../assets/img/units/collector/vacuum/woodArmor/collect.png'; 
import CollectorStartCollectVacuumWoodArmorImage from '../../assets/img/units/collector/vacuum/woodArmor/startCollect.png'; 

import VacuumCarImage from '../../assets/img/units/collector/vacuumCar/vacuumCar.png'; 
import VacuumCarEndImage from '../../assets/img/units/collector/vacuumCar/vacuumCarEnd.png'; 
import CollectorImageForVacuumCarImage from '../../assets/img/units/collector/vacuumCar/image.png'; 
import CollectorPassiveWaitingVacuumCarImage from '../../assets/img/units/collector/vacuumCar/passiveWaiting.png'; 
import CollectorRunVacuumCarImage from '../../assets/img/units/collector/vacuumCar/run.png'; 
import CollectorStartActiveVacuumCarImage from '../../assets/img/units/collector/vacuumCar/startActive.png'; 
import CollectorJoyVacuumCarImage from '../../assets/img/units/collector/vacuumCar/joy.png'; 
import CollectorFallEndVacuumCarImage from '../../assets/img/units/collector/vacuumCar/fallEnd.png'; 

import CollectorWoodArmorFallEndVacuumCarImage from '../../assets/img/units/collector/vacuumCar/woodArmor/fallEnd.png'; 
import CollectorWoodArmorPassiveWaitingVacuumCarImage from '../../assets/img/units/collector/vacuumCar/woodArmor/passiveWaiting.png'; 
import CollectorWoodArmorStartActiveVacuumCarImage from '../../assets/img/units/collector/vacuumCar/woodArmor/startActive.png'; 
import CollectorWoodArmorRunVacuumCarImage from '../../assets/img/units/collector/vacuumCar/woodArmor/run.png'; 
import CollectorWoodArmorJoyVacuumCarImage from '../../assets/img/units/collector/vacuumCar/woodArmor/joy.png'; 

import shieldIcon from '../../assets/img/icons/shieldContrast.png';  
import speedIcon from '../../assets/img/icons/speed.png';  
import coinIcon from '../../assets/img/coin.png';  
import magnetIcon from '../../assets/img/icons/magnet.png';  
import magnetDistanceIcon from '../../assets/img/icons/magnet-distance.png';  

import SoundAttacked1 from '../../assets/sounds/units/miner/attacked1.mp3'; 
import SoundAttacked2 from '../../assets/sounds/units/miner/attacked2.mp3'; 
import SoundAttacked3 from '../../assets/sounds/units/miner/attacked3.mp3'; 

import SoundVacuumStart from '../../assets/sounds/units/collector/vacuumStart.mp3'; 
import SoundVacuum from '../../assets/sounds/units/collector/vacuum.mp3'; 
import SoundVacuumEnd from '../../assets/sounds/units/collector/vacuumEnd.mp3'; 


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
	private static readonly defenseImage: HTMLImageElement = new Image(); 
	private static readonly defenseStartImage: HTMLImageElement = new Image(); 
	private static readonly joyImage: HTMLImageElement = new Image(); 

	private static readonly weaponImage: HTMLImageElement = new Image();

	private static readonly initialSpeed: number = 30;

	static readonly shopItem: ShopItem = new ShopItem('Золотособиратель', Collector.shopImage, 50, 'Собирает монетки', ShopCategoryEnum.UNITS, 10);

	private _collectingAnimation: Animation; //анимация собирания монеток
	private _collectingArmorAnimation: Animation; //для апгрейда брони - анимация собирания монеток

	private _startCollectingVacuumAnimation: Animation; //анимация начала собирания монеток пылесосом
	private _startCollectingVacuumArmorAnimation: Animation; //для апгрейда брони - анимация начала собирания монеток пылесосом

	private _isCollecting: boolean; //Собирает монеты сейчас? 
	private _wasCollected: boolean; //Сбор уже состоялся за текущий цикл анимации collecting ?

	protected _goalCoin: Coin|null; //цель-монетка для сбора

	//активная защита
	private static readonly defensePercentage: number = 15; //сколько в процентах съедается урона активной защитой
	private static readonly defenseModifierName: string = 'Defense'; //имя модифатора защиты
	private static readonly defenseMinDurationMs: number = 1500; //минимальное время действия защиты - если никто больше не атакует

	private readonly defenseActivationAnimation: Animation; //анимация старта защиты
	private readonly defenseActivationArmorAnimation: Animation; //анимация старта защиты - для брони
	private readonly defenseActivationToolAnimation: Animation; //анимация старта защиты - для инструмента

	private readonly defenseAnimation: AnimationInfinite; //анимация защиты
	private readonly defenseArmorAnimation: AnimationInfinite; //анимация защиты - для брони
	private readonly defenseToolAnimation: AnimationInfinite; //анимация защиты - для инструмента

	private _isDefenseActivationStarted: boolean; //началась анимация защиты
	private _isDefenseActivated: boolean; //защита установлена
	private _isDefenseDeactivationStarted: boolean; //защита убирается

	private _isNewCoin: boolean; //новая монетка появилась?

	private _isHasVacuum: boolean; //прокачен до пылесоса? - это меняет логику сбора монет
	private _isVacuumCollectingStarted: boolean; //была ли начата анимация старта сбора?
	private _vacuumSound: Tone.Player|null; //звук пылесоса
	private _vacuumSoundEnd: Tone.Player|null; //звук пылесоса
	private static readonly VacuumRunStartDistance: number = 30;

	private _isHasVacuumCar: boolean; //прокачен до машины-пылесоса - это меняет логику сбора монет
	private _vacuumCarPower: number; //мощность машины всасывания (ускорение в пискелях придаваемое монете по оси x в сторону машины)
	private static readonly _vacuumCarPowerIncreasing: number = 1; //шаг приращение/прокачки мощности
	private _vacuumCarGravityDistance: number; //дальность притягивания монет машиной (в пикселях)
	private static readonly _vacuumCarGravityDistanceIncreasing: number = 50; //шаг приращение/прокачки дальности притягивания монет машиной
	private static readonly _vacuumCarGravityAngle: number = 65; //угол прямоугольного треугольника притяжения монет
	private _isDisplayDistanceVacuumCar: boolean; //рисовать дистанцию притяжения монет для машины-пылесоса? 
	
	private readonly empty: Animation;

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
			new Animation(8, 8 * 100, Collector.joyImage),  				    //joy animation
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
		this._collectingAnimation.leftTimeMs = 0;

		this._startCollectingVacuumAnimation = new Animation(4, 4 * 150);
		this._startCollectingVacuumArmorAnimation = new Animation(this._startCollectingVacuumAnimation.frames, this._startCollectingVacuumAnimation.durationMs); //пока апгрейда нету
		this._startCollectingVacuumAnimation.leftTimeMs = this._startCollectingVacuumArmorAnimation.leftTimeMs = 0;
		this.empty = new Animation(0, 0);

		this._isCollecting = true;
		this._wasCollected = false;
		this.isLeftSide = this.x < Buildings.flyEarth.centerX;
		this.isRunRight = true;
		this._goalCoin = null;
		this._shiftYWeaponInEarch = this.height / 2 - 10;

		this._isDefenseActivationStarted = false;
		this._isDefenseActivated = false;
		this._isDefenseDeactivationStarted = false;

		this.defenseActivationAnimation = new Animation(3, 300, Collector.defenseStartImage);
		this.defenseActivationArmorAnimation = new Animation(this.defenseActivationAnimation.frames, this.defenseActivationAnimation.durationMs);
		this.defenseActivationToolAnimation = new Animation(this.defenseActivationAnimation.frames, this.defenseActivationAnimation.durationMs);

		this.defenseAnimation = new AnimationInfinite(1, 1000, Collector.defenseImage);
		this.defenseArmorAnimation = new AnimationInfinite(this.defenseAnimation.frames, this.defenseAnimation.durationMs);
		this.defenseToolAnimation = new AnimationInfinite(this.defenseAnimation.frames, this.defenseAnimation.durationMs);

		this.shopItemName = Collector.shopItem.name;

		this._isNewCoin = false;
		this._isHasVacuum = false;
		this._isVacuumCollectingStarted = false;
		this._joyAnimation.leftTimeMs = 0;
		this._vacuumSound = null;
		this._vacuumSoundEnd = null;

		
		this._isHasVacuumCar = false;
		this._vacuumCarPower = Collector._vacuumCarPowerIncreasing;
		this._vacuumCarGravityDistance = Collector._vacuumCarGravityDistanceIncreasing * 3;
		this._isDisplayDistanceVacuumCar = false;

        Collector.init(true); //reserve init

		document.addEventListener(Coin.FALL_END_EVENT, this.fallEndEvent.bind(this));
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
			Collector.imageHandler.new(Collector.defenseImage).src = CollectorDefenseImage;
			Collector.imageHandler.new(Collector.defenseStartImage).src = CollectorDefenseStartImage;
			Collector.imageHandler.new(Collector.joyImage).src = CollectorJoyImage;
			Collector.imageHandler.new(Collector.weaponImage).src = WeaponImage;
		}
	}

	loadedResourcesAfterBuild(){
		super.loadedResourcesAfterBuild();

		this.infoItems = this.infoItems.filter(x => x.label != 'Защита');
		this.infoItems.splice(1, 0, new ParameterItem('Скорость', () => this.speed, speedIcon, 22, () => Collector.shopItem.price * 0.2, () => this.improveSpeed()));

		this.improvements.push(new Improvement('Деревянная броня', Collector.shopItem.price * 2, WoodArmorImage, () => this.improveToWoodArmor(), [
		 	new ImprovementParameterItem(`+`, shieldIcon)
		]));

		this.improvements.push(new Improvement('Пылесос', Collector.shopItem.price * 0.8, VacuumImage, () => this.improveToVacuum(), [
			new ImprovementParameterItem(`+ авто сбор `, coinIcon)
		]));

		this.improvements.push(new Improvement('Пылесос-машина', Collector.shopItem.price * 0.8, VacuumCarImage, () => this.improveToVacuumCar(), [
			new ImprovementParameterItem(`+++ авто сбор `, coinIcon)
		], true));
	}

	improveToWoodArmor(){
		this.defense += 1;
		this.defenseActivationArmorAnimation.image.src = CollectorDefenseStartWoodArmorImage;
		this.defenseArmorAnimation.image.src = CollectorDefenseWoodArmorImage;
		this._passiveWaitingArmorAnimation.image.src = CollectorPassiveWait1WoodArmorImage;
		this._startActiveWaitingArmorAnimation.image.src = CollectorPassiveWait1WoodArmorImage;
		this._activeWaitingArmorAnimation.image.src = CollectorPassiveWait1WoodArmorImage;
		this._fallEndArmorAnimation.image.src = CollectorFallEndWoodArmorImage;
		this._runArmorAnimation.image.src = CollectorRunWoodArmorImage;
		this._joyArmorAnimation.image.src = CollectorJoyWoodArmorImage;
		this._fallArmorImage.src = CollectorFallWoodArmorImage;

		if(this._isHasVacuum){
			this.improveVacuumToWoodArmor();
		}
		else if(this._isHasVacuumCar){
			this.improveVacuumCarToWoodArmor();
		}
		else{
			this._collectingArmorAnimation.image.src = CollectorCollectWoodArmorImage;
		}

		let t = this.improvements.find(x => x.label == 'Деревянная броня');
		if(t) t.isImproved = true;
	}

	improveToVacuum(){
		this._isHasVacuum = true;

		this.imageWeapon = new Image();
		this.imageWeapon.src = VacuumImage;
		this._rotateWeaponInEarch = -25;
		this._weaponRotateInAir = 190;
		this._shiftYWeaponInEarch = 5;

		if(this.improvements.find(x => x.label == 'Деревянная броня')?.isImproved){
			this.improveVacuumToWoodArmor();
		}
		this._collectingAnimation = new Animation(4, 4 * 150);
		this._collectingAnimation.image.src = CollectorCollectVacuumImage;
		this._collectingAnimation.leftTimeMs = 
		this._collectingArmorAnimation.leftTimeMs = 
		this._startCollectingVacuumAnimation.leftTimeMs = 
		this._startCollectingVacuumArmorAnimation.leftTimeMs = 0;
		this._passiveWaitingWeaponAnimation.image.src = CollectorPassiveWaitingVacuumImage;
		this._startActiveWaitingWeaponAnimation.image.src = CollectorPassiveWaitingVacuumImage;
		this._activeWaitingWeaponAnimation.image.src = CollectorPassiveWaitingVacuumImage;
		this._startCollectingVacuumAnimation.image.src = CollectorStartCollectingVacuumImage;
		this._fallEndWeaponAnimation.image.src = CollectorFallEndVacuumImage;
		this._runWeaponAnimation.image.src = CollectorRunVacuumImage;
		this._joyWeaponAnimation.image.src = CollectorJoyVacuumImage;
		this.defenseToolAnimation.image.src = CollectorDefenseVacuumImage;
		this.defenseActivationToolAnimation.image.src = CollectorDefenseStartVacuumImage;

		this.improveSpeedOfVacuum();

		AudioSystem.load(SoundVacuumStart);
		AudioSystem.load(SoundVacuum);
		AudioSystem.load(SoundVacuumEnd);

		let t = this.improvements.find(x => x.label == 'Пылесос'); 
		if(t) t.isImproved = true;
	}

	improveVacuumToWoodArmor(){
		this._collectingArmorAnimation = new Animation(4, 4 * 150);
		this._collectingArmorAnimation.image.src = CollectorCollectVacuumWoodArmorImage;
		this._startCollectingVacuumArmorAnimation.image.src = CollectorStartCollectVacuumWoodArmorImage;

		this._collectingAnimation.leftTimeMs = 
		this._collectingArmorAnimation.leftTimeMs =
		this._startCollectingVacuumAnimation.leftTimeMs = 
		this._startCollectingVacuumArmorAnimation.leftTimeMs = 0;
	}

	improveToVacuumCar(){
		this._isHasVacuumCar = true;
		this._isHasVacuum = false;

		this.imageWeapon = new Image();
		this.imageWeapon.src = VacuumCarEndImage;
		this._rotateWeaponInEarch = 90;
		this._weaponRotateInAir = 0;
		this._shiftYWeaponInEarch = 40;

		this._passiveWaitingAnimation = new AnimationInfinite(4, 4 * 500);
		this._passiveWaitingAnimation.image.src = CollectorPassiveWaitingVacuumCarImage;
		this._passiveWaitingWeaponAnimation = new AnimationInfinite(this._passiveWaitingAnimation.frames, this._passiveWaitingAnimation.initialDurationMs);
		this._passiveWaitingArmorAnimation = new AnimationInfinite(this._passiveWaitingAnimation.frames, this._passiveWaitingAnimation.initialDurationMs);

		this._startActiveWaitingAnimation = new Animation(3, 3 * 200);
		this._startActiveWaitingAnimation.image.src = CollectorStartActiveVacuumCarImage;
		this._startActiveWaitingArmorAnimation = new Animation(this._startActiveWaitingAnimation.frames, this._startActiveWaitingAnimation.initialDurationMs);
		this._startActiveWaitingWeaponAnimation = new Animation(this._startActiveWaitingAnimation.frames, this._startActiveWaitingAnimation.initialDurationMs);
		
		this._runAnimation = new AnimationInfinite(1, 1000);
		this._runAnimation.image.src = CollectorRunVacuumCarImage;
		this._runArmorAnimation = new AnimationInfinite(this._runAnimation.frames, this._runAnimation.initialDurationMs);
		this._runWeaponAnimation = new AnimationInfinite(this._runAnimation.frames, this._runAnimation.initialDurationMs);

		this._activeWaitingAnimation = new AnimationInfinite(this._runAnimation.frames, this._runAnimation.initialDurationMs);
		this._activeWaitingAnimation.image.src = CollectorRunVacuumCarImage;
		this._activeWaitingWeaponAnimation = new AnimationInfinite(this._runAnimation.frames, this._runAnimation.initialDurationMs);
		this._activeWaitingArmorAnimation = new AnimationInfinite(this._runAnimation.frames, this._runAnimation.initialDurationMs);

		this._collectingAnimation = new Animation(this._runAnimation.frames, this._runAnimation.initialDurationMs);
		this._collectingAnimation.image.src = CollectorRunVacuumCarImage;
		this._collectingArmorAnimation = new Animation(this._runAnimation.frames, this._runAnimation.initialDurationMs);
		this._collectingAnimation.leftTimeMs = 
		this._collectingArmorAnimation.leftTimeMs = 0;

		this._joyAnimation.image.src = CollectorJoyVacuumCarImage;
		this._joyWeaponAnimation.image.src = '';
		this._joyArmorAnimation.image.src = '';

		this._fallEndAnimation.image.src = CollectorFallEndVacuumCarImage;
		this._fallEndWeaponAnimation.image.src = '';
		this._fallEndArmorAnimation.image.src = '';
		
		if(this.improvements.find(x => x.label == 'Деревянная броня')?.isImproved){
			this.improveVacuumCarToWoodArmor();
		}

		//update height/width, Y
		let oldheight = this.height;
		this.image = new Image();
		this.image.src = CollectorImageForVacuumCarImage;
		this.image.onload = (ev: Event) => {
			this.y -= this.height - oldheight;
			this._isFall = true;
		};

		this.speed += 15;

		AudioSystem.load(SoundVacuumStart);
		AudioSystem.load(SoundVacuum);
		AudioSystem.load(SoundVacuumEnd);
		
		this.infoItems.push(new ParameterItem('Сила магнита', () => this._vacuumCarPower, magnetIcon, 12, () => this.price / 2, () => this._vacuumCarPower += Collector._vacuumCarPowerIncreasing));
		this.infoItems.push(new ParameterItem('Дальность магнита', () => this._vacuumCarGravityDistance, magnetDistanceIcon, 24, () => this.price / 2, () => this._vacuumCarGravityDistance += Collector._vacuumCarGravityDistanceIncreasing, 
			this.displayDistanceVacuumCar.bind(this), this.hideDistanceVacuumCar.bind(this)));

		let t = this.improvements.find(x => x.label == 'Пылесос-машина'); 
		if(t) t.isImproved = true;
	}

	improveVacuumCarToWoodArmor(){
		this._fallEndArmorAnimation.image.src = CollectorWoodArmorFallEndVacuumCarImage;

		this._passiveWaitingArmorAnimation = new AnimationInfinite(this._passiveWaitingAnimation.frames, this._passiveWaitingAnimation.initialDurationMs);
		this._passiveWaitingArmorAnimation.image.src = CollectorWoodArmorPassiveWaitingVacuumCarImage;

		this._startActiveWaitingArmorAnimation = new Animation(this._startActiveWaitingAnimation.frames, this._startActiveWaitingAnimation.initialDurationMs);
		this._startActiveWaitingArmorAnimation.image.src = CollectorWoodArmorStartActiveVacuumCarImage;

		this._runArmorAnimation = new AnimationInfinite(this._runAnimation.frames, this._runAnimation.initialDurationMs);
		this._runArmorAnimation.image.src = CollectorWoodArmorRunVacuumCarImage;

		this._activeWaitingArmorAnimation = new AnimationInfinite(this._runAnimation.frames, this._runAnimation.initialDurationMs);
		this._activeWaitingArmorAnimation.image.src = CollectorWoodArmorRunVacuumCarImage;

		this._collectingArmorAnimation = new Animation(this._runAnimation.frames, this._runAnimation.initialDurationMs);
		this._collectingArmorAnimation.image.src = CollectorWoodArmorRunVacuumCarImage;
		this._collectingAnimation.leftTimeMs = 
		this._collectingArmorAnimation.leftTimeMs = 0;

		this._joyArmorAnimation.image.src = CollectorWoodArmorJoyVacuumCarImage;
	}

	displayDistanceVacuumCar(){
		this._isDisplayDistanceVacuumCar = true;
	}

	hideDistanceVacuumCar(){
		this._isDisplayDistanceVacuumCar = false;
	}

	improveSpeed(){
		this.speed += 10;

		let newDurationCollecting = Collector.initialSpeed / this.speed * this._collectingAnimation.initialDurationMs;
		this._collectingAnimation.changeDuration(newDurationCollecting);
		this._collectingArmorAnimation.changeDuration(newDurationCollecting);

		let newDurationRun = Collector.initialSpeed / this.speed * this._runAnimation.initialDurationMs;
		this._runAnimation.changeDuration(newDurationRun);
		this._runArmorAnimation.changeDuration(newDurationRun);
		this._runWeaponAnimation.changeDuration(newDurationRun);

		this.improveSpeedOfVacuum();
	}

	improveSpeedOfVacuum(){
		let newDurationCollecting = Collector.initialSpeed / this.speed * this._collectingAnimation.initialDurationMs;
		this._collectingAnimation.changeDuration(newDurationCollecting);
		this._collectingArmorAnimation.changeDuration(newDurationCollecting);
		
		let newDurationStartCollecting = Collector.initialSpeed / this.speed * this._startCollectingVacuumAnimation.initialDurationMs;
		this._startCollectingVacuumAnimation.changeDuration(newDurationStartCollecting);
		this._startCollectingVacuumArmorAnimation.changeDuration(newDurationStartCollecting);
	}

	recovery(): boolean{
		let oldHealth = this._health;
		let result = super.recovery();
		if(result && oldHealth <= 0){
			this._isCollecting = true;
			this.isLeftSide = this.x < Buildings.flyEarth.centerX;
			this._isDefenseActivationStarted = false;
			this._isDefenseActivated = false;
			this._isDefenseDeactivationStarted = false;
		}

		return result;
	}

	fallEndEvent(){
		this._isNewCoin = true;
	}

	getCoinDistance(): number{
		if(this._goalCoin){
			let shift = this._isHasVacuum ? 5 : this.width / 5;
			let isLeftMoving = this._goalCoin.centerX < this.centerX;
			let distance = isLeftMoving 
				? this.x - (this._goalCoin.centerX - shift)
				: (this._goalCoin.centerX + shift) - (this.x + this.width);
			return distance;
		}

		return 0;
	}

	startVacuumSound(){
		if(this._vacuumSoundEnd){
			this._vacuumSoundEnd.stop();
		}

		AudioSystem.play(this.centerX, SoundVacuumStart, -15, 1, false, true, 0, 0, false, false, (source: Tone.Player) => {
			if(this._startCollectingVacuumAnimation.leftTimeMs > 0 || this._collectingAnimation.leftTimeMs > 0 || this._isHasVacuumCar){
				this.playVacuumSound(true);
			}
			else{
				this.endVacuumSound();
			}
			return false;
		}).then(source => this._vacuumSound = source);
	}

	endVacuumSound(){
		this._vacuumSound = null;
		AudioSystem.play(this.centerX, SoundVacuumEnd, -15, 1, false, true, 0, 0.3, false, false, (source: Tone.Player) => {
			this._vacuumSoundEnd = null;
			return false;
		}).then(source => this._vacuumSoundEnd = source);
	}

	playVacuumSound(isForce: boolean = false){
		if(!this._vacuumSound){
			this.startVacuumSound();
			return;
		}

		if(!isForce){
			return;
		}

		AudioSystem.play(this.centerX, SoundVacuum, -15, 1, false, true, 0, 0.3, false, true, (source: Tone.Player) => {
			if(this._goalCoin){
				if(this._isHasVacuumCar){
					return true;
				}
	
				if(this._isHasVacuum){
					let coinDistance = this.getCoinDistance();
					if (coinDistance < Collector.VacuumRunStartDistance){
						return true;
					}
				}
			}

			this.endVacuumSound();
			return false;
		}).then(source => this._vacuumSound = source);

	}

	logicMoving(drawsDiffMs: number, speed: number){
		this.isRun = false;

		if (this._isDefenseActivationStarted || this._isDefenseActivated || this._isDefenseDeactivationStarted){
			return;  //игнорируем логику движения
		}

		if (this._fallEndAnimation.leftTimeMs > 0){
			return;
		}

		if (this._joyAnimation.leftTimeMs > 0){
			return;
		}

		if (this._collectingAnimation.leftTimeMs > 0 && !this._isHasVacuum && !this._isHasVacuumCar){
			return;
		}

		if(this._isCollecting){ //период сбора монет
			if(this._goalCoin){ //есть цель монетка и сбор предыдущей уже окончен
				if(this._isHasVacuumCar){
					this.playVacuumSound();
				}

				if(this._isHasVacuum){
					let coinDistance = this.getCoinDistance();
					if (coinDistance < Collector.VacuumRunStartDistance){
						this.isRun = false; //to display collectingAnimation

						if(!this._isVacuumCollectingStarted){
							this._startCollectingVacuumAnimation.restart();
							this._startCollectingVacuumArmorAnimation.restart();
							this._isVacuumCollectingStarted = true;
							this._collectingAnimation.restart();
							this._collectingArmorAnimation.restart();
						}
						else if (this._startCollectingVacuumAnimation.leftTimeMs > 0){
							//nothing do - waiting
							return;
						}

						if(this._collectingAnimation.leftTimeMs <= 0){
							this._collectingAnimation.restart();
							this._collectingArmorAnimation.restart();
						}

						this.playVacuumSound();
					}
					else{
						this.isRun = true;
					}
				}
				
				let shift = this._isHasVacuum ? 5 : this.width / 5;
				let isLeftMoving = this._goalCoin.centerX < this.centerX;
				let isArrived = isLeftMoving 
					? this.x <= this._goalCoin.centerX - shift
					: this.x + this.width >= this._goalCoin.centerX + shift;

				if (isArrived) { //дошёл
					if(this._isHasVacuum || this._isHasVacuumCar){
						this.collectCoin();
					}
					else{
						this._collectingAnimation.restart();
						this._collectingArmorAnimation.restart();
					}
					return;
				}
				else{ //ещё не дошёл
					if(!this._isHasVacuum){
						this.isRun = true;
					}
					if(isLeftMoving)
						this.x -= speed;
					else 
						this.x += speed;
					return;
				}
			}
		}
		else {
			if(!this._isHasVacuum){
				this.isRun = true;
			}
			if(this.isRunRight){
				this.x += speed;
			}
			else{
				this.x -= speed;
			}

			this.isLeftSide = this.x < Buildings.flyEarth.centerX;
			return;
		}

		super.logicMoving(drawsDiffMs, speed);
	}

	collectCoin(){
		if(this._goalCoin && (!this._isHasVacuum || this._startCollectingVacuumAnimation.leftTimeMs <= 0)){
			let i = Coins.all.indexOf(this._goalCoin);
			Coins.collect(i, this._goalCoin.centerX, this._goalCoin.centerY);
			this._goalCoin = null;
			this._wasCollected = true;
		}
	}

	getCLoserMonsters(monsters: Monster[]){
		let closerMonsters = monsters.filter(x => Math.abs(this.centerX - x.centerX) < this.width * 1.5);
		return closerMonsters;
	}

	clear(){
		this._goalCoin = null;
		this._isVacuumCollectingStarted = false;
		this._wasCollected = false;
		this._startCollectingVacuumAnimation.leftTimeMs = 0;
		this._collectingAnimation.leftTimeMs = 0;
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logic(drawsDiffMs, buildings, monsters, units, bottomShiftBorder);
		

		//end 
		if(this._isDisplayWeaponInEarch && !this._isHasVacuum && !this._isHasVacuumCar){
			this.clear();
			this.imageWeapon = Collector.weaponImage;
			return;
		}

		if(this.health <= 0){
			this.clear();
			return;
		}

		//создание защиты
		if(this._isDefenseActivationStarted){
			let defenseModifier = this.modifiers.find(x => x.name == Collector.defenseModifierName);
			if(this.defenseActivationAnimation.leftTimeMs <= 0) {
				this._isDefenseActivated = true;
				this._isDefenseActivationStarted = false;
				this.defenseAnimation.restart();
				this.defenseArmorAnimation.restart();
				this.defenseToolAnimation.restart();
				if(!defenseModifier){
					this.addModifier(new Modifier(Collector.defenseModifierName, 0, -Collector.defensePercentage / 100, 0, 0, 0, Collector.defenseMinDurationMs));
				}
			}
			else if(this.defenseActivationAnimation.leftTimeMs <= 100 && !defenseModifier){
				this.addModifier(new Modifier(Collector.defenseModifierName, 0, -Collector.defensePercentage / 100, 0, 0, 0, Collector.defenseMinDurationMs));
			}

			return;
		}

		//удержание защиты
		if(this._isDefenseActivated){
			let closerMonsters = this.getCLoserMonsters(monsters);
			let leftMonster = closerMonsters.find(x => x.isLand && x.isLeftSide);
			let rightMonster = closerMonsters.find(x => x.isLand && !x.isLeftSide);

			let defenseModifier = this.modifiers.find(x => x.name == Collector.defenseModifierName);
			if(!defenseModifier || !leftMonster || !rightMonster){
				this._isDefenseActivated = false;
				this._isDefenseDeactivationStarted = true;
				this.defenseActivationAnimation.restart();
				this.defenseActivationArmorAnimation.restart();
				this.defenseActivationToolAnimation.restart();

				if(leftMonster){
					this.isRunRight = true;
				}
				else if(rightMonster){
					this.isRunRight = false;
				}
			}

			return;
		}

		//убираем защиту
		if(this._isDefenseDeactivationStarted){
			if(this.defenseActivationAnimation.leftTimeMs <= 0){
				this._isDefenseDeactivationStarted = false;
			}

			return; 
		}

		//монетка исчезла
		if(this._goalCoin && this._goalCoin.lifeTimeLeftMs <= 0){
			this.isRun = false;
			this.clear();
		}

		//игра пошла
		if(WavesState.isWaveStarted && WavesState.delayStartLeftTimeMs <= 0 || Coins.all.length){

			//логика всасывания монет машиной-пылесосом
			if(this._isHasVacuumCar){
				if(this._isDisplayDistanceVacuumCar){
					this._isDisplayDistanceVacuumCar = false;
				}

				for(let coin of Coins.all){
				    //авто сбор монет упавших на машину
					if (coin.centerX > this.x && coin.centerX < this.x + this.width && coin.centerY > this.centerY){
						let i = Coins.all.indexOf(coin);
						Coins.collect(i, coin.centerX, coin.centerY);
					}
					else {
						//притягиваем пропорционально расстоянию и по геометрической форме треугольника
						let yStart = this.y + this.height;
						let xStart = this.isRunRight ? this.x : this.x + this.width;
						let height = -this._vacuumCarGravityDistance / Math.tan((Collector._vacuumCarGravityAngle * Math.PI) / 180);
						let width = (this.isRunRight ? 1 : -1) * this._vacuumCarGravityDistance;
						let isGravity = Helper.IsTriangleContainsPoint(coin.centerX, coin.centerY, 
							xStart, yStart, 
							xStart + width, yStart,
							xStart + width, yStart + height)
						if(isGravity){
							let sign = Math.sign(this.centerX - coin.centerX);
							coin.impulseX += sign * Math.abs(this.centerX + (-1 * sign * this._vacuumCarGravityDistance) - coin.centerX) / 1000 * this._vacuumCarPower;
							coin.impulseY /= this._vacuumCarPower;
						}
					}
				}
			}
			
			if(this._isCollecting){ //период сбора монеток

				//сбор монетки
				if(this._collectingAnimation.leftTimeMs > 0 && !this._isHasVacuum && !this._isHasVacuumCar){
					if(this._collectingAnimation.leftTimeMs < this._collectingAnimation.durationMs * 0.45){
						if(!this._wasCollected && this._goalCoin){
							this.collectCoin();
							this._wasCollected = true;
						}
					}
					else{
						this._wasCollected = false;
						if(!this._goalCoin){
							this._collectingAnimation.leftTimeMs = this._collectingArmorAnimation.leftTimeMs = 0;
						}
					}
					return;
				}

				//выбираем новую или более ближнюю монету
				if (!this._goalCoin || this._isNewCoin){ 
					let coins = this._isHasVacuumCar 
						? Coins.all.filter(x => x.centerY > this.y)
						: Coins.all.filter(x => x.impulseY == 0 && x.lifeTimeLeftMs > 0);

					//монетку не должен загораживать монстр
					let leftMonsters = sortBy(monsters.filter(x => x.isLand && x.isLeftSide), x => x.centerX);
					let rightMonsters = sortBy(monsters.filter(x => x.isLand && !x.isLeftSide), x => x.centerX);

					if(leftMonsters.length){
						let closerMonsterLeft = leftMonsters[leftMonsters.length - 1];
						coins = coins.filter(x => x.x > closerMonsterLeft.x + closerMonsterLeft.width);
					}

					if(rightMonsters.length){
						let closerMonsterRight = rightMonsters[0];
						coins = coins.filter(x => x.x < closerMonsterRight.x);
					}

					let sameUnits = units.filter(x => x.name == this.name && x.health > 0);
					if(sameUnits.length > 1){
						let widthOfPart = Buildings.flyEarth.width / sameUnits.length;
						let filteredCoins = coins.filter(x => Math.abs(this.centerX - x.centerX) < widthOfPart && Math.abs(this.goalX - x.centerX) < widthOfPart);
						if(!this._goalCoin && !filteredCoins.length && coins.length){
							coins = coins.filter(x => Math.abs(this.goalX - x.centerX) < widthOfPart);
						}
						else{
							coins = filteredCoins;
						}
					}

					if(coins.length && (!this._goalCoin || coins.length > 1)){
						if(sameUnits.length > 1){
							this._goalCoin = sortBy(coins, x => Math.abs(this.centerX - x.centerX) + Math.abs(x.centerX - this.goalX))[0];
						}
						else{
							if(this._isHasVacuumCar){
								var coinsOnTheOneSide = coins.filter(coin => this.isRunRight ? coin.centerX > this.centerX : coin.centerX < this.centerX);
								if (coinsOnTheOneSide.length){
									this._goalCoin = sortBy(coinsOnTheOneSide, x => Math.abs(this.centerX - x.centerX))[coinsOnTheOneSide.length - 1];
								}
								else{
									this._goalCoin = sortBy(coins, x => Math.abs(this.centerX - x.centerX))[coins.length - 1];
								}
							}
							else{
								this._goalCoin = sortBy(coins, x => Math.abs(this.centerX - x.centerX))[0];
							}
						}
						this.isRunRight = this._goalCoin.centerX > this.centerX;
					}
					else if ((!this._goalCoin || this.getCoinDistance() > Collector.VacuumRunStartDistance) && this._isHasVacuum && this._wasCollected){
						this._isVacuumCollectingStarted = false;
						this._wasCollected = false;
						this._startCollectingVacuumAnimation.restart();
						this._startCollectingVacuumArmorAnimation.restart();
						this._collectingAnimation.leftTimeMs = 0;
						this._collectingArmorAnimation.leftTimeMs = 0;
					}
					this._isNewCoin = false;

					//следим за монстрами - пора ли убегать? 
					if(!this._goalCoin && monsters.length){
						let closerMonsters = this.getCLoserMonsters(monsters);
						let leftMonster = closerMonsters.find(x => x.isLand && x.isLeftSide);
						let rightMonster = closerMonsters.find(x => x.isLand && !x.isLeftSide);
	
						if(leftMonster && rightMonster){
							this.activateDefense();
						}
						else if(leftMonster){
							this._isCollecting = false;
							this._startCollectingVacuumAnimation.leftTimeMs = 0;
							this._startCollectingVacuumArmorAnimation.leftTimeMs = 0;
							this.isRunRight = leftMonster.isLeftSide;
						}
						else if(rightMonster){
							this._isCollecting = false;
							this._startCollectingVacuumAnimation.leftTimeMs = 0;
							this._startCollectingVacuumArmorAnimation.leftTimeMs = 0;
							this.isRunRight = rightMonster.isLeftSide;
						}
					}
				}
				
			}
			else{ //убегать от нападения 
				//logic in logicMoving

				let closerMonsters = this.getCLoserMonsters(monsters);
				let leftMonster = closerMonsters.find(x => x.isLand && x.isLeftSide);
				let rightMonster = closerMonsters.find(x => x.isLand && !x.isLeftSide);

				//рядом больше нет монстров
				if (!leftMonster && !rightMonster){
					this._isCollecting = true;
				}
				else if(leftMonster && rightMonster){
					this.activateDefense();
				}
				else if(this._isHasVacuumCar){
					//отталкиваем монстров от кнута :D
					if(this.centerX > Buildings.flyEarth.x + Buildings.flyEarth.width){
						this.isRunRight = false;
					}
					else if(this.centerX < Buildings.flyEarth.x){
						this.isRunRight = true;
					}
				}
			}
		}
		else if(WavesState.isWaveEnded){
			this._collectingAnimation.leftTimeMs = this._collectingArmorAnimation.leftTimeMs = 0;
			this.clear();
		}
	}

	activateDefense(){
		if(!this._isDefenseActivationStarted && !this._isDefenseActivated && !this._isHasVacuumCar){
			this._isDefenseActivationStarted = true;
			this._isDefenseDeactivationStarted = false;
			this._isDefenseActivated = false;
			this.defenseActivationAnimation.restart();
			this.defenseActivationArmorAnimation.restart();
			this.defenseActivationToolAnimation.restart();
		}
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null, attackingObject: AttackedObject|null = null): number{
		damage = super.applyDamage(damage, x, y);
		if(damage > 0){
			AudioSystem.playRandom(this.centerX, [SoundAttacked1, SoundAttacked2, SoundAttacked3], [-1, -1, -1, -1], false, 1, true);
			this._collectingAnimation.leftTimeMs = this._collectingArmorAnimation.leftTimeMs = 0;

			if(this.health <= 0){
				if(this._isHasVacuumCar){
					this._isDisplayWeaponInAir = false;
					this._isDisplayWeaponInEarch = true;
					this._impulseY = 0;
					this.y += this._shiftYWeaponInEarch;
				}
				else if(this._isHasVacuum){
					this._wasCollected = false;
					this._isVacuumCollectingStarted = false;
					//ignore next logic
				}
				else if(damage >= this.healthMax){
					let offCanvas = new OffscreenCanvas(Collector.fallImage.width, Collector.fallImage.height);
					let offContext = offCanvas.getContext('2d');
					if (offContext){
						offContext.drawImage(this._fallImage, 0, 0, Collector.fallImage.width, Collector.fallImage.height);
						offContext.drawImage(this._fallArmorImage, 0, 0, Collector.fallImage.width, Collector.fallImage.height);
					}

					this.imageWeapon = offCanvas;
					this._weaponRotateInAir = 0;
				}
				else{
					this.imageWeapon = Collector.weaponImage;
					this._weaponRotateInAir = 180;
				}
				return damage;
			}
			
		}

		//если защита активна и снова атакуют - продлеваем защиту
		if(this._isDefenseActivated){
			let modifier = this.modifiers.find(x => x.name == Collector.defenseModifierName);
			if(modifier){
				modifier.lifeTimeMs = Collector.defenseMinDurationMs;
			}
		}

		//убегаем от урона - даже если его нету
		if(this._isCollecting && !WavesState.isWaveEnded){
			this.isRunRight = (x || 0) < this.centerX;
			this._isCollecting = false;
			this._startCollectingVacuumAnimation.leftTimeMs = 0;
			this._startCollectingVacuumArmorAnimation.leftTimeMs = 0;
			this._collectingAnimation.leftTimeMs = this._collectingArmorAnimation.leftTimeMs = 0;
		}

		return damage;
	}
	

	drawObjects(drawsDiffMs: number, 
		imageOrAnimation: AnimationInfinite|Animation|HTMLImageElement, 
		imageOrAnimationArmor: AnimationInfinite|Animation|HTMLImageElement, 
		imageOrAnimationWeapon: AnimationInfinite|Animation|HTMLImageElement, 
		isGameOver: boolean, 
		invertSign: number = 1, 
		x: number|null = null, 
		y: number|null = null, 
		filter: string|null = null,
		isInvertAnimation: boolean = false)
	{
		//display radius attack
		if(this._isHasVacuumCar && this._isDisplayDistanceVacuumCar){
			Draw.ctx.beginPath();

			let yStart = this.y + this.height;
			let xStart = this.x;
			let height = -this._vacuumCarGravityDistance / Math.tan((Collector._vacuumCarGravityAngle * Math.PI) / 180);
			let width = this._vacuumCarGravityDistance;

            Draw.ctx.moveTo(xStart, yStart);
            Draw.ctx.lineTo(xStart + width, yStart);
            Draw.ctx.lineTo(xStart + width, yStart + height);
            Draw.ctx.lineTo(xStart, yStart);
			Draw.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
			Draw.ctx.fill();
			Draw.ctx.lineWidth = 2;
			Draw.ctx.strokeStyle = 'rgb(0, 255, 0)';
			Draw.ctx.stroke();
		}

		if (this._isFall || this._fallEndAnimation.leftTimeMs > 0)
		{
			imageOrAnimation = this._fallEndAnimation;
			imageOrAnimationArmor = this._fallEndArmorAnimation;
			imageOrAnimationWeapon = this._fallEndWeaponAnimation;
		}
		else if (this._isDefenseActivated){
			imageOrAnimation = this.defenseAnimation;
			imageOrAnimationArmor = this.defenseArmorAnimation;
			imageOrAnimationWeapon = this.defenseToolAnimation;
		}
		else if (this._isDefenseActivationStarted){
			imageOrAnimation = this.defenseActivationAnimation;
			imageOrAnimationArmor = this.defenseActivationArmorAnimation;
			imageOrAnimationWeapon = this.defenseActivationToolAnimation;
		}
		else if (this._isDefenseDeactivationStarted){
			imageOrAnimation = this.defenseActivationAnimation;
			imageOrAnimationArmor = this.defenseActivationArmorAnimation;
			imageOrAnimationWeapon = this.defenseActivationToolAnimation;
			isInvertAnimation = true;
		}
		else if (this._joyAnimation.leftTimeMs > 0){
			this._startCollectingVacuumAnimation.restart();
			this._startCollectingVacuumArmorAnimation.restart();
			imageOrAnimation = this._joyAnimation;
			imageOrAnimationArmor = this._joyArmorAnimation;
			imageOrAnimationWeapon = this._joyWeaponAnimation;
		}
		else if(this._isHasVacuum && this._isCollecting && this._startCollectingVacuumAnimation.leftTimeMs > 0){
			if (this._collectingAnimation.leftTimeMs <= 0){
				isInvertAnimation = true;
			}
			imageOrAnimation = this._startCollectingVacuumAnimation;
			imageOrAnimationArmor = this._startCollectingVacuumArmorAnimation;
			imageOrAnimationWeapon = this.empty;
		}
		else if(this._isCollecting && this._collectingAnimation.leftTimeMs > 0){
			imageOrAnimation = this._collectingAnimation;
			imageOrAnimationArmor = this._collectingArmorAnimation;
			imageOrAnimationWeapon = this.empty;
		}
		else if(this._goalCoin && this._goalCoin.lifeTimeLeftMs > 0 || !this._isCollecting || this._isHasVacuumCar && WavesState.isWaveStarted){
			imageOrAnimation = this._runAnimation;
			imageOrAnimationArmor = this._runArmorAnimation;
			imageOrAnimationWeapon = this._runWeaponAnimation;
		}
		else{
			imageOrAnimation = this._passiveWaitingAnimation;
			imageOrAnimationArmor = this._passiveWaitingArmorAnimation;
			imageOrAnimationWeapon = this._passiveWaitingWeaponAnimation;
		}

		//переопределяем логику отрисовки при окончании волны с монетами - что бы собирать их
		if(!WavesState.isWaveStarted && Coins.all.length){
			super.drawObjectBase(drawsDiffMs, imageOrAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObjectBase(drawsDiffMs, imageOrAnimationArmor, isGameOver, invertSign, x, y, filter, isInvertAnimation);
			super.drawObjectBase(drawsDiffMs, imageOrAnimationWeapon, isGameOver, invertSign, x, y, filter, isInvertAnimation);
		}
		else{
			super.drawObjects(drawsDiffMs, imageOrAnimation, imageOrAnimationArmor, imageOrAnimationWeapon, isGameOver, invertSign, x, y, filter, isInvertAnimation);
		}
	}

}
Object.defineProperty(Collector, "name", { value: 'Collector', writable: false }); //fix production minification class names