import {ImageHandler} from '../ImageHandler';

import {Monster} from './Monster';

import {Building} from '../buildings/Building';

import {AudioSystem} from '../gameSystems/AudioSystem';

import {Helper} from '../helpers/Helper';

import {Modifier} from '../modifiers/Modifier';

import Bat1Image from '../../assets/img/monsters/bat/bat.png';  

import Sound1 from '../../assets/sounds/monsters/bat/1.mp3'; 
import Sound2 from '../../assets/sounds/monsters/bat/2.mp3'; 
import Sound3 from '../../assets/sounds/monsters/bat/3.mp3'; 
import Sound4 from '../../assets/sounds/monsters/bat/4.mp3'; 
import Sound5 from '../../assets/sounds/monsters/bat/5.mp3'; 


export class Bat extends Monster{
	public static readonly imageHandler: ImageHandler = new ImageHandler();
	private static readonly images: HTMLImageElement[] = []; //разные окраски монстра
	private static readonly imageFrames = 6; 

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
			false,  //isLand
			Bat.name,
			selectedImage,
			Bat.imageFrames,
			300,  //speed animation
			selectedImage,
			Bat.imageFrames,
			300,  //speed animation attack
			5,    //reduce hover
			1,    //health
			0.1,  //damage
			200,  //time attack wait
			200,  //speed
			Bat.imageHandler,
			3000); //avrTimeSoundWaitMs

		this.zigzagLength = 0;
		this.isZigzagToTop = !!Helper.getRandom(0, 1);
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && !Bat.images.length){
			Bat.imageHandler.add(Bat.images).src = Bat1Image;
		}
	}

	logic(drawsDiffMs: number, buildings: Building[], bottomBorder: number): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logic(drawsDiffMs, buildings, bottomBorder);

		if(this.buildingGoal){
			let speedMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.speedMultiplier);
			let speed = this.speed * (drawsDiffMs / 1000);
			speed += speed * speedMultiplier;

			if(!this.isAttack){
				this.y += (this.buildingGoal.centerY - this.centerY) / Helper.getDistance(this.centerX, this.centerY, this.buildingGoal.centerX, this.buildingGoal.centerY) * speed;
	
				//Зигзагообразное перемещение
				var changes = drawsDiffMs / 10 * (this.isZigzagToTop ? 1 : -1);
				this.y += changes;
				this.zigzagLength += changes;
				if(Math.abs(this.zigzagLength) > Bat.zigzagThreshold){
					this.zigzagLength = 0;
					this.isZigzagToTop = !this.isZigzagToTop;
				}
				
			}
			else{
				if(this.y < this.buildingGoal.y + this.buildingGoal.reduceHover){
					this.y++;
				}
				else if(this.y > this.buildingGoal.y + this.buildingGoal.height - this.buildingGoal.reduceHover){
					this.y--;
				}
			}
		}
	}

	playSound(): void{
		AudioSystem.playRandom(this.centerX, [Sound1, Sound2, Sound3, Sound4, Sound5], [0.1, 0.1, 0.02, 0.02, 0.02], false, 1, true);
	}

}