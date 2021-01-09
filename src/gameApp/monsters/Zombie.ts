import {Monster} from '../gameObjects/Monster';
import {Helper} from '../helpers/Helper';

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
		Zombie.images.push(new Image()); Zombie.images[0].src = './media/img/monsters/zombie.png';
		Zombie.images.push(new Image()); Zombie.images[1].src = './media/img/monsters/zombie2.png';
		Zombie.images.push(new Image()); Zombie.images[2].src = './media/img/monsters/zombie3.png';
		Zombie.images.push(new Image()); Zombie.images[3].src = './media/img/monsters/zombie4.png';
		
		Zombie.attackImages.push(new Image()); Zombie.attackImages[0].src = './media/img/monsters/zombieAttack.png';
		Zombie.attackImages.push(new Image()); Zombie.attackImages[1].src = './media/img/monsters/zombieAttack2.png';
		Zombie.attackImages.push(new Image()); Zombie.attackImages[2].src = './media/img/monsters/zombieAttack3.png';
		Zombie.attackImages.push(new Image()); Zombie.attackImages[3].src = './media/img/monsters/zombieAttack4.png';
	}
}