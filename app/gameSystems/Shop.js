class Shop{
	static get element(){
		return document.getElementById('shop');
	}

	
	static show(){
		this.element.show();
	}
	static hide(){
		this.element.hide();
	}
}