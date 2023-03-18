import {Building} from './Building';

import {ImageHandler} from '../ImageHandler';

import FlyEarthRopeImage from '../../assets/img/buildings/flyEarthRope.png';  

/** Канат держащий землю - главное здание в еденичном экземпляре */
export class FlyEarthRope extends Building{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	static readonly image: HTMLImageElement = new Image();

	constructor(x: number, y: number) {
		super(x, y, false, true, FlyEarthRope.name, 1,
			FlyEarthRope.image, 0, 0, 0, 
			100, 0, false, false,
			FlyEarthRope.imageHandler);
		this.maxImpulse = 0;
		FlyEarthRope.init(true);
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			FlyEarthRope.imageHandler.new(FlyEarthRope.image).src = FlyEarthRopeImage;
		}
	}

	drawHealth(): void{
		super.drawHealthBase(this.x - 15, this.y - 10, 50);
	}
}