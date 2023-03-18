import {Modifier} from "./Modifier";

import {AttackedObject} from "../../models/AttackedObject";

import AnimationInfinite from "../../models/AnimationInfinite";

import cloudImage from '../../assets/img/monsters/necromancer/clouds.png'; 

/* Кислотный дождь 
	Создаётся монстром Necromancer
	даёт деффаб уменьшения брони + постоянный урон от капель + уменьшает наносимый урон
 */
export class AcidRainModifier extends Modifier{
	static cloudImage: HTMLImageElement = new Image(); //изображение облаков

	acidBlobDamage: number; //урона от кислотных капель
	_cloudAnimation: AnimationInfinite = new AnimationInfinite(5, 500, AcidRainModifier.cloudImage);

	static readonly damageMultiplier: number = -0.1; //на 10% уменьшает урон
	static readonly defenceMultiplier: number = -0.1; //на 10% уменьшает защиту

	constructor(lifeTimeMs: number|null, acidBlobDamage: number) {
		super(AcidRainModifier.name, 0, AcidRainModifier.damageMultiplier, 0, AcidRainModifier.defenceMultiplier, lifeTimeMs); 

		this.acidBlobDamage = acidBlobDamage;
	}

	static loadResources(){
		AcidRainModifier.cloudImage.src = cloudImage;
	}

	drawAheadObjects(object: AttackedObject, drawsDiffMs: number){
		const width = this._cloudAnimation.image.width / this._cloudAnimation.frames;
		const height = this._cloudAnimation.image.height;
		const x = object.centerX - width / 2;
		const y = object.y - height;
		this._cloudAnimation.draw(drawsDiffMs, false, x, y, width, height);
	}
}