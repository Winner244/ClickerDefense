class Buildings{
	static all = []; //все строения

	static flyEarth; //ключевое воздушное здание
	static flyEarthRope; //ключивое наземное здание

	static init(){
		this.all = [];
		
		FlyEarth.init();
		FlyEarthRope.init();

		this.flyEarth = new FlyEarth(
			Draw.canvas.width / 2 - FlyEarth.width / 2, 
			Draw.canvas.height / 2 - FlyEarth.height / 2);

		
		this.flyEarthRope = new FlyEarthRope(0, 0);
		FlyEarthRope.image.onload = () => {
			this.flyEarthRope.x = this.flyEarth.x + FlyEarth.width / 2 - FlyEarthRope.image.width / 2;
			this.flyEarthRope.y = this.flyEarth.y + FlyEarth.height - 8;
			this.flyEarthRope.width = FlyEarthRope.image.width;
			this.flyEarthRope.height = FlyEarthRope.image.height;
		}

		Buildings.all.push(this.flyEarth);
		Buildings.all.push(this.flyEarthRope);
	}

	static mouseLogic(mouseX, mouseY, isClick){
		if(mouseX > this.flyEarth.x + this.flyEarth.reduceHover && 
			mouseX < this.flyEarth.x + FlyEarth.width - this.flyEarth.reduceHover &&
			mouseY > this.flyEarth.y + this.flyEarth.reduceHover && 
			mouseY < this.flyEarth.y + FlyEarth.height - this.flyEarth.reduceHover)
		{
			Cursor.setCursor(Cursor.pick);
	
			if(isClick){
				let coinX = this.flyEarth.x + this.flyEarth.reduceHover + Math.random() * (FlyEarth.width - this.flyEarth.reduceHover * 2);
				let coinY = this.flyEarth.y + FlyEarth.height / 2;
				Coins.create(coinX, coinY);
			}
			
			return true;
		}

		return false;
	}

	static draw(millisecondsFromStart, isGameOver){
		Buildings.all.forEach(building => building.draw(isGameOver, millisecondsFromStart));
	}
}