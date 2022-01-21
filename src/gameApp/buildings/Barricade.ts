import {Building} from '../gameObjects/Building';
import {Draw} from '../gameSystems/Draw';

import towerImage from '../../assets/img/buildings/barricade/barricade.png';  

export class Barricade extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 226 * 0.7;
	static readonly height: number = 189 * 0.7;

	static readonly damageMirrorPercentage: number = 10; //количество возвращаемого монстрам урона (%)

	constructor(x: number) {
		super(x, 
			(Draw.canvas ? Draw.canvas.height : 0) - Barricade.height + 10, 
			false,
			true, //isLand
			'Баррикада', 
			Barricade.image, 0, Barricade.width, Barricade.height, 15,
			250, //health max
			25, // price
			'Колючая и непроходимая. Сдерживает монстров и возвращает часть полученного урона, обратно, монстрам');
		this._maxImpulse = 2;
		this._impulseForceDecreasing = 5;
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage){
			this.image.src = towerImage; 
		}
	}

	get centerY(){
		return this.y + this.height / 4;
	}
}