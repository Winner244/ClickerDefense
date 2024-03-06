import {Draw} from "../gameApp/gameSystems/Draw";
import AnimationBase from "./AnimationBase";

export default class AnimationInfinite extends AnimationBase{
	displayedTimeMs: number; //сколько по времени уже отображается (миллисекунды)

	constructor(framesCount: number, durationMs: number, image: HTMLImageElement|null = null)
	{
		super(framesCount, durationMs, image);
		this.displayedTimeMs = 0;
	}

	changeDuration(newValue: number){
		this._durationMs = newValue;
	}

	restart(){
		this.displayedTimeMs = 0;
	}

	draw(drawsDiffMs: number, isGameOver: boolean, x: number, y: number, width: number|null = null, height: number|null = null, filter: string|null = null){
		this.displayedTimeMs += drawsDiffMs;

		if(!this._durationMs || !this.image.width || !this.frames){
			return;
		}
		
		if(!this.image.complete){
			console.warn(`image src=${this.image.src} is not loaded yet!`);
			return;
		}

		let frame = isGameOver ? 0 : Math.floor(this.displayedTimeMs % this.durationMs / (this.durationMs / this.frames));
		Draw.ctx.drawImage(this.getImage(filter), 
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