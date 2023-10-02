import {ImageHandler} from '../ImageHandler';

import {AudioSystem} from '../gameSystems/AudioSystem';
import {Draw} from '../gameSystems/Draw';

import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

import {Monster} from '../monsters/Monster';

import {Buildings} from '../buildings/Buildings';
import {Building} from '../buildings/Building';

import Animation from '../../models/Animation';
import ShopItem from '../../models/ShopItem';

import {Helper} from '../helpers/Helper';

import {Unit} from './Unit';

import MinerFallImage from '../../assets/img/units/miner/fall.png'; 
import MinerFallEndImage from '../../assets/img/units/miner/fallEnd.png'; 
import MinerWait1Image from '../../assets/img/units/miner/wait1.png'; 

//import SoundAttacked1 from '../../assets/sounds/units/miner/attacked1.mp3'; 


/** Шахтёр - тип юнитов пользователя */
export class Miner extends Unit{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly wait1Image: HTMLImageElement = new Image();
	private static readonly fallImage: HTMLImageElement = new Image();
	private static readonly fallEndImage: HTMLImageElement = new Image(); 

	static readonly shopItem: ShopItem = new ShopItem('Золотодобытчик', Miner.wait1Image, 50, 'Добывает монетки', ShopCategoryEnum.UNITS);

	public goalY: number;

	private readonly _fallEndAnimation: Animation;
	private _isFall: boolean;

	constructor(x: number, y: number) {
		super(x, y, 3, Miner.wait1Image, Miner.name, Miner.imageHandler, 0, 0, Miner.shopItem.price, false); 

		this._fallEndAnimation = new Animation(31, 31 * 75, Miner.fallEndImage);

		this._isFall = false;
		this.isLeftSide = false;

		
		const flyEarth = Buildings.flyEarth;
		const yTop = flyEarth.centerY - (flyEarth.width - Math.abs(flyEarth.centerX - this.x - this.width / 2)) / 6 + 32;
		const yBottom = flyEarth.centerY + (flyEarth.width - Math.abs(flyEarth.centerX - this.x - this.width / 2)) / 7 - 32;
		this.goalY = Helper.getRandom(yBottom, yTop);

        Miner.init(true); //reserve init
	}

	public static get imageLength() : number{
		return Miner.wait1Image?.width || 75;
	}

	static initForShop(): void{
		Miner.wait1Image.src = MinerWait1Image;
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && Miner.imageHandler.isEmpty){
			Miner.imageHandler.new(Miner.wait1Image).src = MinerWait1Image;
			Miner.imageHandler.new(Miner.fallImage).src = MinerFallImage;
			Miner.imageHandler.new(Miner.fallEndImage).src = MinerFallEndImage;
		}
	}


	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number, isWaveStarted: boolean){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logicBase(drawsDiffMs, buildings, monsters, units, bottomShiftBorder);
		
		//gravitations
		if(this.y + this.height < this.goalY){
			this.y++;
			this._isFall = true;
		}
		else{
			this._isFall = false;
		}
		
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null): number{
		var damage = super.applyDamage(damage, x, y);
		if(damage > 0){
			//AudioSystem.playRandom(this.centerX, 
			//	[SoundAttacked1], 
			//	[0.05], false, 1, true);
		}
		return damage;
	}


	draw(drawsDiffMs: number, isGameOver: boolean): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this._isFall){
			Draw.ctx.drawImage(Miner.fallImage, this.x, this.y, this.width, this.height);
		}
		else if(this._fallEndAnimation.leftTimeMs > 0){
			this._fallEndAnimation.draw(drawsDiffMs, isGameOver, this.x, this.y, this.width, this.height);
		}
		else{
			super.draw(drawsDiffMs, isGameOver);
		}
	}

}