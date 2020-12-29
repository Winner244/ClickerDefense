class Coin {
	static lifetime = 8; //время жизни монетки (в секундах)
	static image = new Image();  

	static init(){
		Coin.image.src = './media/img/coin.png';
	}

	constructor(x, y){
		this.x = x; 
		this.y = y;
		this.timeCreated = Date.now();
		this.impulseY = 0;
	}

	logic(millisecondsDifferent, bottomShiftBorder){
		if(this.timeCreated + Coins.lifetime * 1000 < Date.now()){
			return;
		}

		if(this.y + Coin.image.height < Draw.canvas.height - bottomShiftBorder){ //ускорение свободного падения
			if (this.impulseY < 0)
				this.impulseY += 0.02;
			else
				this.impulseY += 0.01;
		}

		this.y += millisecondsDifferent * this.impulseY;

		if(this.y + Coin.image.height > Draw.canvas.height - bottomShiftBorder){
			this.y = Draw.canvas.height - bottomShiftBorder - Coin.image.height;
			this.impulseY = -this.impulseY * Helper.getRandom(1, 6) / 10;
		}
	}

	draw(){
		Draw.ctx.drawImage(Coin.image, this.x, this.y);
	}
}