import {Building} from '../gameObjects/Building';
import {Draw} from '../gameSystems/Draw';
import towerImage from '../../assets/img/buildings/tower.png';  

export class Tower extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 200 * 0.7;
	static readonly height: number = 425 * 0.7;

	constructor(x: number) {
		super(x, 
			Draw.canvas.height - Tower.height + 10, 
			false,
			true, 
			'Сторожевая башня', 
			Tower.image, 0, Tower.width, Tower.height, 15, 
			100, 
			500, 
			'Стреляет по наземным и воздушным монстрам в радиусе действия.');
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage){
			this.image.src = towerImage; 
		}
	}
}