import {Modifier} from "./Modifier";

import {Draw} from "../gameSystems/Draw";

import {AttackedObject} from "../../models/AttackedObject";
import {MovingObject} from "../../models/MovingObject";

import AnimationInfinite from "../../models/AnimationInfinite";

import {Helper} from "../helpers/Helper";

import cloudImage from '../../assets/img/monsters/necromancer/clouds.png'; 
import blobImage from '../../assets/img/monsters/necromancer/blob.png'; 

/* Кислотный дождь 
	Создаётся монстром Necromancer
	даёт деффаб уменьшения брони + постоянный урон от капель + уменьшает наносимый урон
 */
export class AcidRainModifier extends Modifier{
	static cloudImage: HTMLImageElement = new Image(); //изображение облаков
	static blobImage: HTMLImageElement = new Image(); //изображение кислотной капли

	acidBlobDamage: number; //урона от кислотных капель
	cloudAnimation: AnimationInfinite = new AnimationInfinite(5, 500, AcidRainModifier.cloudImage);
	private _leftTimeToCreateNewBlobMs: number = 0; //сколько осталось времени до создания следующей кислотной капли
	private _blobs: MovingObject[]; //капли

	static readonly damageMultiplier: number = -0.1; //на 10% уменьшает урон
	static readonly defenceMultiplier: number = -0.1; //на 10% уменьшает защиту
	static readonly periodCreatingBlobMs: number = 100; //каждые N мс создаёт кислотную каплу
	static readonly blobSpeed: number = 400; //скорость движения капель (пикселей в секунду)

	constructor(lifeTimeMs: number|null, acidBlobDamage: number) {
		super(AcidRainModifier.name, 0, AcidRainModifier.damageMultiplier, 0, AcidRainModifier.defenceMultiplier, lifeTimeMs); 

		this.acidBlobDamage = acidBlobDamage;
		this._blobs = [];
	}

	logic(object: AttackedObject, drawsDiffMs: number, objects: AttackedObject[]): void{
		super.logic(object, drawsDiffMs, objects);

		this._leftTimeToCreateNewBlobMs -= drawsDiffMs;

		//create
		if(this._leftTimeToCreateNewBlobMs <= 0){
			this._leftTimeToCreateNewBlobMs = AcidRainModifier.periodCreatingBlobMs;
			const x = Helper.getRandom(object.x + object.reduceHover, object.x + object.width - object.reduceHover);
			const y = object.y - this.cloudAnimation.image.height;
			const dy = AcidRainModifier.blobSpeed;
			const goalY = Helper.getRandom(object.y + object.reduceHover, object.y + object.height - object.reduceHover * 2);
			const leftTimeMs = (goalY - y) / dy * 1000;
			this._blobs.push(new MovingObject(x, y, 1, 1, leftTimeMs, 0, dy, 0));
		}

		//move/damage
		for(let i = 0; i < this._blobs.length; i++){
			const blob = this._blobs[i];

			blob.location.y += blob.dy * (drawsDiffMs / 1000);
			blob.leftTimeMs -= drawsDiffMs;
			if(blob.leftTimeMs <= 0 || blob.location.y > object.y + object.height){
				object.applyDamage(this.acidBlobDamage, blob.centerX, blob.centerY);
				this._blobs.splice(i, 1);
				i--;
			}
		}
	}

	static loadResources(){
		AcidRainModifier.cloudImage.src = cloudImage;
		AcidRainModifier.blobImage.src = blobImage;
	}

	drawAheadObjects(object: AttackedObject, drawsDiffMs: number){
		this._blobs.forEach(blob => Draw.ctx.drawImage(AcidRainModifier.blobImage, blob.location.x, blob.location.y));

		const width = this.cloudAnimation.image.width / this.cloudAnimation.frames;
		const height = this.cloudAnimation.image.height;
		const x = object.centerX - width / 2;
		const y = object.y - height * 1.3;
		this.cloudAnimation.draw(drawsDiffMs, false, x, y, width, height);
	}
}