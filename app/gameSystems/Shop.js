class Shop{
	static get element(){
		return document.getElementById('shop');
	}

	
	static show(){
		this.element.show();
		Game.pause();
		Menu.buttonOutsiteOpenMenu.hide()
		Menu.buttonOutsiteShop.hide()
	}

	static hide(){
		this.element.hide();
		Menu.buttonOutsiteOpenMenu.show();
		Menu.buttonOutsiteShop.show();
		Game.continue();
	}
}