import {Monster} from '../gameObjects/Monster';
import {Helper} from '../helpers/Helper';

import Zombie1Image from '../../assets/img/monsters/zombie/zombie.png'; 
import Zombie2Image from '../../assets/img/monsters/zombie/zombie2.png'; 
import Zombie3Image from '../../assets/img/monsters/zombie/zombie3.png'; 
import Zombie4Image from '../../assets/img/monsters/zombie/zombie4.png'; 

import ZombieAttack1Image from '../../assets/img/monsters/zombie/zombieAttack.png'; 
import ZombieAttack2Image from '../../assets/img/monsters/zombie/zombieAttack2.png'; 
import ZombieAttack3Image from '../../assets/img/monsters/zombie/zombieAttack3.png'; 
import ZombieAttack4Image from '../../assets/img/monsters/zombie/zombieAttack4.png'; 
import { ImageHandler } from '../ImageHandler';

export class Zombie extends Monster{

	static readonly images: HTMLImageElement[] = []; //разные окраски монстра
	static readonly imageFrames = 12;

	static readonly attackImages: HTMLImageElement[] = [];  //разные окраски монстра
	static readonly attackImageFrames = 4;

	private static readonly imageHandler: ImageHandler = new ImageHandler();
	private static wasInit: boolean; //вызов функции init уже произошёл?


	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		Zombie.init(true); //reserve init

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
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage && !Zombie.wasInit){
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
}