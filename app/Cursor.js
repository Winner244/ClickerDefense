class Cursor{
	static default = './media/cursors/Standart.png';
	static pick = './media/cursors/Pick.png';
	static hand = './media/cursors/Hand.png';
	static sword = './media/cursors/Sword.png';
	static swordRed = './media/cursors/SwordRed.png';

	static setCursor(cursor){
		document.body.style.cursor = "url(" + cursor + "), auto";
	}
}