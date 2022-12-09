import {Cursor} from '../Cursor';
import {Coin} from '../gameObjects/Coin';
import {Labels} from './Labels';
import {AudioSystem} from './AudioSystem';
import {Gamer} from '../gameObjects/Gamer';

import CoinGetSoundUrl from '../../assets/sounds/coins/coinGet.mp3'; 

export class Coins{
	static all: Coin[] = [];

	static init(isLoadResources: boolean = true): void{
		this.all = [];
		Coin.init(isLoadResources);
	}

	static create(x: number, y: number): void{
		Coins.all.push(new Coin(x, y));
	}

	static delete(i: number): void{
		Coins.all.splice(i, 1);
	}

	private static playSoundGet(x: number){
		AudioSystem.play(x, CoinGetSoundUrl, 0.4);
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean): boolean{
		for(let i = 0; i < Coins.all.length; i++){
			if(Math.pow(mouseX - Coins.all[i].x - Coin.image.width / 2, 2) + Math.pow(mouseY - Coins.all[i].y - Coin.image.height / 2, 2) < Math.pow(Coin.image.width / 2, 2)){
				Cursor.setCursor(Cursor.hand);

				if(isClick){
					Labels.createCoinLabel(mouseX - 10, mouseY - 10, '+1');
					Coins.delete(i);
					Gamer.coins++;
					Coins.playSoundGet(mouseX);
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