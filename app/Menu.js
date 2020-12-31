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
	static get buttonOpenMenu(){
		return document.getElementById('menu-button-open');
	}

	static clickNewGame(){
		Menu.hide();
		Menu.showCanvas();
		Game.init();
		Waves.startFirstWave();
	}

	static clickContinueGame(){
		Game.continue();
		Menu.hide();
	}

	static show(){
		Menu.element.style.display = 'block';
		Draw.drawBlackout();
		Menu.hideButtonOpenMenu();
	}
	static hide(){
		Menu.element.style.display = 'none';
		Menu.showButtonOpenMenu();
	}


	static showButtonContinueGame(){
		Menu.buttonContinueGame.style.display = 'block';
	}
	static hideButtonContinueGame(){
		Menu.buttonContinueGame.style.display = 'none';
	}


	static showButtonOpenMenu(){
		Menu.buttonOpenMenu.style.display = 'block';
	}
	static hideButtonOpenMenu(){
		Menu.buttonOpenMenu.style.display = 'none';
	}


	static showCanvas(){
		Draw.canvas.style.display = 'block';
	}
}