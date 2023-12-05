import {Draw} from "../gameApp/gameSystems/Draw";

export default class AnimationInfinite{
	readonly image: HTMLImageElement; //изображение с несколькими кадрами в ряд
	readonly frames: number; //количество кадров на изображении
	displayedTimeMs: number; //сколько по времени уже отображается (миллисекунды)

	private _durationMs: number; //время полной анимации в миллисекундах
	public get durationMs(): number{
		return this._durationMs;
	}

	readonly initialDurationMs: number; //время полной анимации в миллисекундах

	constructor(frames: number, durationMs: number, image: HTMLImageElement|null = null)
	{
		this.image = image || new Image();
		this.frames = frames;
		this.initialDurationMs = this._durationMs = durationMs;
		this.displayedTimeMs = 0;
	}

	changeDuration(newValue: number){
		this._durationMs = newValue;
	}

	restart(){
		this.displayedTimeMs = 0;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, x: number, y: number, width: number|null = null, height: number|null = null){
		this.displayedTimeMs += drawsDiffMs;
		
		if(!this.image.complete){
			console.warn(`image src=${this.image.src} is not loaded yet!`);
			return;
		}

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