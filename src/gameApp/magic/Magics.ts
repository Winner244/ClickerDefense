import AnimationInfinite from '../../models/AnimationInfinite';

import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';

import {Magic} from './Magic';


/** Система управления всеми задействованными магиями - единичный статичный класс */
export class Magics{
	static all: Magic[] = []; //все задействованные магии
	static cursorMagicAnimation: AnimationInfinite|null; //анимация магии на курсоре

	static init(): void{
		this.all = [];
	}

	static loadResources(){
	}

	static displayOnCursor(magic: Magic){
		//TODO: this.cursorMagicAnimation = magic;
	}

	static deleteAllFromCursor(){
		this.cursorMagicAnimation = null;
	}

	static add(magic: Magic){
		//TODO: clone magic or create new by class
		this.all.push(magic);
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isHoverFound: boolean, isWaveStarted: boolean, isWaveEnded: boolean, isBuilderActive: boolean): boolean{
		let isProcessed = false;
		//TODO this.cursorMagicAnimation.
		return isProcessed;
	}

	static logic(drawsDiffMs: number, isGameOver: boolean, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!isGameOver){
			for(let i = 0; i < this.all.length; i++)
			{
				//проверка времени жизни
				let magic = this.all[i];
				if (magic.leftTime){
					magic.leftTime -= drawsDiffMs;
					if(magic.leftTime <= 0){ 
						this.all.splice(i, 1);
						i--;
						continue;
					}
				}

				//логика магии
				magic.logic(drawsDiffMs, buildings, monsters, units, bottomShiftBorder)
			}
		}
	}

	static draw(drawsDiffMs: number, isGameOver: boolean): void{
		this.all.forEach(magic => magic.draw(drawsDiffMs, isGameOver));
		//TODO this.cursorMagicAnimation.
	}
}