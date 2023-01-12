import {Draw} from "../gameApp/gameSystems/Draw";

export default class AnimationInfinite{
	readonly image: HTMLImageElement; //изображение с несколькими кадрами в ряд
	readonly frames: number; //количество кадров на изображении
	readonly durationMs: number; //время полной анимации в миллисекундах
	displayedTimeMs: number; //сколько по времени уже отображается (миллисекунды)

	constructor(frames: number, durationMs: number, image: HTMLImageElement|null = null)
	{
		this.image = image || new Image();
		this.frames = frames;
		this.durationMs = durationMs;
		this.displayedTimeMs = 0;
	}

	restart(){
		this.displayedTimeMs = 0;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, x: number, y: number, width: number|null = null, height: number|null = null){
		this.displayedTimeMs += drawsDiffMs;
		let frame = isGameOver ? 0 : Math.floor(this.displayedTimeMs % this.durationMs / (this.durationMs / this.frames));
		Draw.ctx.drawImage(this.image, 
			this.image.width / this.frames * frame, //crop from x
			0, //crop from y
			this.image.width / this.frames, //crop by width
			this.image.height,    //crop by height
			x, //x
			y,  //y
			width || this.image.width / this.frames, //displayed width 
			height || this.image.height); //displayed height 
	}
}