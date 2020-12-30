class Mouse{
	static x;
	static y;
	static isClick;

	static init(){
		window.addEventListener('mousemove', Mouse.onMove);
		window.addEventListener('mousedown', Mouse.onClick);
		this.isClick = false;
	}

	static onClick(){
		Mouse.isClick = true;
	}

	static onMove(event){
		Mouse.x = event.pageX;
		Mouse.y = event.pageY;
	}
}