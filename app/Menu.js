class Menu{
	static get element(){
		return document.getElementById('menu');
	}
	static get buttonNewGame(){
		return document.getElementById('menu-button-new-game');
	}
	static get buttonContinueGame(){
		return document.getElementById('menu-button-continue-game');
	}

	static clickNewGame(){
		Menu.hide();
		Menu.showCanvas();
		Game.init();
	}

	static clickContinueGame(){
		Game.continue();
		Menu.hide();
	}

	static show(){
		Menu.element.style.display = 'block';
		Draw.drawBlackout();
	}
	static hide(){
		Menu.element.style.display = 'none';
	}


	static showButtonContinueGame(){
		Menu.buttonContinueGame.style.display = 'block';
	}
	static hideButtonContinueGame(){
		Menu.buttonContinueGame.style.display = 'none';
	}

	static showCanvas(){
		Draw.canvas.style.display = 'block';
	}
}