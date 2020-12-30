class Menu{
	static get element(){
		return document.getElementById('menu');
	}

	static clickNewGame(){
		Menu.hideMenu();
		Menu.showCanvas();
		Game.init();
	}

	static hideMenu(){
		Menu.element.style.display = 'none';
	}

	static showCanvas(){
		Draw.canvas.style.display = 'block';
	}
}