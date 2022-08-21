import {FlyEarth} from '../buildings/FlyEarth';
import {FlyEarthRope} from '../buildings/FlyEarthRope';

import {SimpleObject} from '../../models/SimpleObject';
import Animation from '../../models/Animation';

import {Draw} from './Draw';

import {Building} from '../gameObjects/Building';
import { Monster } from '../gameObjects/Monster';

import ExplosionImage from '../../assets/img/buildings/explosion.png'; 

export class Buildings{
	static all: Building[] = []; //все строения
	
	static explosionANimation: Animation = new Animation(10, 1000); //анимация после разрушения здания
	static explosions: SimpleObject[] = []; //анимации разрушения 

	static flyEarth: Building; //ключевое воздушное здание
	static flyEarthRope: Building; //ключивое наземное здание

	static init(isLoadImage: boolean = true): void{
		Building.init(isLoadImage);
		
		this.all = [];
		
		if(isLoadImage){
			this.explosionANimation.image.src = ExplosionImage;
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

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isWaveStarted: boolean, isWaveEnded: boolean): boolean{
		let isProcessed = false;
		let buildings = this.all.slice().reverse();
		for(var i = 0; i < buildings.length; i++){
			let building = buildings[i];
			let isMouseIn = 
				mouseX > building.x + building.reduceHover && 
				mouseX < building.x + building.width - building.reduceHover &&
				mouseY > building.y + building.reduceHover && 
				mouseY < building.y + building.height - building.reduceHover;
			
			isProcessed = building.mouseLogic(mouseX, mouseY, isClick, isWaveStarted, isWaveEnded, isMouseIn);
			if(isProcessed){
				break;
			}
		}

		return isProcessed;
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
					this.explosions.push(new SimpleObject(building.x, building.y, building.width, building.height, this.explosionANimation.duration));
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
			let newHeight = this.explosionANimation.image.height * (explosion.size.width / (this.explosionANimation.image.width / this.explosionANimation.frames));
			this.explosionANimation.draw(false, explosion.location.x, explosion.location.y + explosion.size.height - newHeight, explosion.size.width, newHeight, explosion.lifeTime);
			Draw.ctx.globalAlpha = 1;

		});

		Buildings.all.forEach(building => building.draw(millisecondsFromStart, isGameOver));
	}

	static drawHealth(): void{
		Buildings.all.forEach(building => building.drawHealth());
	}

	static drawRepairingAnumation(): void{
		Buildings.all.forEach(building => building.drawRepairingAnumation());
	}
}