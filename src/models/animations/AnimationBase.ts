import { Draw } from "../../gameApp/gameSystems/Draw";
import { ImmutableImage } from "./ImmutableImage"

export default class AnimationBase{
	readonly frames: number; //количество кадров в изображении

	readonly initialDurationMs: number; //время полной анимации в миллисекундах

	protected _durationMs: number; //время полной анимации в миллисекундах
	public get durationMs(): number{
		return this._durationMs;
	}
	
	protected _image: ImmutableImage; //защищённое для изменения изображение
	public get image(): ImmutableImage{
		return this._image;
	}

	public currentFrame: number = 0;

	changeDuration(newValue: number){
		this._durationMs = newValue;
	}

	changeImage(newSrc: string){
		this._image = new ImmutableImage(newSrc);
	}

	/**
	 * @param framesCount - количество фреймов в изображении image
	 * @param durationMs - время полной анимации в миллисекундах
	 * @param image - изображение содержащее все кадры анимации
	 */
	constructor(framesCount: number, durationMs: number, image: HTMLImageElement|string|null = null)
	{
		this._image = new ImmutableImage(image || new Image());
		this.frames = framesCount;
		this._durationMs = durationMs;
		this.initialDurationMs = durationMs;
	}

	protected getImage(filter: string|null = null): HTMLImageElement|OffscreenCanvas{
		let image = Draw.getFilteredImage(filter, this.image.getImage(), this.image.width, this.image.height);
		return image;
	}

	get width(): number {
		return this.image.width / this.frames;
	}

	get height(): number {
		return this.image.height;
	}

	drawBase(context: CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D, 
		filter: string|null = null, 
		x: number = 0, 
		y: number = 0, 
		width: number|null = null, 
		height: number|null = null): void 
	{
		context.drawImage(this.getImage(filter), 
			this.image.width / this.frames * this.currentFrame, //crop from x
			0, //crop from y
			this.width, //crop by width
			this.height,    //crop by height
			x, //x
			y,  //y
			width || this.width, //displayed width 
			height || this.height); //displayed height 
	}
}