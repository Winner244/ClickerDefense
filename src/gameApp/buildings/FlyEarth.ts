import {Building} from '../gameObjects/Building';

export class FlyEarth extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 375;
	static readonly height: number = 279;

	constructor(x: number, y: number) {
		super(x, y, false, false, FlyEarth.name, FlyEarth.image, 4, FlyEarth.width, FlyEarth.height, 15, 100);
	}

	static init(): void{
		this.image.src = './media/img/builders/flyEarth.png'; 
	}
}