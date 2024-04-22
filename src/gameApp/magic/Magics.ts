import AnimationInfinite from '../../models/AnimationInfinite';

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
				//let x = 
				//let y = 
				//this.all.push(new Meteor());
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
		}
	}

	static draw(drawsDiffMs: number, isGameOver: boolean): void{
		this.all.forEach(magic => magic.draw(drawsDiffMs, isGameOver));

		if(this.cursorMagic && !isGameOver){

			if(this.cursorMagic.name == Meteor.name){
				let angle = 0;
				if(this.starCreatingPoint){
					let pointStart = this.starCreatingPoint;
					let pointEnd = Mouse.getCanvasMousePoint();
					let distance = Helper.getDistance(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y); 
					if (distance > 10){
						angle = Helper.getRotateAngle(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y); //0 - it is bottom, 90 - it is right, 360-90 it is left, 180 it is top
					} 
				}

				//TODO: display trajectory 
			}

			let x = Mouse.x / (Draw.canvas.clientWidth / Draw.canvas.width);
			let y = Mouse.y / (Draw.canvas.clientHeight / Draw.canvas.height);
			let width = 50;
			let height = 50;
			this.cursorMagic.animationForCursor.draw(drawsDiffMs, isGameOver, x + this.cursorMagic.shiftAnimationForCursor.x, y + this.cursorMagic.shiftAnimationForCursor.y, width, height);
		}
	}
}