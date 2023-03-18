import {Draw} from '../gameSystems/Draw';
import {AudioSystem} from '../gameSystems/AudioSystem';

import {Building} from './Building';
import {FlyEarth} from './FlyEarth';
import {FlyEarthRope} from './FlyEarthRope';

import {SimpleObject} from '../../models/SimpleObject';
import Animation from '../../models/Animation';

import {Monster} from '../monsters/Monster';

import {BuildingButtons} from '../../reactApp/components/BuildingButtons/BuildingButtons';

import ExplosionSound from '../../assets/sounds/buildings/explosion_building.mp3'; 

import ExplosionImage from '../../assets/img/buildings/explosion.png'; 

/** Система управления всеми зданиями - единичный статичный класс */
export class Buildings{
	static readonly explosionAnimation: Animation = new Animation(10, 1000); //анимация после разрушения здания

	static all: Building[] = []; //все строения
	static explosions: SimpleObject[] = []; //анимации разрушения 

	static flyEarth: FlyEarth; //ключевое воздушное здание
	static flyEarthRope: FlyEarthRope; //ключивое наземное здание

	static init(isLoadResources: boolean = true): void{
		this.all = [];

		this.flyEarth = new FlyEarth(0, -1000);
		let flyEarthImageOnLoad = () => {
			this.flyEarth.x = Draw.canvas.width / 2 - this.flyEarth.width / 2;
			this.flyEarth.y = Draw.canvas.height / 2 - this.flyEarth.height / 2;
		}
		FlyEarth.image.onload = flyEarthImageOnLoad;
		if(FlyEarthRope.image.complete){
			flyEarthImageOnLoad();
		}
		
		this.flyEarthRope = new FlyEarthRope(Draw.canvas.width / 2, Draw.canvas.height);
		let flyEarthRopeImageOnLoad = () => {
			this.flyEarthRope.x = this.flyEarth.x + this.flyEarth.width / 2 - this.flyEarthRope.width / 2;
			this.flyEarthRope.y = this.flyEarth.y + this.flyEarth.height - 8;
		}
		FlyEarthRope.image.onload = flyEarthRopeImageOnLoad;
		if(FlyEarthRope.image.complete){
			flyEarthRopeImageOnLoad();
		}

		Buildings.all.push(this.flyEarthRope);
		Buildings.all.push(this.flyEarth);
	}

	static loadResources(){
		this.explosionAnimation.image.src = ExplosionImage;
		AudioSystem.load(ExplosionSound);
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isWaveStarted: boolean, isWaveEnded: boolean): boolean{
		let isProcessed = false;
		let buildings = this.all.slice().reverse();
		let isAnyMouseIn = false;
		for(var i = 0; i < buildings.length; i++){
			let building = buildings[i];
			let isMouseIn = 
				mouseX > building.x + building.reduceHover && 
				mouseX < building.x + building.width - building.reduceHover &&
				mouseY > building.y + building.reduceHover && 
				mouseY < building.y + building.height - building.reduceHover;
			isAnyMouseIn = isAnyMouseIn || isMouseIn;
			
			isProcessed = building.mouseLogic(mouseX, mouseY, isClick, isWaveStarted, isWaveEnded, isMouseIn);
			if(isProcessed){
				break;
			}
		}

		if(!isAnyMouseIn){
			BuildingButtons.isEnterMouse = false;
		}

		return isProcessed;
	}

	static logic(drawsDiffMs: number, isWaveStarted: boolean, isGameOver: boolean, monsters: Monster[], bottomShiftBorder: number){
		//логика анимации разрушения здания
		if(this.explosions.length){
			for(let i = 0; i < this.explosions.length; i++){
				this.explosions[i].leftTimeMs -= drawsDiffMs;
				if(this.explosions[i].leftTimeMs <= 0){
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
					this.explosions.push(new SimpleObject(building.x, building.y, building.width, building.height, this.explosionAnimation.durationMs));
					this.all.splice(i, 1);
					i--;
					AudioSystem.play(building.centerX, ExplosionSound, 0.1, 2, false, true);
				}
				else{
					building.logic(drawsDiffMs, monsters, bottomShiftBorder, isWaveStarted)
				}
			}
		}
	}

	static draw(drawsDiffMs: number, isGameOver: boolean): void{
		//разрушения зданий
		this.explosions.forEach(explosion => {
			let newHeight = this.explosionAnimation.image.height * (explosion.size.width / (this.explosionAnimation.image.width / this.explosionAnimation.frames));
			this.explosionAnimation.leftTimeMs = explosion.leftTimeMs;
			this.explosionAnimation.draw(drawsDiffMs, false, explosion.location.x, explosion.location.y + explosion.size.height - newHeight, explosion.size.width, newHeight);
		});

		Buildings.all.forEach(building => building.draw(drawsDiffMs, isGameOver));
	}

	static drawHealth(): void{
		Buildings.all.forEach(building => building.drawHealth());
	}

	static drawRepairingAnumation(): void{
		Buildings.all.forEach(building => building.drawRepairingAnumation());
	}
}