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

	static onClickByItem(element){
		if(element.className.indexOf('shop__item--info') > -1){
			element.className = element.className.replace(' shop__item--info', '');
		}
		else{
			element.className = element.className + ' shop__item--info';
		}
	}
}