import {ImageHandler} from '../ImageHandler';

import {AudioSystem} from '../gameSystems/AudioSystem';

import {Monster} from '../gameObjects/Monster';
import {Building} from '../gameObjects/Building';

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



export class Zombie extends Monster{

	static readonly images: HTMLImageElement[] = []; //разные окраски монстра
	static readonly imageFrames = 12;

	static readonly attackImages: HTMLImageElement[] = [];  //разные окраски монстра
	static readonly attackImageFrames = 4;

	static readonly minTimeSoundWait = 3000; //миллисекунды

	private static readonly imageHandler: ImageHandler = new ImageHandler();
	private static wasInit: boolean; //вызов функции init уже произошёл?
	private timePlaySound: number;

	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		let random = Helper.getRandom(1, Zombie.images.length) - 1;
		let selectedImage = Zombie.images[random];
		let selectedAttackImage = Zombie.attackImages[random];

		super(x, y,
			scaleSize,
			isLeftSide,
			true, //isLand
			Zombie.name,
			selectedImage,
			Zombie.imageFrames,
			900,
			selectedAttackImage,
			Zombie.attackImageFrames,
			1000,
			5,
			3,  //health
			100,   //damage
			990, //time attack wait
			50,  //speed
			Zombie.imageHandler); 

			Zombie.init(true); //reserve init

			this.timePlaySound = Date.now() - Zombie.minTimeSoundWait / 2;
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && !Zombie.wasInit){
			Zombie.wasInit = true;

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

	logic(millisecondsDifferent: number, buildings: Building[], bottomBorder: number): void{
		super.logic(millisecondsDifferent, buildings, bottomBorder);


		if(this.timePlaySound + Zombie.minTimeSoundWait < Date.now() && Helper.getRandom(0, 100) > 99){
			this.timePlaySound = Date.now();
			AudioSystem.playRandom(this.centerX, 
				[Sound1, Sound2, Sound3, Sound4, Sound5, Sound6, Sound7, Sound8, Sound9, Sound10], 
				[0.1, 0.1, 0.1, 0.1, 0.1, 0.05, 0.2, 0.05, 0.07, 0.08], false, 1, true);
		}
	}

	onClicked(){
		AudioSystem.playRandom(this.centerX, 
			[SoundAttacked1, SoundAttacked2, SoundAttacked3], 
			[0.04, 0.04, 0.07], false, 1, true);
	}
}