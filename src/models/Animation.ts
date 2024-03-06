import {Draw} from "../gameApp/gameSystems/Draw";
import AnimationBase from "./AnimationBase";

export default class Animation extends AnimationBase {
	leftTimeMs: number; //оставшееся время анимации (миллисекунды)

	private lastFrame: number = 0; //кадр из прошлой прорисовки

	/**
	 * @param framesCount - количество фреймов в изображении image
	 * @param durationMs - время полной анимации в миллисекундах
	 * @param image - изображение содержащее все кадры анимации
	 */
	constructor(framesCount: number, durationMs: number, image: HTMLImageElement|string|null = null)
	{
		super(framesCount, durationMs, image);
		this.leftTimeMs = durationMs;
	}

	restart(){
		this.leftTimeMs = this.durationMs;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, x: number, y: number, width: number, height: number, filter: string|null = null, isInvert: boolean = false){
		if(!isGameOver){
			this.leftTimeMs -= drawsDiffMs;
		}
		
		if(!this.image.complete){
			console.warn(`image src=${this.image.src} is not loaded yet!`);
			return;
		}

		if(!this._durationMs || !this.image.width || !this.frames){
			return;
		}

		let frame = this.leftTimeMs <= 0 
			? this.frames - 1
			: isGameOver 
				? this.lastFrame 
				: Math.floor((this.durationMs - this.leftTimeMs) / (this.durationMs / this.frames));

		if(isInvert){
			frame = this.leftTimeMs <= 0 
				? 0
				: isGameOver 
					? this.lastFrame
					: this.frames - Math.floor((this.durationMs - this.leftTimeMs) / (this.durationMs / this.frames)) - 1;
		}

		this.lastFrame = frame;

		Draw.ctx.drawImage(this.getImage(filter), 
			this.image.width / this.frames * frame, //crop from x
			0, //crop from y
			this.image.width / this.frames, //crop by width
			this.image.height,    //crop by height
			x, //x
			y,  //y
			width, //displayed width 
			height); //displayed height 
	}
}