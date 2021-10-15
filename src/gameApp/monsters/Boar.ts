import {Monster} from '../gameObjects/Monster';
import {Helper} from '../helpers/Helper';

import Boar1Image from '../../assets/img/monsters/boar2.png';

import BoarAttack1Image from '../../assets/img/monsters/boar2.png';

export class Boar extends Monster{

	static images: HTMLImageElement[] = [];
	static attackImages: HTMLImageElement[] = [];

	constructor(x: number, y: number, isLeftSide: boolean) {
		let random = Helper.getRandom(1, Boar.images.length) - 1;
		let selectedImage = Boar.images[random];
		let selectedAttackImage = Boar.attackImages[random];

		super(x, y, isLeftSide, true, Boar.name, selectedImage, 8,  85, selectedAttackImage, 8, 85, 5, 4, 3, 150);
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage){
			Boar.images.push(new Image()); Boar.images[0].src = Boar1Image;
			//Boar.images.push(new Image()); Boar.images[1].src = Boar2Image;
			//Boar.images.push(new Image()); Boar.images[2].src = Boar3Image;

			Boar.attackImages.push(new Image()); Boar.attackImages[0].src = BoarAttack1Image;
			//Boar.attackImages.push(new Image()); Boar.attackImages[1].src = BoarAttack2Image;
			//Boar.attackImages.push(new Image()); Boar.attackImages[2].src = BoarAttack3Image;
		}
	}
}