import {FlyEarth} from '../buildings/FlyEarth';
import {FlyEarthRope} from '../buildings/FlyEarthRope';
import {Tower} from '../buildings/Tower';

import {Cursor} from '../Cursor';

import {Draw} from '../gameSystems/Draw';

import {Building} from './Building';
import {Coins} from './Coins';

export class Buildings{
	static all: Building[] = []; //все строения

	static flyEarth: Building; //ключевое воздушное здание
	static flyEarthRope: Building; //ключивое наземное здание

	static init(isLoadImage: boolean = true): void{
		this.all = [];
		
		FlyEarth.init(isLoadImage);
		FlyEarthRope.init(isLoadImage);
		Tower.init(isLoadImage);

		this.flyEarth = new FlyEarth(
			Draw.canvas.width / 2 - FlyEarth.width / 2, 
			Draw.canvas.height / 2 - FlyEarth.height / 2);

		
		this.flyEarthRope = new FlyEarthRope(0, 0);
		let flyEarthRopeImageOnLoad = () => {
			this.flyEarthRope.x = this.flyEarth.x + FlyEarth.width / 2 - FlyEarthRope.image.width / 2;
			this.flyEarthRope.y = this.flyEarth.y + FlyEarth.height - 8;
			this.flyEarthRope.width = FlyEarthRope.image.width;
			this.flyEarthRope.height = FlyEarthRope.image.height;
		}
		FlyEarthRope.image.onload = flyEarthRopeImageOnLoad;
		if(FlyEarthRope.image.complete){
			flyEarthRopeImageOnLoad();
		}

		Buildings.all.push(this.flyEarthRope);
		Buildings.all.push(this.flyEarth);
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean): boolean{
		if(mouseX > this.flyEarth.x + this.flyEarth.reduceHover && 
			mouseX < this.flyEarth.x + FlyEarth.width - this.flyEarth.reduceHover &&
			mouseY > this.flyEarth.y + this.flyEarth.reduceHover && 
			mouseY < this.flyEarth.y + FlyEarth.height - this.flyEarth.reduceHover)
		{
			Cursor.setCursor(Cursor.pick);
	
			if(isClick){
				let coinX = this.flyEarth.x + this.flyEarth.reduceHover + Math.random() * (FlyEarth.width - this.flyEarth.reduceHover * 2);
				let coinY = this.flyEarth.y + FlyEarth.height / 2;
				Coins.create(coinX, coinY);
			}
			
			return true;
		}

		return false;
	}

	static draw(millisecondsFromStart: number, isGameOver: boolean): void{
		Buildings.all.forEach(building => building.draw(millisecondsFromStart, isGameOver));
	}

	static drawHealth(): void{
		Buildings.all.forEach(building => building.drawHealth());
	}
}