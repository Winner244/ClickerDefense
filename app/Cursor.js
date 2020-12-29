class Cursor{
	static default = './media/cursors/Standart.png';
	static pick = './media/cursors/Pick.png';
	static hand = './media/cursors/Hand.png';
	static sword = './media/cursors/Sword.png';
	static swordRed = './media/cursors/SwordRed.png';

	static cursorWait = 0; 

	static setCursor(cursor){
		if(cursor == Cursor.swordRed){
			Cursor.cursorWait = 100; //замораживаем текущий курсор на 100 миллисекунд (работает нестабильно)
		}
		else if(Cursor.cursorWait > 0){
			return;
		}

		document.body.style.cursor = "url(" + cursor + "), auto";
	}
}