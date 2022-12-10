import {Draw} from '../gameSystems/Draw';

import {Helper} from '../helpers/Helper';

import CoinImage from '../../assets/img/coin.png'; 

export class Coin {
	static readonly lifetime: number = 5; //время жизни монетки (в секундах)
	static readonly image: HTMLImageElement = new Image();  

	x: number;
	y: number;
	impulseY: number;
	lifeTimeLeft: number; //осталось времени жизни

	static init(isLoadResources: boolean = true){
		if(isLoadResources){
			Coin.image.src = CoinImage;
		}
	}

	constructor(x: number, y: number){
		this.x = x; 
		this.y = y;
		this.impulseY = 0;
		this.lifeTimeLeft = Coin.lifetime * 1000;
	}

	logic(millisecondsDifferent: number, bottomShiftBorder: number): void{
		
		//ускорение свободного падения
		if(this.y + Coin.image.height < Draw.canvas.height - bottomShiftBorder){ 
			if (this.impulseY < 0)
				this.impulseY += 0.02;
			else
				this.impulseY += 0.01;
		}

		//перемещение
		this.y += millisecondsDifferent * this.impulseY;

		//отскок от земли
		if(this.y + Coin.image.height > Draw.canvas.height - bottomShiftBorder){
			this.y = Draw.canvas.height - bottomShiftBorder - Coin.image.height;
			this.impulseY = -this.impulseY * Helper.getRandom(1, 6) / 10;
		}
	}

	draw(): void{
		Draw.ctx.drawImage(Coin.image, this.x, this.y);
	}
}