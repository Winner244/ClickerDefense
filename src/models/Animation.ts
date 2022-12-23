import {Draw} from "../gameApp/gameSystems/Draw";

export default class Animation{
	readonly image: HTMLImageElement; //изображение с несколькими кадрами в ряд
	readonly frames: number; //количество кадров на изображении
	readonly duration: number; //время полной анимации в миллисекундах
	leftTimeMs: number; //оставшееся время анимации (миллисекунды)

	constructor(frames: number, duration: number, image: HTMLImageElement|null = null)
	{
		this.image = image || new Image();
		this.frames = frames;
		this.duration = duration;
		this.leftTimeMs = duration;
	}

	restart(){
		this.leftTimeMs = this.duration;
	}

	draw(millisecondsDifferent: number, isGameOver: boolean, x: number, y: number, width: number, height: number){
		if(!isGameOver)
			this.leftTimeMs -= millisecondsDifferent;

		let frame = this.leftTimeMs <= 0 
			? this.frames - 1
			: isGameOver 
				? 0 
				: Math.floor((this.duration - this.leftTimeMs) / (this.duration / this.frames));

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