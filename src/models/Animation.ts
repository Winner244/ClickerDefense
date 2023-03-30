import {Draw} from "../gameApp/gameSystems/Draw";

export default class Animation{
	readonly image: HTMLImageElement; //изображение с несколькими кадрами в ряд
	readonly frames: number; //количество кадров на изображении
	readonly durationMs: number; //время полной анимации в миллисекундах
	leftTimeMs: number; //оставшееся время анимации (миллисекунды)

	constructor(frames: number, durationMs: number, image: HTMLImageElement|null = null)
	{
		this.image = image || new Image();
		this.frames = frames;
		this.durationMs = durationMs;
		this.leftTimeMs = durationMs;
	}

	restart(){
		this.leftTimeMs = this.durationMs;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, x: number, y: number, width: number, height: number, isInvert: boolean = false){
		if(!this.image.complete){
			console.warn(`image src=${this.image.src} is not loaded yet!`);
			return;
		}

		if(!isGameOver)
			this.leftTimeMs -= drawsDiffMs;

		let frame = this.leftTimeMs <= 0 
			? this.frames - 1
			: isGameOver 
				? 0 
				: Math.floor((this.durationMs - this.leftTimeMs) / (this.durationMs / this.frames));

		if(isInvert){
			frame = this.leftTimeMs <= 0 
			? 0
			: isGameOver 
				? this.frames - 1 
				: this.frames - Math.floor((this.durationMs - this.leftTimeMs) / (this.durationMs / this.frames));
		}

		Draw.ctx.drawImage(this.image, 
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