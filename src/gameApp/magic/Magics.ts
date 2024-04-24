import {Draw} from '../gameSystems/Draw';

import {Mouse} from '../gamer/Mouse';

import {Point} from '../../models/Point';

import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';
import {Magic} from './Magic';
import {Meteor} from './Meteor';

import {Helper} from '../helpers/Helper';


/** Система управления всеми задействованными магиями - единичный статичный класс */
export class Magics{
	static all: Magic[] = []; //все задействованные магии
	static starCreatingPoint: Point|null; //точка начала создания магии
	static cursorMagic: Magic|null; //магия на курсоре

	static readonly cursorMagicWidth: number = 50; //ширина отображаемой магии на курсоре после выбора
	static readonly cursorMagicHeight: number = 50; //высота отображаемой магии на курсоре после выбора

	static init(): void{
		this.all = [];
	}

	static loadResources(){
	}

	static displayOnCursor(magic: Magic){
		this.cursorMagic = magic
	}

	static clearCursor(){
		this.cursorMagic = null;
		this.starCreatingPoint = null;
	}

	static startCreatingCursorAnimation(magic: Magic, pointStart: Point){
		this.starCreatingPoint = pointStart;
		this.cursorMagic = magic;
	}

	static create(magic: Magic, pointEnd: Point){
		let pointStart = this.starCreatingPoint ?? pointEnd;
		let angle = Helper.getRotateAngle(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y); //0 - it is bottom, 90 - it is right, 360-90 it is left, 180 it is top
		let distance = Helper.getDistance(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y);

		switch(magic.name){
			case Meteor.name: 
				let meteor = magic as Meteor;
				//TODO: move logic to calculate x and y to inside Meteor
				this.all.push(new Meteor(pointEnd.x, (distance > 100 ? angle : 0), meteor.size));
				break;
			default: throw `not expected magic name '${magic.name}'`;
		}
		
		this.clearCursor();
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

			//магия окончена?
			if(magic.isEnd){
				this.all.splice(i, 1);
				i--;
				continue;
			}
		}
	}

	static draw(drawsDiffMs: number, isGameOver: boolean): void{
		this.all.forEach(magic => magic.draw(drawsDiffMs, isGameOver));

		if(this.cursorMagic && !isGameOver){

			this.cursorMagic.drawTrajectory(drawsDiffMs, this.starCreatingPoint);

			let x = Mouse.canvasX + this.cursorMagic.shiftAnimationForCursor.x;
			let y = Mouse.canvasY + this.cursorMagic.shiftAnimationForCursor.y;
			this.cursorMagic.animationForCursor.draw(drawsDiffMs, isGameOver, x, y, Magics.cursorMagicWidth, Magics.cursorMagicHeight);
		}
	}
}