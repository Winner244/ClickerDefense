import {Monster} from '../gameObjects/Monster';
import {Building} from '../gameObjects/Building';
import {Helper} from '../helpers/Helper';
import {ImageHandler} from '../ImageHandler';

import Bat1Image from '../../assets/img/monsters/bat/bat.png';  
import { Modifier } from '../gameObjects/Modifier';


export class Bat extends Monster{

	static readonly images: HTMLImageElement[] = []; //разные окраски монстра
	static readonly imageFrames = 6;

	private static readonly imageHandler: ImageHandler = new ImageHandler();
	private static wasInit: boolean; //вызов функции init уже произошёл?

	private zigzagLength: number;
	private isZigzagToTop: boolean;
	private static readonly zigzagThreshold: number = 20;

	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		Bat.init(true);

		let random = Helper.getRandom(1, Bat.images.length) - 1;
		let selectedImage = Bat.images[random];

		super(x, y,
			scaleSize,
			isLeftSide,
			false, //isLand
			Bat.name,
			selectedImage,
			Bat.imageFrames,
			3,  //speed anumation
			selectedImage,
			Bat.imageFrames,
			3,  //speed anumation attack
			5,  //reduce hover
			1,  //health
			5,  //damage
			200, //time attack wait
			200, //speed
			Bat.imageHandler);

		this.zigzagLength = 0;
		this.isZigzagToTop = !!Helper.getRandom(0, 1);
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage && !Bat.wasInit){
			Bat.wasInit = true;
			Bat.images.push(new Image()); Bat.images[0].src = Bat1Image;
		}
	}

	logic(millisecondsDifferent: number, buildings: Building[], bottomBorder: number): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logic(millisecondsDifferent, buildings, bottomBorder);

		if(this.buildingGoal && !this.isAttack){

			let speedMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.speedMultiplier);
			let speed = this.speed * (millisecondsDifferent / 1000);
			speed += speed * speedMultiplier;
			this.y += (this.buildingGoal.centerY - this.centerY) / Helper.getDistance(this.centerX, this.centerY, this.buildingGoal.centerX, this.buildingGoal.centerY) * (speed / 2);

			//Зигзагообразное перемещение
			var changes = millisecondsDifferent / 10 * (this.isZigzagToTop ? 1 : -1);
			this.y += changes;
			this.zigzagLength += changes;
			if(Math.abs(this.zigzagLength) > Bat.zigzagThreshold){
				this.zigzagLength = 0;
				this.isZigzagToTop = !this.isZigzagToTop;
			}
			
		}
	}

}