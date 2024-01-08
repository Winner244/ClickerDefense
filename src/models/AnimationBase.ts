import { Draw } from "../gameApp/gameSystems/Draw";

export default class AnimationBase{
	readonly image: HTMLImageElement; //изображение с несколькими кадрами в ряд
	readonly frames: number; //количество кадров в изображении

	readonly initialDurationMs: number; //время полной анимации в миллисекундах

	protected _durationMs: number; //время полной анимации в миллисекундах
	public get durationMs(): number{
		return this._durationMs;
	}
	
	changeDuration(newValue: number){
		this._durationMs = newValue;
	}

	/**
	 * @param framesCount - количество фреймов в изображении image
	 * @param durationMs - время полной анимации в миллисекундах
	 * @param image - изображение содержащее все кадры анимации
	 */
	constructor(framesCount: number, durationMs: number, image: HTMLImageElement|null = null)
	{
		this.image = image || new Image();
		this.frames = framesCount;
		this._durationMs = durationMs;
		this.initialDurationMs = durationMs;
	}

	protected getImage(filter: string|null = null): HTMLImageElement|OffscreenCanvas{
		let image = Draw.getFilteredImage(filter, this.image, this.image.width, this.image.height);
		return image;
	}

}