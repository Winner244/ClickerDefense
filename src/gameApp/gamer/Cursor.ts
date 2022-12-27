
import StandartImage from '../../assets/cursors/Standart.png';
import PickImage from '../../assets/cursors/Pick.png';
import PickYellowImage from '../../assets/cursors/PickYellow.png';
import HandImage from '../../assets/cursors/Hand.png';
import SwordImage from '../../assets/cursors/Sword.png';  
import SwordRedImage from '../../assets/cursors/SwordRed.png';  

/** Отображение курсора мыши - единичный статичный класс */
export class Cursor{
	static readonly default: string = StandartImage;
	static readonly pick: string = PickImage;
	static readonly pickYellow: string = PickYellowImage;
	static readonly hand: string = HandImage;
	static readonly sword: string = SwordImage;
	static readonly swordRed: string = SwordRedImage;

	static readonly cursorWaitAfterChangeMs: number = 100; //время на которое замораживается курсор после изменения, что бы небыло морганий (миллисекунды)
	static cursorWaitLeftTimeMs: number = 0; //сколько времени заморозки осталось (миллисекунды)

	static setCursor(cursor: string){
		if(cursor == Cursor.swordRed || cursor == Cursor.pickYellow){
			Cursor.cursorWaitLeftTimeMs = Cursor.cursorWaitAfterChangeMs; //замораживаем текущий курсор (работает нестабильно)
		}
		else if(Cursor.cursorWaitLeftTimeMs > 0){
			return;
		}

		document.body.style.cursor = "url(" + cursor + "), auto";
	}
}