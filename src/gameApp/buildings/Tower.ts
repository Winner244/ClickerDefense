import {Building} from '../gameObjects/Building';
import ShoCategoryEnum from '../../enum/ShoCategoryEnum';
import towerImage from '../../assets/img/buildings/tower.png';  

export class Tower extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 200 * 0.7;
	static readonly height: number = 425 * 0.7;

	constructor(x: number, y: number) {
		super(x, y, 
			false,
			false, 
			'Сторожевая башня', 
			Tower.image, 0, Tower.width, Tower.height, 15, 
			200, 
			500, 
			'Стреляет по наземным и воздушным монстрам в радусе действия.', 
			ShoCategoryEnum.BUILDINGS);
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage){
			this.image.src = towerImage; 
		}
	}
}