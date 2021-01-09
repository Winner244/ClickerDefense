export class Cursor{
	static readonly default: string = './media/cursors/Standart.png';
	static readonly pick: string = './media/cursors/Pick.png';
	static readonly hand: string = './media/cursors/Hand.png';
	static readonly sword: string = './media/cursors/Sword.png';
	static readonly swordRed: string = './media/cursors/SwordRed.png';

	static cursorWait: number = 0; 

	static setCursor(cursor: string){
		if(cursor == Cursor.swordRed){
			Cursor.cursorWait = 100; //замораживаем текущий курсор на 100 миллисекунд (работает нестабильно)
		}
		else if(Cursor.cursorWait > 0){
			return;
		}

		document.body.style.cursor = "url(" + cursor + "), auto";
	}
}