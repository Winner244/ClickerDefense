
import StandartImage from '../assets/cursors/Standart.png';
import PickImage from '../assets/cursors/Pick.png';
import PickYellowImage from '../assets/cursors/PickYellow.png';
import HandImage from '../assets/cursors/Hand.png';
import SwordImage from '../assets/cursors/Sword.png';  
import SwordRedImage from '../assets/cursors/SwordRed.png';  

export class Cursor{
	static readonly default: string = StandartImage;
	static readonly pick: string = PickImage;
	static readonly pickYellow: string = PickYellowImage;
	static readonly hand: string = HandImage;
	static readonly sword: string = SwordImage;
	static readonly swordRed: string = SwordRedImage;

	static cursorWait: number = 0; 

	static setCursor(cursor: string){
		if(cursor == Cursor.swordRed || cursor == Cursor.pickYellow){
			Cursor.cursorWait = 100; //замораживаем текущий курсор на 100 миллисекунд (работает нестабильно)
		}
		else if(Cursor.cursorWait > 0){
			return;
		}

		document.body.style.cursor = "url(" + cursor + "), auto";
	}
}