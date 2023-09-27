import {SimpleObject} from "../../models/SimpleObject";

import {Building} from "../buildings/Building";

import {Monster} from "../monsters/Monster";

import {Unit} from "./Unit";


/** Система управления всеми юнитами - единичный статичный класс */
export class Units {
	static all: Unit[] = []; //все созданные и пока ещё живые юниты
	static deaths: SimpleObject[] = []; //анимации гибели юнитов 

	
	static init(){
		Units.all = [];
	}

	static loadResources(){
		//this.deathAnimation.image.src = DeathImage;
		//AudioSystem.load(DeathSound);
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isHoverFound: boolean, isWaveStarted: boolean, isWaveEnded: boolean, isBuilderActive: boolean): boolean{
		let isProcessed = false;
		let isAnyMouseIn = false;

		if(isHoverFound){
			let units = this.all.slice().reverse();
			for(var i = 0; i < units.length; i++){
				let unit = units[i];
				let isMouseIn = 
					mouseX > unit.x + unit.reduceHover && 
					mouseX < unit.x + unit.width - unit.reduceHover &&
					mouseY > unit.y + unit.reduceHover && 
					mouseY < unit.y + unit.height - unit.reduceHover;
				isAnyMouseIn = isAnyMouseIn || isMouseIn;
				
				isProcessed = unit.mouseLogic(mouseX, mouseY, isClick, isWaveStarted, isWaveEnded, isMouseIn, isBuilderActive);
				if(isProcessed){
					break;
				}
			}
		}

		if(!isAnyMouseIn){
			//UnitsButtons.isEnterMouse = false;
		}

		return isProcessed;
	}

	static logic(drawsDiffMs: number, isWaveStarted: boolean, isGameOver: boolean, buildings: Building[], monsters: Monster[], bottomShiftBorder: number){
		//логика анимации гибели юнита
		if(this.deaths.length){
			for(let i = 0; i < this.deaths.length; i++){
				this.deaths[i].leftTimeMs -= drawsDiffMs;
				if(this.deaths[i].leftTimeMs <= 0){
					this.deaths.splice(i, 1);
					i--;
				}
			}
		}

		if(!isGameOver){
			for(let i = 0; i < this.all.length; i++)
			{
				let unit = this.all[i];
				if(this.all[i].health <= 0){ //проверка здоровья
					unit.destroy();
					//this.deaths.push(new SimpleObject(unit.x, unit.y, unit.width, unit.height, this.deathAnimation.durationMs));
					this.all.splice(i, 1);
					i--;
					//AudioSystem.play(unit.centerX, DeathSound, 0.1, 2, false, true);
				}
				else{
					unit.logic(drawsDiffMs, buildings, monsters, this.all, bottomShiftBorder, isWaveStarted)
				}
			}
		}
	}

	static clearModifiers(){
		Units.all.forEach(unit => unit.modifiers = []);
	}

	static draw(drawsDiffMs: number, isGameOver: boolean): void{
		//разрушения зданий
		this.deaths.forEach(explosion => {
			//let newHeight = this.deathAnimation.image.height * (explosion.size.width / (this.deathAnimation.image.width / this.deathAnimation.frames));
			//this.deathAnimation.leftTimeMs = explosion.leftTimeMs;
			//this.deathAnimation.draw(drawsDiffMs, false, explosion.location.x, explosion.location.y + explosion.size.height - newHeight, explosion.size.width, newHeight);
		});

		Units.all.forEach(unit => unit.draw(drawsDiffMs, isGameOver));
	}

	static drawHealth(): void{
		Units.all.forEach(unit => unit.drawHealth());
	}

	static drawRepairingAnumation(): void{
		Units.all.forEach(unit => unit.drawRepairingAnumation());
	}

	static drawModifiersAhead(drawsDiffMs: number, isGameOver: boolean): void{
		Units.all.forEach(unit => unit.drawModifiersAhead(drawsDiffMs, isGameOver));
	}
}