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
	static get buttonOutsiteOpenMenu(){
		return document.getElementById('menu-button-outside-open');
	}
	static get buttonOutsiteShop(){
		return document.getElementById('menu-button-outside-shop');
	}
	static get buttonShop(){
		return document.getElementById('menu-button-shop');
	}

	static clickNewGame(){
		Menu.hide();
		Draw.canvas.show();
		Game.init();
		Waves.startFirstWave();
	}

	static clickContinueGame(){
		Game.continue();
		Menu.hide();
	}

	static clickOpenShop(){
		Menu.element.hide();
		Shop.show();
	}


	static showStartMenu(){
		Menu.buttonContinueGame.hide()
		Menu.buttonOutsiteShop.hide()
		Menu.buttonShop.hide()
		this.show();
	}



	static show(){
		Menu.element.show();
		Draw.drawBlackout();
		Menu.buttonOutsiteOpenMenu.hide()
		Menu.buttonOutsiteShop.hide()

		if(!Waves.isStarted && Menu.buttonContinueGame.isShowed()){
			Menu.buttonShop.show();
		}
	}
	static hide(){
		Menu.element.hide();
		Menu.buttonOutsiteOpenMenu.show();
		if(!Waves.isStarted && Menu.buttonContinueGame.isShowed()){
			Menu.buttonOutsiteShop.show();
		}
	}
}