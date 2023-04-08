import {ImageHandler} from '../ImageHandler';

import {AudioSystem} from '../gameSystems/AudioSystem';

import {Monster} from './Monster';

import {Helper} from '../helpers/Helper';

import {AttackedObject} from '../../models/AttackedObject';

import Skelet1Image from '../../assets/img/monsters/skelet/skelet.png'; 

import SkeletAttack1Image from '../../assets/img/monsters/skelet/skeletAttack.png'; 



/** Скелет - тип монстров, которые вызываются Некромантом */
export class Skelet extends Monster{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly images: HTMLImageElement[] = []; //разные окраски монстра
	private static readonly imageFrames = 6;

	private static readonly attackImages: HTMLImageElement[] = [];  //разные окраски монстра
	private static readonly attackImageFrames = 6;

	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		let random = Helper.getRandom(1, Skelet.images.length) - 1;
		let selectedImage = Skelet.images[random];
		let selectedAttackImage = Skelet.attackImages[random];

		super(x, y,
			scaleSize,
			isLeftSide,
			true,  //isLand
			Skelet.name,
			selectedImage,
			Skelet.imageFrames,
			500,   //speed animation
			selectedAttackImage,
			Skelet.attackImageFrames,
			1000,  //speed animation attack
			5,     //reduce hover
			3,     //health
			3,     //damage
			990,   //time attack wait
			150,    //speed
			Skelet.imageHandler,
			3000); //avrTimeSoundWaitMs

			Skelet.init(true); //reserve init
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && !Skelet.images.length){
			Skelet.imageHandler.add(Skelet.images).src = Skelet1Image;
			
			Skelet.imageHandler.add(Skelet.attackImages).src = SkeletAttack1Image;
		}
	}

	playSound(): void {
		/*AudioSystem.playRandom(this.centerX, 
			[Sound1, Sound2, Sound3, Sound4, Sound5, Sound6, Sound7, Sound8, Sound9, Sound10], 
			[0.1, 0.1, 0.1, 0.1, 0.1, 0.05, 0.2, 0.05, 0.07, 0.08], false, 1, true);*/
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null, attackingObject: AttackedObject|null = null): number{
		var damage = super.applyDamage(damage, x, y, attackingObject);
		if(damage > 0){
			/*AudioSystem.playRandom(this.centerX, 
				[SoundAttacked1, SoundAttacked2, SoundAttacked3, SoundAttacked4, SoundAttacked5, SoundAttacked6, SoundAttacked7, SoundAttacked8, SoundAttacked9, SoundAttacked10, SoundAttacked11, SoundAttacked12], 
				[0.05, 0.05, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08], false, 1, true);*/
		}
		return damage;
	}

}