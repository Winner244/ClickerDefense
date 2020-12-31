class Draw{
	static canvas = document.getElementById('canvas');
	static ctx = Draw.canvas.getContext('2d');

	/** Прорисовка жизней */
	static drawHealth(x, y, width, healthMax, healthCurrent){
		let height = 2;
		let border = 0;
		Draw.ctx.fillStyle = "orange";
		Draw.ctx.fillRect(x, y, width + border * 2, height + border * 2);

		Draw.ctx.fillStyle = "black";
		Draw.ctx.fillRect(x + border, y + border, width, height);

		Draw.ctx.fillStyle = "red";
		Draw.ctx.fillRect(x + border, y + border, width * (healthCurrent/ healthMax), height);
	}

	/** Очитка холста */
	static clear(){
		Draw.ctx.clearRect(0, 0, Draw.canvas.width, Draw.canvas.height);
	}

	/** Затемнение холста */
	static drawBlackout(){
		Draw.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		Draw.ctx.fillRect(0, 0, Draw.canvas.width, Draw.canvas.height);
	}
	
	/** Прорисовка исчезающей надписи */
	static drawLabel(label, labelLifetime){
		let leftTime = Date.now() - (label.timeCreated + labelLifetime * 1000);

		Draw.ctx.fillStyle = `rgba(${label.red},${label.green},${label.blue},${Math.abs(leftTime / 1000 / labelLifetime)})`;
		Draw.ctx.font = "14px Calibri";
		Draw.ctx.fillText(label.text, label.x, label.y);
	}

	/** Пррисовка интерфейса - количества монеток у игрока */
	static drawCoinsInterface(coinImage, coinsCount){
		let y = 10;
		Draw.ctx.drawImage(coinImage, 10, y);
	
		Draw.ctx.fillStyle = `rgba(255, 255, 0)`;
		Draw.ctx.font = "16px Calibri";
		Draw.ctx.fillText(`: ${coinsCount}`, 10 + coinImage.width + 3, y + 15);
	}

	static drawWaveInterface(MosterImage, killedMonsters, allMonsters){
		let y = 10;
		let x = Draw.canvas.width - 300;
		Draw.ctx.drawImage(MosterImage, x, y);

		Draw.ctx.fillStyle = `rgba(255, 0, 0)`;
		Draw.ctx.font = "16px Calibri";
		Draw.ctx.fillText(`${killedMonsters} / ${allMonsters}`, x + MosterImage.width + 7, y + 20);
	}
	
	/** Прорисовка травы на всей нижней части экрана */
	static drawGrass(grassImage){
		for(let i = 0; i < Draw.canvas.width / grassImage.width; i++){
			Draw.ctx.drawImage(grassImage, grassImage.width * i, Draw.canvas.height - grassImage.height);
		}
	}

	/** Конец игры */
	static drawGameOver(){
		let text = 'Game Over!';
		Draw.ctx.fillStyle = `orange`;
		Draw.ctx.font = "72px Calibri";
		Draw.ctx.fillText(text, Draw.canvas.width / 2 - 150, Draw.canvas.height / 2 - 32);
		Draw.ctx.fillStyle = `red`;
		Draw.ctx.fillText(text, Draw.canvas.width / 2 - 152, Draw.canvas.height / 2 - 33);
	}
}