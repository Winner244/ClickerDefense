import {Monster} from '../gameObjects/Monster';
import {Helper} from '../helpers/Helper';
import { ImageHandler } from '../ImageHandler';

import Bat1Image from '../../assets/img/monsters/bat/bat.png';  

import BatAttack1Image from '../../assets/img/monsters/bat/batAttack.png'; 

export class Bat extends Monster{

	static readonly images: HTMLImageElement[] = []; //разные окраски монстра
	static readonly imageFrames = 12;

	static readonly attackImages: HTMLImageElement[] = [];  //разные окраски монстра
	static readonly attackImageFrames = 1;

	private static readonly imageHandler: ImageHandler = new ImageHandler();
	private static wasInit: boolean; //вызов функции init уже произошёл?


	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		let random = Helper.getRandom(1, Bat.images.length) - 1;
		let selectedImage = Bat.images[random];
		let selectedAttackImage = Bat.attackImages[random];

		super(x, y,
			scaleSize,
			isLeftSide,
			false, //isLand
			Bat.name,
			selectedImage,
			Bat.imageFrames,
			1,
			selectedAttackImage,
			Bat.attackImageFrames,
			1,
			5,
			1,  //health
			5,  //damage
			100, //time attack wait
			200, //speed
			Bat.imageHandler);
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage && !Bat.wasInit){
			Bat.wasInit = true;
			Bat.images.push(new Image()); Bat.images[0].src = Bat1Image;
			
			Bat.attackImages.push(new Image()); Bat.attackImages[0].src = BatAttack1Image;
		}
	}
}