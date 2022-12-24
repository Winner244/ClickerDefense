import {Building} from './Building';
import {Draw} from '../gameSystems/Draw';

import FlyEarthRopeImage from '../../assets/img/buildings/flyEarthRope.png';  

/** Канат держащий землю - главное здание в еденичном экземпляре */
export class FlyEarthRope extends Building{
	static readonly image: HTMLImageElement = new Image();

	constructor(x: number, y: number) {
		super(x, y, false, true, FlyEarthRope.name, 
			FlyEarthRope.image, 0, 0, FlyEarthRope.image.width, FlyEarthRope.image.height, 0, 
			100, 0, '', false, false);
		this.maxImpulse = 0;
		FlyEarthRope.init(true);
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			FlyEarthRope.image.src = FlyEarthRopeImage;  //load image only once
		}
	}

	drawHealth(): void{
		if(this.health < this.healthMax && this.health > 0){
			Draw.drawHealth(this.x - 15, this.y - 10, 50, this.healthMax, this.health);
		}
	}
}