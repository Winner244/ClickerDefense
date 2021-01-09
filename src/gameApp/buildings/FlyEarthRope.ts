import {Building} from '../gameObjects/Building';

export class FlyEarthRope extends Building{
	static readonly image: HTMLImageElement = new Image();

	constructor(x: number, y: number) {
		super(x, y, false, true, FlyEarthRope.name, FlyEarthRope.image, 1, FlyEarthRope.image.width, FlyEarthRope.image.height, 0, 100);
	}

	static init(): void{
		FlyEarthRope.image.src = './media/img/builders/flyEarthRope.png'; 
	}
}