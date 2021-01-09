import {Monster} from '../gameObjects/Monster';
import {Helper} from '../helpers/Helper';

import Zombie1Image from '../../assets/img/monsters/zombie.png'; 
import Zombie2Image from '../../assets/img/monsters/zombie2.png'; 
import Zombie3Image from '../../assets/img/monsters/zombie3.png'; 
import Zombie4Image from '../../assets/img/monsters/zombie4.png'; 

import ZombieAttack1Image from '../../assets/img/monsters/zombieAttack.png'; 
import ZombieAttack2Image from '../../assets/img/monsters/zombieAttack2.png'; 
import ZombieAttack3Image from '../../assets/img/monsters/zombieAttack3.png'; 
import ZombieAttack4Image from '../../assets/img/monsters/zombieAttack4.png'; 

export class Zombie extends Monster{

	static images: HTMLImageElement[] = [];
	static attackImages: HTMLImageElement[] = [];

	constructor(x: number, y: number, isLeftSide: boolean) {
		let random = Helper.getRandom(1, Zombie.images.length) - 1;
		let selectedImage = Zombie.images[random];
		let selectedAttackImage = Zombie.attackImages[random];

		super(x, y, isLeftSide, true, Zombie.name, selectedImage, 12,  49, selectedAttackImage, 4, 48, 5, 3, 1, 50);
	}

	static init(): void{
		Zombie.images.push(new Image()); Zombie.images[0].src = Zombie1Image;
		Zombie.images.push(new Image()); Zombie.images[1].src = Zombie2Image;
		Zombie.images.push(new Image()); Zombie.images[2].src = Zombie3Image;
		Zombie.images.push(new Image()); Zombie.images[3].src = Zombie4Image;
		
		Zombie.attackImages.push(new Image()); Zombie.attackImages[0].src = ZombieAttack1Image;
		Zombie.attackImages.push(new Image()); Zombie.attackImages[1].src = ZombieAttack2Image;
		Zombie.attackImages.push(new Image()); Zombie.attackImages[2].src = ZombieAttack3Image;
		Zombie.attackImages.push(new Image()); Zombie.attackImages[3].src = ZombieAttack4Image;
	}
}