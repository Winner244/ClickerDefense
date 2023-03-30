import {Draw} from "../gameApp/gameSystems/Draw";

import {Helper} from "../gameApp/helpers/Helper";

export default class AnimationRandom{
	readonly image: HTMLImageElement; //изображение с несколькими кадрами в ряд
	readonly frames: number; //количество кадров на изображении
	readonly durationMs: number; //время полной анимации в миллисекундах
	displayedTimeMs: number; //сколько по времени уже отображается (миллисекунды)
	currentFrame: number; //текущий фрейм
	keyFrame: number; //ключ фрейма - нужен для фиксации времени, когда фрейм не надо менять

	constructor(frames: number, durationMs: number, image: HTMLImageElement|null = null)
	{
		this.image = image || new Image();
		this.frames = frames;
		this.durationMs = durationMs;
		this.displayedTimeMs = 0;
		this.currentFrame = 0;
		this.keyFrame = 0;
	}

	restart(){
		this.displayedTimeMs = 0;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, x: number, y: number, width: number|null = null, height: number|null = null){
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

		Draw.ctx.drawImage(this.image, 
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