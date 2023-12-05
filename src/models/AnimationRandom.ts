import {Draw} from "../gameApp/gameSystems/Draw";
import AnimationBase from "./AnimationBase";

import {Helper} from "../gameApp/helpers/Helper";

export default class AnimationRandom extends AnimationBase{
	displayedTimeMs: number; //сколько по времени уже отображается (миллисекунды)
	currentFrame: number; //текущий фрейм
	keyFrame: number; //ключ фрейма - нужен для фиксации времени, когда фрейм не надо менять

	constructor(framesCount: number, durationMs: number, image: HTMLImageElement|null = null)
	{
		super(framesCount, durationMs, image);
		this.displayedTimeMs = 0;
		this.currentFrame = 0;
		this.keyFrame = 0;
	}

	restart(){
		this.displayedTimeMs = 0;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, x: number, y: number, width: number|null = null, height: number|null = null, filter: string|null = null){
		if(!this.image.complete){
			console.warn(`image src=${this.image.src} is not loaded yet!`);
			return;
		}

		if(!isGameOver){
			this.displayedTimeMs += drawsDiffMs;

			let newKeyFrame = Math.floor(this.displayedTimeMs % this.durationMs / (this.durationMs / this.frames));
			if(newKeyFrame != this.keyFrame){
				this.keyFrame = newKeyFrame;

				let newFrame = this.currentFrame;
				do{
					newFrame = Helper.getRandom(0, this.frames - 1);
				} while(newFrame == this.currentFrame);
				this.currentFrame = newFrame;
			}
		}

		Draw.ctx.drawImage(this.getImage(filter), 
			this.image.width / this.frames * this.currentFrame, //crop from x
			0, //crop from y
			this.image.width / this.frames, //crop by width
			this.image.height,    //crop by height
			x, //x
			y,  //y
			width || this.image.width / this.frames, //displayed width 
			height || this.image.height); //displayed height 
	}
}