import {Cursor} from '../Cursor';
import {Coin} from '../gameObjects/Coin';
import {Labels} from './Labels';
import {Gamer} from '../gameObjects/Gamer';

export class Coins{
	static all: Coin[] = [];

	static init(isLoadImage: boolean = true): void{
		this.all = [];
		Coin.init(isLoadImage);
	}

	static create(x: number, y: number): void{
		Coins.all.push(new Coin(x, y));
	}

	static delete(i: number): void{
		Coins.all.splice(i, 1);
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean): boolean{
		for(let i = 0; i < Coins.all.length; i++){
			if(Math.pow(mouseX - Coins.all[i].x - Coin.image.width / 2, 2) + Math.pow(mouseY - Coins.all[i].y - Coin.image.height / 2, 2) < Math.pow(Coin.image.width / 2, 2)){
				Cursor.setCursor(Cursor.hand);

				if(isClick){
					Labels.createGreen(mouseX - 10, mouseY - 10, '+1');
					Coins.delete(i);
					Gamer.coins++;
				}

				return true;
			}
		}
		
		return false;
	}

	static logic(millisecondsDifferent: number, bottomShiftBorder: number): void{
		for(let i = 0; i < Coins.all.length; i++){
			let coin = Coins.all[i];
			coin.lifeTimeLeft -= millisecondsDifferent;
		
			if(coin.lifeTimeLeft <= 0){
				Coins.all.splice(i, 1);
				i--;
				continue;
			}
			
			coin.logic(millisecondsDifferent, bottomShiftBorder);
		}
	}

	static draw(): void{
		Coins.all.forEach(coin => coin.draw());
	}
}