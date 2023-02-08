import {ImageHandler} from '../ImageHandler';

import {AudioSystem} from '../gameSystems/AudioSystem';

import {Monster} from './Monster';

import {Helper} from '../helpers/Helper';

import Necromancer1Image from '../../assets/img/monsters/necromancer/necromancer.png'; 

import NecromancerAttack1Image from '../../assets/img/monsters/necromancer/necromancerAttack.png'; 

/*
import Sound1 from '../../assets/sounds/monsters/necromancer/1.mp3'; 
import Sound2 from '../../assets/sounds/monsters/necromancer/2.mp3'; 
import Sound3 from '../../assets/sounds/monsters/necromancer/3.mp3'; 

import SoundAttacked1 from '../../assets/sounds/monsters/necromancer/attacked1.mp3'; 
import SoundAttacked2 from '../../assets/sounds/monsters/necromancer/attacked2.mp3'; 
import SoundAttacked3 from '../../assets/sounds/monsters/necromancer/attacked3.mp3'; 
*/

/** Некромант - тип монстров */
export class Necromancer extends Monster{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly image: HTMLImageElement = new Image(); //окраска монстра
	private static readonly imageFrames = 6;

	private static readonly attackImage: HTMLImageElement = new Image();  //атака монстра
	private static readonly attackImageFrames = 5;

	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		super(x, y,
			scaleSize,
			isLeftSide,
			true,  //isLand
			Necromancer.name,
			Necromancer.image,
			Necromancer.imageFrames,
			700,   //speed animation
			Necromancer.attackImage,
			Necromancer.attackImageFrames,
			1000,  //speed animation attack
			5,     //reduce hover
			3,     //health
			3,     //damage
			990,   //time attack wait
			55,    //speed
			Necromancer.imageHandler,
			7000); //avrTimeSoundWaitMs

			Necromancer.init(true); //reserve init
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			Necromancer.imageHandler.new(Necromancer.image).src = Necromancer1Image;
			
			Necromancer.imageHandler.new(Necromancer.attackImage).src = NecromancerAttack1Image;
		}
	}

	/*playSound(): void {
		AudioSystem.playRandom(this.centerX, 
			[Sound1, Sound2, Sound3], 
			[0.1, 0.1, 0.1, 0.1, 0.1, 0.05, 0.2, 0.05, 0.07, 0.08], false, 1, true);
	}

	attacked(damage: number, x: number|null = null, y: number|null = null): void{
		super.attacked(damage, x, y);
		AudioSystem.playRandom(this.centerX, 
			[SoundAttacked1, SoundAttacked2, SoundAttacked3], 
			[0.05, 0.05, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08], false, 1, true);
	}*/
}