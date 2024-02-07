import {Draw} from '../gameSystems/Draw';

import {Helper} from '../helpers/Helper';

import CoinImage from '../../assets/img/coin.png'; 

/** Монетка */
export class Coin {
	static readonly FALL_END_EVENT: string = 'FALL_END_EVENT'; //название события окончания падения монетки
	static readonly lifeTimeMs: number = 5000; //время жизни монетки (миллисекунды)
	static readonly image: HTMLImageElement = new Image();  

	//поля свойства экземпляра
	x: number;
	y: number;
	impulseY: number;
	lifeTimeLeftMs: number; //осталось времени жизни (миллисекунды)
	isFallEnd: boolean; //падение завершено?


	get centerX(): number {
		return this.x + Coin.image.width / 2;
	}
	get centerY(): number {
		return this.y + Coin.image.height / 2;
	}

	static init(isLoadResources: boolean = true){
		if(isLoadResources){
			Coin.image.src = CoinImage;
		}
	}

	constructor(x: number, y: number){
		this.x = x; 
		this.y = y;
		this.impulseY = 0.1;
		this.lifeTimeLeftMs = Coin.lifeTimeMs;
		this.isFallEnd = false;
	}

	logic(drawsDiffMs: number, bottomShiftBorder: number): void{
		if(this.isFallEnd){
			return;
		}
		
		//ускорение свободного падения
		if(this.y + Coin.image.height < Draw.canvas.height - bottomShiftBorder){ 
			if (this.impulseY < 0)
				this.impulseY += 0.02;
			else
				this.impulseY += 0.01;
		}

		//перемещение
		this.y += drawsDiffMs * this.impulseY;

		//отскок от земли
		if(this.y + Coin.image.height > Draw.canvas.height - bottomShiftBorder){
			if(this.impulseY < 0.05){ //the end
				this.impulseY = 0;
				this.isFallEnd = true;
				document.dispatchEvent(new CustomEvent(Coin.FALL_END_EVENT, { detail: { coin: this } }));
			}
			else{
				this.impulseY = -this.impulseY * Helper.getRandom(1, 6) / 10;
			}
			this.y = Draw.canvas.height - bottomShiftBorder - Coin.image.height;
		}
	}

	draw(): void{
		Draw.ctx.drawImage(Coin.image, this.x, this.y);
	}
}