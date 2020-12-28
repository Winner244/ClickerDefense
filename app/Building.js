class Building{
	constructor(x, y, isLeftSide, isLand, name, image, frames, width, height, reduceHover, healthMax){
		this.name = name;

		this.image = image; //содержит несколько изображений для анимации

		this.frames = frames; //сколько изображений в image?

		this.width = width; //ширина image
		this.height = height; //высота image
		this.reduceHover = reduceHover; //на сколько пикселей уменьшить зону наведения?

		this.healthMax = healthMax; //максимум хп
		this.health = healthMax;

		this.x = x;
		this.y = y;

		this.isLeftSide = isLeftSide; // с левой стороны ? (если это не центральное здание)
		this.isLand = isLand; //наземное? (иначе - воздушное)
	}

	draw(isGameOver, millisecondsFromStart){
		if(this.frames > 1){
			let frame = isGameOver ? 0 : Math.floor((millisecondsFromStart % 1000) / (500 / this.frames)) % this.frames;
			Draw.ctx.drawImage(this.image, 
				this.image.width / this.frames * frame, //crop from x
				0, //crop from y
				this.image.width / this.frames, //crop by width
				this.image.height,    //crop by height
				this.x, //draw from x
				this.y,  //draw from y
				this.width, //draw by width 
				this.height); //draw by height 
		}
		else{
			Draw.ctx.drawImage(this.image, this.x, this.y);
		}

		if(this.health < this.healthMax && this.health > 0){
			Draw.drawHealth(this.x - 15, this.y - 10, 50, this.healthMax, this.health);
		}
	}
}