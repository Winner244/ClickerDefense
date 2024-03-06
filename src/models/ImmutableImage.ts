export class ImmutableImage{
	protected readonly _image: HTMLImageElement; //изображение с несколькими кадрами в ряд

	public get width(): number{
		return this._image.width;
	}
	public get height(): number{
		return this._image.height;
	}
	public get src(): string{
		return this._image.src;
	}
	public get complete(): boolean{
		return this._image.complete;
	}

	constructor(image: HTMLImageElement|string)
	{
		if(image instanceof HTMLImageElement){
			this._image = image;
		}
		else {
			this._image = new Image();
			this._image.src = image;
		}
	}

    getImage(): HTMLImageElement{
        return this._image;
    }
}