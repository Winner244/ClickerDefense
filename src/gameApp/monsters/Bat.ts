import {Monster} from '../gameObjects/Monster';
import {Helper} from '../helpers/Helper';
import { ImageHandler } from '../ImageHandler';

import Bat1Image from '../../assets/img/monsters/bat/bat.png';  

import BatAttack1Image from '../../assets/img/monsters/bat/bat.png'; 
import { Building } from '../gameObjects/Building';

export class Bat extends Monster{

	static readonly images: HTMLImageElement[] = []; //разные окраски монстра
	static readonly imageFrames = 6;

	static readonly attackImages: HTMLImageElement[] = [];  //разные окраски монстра
	static readonly attackImageFrames = 6;

	private static readonly imageHandler: ImageHandler = new ImageHandler();
	private static wasInit: boolean; //вызов функции init уже произошёл?


	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		Bat.init(true);

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
			3,  //speed anumation
			selectedAttackImage,
			Bat.attackImageFrames,
			3,  //speed anumation attack
			5,  //reduce hover
			1,  //health
			5,  //damage
			200, //time attack wait
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

	logic(millisecondsDifferent: number, buildings: Building[], bottomBorder: number): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this.buildingGoal){
			if(this.y < this.buildingGoal.y){
				this.y++;
			}
			else if(this.y > this.buildingGoal.y + this.buildingGoal.height){
				this.y--;
			}
		}


		super.logic(millisecondsDifferent, buildings, bottomBorder);
	}

}