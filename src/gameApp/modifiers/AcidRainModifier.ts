import * as Tone from 'tone';

import {Modifier} from "./Modifier";

import {Draw} from "../gameSystems/Draw";
import {AudioSystem} from "../gameSystems/AudioSystem";

import {AttackedObject} from "../../models/AttackedObject";
import {MovingObject} from "../../models/MovingObject";

import AnimationInfinite from "../../models/AnimationInfinite";

import {Helper} from "../helpers/Helper";

import cloudImage from '../../assets/img/monsters/necromancer/clouds.png'; 
import blobImage from '../../assets/img/monsters/necromancer/blob.png'; 

import SoundRain from '../../assets/sounds/rain.mp3'; 

/* Кислотный дождь 
	Создаётся монстром Necromancer
	даёт деффаб уменьшения брони + постоянный урон от капель + уменьшает наносимый урон
 */
export class AcidRainModifier extends Modifier{
	static readonly damageInMultiplier: number = 0.1; //на 10% увеличивает входящий урон
	static readonly damageOutMultiplier: number = -0.1; //на 10% уменьшает исходящий урон
	static readonly defenceMultiplier: number = -0.1; //на 10% уменьшает защиту
	static readonly periodCreatingBlobMs: number = 100; //каждые N мс создаёт кислотную каплу
	static readonly blobSpeed: number = 400; //скорость движения капель (пикселей в секунду)

	static cloudImage: HTMLImageElement = new Image(); //изображение облаков
	static blobImage: HTMLImageElement = new Image(); //изображение кислотной капли

	acidBlobDamage: number; //урона от кислотных капель
	cloudAnimation: AnimationInfinite = new AnimationInfinite(5, 500, AcidRainModifier.cloudImage);

	private _leftTimeToCreateNewBlobMs: number = 0; //сколько осталось времени до создания следующей кислотной капли
	private _blobs: MovingObject[]; //капли
	private _isSoundRainStarted: boolean; //запущен ли звук дождя?
	private _soundRain: Tone.Player|null; //звук дождя

	constructor(lifeTimeMs: number|null, acidBlobDamage: number) {
		super(AcidRainModifier.name, 0, AcidRainModifier.damageInMultiplier, AcidRainModifier.damageOutMultiplier, 0, AcidRainModifier.defenceMultiplier, lifeTimeMs); 

		this.acidBlobDamage = acidBlobDamage;
		this._blobs = [];
		this._isSoundRainStarted = false;
		this._soundRain = null;
	}

	logic(object: AttackedObject, drawsDiffMs: number): void{
		super.logic(object, drawsDiffMs);

		this._leftTimeToCreateNewBlobMs -= drawsDiffMs;

		//play rain sound
		if(!this._isSoundRainStarted){
			this._isSoundRainStarted = true;
			AudioSystem.play(object.centerX, SoundRain, 0, 1, false, true).then(source => this._soundRain = source);
		}

		//create blobs
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
	
	destroy(): void{
		this._soundRain?.stop();
		this._soundRain = null;
	}

	static loadResources(){
		AcidRainModifier.cloudImage.src = cloudImage;
		AcidRainModifier.blobImage.src = blobImage;
		AudioSystem.load(SoundRain);
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
Object.defineProperty(AcidRainModifier, "name", { value: 'AcidRainModifier', writable: false }); //fix production minification class names