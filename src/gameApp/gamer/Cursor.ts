
import StandartImage from '../../assets/cursors/Standart.png';
import PickImage from '../../assets/cursors/Pick.png';
import PickYellowImage from '../../assets/cursors/PickYellow.png';
import HandImage from '../../assets/cursors/Hand.png';
import SwordImage from '../../assets/cursors/Sword.png';  
import SwordRedImage from '../../assets/cursors/SwordRed.png';  

import {BaseCursorModifier} from '../cursorModifiers/BaseCursorModifier';

import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';
import {Building} from '../buildings/Building';
import {Draw} from '../gameSystems/Draw';
import {Mouse} from './Mouse';
import {ImageHandler} from '../ImageHandler';
import AnimationInfinite from '../../models/animations/AnimationInfinite';

/** Отображение курсора мыши - единичный статичный класс */
export class Cursor{
	static allModifiers: BaseCursorModifier[] = []; //все модификаторы курсора

	static readonly default: string = StandartImage;
	static readonly pick: string = PickImage;
	static readonly pickYellow: string = PickYellowImage;
	static readonly hand: string = HandImage;
	static readonly sword: string = SwordImage;
	static readonly swordRed: string = SwordRedImage;

	//для модификации курсора с canvas отрисовкой мыши (this.allModifiers.find(x => x.isUseNotHardwareCursor) != null)
	private static readonly imageHandler: ImageHandler = new ImageHandler();
	private static readonly defaultImage: HTMLImageElement = new Image();
	private static readonly pickImage: HTMLImageElement = new Image();
	private static readonly pickYellowImage: HTMLImageElement = new Image();
	private static readonly handImage: HTMLImageElement = new Image();
	private static readonly swordImage: HTMLImageElement = new Image();
	private static readonly swordRedImage: HTMLImageElement = new Image();
	static isCursorCanvasOut: boolean = false; //курсор вышел за границы canvas ?

	static readonly cursorWaitAfterChangeMs: number = 100; //время на которое замораживается курсор после изменения, что бы небыло морганий (миллисекунды)
	static cursorWaitLeftTimeMs: number = 0; //сколько времени заморозки осталось (миллисекунды)
	static currentCursorType: string = "";
	static currentCursorForceHardware: boolean = false;

	static init(){
		//для модификации курсора с canvas отрисовкой мыши (this.allModifiers.find(x => x.isUseNotHardwareCursor) != null)
		Cursor.imageHandler.new(Cursor.defaultImage).src = StandartImage;
		Cursor.imageHandler.new(Cursor.pickImage).src = PickImage;
		Cursor.imageHandler.new(Cursor.pickYellowImage).src = PickYellowImage;
		Cursor.imageHandler.new(Cursor.handImage).src = HandImage;
		Cursor.imageHandler.new(Cursor.swordImage).src = SwordImage;
		Cursor.imageHandler.new(Cursor.swordRedImage).src = SwordRedImage;

		var canvas = document.querySelector('.game-canvas');
		if(canvas){
			canvas.addEventListener('mouseleave', () => {
				this.isCursorCanvasOut = true;
				Cursor.setCursor(this.currentCursorType, this.currentCursorForceHardware);
			});

			canvas.addEventListener('mouseenter', () => {
				this.isCursorCanvasOut = false;
				Cursor.setCursor(this.currentCursorType, this.currentCursorForceHardware);
			});
		}
	}

	static convert(cursorSrc: string) : HTMLImageElement{
		switch(cursorSrc){
			case Cursor.default: return Cursor.defaultImage;
			case Cursor.pick: return Cursor.pickImage;
			case Cursor.pickYellow: return Cursor.pickYellowImage;
			case Cursor.hand: return Cursor.handImage;
			case Cursor.sword: return Cursor.swordImage;
			case Cursor.swordRed: return Cursor.swordRedImage;
			default: return Cursor.defaultImage;
		}
	}

	static setCursor(cursor: string, isForceHardwareCursor: boolean = false)
	{
		this.currentCursorForceHardware = isForceHardwareCursor;
		if(this.isCursorCanvasOut){
			document.body.style.cursor = "url(" + this.default + "), auto";
			return;
		}

		if(cursor == Cursor.swordRed || cursor == Cursor.pickYellow){
			Cursor.cursorWaitLeftTimeMs = Cursor.cursorWaitAfterChangeMs; //замораживаем текущий курсор (работает нестабильно)
		}
		else if(Cursor.cursorWaitLeftTimeMs > 0){
			return;
		}

		this.currentCursorType = cursor;

		//будет отрисованный курсор ? нет - значит аппаратный
		var isUseNotHardwareCursor = this.allModifiers.find(x => x.isUseNotHardwareCursor) != null;
		if (isUseNotHardwareCursor && !isForceHardwareCursor){
			document.body.style.cursor = "none";
			return;
		}

		if(this.allModifiers?.length){
			if(cursor == this.default){
				cursor = (this.allModifiers.map(x => x.imageForDefaultCursor).find(x => x && x instanceof HTMLImageElement) as HTMLImageElement|null)?.src ?? this.default;
			}
			else if(cursor == this.sword){
				cursor = (this.allModifiers.map(x => x.imageForSwordCursor).find(x => x && x instanceof HTMLImageElement) as HTMLImageElement|null)?.src ?? this.sword;
			}
			else if(cursor == this.swordRed){
				cursor = (this.allModifiers.map(x => x.imageForSwordAttackCursor).find(x => x && x instanceof HTMLImageElement) as HTMLImageElement|null)?.src ?? this.swordRed;
			}
		}

		document.body.style.cursor = "url(" + cursor + "), auto";
	}

	static clickByMonster(monster: Monster)
	{
		Cursor.allModifiers.forEach(x => x.clickByMonster(monster));
	}

	static click(isHoverFound: boolean, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number)
	{
		Cursor.allModifiers.forEach(x => x.click(isHoverFound, buildings, monsters, units, bottomShiftBorder));
	}


	static logic(drawsDiffMs: number, isGameOver: boolean, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number)
	{
		if(isGameOver){
			return;
		}

		Cursor.allModifiers.forEach(x => x.logic(drawsDiffMs, buildings, monsters, units, bottomShiftBorder));
	}

	static draw(drawsDiffMs: number, isGameOver: boolean): void
	{
		if(isGameOver){
			return;
		}
		
		Cursor.allModifiers.forEach(x => x.draw(drawsDiffMs, isGameOver));

		var isUseNotHardwareCursor = this.allModifiers.find(x => x.isUseNotHardwareCursor) != null;
		if(isUseNotHardwareCursor){
			
			var cursor: HTMLImageElement | AnimationInfinite = Cursor.convert(this.currentCursorType);
			if(this.allModifiers?.length){
				if(this.currentCursorType == this.default){
					cursor = this.allModifiers.find(x => x.imageForDefaultCursor)?.imageForDefaultCursor ?? this.defaultImage;
				}
				else if(this.currentCursorType == this.sword){
					cursor = this.allModifiers.find(x => x.imageForSwordCursor)?.imageForSwordCursor ?? this.swordImage;
				}
				else if(this.currentCursorType == this.swordRed){
					cursor = this.allModifiers.find(x => x.imageForSwordAttackCursor)?.imageForSwordAttackCursor ?? this.swordRedImage;
				}
			}

			if(cursor instanceof AnimationInfinite){
				cursor.draw(drawsDiffMs, false, Mouse.canvasX, Mouse.canvasY);
			}
			else{
				Draw.ctx.drawImage(cursor, Mouse.canvasX, Mouse.canvasY);
			}
		}
	}
}
