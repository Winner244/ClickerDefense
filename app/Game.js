class Game{
	static images = [];  //все изображения (кроме курсоров)

	static bottomShiftBorder = 10; //нижняя граница по которой ходят монстры и до куда падают монетки 

	static grassImage = new Image(); //трава

	static isGameRun = true; //если false - значит на паузе 
	static isGameOver = false; //игра заканчивается
	static isEndAfterGameOver = false; //игра закончилась

	static lastDrawTime = 0; //время последней отрисовки (нужно для высчита millisecondsDifferent)
	static animationId = null; //техническая переменная для браузера 

	static init(){
		Game.isGameRun = true;
		Game.isGameOver = false;
		Game.isEndAfterGameOver = false;
		Game.lastDrawTime = 0;
		Game.grassImage.src = './media/img/grass1.png';

		Mouse.init();
		Buildings.init();
		Monsters.init();
		Coins.init();
		Gamer.init();
		Labels.init();
		Waves.init();

		Game.images = [];
		Game.images.push(Game.grassImage);
		Game.images.push(FlyEarth.image);
		Game.images.push(FlyEarthRope.image);
		Game.images.push(Coin.image);
		Zombie.images.forEach(image => Game.images.push(image));
		Zombie.attackImages.forEach(attackImage => Game.images.push(attackImage));

		Cursor.setCursor(Cursor.default);

		window.addEventListener('keypress', Game.onKey);

		Game.animationId = window.requestAnimationFrame(Game.go);
	}
		
	static gameOverLogic(millisecondsDifferent){
		Cursor.setCursor(Cursor.default);

		if(Buildings.flyEarthRope.y < Draw.canvas.height - Game.bottomShiftBorder - 20){
			Buildings.flyEarthRope.y += 100 * millisecondsDifferent / 1000;
		}

		if(Buildings.flyEarth.y > -FlyEarth.height){
			Buildings.flyEarth.y -= 100 * millisecondsDifferent / 1000;
		}
	}

	static mouseLogic(millisecondsDifferent){
		//при изменении размера canvas, мы должны масштабировать координаты мыши
		let x = Mouse.x / (Draw.canvas.clientWidth / Draw.canvas.width);
		let y = Mouse.y / (Draw.canvas.clientHeight / Draw.canvas.height);

		let isSetCursor = Buildings.mouseLogic(x, y, Mouse.isClick);

		if(!isSetCursor){
			isSetCursor = Coins.mouseLogic(x, y, Mouse.isClick);
		}

		if(!isSetCursor){
			isSetCursor = Monsters.mouseLogic(x, y, Mouse.isClick);
		}

		if(Cursor.cursorWait > 0){
			Cursor.cursorWait -= millisecondsDifferent;
		}

		if(!isSetCursor){
			Cursor.setCursor(Cursor.default);
		}

		Mouse.isClick = false;
	}

	static drawAll(millisecondsFromStart){
		Draw.clear(); //очищаем холст
		Draw.drawBlackout(); //затемняем фон
	
		Buildings.draw(millisecondsFromStart, Game.isGameOver);
	
		Coins.draw();
	
		Monsters.draw(Game.isGameOver);
	
		Draw.drawGrass(Game.grassImage); 
	
		Labels.draw();
	
		Draw.drawCoinsInterface(Coin.image, Gamer.coins);

		Draw.drawWaveInterface(Waves.iconCountKilledMonsters, Waves.waveCountKilledMonsters, Waves.waveCountMonsters);

		Waves.draw();
	
		if(Game.isGameOver && Buildings.flyEarth.y <= -FlyEarth.height){
			Draw.drawGameOver();
		}
	
		Game.lastDrawTime = millisecondsFromStart;
	}

	/** основной цикл игры */
	static go(millisecondsFromStart){
		if(!Game.isGameRun){
			return;
		}

		//проверка что все изображения загружены - иначе будет краш хрома
		if(Game.images.some(x => !x.complete)){
			Game.animationId = window.requestAnimationFrame(Game.go);
			return;
		}

		if(!Game.lastDrawTime){
			Game.lastDrawTime = millisecondsFromStart - 100;
		}

		let millisecondsDifferent = millisecondsFromStart - Game.lastDrawTime; //сколько времени прошло с прошлой прорисовки

		///** logics **//
		if(Game.isGameOver){
			Game.gameOverLogic(millisecondsDifferent);

			if(Buildings.flyEarth.y <= -FlyEarth.height){
				Game.isEndAfterGameOver = true;
			}
		}
		else{
			if(Buildings.flyEarthRope.health <= 0){
				Game.isGameOver = true;
			}
			
			Game.mouseLogic(millisecondsDifferent); //логика обработки мыши

			Waves.logic(millisecondsDifferent, Game.bottomShiftBorder);
		
			Monsters.logic(millisecondsDifferent, Buildings.flyEarth, Buildings.all);
		}
		
		Coins.logic(millisecondsDifferent, Game.bottomShiftBorder);
		
		Labels.logic();

		FPS.counting();

		Game.drawAll(millisecondsFromStart);

		if(!Game.isEndAfterGameOver){
			window.requestAnimationFrame(Game.go);
		}
	}

	static onKey(event){
		if(event.key == ' '){
			if(Game.isGameRun){
				Game.pause();
			}
			else{
				Game.continue();
			}
		}
	}

	static pause(){
		cancelAnimationFrame(Game.animationId);
		Game.isGameRun = false;
		Menu.show();
		Menu.showButtonContinueGame();
	}

	static continue(){
		Game.isGameRun = true;
		Game.lastDrawTime = 0;
		Game.animationId = window.requestAnimationFrame(Game.go);
		Menu.hide();
		Mouse.isClick = false;
	}
}