/**
 * Динамическая загрузка картинок и их ожидание
 */
export class ImageHandler {
 	private	waitingImages: HTMLImageElement[] = []; //картинки, чью загрузку мы ожидаем 

	new(fieldToInit: HTMLImageElement): HTMLImageElement {
		return this.apply(fieldToInit);
	}

	add(array: HTMLImageElement[]): HTMLImageElement {
		if(!array){
			array = [];
		}

		var image = this.apply(new Image());
		array.push(image);

		return image;
	}

	get isImagesCompleted(): boolean {
		return this.waitingImages.every(x => x.complete);
	}

	private apply(image: HTMLImageElement): HTMLImageElement {
		image.onload = this.onLoad;
		image.onabort = this.onabort;
		image.onerror = this.onerror;
		this.waitingImages.push(image);
		return image;
	}

	private onLoad(e: any){
		//console.log('onLoaded', e.path[0].src, e.timeStamp);
	}

	private onabort(e: any){
		console.log('onabort', e);
	}

	private onerror(e: any){
		console.log('onerror', e);
	}
}