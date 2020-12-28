class Monster{
	constructor(x, y, isLeftSide, isLand, name, image, frames, width, imageAttack, attackFrames, attackWidth, reduceHover, healthMax, damage, speed){
		this.name = name;

		this.image = image; //содержит несколько изображений для анимации
		this.attackImage = imageAttack;  //содержит несколько изображений для анимации

		this.frames = frames; //сколько изображений в image?
		this.attackFrames = attackFrames; //сколько изображений атаки в attackImage?

		this.width = width; //ширина image
		this.attackWidth = attackWidth; //ширина attack image
		this.reduceHover = reduceHover; //на сколько пикселей уменьшить зону наведения?

		this.healthMax = healthMax; //максимум хп
		this.health = healthMax;
		this.damage = damage; //урон (в секунду)
		this.speed = speed; //скорость (пикселей в секунду)

		this.x = x;
		this.y = y;

		this.isAttack = false; //атакует?
		this.isLeftSide = isLeftSide; // с левой стороны движется?
		this.isLand = isLand; //наземный?

		this.createdTime = Date.now();
	}

	logic(millisecondsDifferent, buildings){
		//логика передвижения
		let buildingsGoal = buildings.filter(building => building.isLand == this.isLand);
		buildingsGoal.sortByField(building => building.x);
		var buildingGoal = this.isLeftSide ? buildingsGoal.first() : buildingsGoal.last();

		this.isAttack = false;
		if(this.isLeftSide) //если монстр идёт с левой стороны
		{
			if (this.x + this.width < buildingGoal.x + this.width / 5) { //ещё не дошёл
				this.x += this.speed * (millisecondsDifferent / 1000);
			}
			else //дошёл
			{
				this.x = buildingGoal.x - this.width + this.width / 5;
				this.isAttack = true; //атакует
			}
		}
		else 
		{
			if (this.x > buildingGoal.x + buildingGoal.width - this.width / 5) { //ещё не дошёл
				this.x -= this.speed * (millisecondsDifferent / 1000);
			}
			else //дошёл
			{
				this.x = buildingGoal.x + buildingGoal.width - this.width / 5;
				this.isAttack = true; //атакует
			}
		}

		//логика атаки
		if(this.isAttack) //если атакует
		{
			var damage = this.damage * (millisecondsDifferent / 1000);
			if(damage > 0){
				buildingGoal.health -= damage; //наносим урон
			}
		}
	}

	draw(ctx, isGameOver){
		let isInvert = this.isLeftSide;
		let scale = isInvert ? -1 : 1;

		if(isInvert){
			ctx.save();
			ctx.scale(-1, 1);
		}

		if(this.isAttack){
			//атака
			this.currentFrame = isGameOver ? 0 : Math.floor(((Date.now() - this.createdTime) % 1000) / (1000 / this.attackFrames)) % this.attackFrames;
			ctx.drawImage(this.attackImage, 
				this.attackWidth * this.currentFrame, //crop from x
				0, //crop from y
				this.attackWidth, 		  //crop by width
				this.attackImage.height,  //crop by height
				scale * this.x,  //draw from x
				this.y,  		 //draw from y
				scale * this.attackWidth, //draw by width 
				this.attackImage.height); //draw by height
		}
		else{
			//передвижение
			this.currentFrame = isGameOver ? 0 : Math.floor(((Date.now() - this.createdTime) % 1000) / (1000 / this.frames)) % this.frames;
			ctx.drawImage(this.image, 
				this.width * this.currentFrame, //crop from x
				0, //crop from y
				this.width, 	   //crop by width
				this.image.height, //crop by height
				scale * this.x,  //draw from x
				this.y,  		 //draw from y
				scale * this.width, //draw by width 
				this.image.height); //draw by height
		}

		if(isInvert){
			ctx.restore();
		}

		if(this.health != this.healthMax){
			Draw.drawHealth(this.x + 10, this.y - 2, this.width - 20, this.healthMax, this.health);
		}
	}
}