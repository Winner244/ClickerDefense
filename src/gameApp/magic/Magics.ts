import AnimationInfinite from '../../models/AnimationInfinite';

import {Draw} from '../gameSystems/Draw';

import {Mouse} from '../gamer/Mouse';

import {Point} from '../../models/Point';

import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';
import {Magic} from './Magic';


/** Система управления всеми задействованными магиями - единичный статичный класс */
export class Magics{
	static all: Magic[] = []; //все задействованные магии
	static cursorMagicAnimation: AnimationInfinite|null; //анимация магии на курсоре
	static shiftCursorMagicAnimation: Point; //сдвиг анимация магии на курсоре

	static init(): void{
		this.all = [];
	}

	static loadResources(){
	}

	static displayOnCursor(magicAnimationForCursor: AnimationInfinite, shiftAnimationForCursor: Point){
		this.cursorMagicAnimation = magicAnimationForCursor
		this.shiftCursorMagicAnimation = shiftAnimationForCursor
	}

	static clearCursor(){
		this.cursorMagicAnimation = null;
	}

	static create(magic: Magic){
		//TODO: clone magic or create new by class
		this.all.push(magic);
		this.cursorMagicAnimation = null;
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isHoverFound: boolean, isWaveStarted: boolean, isWaveEnded: boolean, isBuilderActive: boolean): boolean{
		let isProcessed = false;
		return isProcessed;
	}

	static logic(drawsDiffMs: number, isGameOver: boolean, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(isGameOver){
			this.clearCursor();
			return;
		}

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

	static draw(drawsDiffMs: number, isGameOver: boolean): void{
		this.all.forEach(magic => magic.draw(drawsDiffMs, isGameOver));
		if(this.cursorMagicAnimation && !isGameOver){
			let x = Mouse.x / (Draw.canvas.clientWidth / Draw.canvas.width);
			let y = Mouse.y / (Draw.canvas.clientHeight / Draw.canvas.height);
			let width = 50;
			let height = 50;
			this.cursorMagicAnimation.draw(drawsDiffMs, isGameOver, x + this.shiftCursorMagicAnimation.x, y + this.shiftCursorMagicAnimation.y, width, height);
		}
	}
}