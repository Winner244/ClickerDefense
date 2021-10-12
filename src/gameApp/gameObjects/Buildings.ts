import {FlyEarth} from '../buildings/FlyEarth';
import {FlyEarthRope} from '../buildings/FlyEarthRope';
import {Tower} from '../buildings/Tower';
import {SimpleObject} from '../../models/SimpleObject';

import {Cursor} from '../Cursor';

import {Draw} from '../gameSystems/Draw';

import {Building} from './Building';
import {Coins} from './Coins';

import ExplosionImage from '../../assets/img/buildings/explosion.png'; 
import { Monster } from './Monster';

export class Buildings{
	static all: Building[] = []; //все строения
	
	static explosionImage: HTMLImageElement = new Image(); //анимация после разрушения здания
	static explosions: SimpleObject[] = []; //анимации разрушения 
	static readonly explosionLifeTime = 1000; //время жизни анимации разрушения (в миллисекундах)
	static readonly explosionFrames = 10;

	static flyEarth: Building; //ключевое воздушное здание
	static flyEarthRope: Building; //ключивое наземное здание

	static init(isLoadImage: boolean = true): void{
		this.all = [];
		
		FlyEarth.init(isLoadImage);
		FlyEarthRope.init(isLoadImage);
		Tower.init(isLoadImage);

		if(isLoadImage){
			this.explosionImage.src = ExplosionImage;
		}

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
				Cursor.setCursor(Cursor.pickYellow);
			}
			
			return true;
		}

		return false;
	}

	static logic(millisecondsDifferent: number, isGameOver: boolean, monsters: Monster[], bottomShiftBorder: number){
		//логика анимации разрушения здания
		if(this.explosions.length){
			for(let i = 0; i < this.explosions.length; i++){
				this.explosions[i].lifeTime -= millisecondsDifferent;
				if(this.explosions[i].lifeTime <= 0){
					this.explosions.splice(i, 1);
					i--;
				}
			}
		}

		if(!isGameOver){
			for(let i = 0; i < this.all.length; i++)
			{
				let building = this.all[i];
				if(this.all[i].health <= 0){ //проверка здоровья
					this.explosions.push(new SimpleObject(building.x, building.y, building.width, building.height, this.explosionLifeTime));
					this.all.splice(i, 1);
					i--;
				}
				else{
					building.logic(millisecondsDifferent, monsters, bottomShiftBorder)
				}
			}
		}
	}

	static draw(millisecondsFromStart: number, isGameOver: boolean): void{
		//разрушения зданий
		this.explosions.forEach(explosion => {
			let frame = Math.floor((this.explosionLifeTime - explosion.lifeTime) / this.explosionLifeTime * this.explosionFrames);
			let newHeight = this.explosionImage.height * (explosion.size.width / (this.explosionImage.width / this.explosionFrames));
			Draw.ctx.drawImage(this.explosionImage, 
				this.explosionImage.width / this.explosionFrames * frame, //crop from x
				0, //crop from y
				this.explosionImage.width / this.explosionFrames, //crop by width
				this.explosionImage.height,    //crop by height
				explosion.location.x, //draw from x
				explosion.location.y + explosion.size.height - newHeight,  //draw from y
				explosion.size.width, //draw by width 
				newHeight); //draw by height 

		});

		Buildings.all.forEach(building => building.draw(millisecondsFromStart, isGameOver));
	}

	static drawHealth(): void{
		Buildings.all.forEach(building => building.drawHealth());
	}
}