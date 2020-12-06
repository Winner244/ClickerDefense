import {Draw} from "../../gameApp/gameSystems/Draw";
import AnimationBase from "./AnimationBase";

import {Helper} from "../../gameApp/helpers/Helper";

export default class AnimationRandom extends AnimationBase{
	displayedTimeMs: number; //сколько по времени уже отображается (миллисекунды)
	keyFrame: number; //ключ фрейма - нужен для фиксации времени, когда фрейм не надо менять

	constructor(framesCount: number, durationMs: number, image: HTMLImageElement|null = null)
	{
		super(framesCount, durationMs, image);
		this.displayedTimeMs = 0;
		this.keyFrame = 0;
	}

	restart(){
		this.displayedTimeMs = 0;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, x: number, y: number, width: number|null = null, height: number|null = null, filter: string|null = null): number{
		if(!isGameOver){
			this.displayedTimeMs += drawsDiffMs;
		}

		if(!this._durationMs || !this.image.width || !this.frames){
			return -1;
		}
		
		if(!this.image.complete){
			console.warn(`image src=${this.image.src} is not loaded yet!`);
			return -1;
		}

		this.currentFrame = this.getCurrentFrame(isGameOver);
		this.drawBase(Draw.ctx, filter, x, y, width, height);
			
		return this.currentFrame;
	}

	getCurrentFrame(isGameOver: boolean): number{
		if(!isGameOver){
			let newKeyFrame = Math.floor(this.displayedTimeMs % this.durationMs / (this.durationMs / this.frames));
			if(newKeyFrame != this.keyFrame){
				this.keyFrame = newKeyFrame;

				let newFrame: number;
				do{
					newFrame = Helper.getRandom(0, this.frames - 1);
				} while(newFrame === this.currentFrame);

				return newFrame;
			}
		}

		return this.currentFrame;
	}
}