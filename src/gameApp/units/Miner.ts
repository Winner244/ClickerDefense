import {ImageHandler} from '../ImageHandler';

import {AudioSystem} from '../gameSystems/AudioSystem';

import Animation from '../../models/Animation';

import {Helper} from '../helpers/Helper';

import {Unit} from './Unit';

import MinerFallImage from '../../assets/img/units/miner/fall.png'; 
import MinerFallEndImage from '../../assets/img/units/miner/fallEnd.png'; 
import MinerWait1Image from '../../assets/img/units/miner/wait1.png'; 

//import SoundAttacked1 from '../../assets/sounds/units/miner/attacked1.mp3'; 


/** Шахтёр - тип юнитов пользователя */
export class Miner extends Unit{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly fallImage: HTMLImageElement = new Image();
	private static readonly wait1Image: HTMLImageElement = new Image();
	private static readonly fallEndImage: HTMLImageElement = new Image(); 

	private readonly fallEndAnimation: Animation;

	constructor(x: number, y: number) {
		super(x, y, 3, Miner.wait1Image, Miner.name, Miner.imageHandler); 

		this.fallEndAnimation = new Animation(31, 31 * 100, );

        Miner.init(true); //reserve init
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && Miner.imageHandler.isEmpty){
			Miner.imageHandler.new(Miner.fallImage).src = MinerFallImage;
			Miner.imageHandler.new(Miner.wait1Image).src = MinerWait1Image;
			Miner.imageHandler.new(Miner.fallEndImage).src = MinerFallEndImage;
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

}