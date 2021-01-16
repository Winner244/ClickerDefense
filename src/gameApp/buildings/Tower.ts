import {Building} from '../gameObjects/Building';
import towerImage from '../../assets/img/buildings/tower.png';  

export class Tower extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 100;
	static readonly height: number = 211;

	constructor(x: number, y: number) {
		super(x, y, false, false, Tower.name, Tower.image, 0, Tower.width, Tower.height, 15, 200);
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage){
			this.image.src = towerImage; 
		}
	}
}