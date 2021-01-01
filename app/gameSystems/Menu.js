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
		Menu.showElement(Draw.canvas);
		Game.init();
		Waves.startFirstWave();
	}

	static clickContinueGame(){
		Game.continue();
		Menu.hide();
	}

	static clickOpenShop(){

	}


	static showStartMenu(){
		Menu.hideElement(Menu.buttonContinueGame);
		Menu.hideElement(Menu.buttonOutsiteShop);
		Menu.hideElement(Menu.buttonShop);
		this.show();
	}



	static show(){
		Menu.element.style.display = 'block';
		Draw.drawBlackout();
		Menu.hideElement(Menu.buttonOutsiteOpenMenu);
		Menu.hideElement(Menu.buttonOutsiteShop);

		if(!Waves.isStarted && Menu.isShowedElement(Menu.buttonContinueGame)){
			Menu.showElement(Menu.buttonShop);
		}
	}
	static hide(){
		Menu.element.style.display = 'none';
		Menu.showElement(Menu.buttonOutsiteOpenMenu);
		if(!Waves.isStarted && Menu.isShowedElement(Menu.buttonContinueGame)){
			Menu.showElement(Menu.buttonOutsiteShop);
		}
	}



	static showElement(element){
		element.style.display = 'block';
	}
	static hideElement(element){
		element.style.display = 'none';
	}
	static isShowedElement(element){
		return element.style.display != 'none';
	}
}