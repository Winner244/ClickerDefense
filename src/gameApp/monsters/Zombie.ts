import {ImageHandler} from '../ImageHandler';

import {AudioSystem} from '../gameSystems/AudioSystem';

import {Monster} from './Monster';

import {Helper} from '../helpers/Helper';

import Zombie1Image from '../../assets/img/monsters/zombie/zombie.png'; 
import Zombie2Image from '../../assets/img/monsters/zombie/zombie2.png'; 
import Zombie3Image from '../../assets/img/monsters/zombie/zombie3.png'; 
import Zombie4Image from '../../assets/img/monsters/zombie/zombie4.png'; 

import ZombieAttack1Image from '../../assets/img/monsters/zombie/zombieAttack.png'; 
import ZombieAttack2Image from '../../assets/img/monsters/zombie/zombieAttack2.png'; 
import ZombieAttack3Image from '../../assets/img/monsters/zombie/zombieAttack3.png'; 
import ZombieAttack4Image from '../../assets/img/monsters/zombie/zombieAttack4.png'; 

import Sound1 from '../../assets/sounds/monsters/zombie/1.mp3'; 
import Sound2 from '../../assets/sounds/monsters/zombie/2.mp3'; 
import Sound3 from '../../assets/sounds/monsters/zombie/3.mp3'; 
import Sound4 from '../../assets/sounds/monsters/zombie/4.mp3'; 
import Sound5 from '../../assets/sounds/monsters/zombie/5.mp3'; 
import Sound6 from '../../assets/sounds/monsters/zombie/6.mp3'; 
import Sound7 from '../../assets/sounds/monsters/zombie/7.mp3'; 
import Sound8 from '../../assets/sounds/monsters/zombie/8.mp3'; 
import Sound9 from '../../assets/sounds/monsters/zombie/9.mp3'; 
import Sound10 from '../../assets/sounds/monsters/zombie/10.mp3'; 

import SoundAttacked1 from '../../assets/sounds/monsters/zombie/attacked1.mp3'; 
import SoundAttacked2 from '../../assets/sounds/monsters/zombie/attacked2.mp3'; 
import SoundAttacked3 from '../../assets/sounds/monsters/zombie/attacked3.mp3'; 
import SoundAttacked4 from '../../assets/sounds/monsters/zombie/attacked4.mp3'; 
import SoundAttacked5 from '../../assets/sounds/monsters/zombie/attacked5.mp3'; 
import SoundAttacked6 from '../../assets/sounds/monsters/zombie/attacked6.mp3'; 
import SoundAttacked7 from '../../assets/sounds/monsters/zombie/attacked7.mp3'; 
import SoundAttacked8 from '../../assets/sounds/monsters/zombie/attacked8.mp3'; 
import SoundAttacked9 from '../../assets/sounds/monsters/zombie/attacked9.mp3'; 
import SoundAttacked10 from '../../assets/sounds/monsters/zombie/attacked10.mp3'; 
import SoundAttacked11 from '../../assets/sounds/monsters/zombie/attacked11.mp3'; 
import SoundAttacked12 from '../../assets/sounds/monsters/zombie/attacked12.mp3'; 


/** Зомби - тип монстров */
export class Zombie extends Monster{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly images: HTMLImageElement[] = []; //разные окраски монстра
	private static readonly imageFrames = 12;

	private static readonly attackImages: HTMLImageElement[] = [];  //разные окраски монстра
	private static readonly attackImageFrames = 4;

	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		let random = Helper.getRandom(1, Zombie.images.length) - 1;
		let selectedImage = Zombie.images[random];
		let selectedAttackImage = Zombie.attackImages[random];

		super(x, y,
			scaleSize,
			isLeftSide,
			true,  //isLand
			Zombie.name,
			selectedImage,
			Zombie.imageFrames,
			900,   //speed animation
			selectedAttackImage,
			Zombie.attackImageFrames,
			1000,  //speed animation attack
			5,     //reduce hover
			3,     //health
			1.4,   //damage
			990,   //time attack wait
			50,    //speed
			Zombie.imageHandler,
			3000); //avrTimeSoundWaitMs

			Zombie.init(true); //reserve init
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && !Zombie.images.length){
			Zombie.imageHandler.add(Zombie.images).src = Zombie1Image;
			Zombie.imageHandler.add(Zombie.images).src = Zombie2Image;
			Zombie.imageHandler.add(Zombie.images).src = Zombie3Image;
			Zombie.imageHandler.add(Zombie.images).src = Zombie4Image;
			
			Zombie.imageHandler.add(Zombie.attackImages).src = ZombieAttack1Image;
			Zombie.imageHandler.add(Zombie.attackImages).src = ZombieAttack2Image;
			Zombie.imageHandler.add(Zombie.attackImages).src = ZombieAttack3Image;
			Zombie.imageHandler.add(Zombie.attackImages).src = ZombieAttack4Image;
		}
	}

	playSound(): void {
		AudioSystem.playRandom(this.centerX, 
			[Sound1, Sound2, Sound3, Sound4, Sound5, Sound6, Sound7, Sound8, Sound9, Sound10], 
			[0.1, 0.1, 0.1, 0.1, 0.1, 0.05, 0.2, 0.05, 0.07, 0.08], false, 1, true);
	}

	onClicked(): void{
		super.onClicked();
		this.attacked();
	}

	attacked(): void{
		super.attacked();
		AudioSystem.playRandom(this.centerX, 
			[SoundAttacked1, SoundAttacked2, SoundAttacked3, SoundAttacked4, SoundAttacked5, SoundAttacked6, SoundAttacked7, SoundAttacked8, SoundAttacked9, SoundAttacked10, SoundAttacked11, SoundAttacked12], 
			[0.05, 0.05, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08], false, 1, true);
	}

}