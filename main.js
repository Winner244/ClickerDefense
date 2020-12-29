//*** INIT ***//
let grassImage = new Image();   
grassImage.src = './media/img/grass1.png';

Mouse.init();
Buildings.init();
Monsters.init();
Coin.init();

let images = []; //все изображения (кроме курсоров)
images.push(grassImage);
images.push(FlyEarth.image);
images.push(FlyEarthRope.image);
images.push(Coin.image);
images.push(Zombie.image);
images.push(Zombie.attackImage);

Cursor.setCursor(Cursor.default);

let bottomShiftBorder = 10; //нижняя граница по которой ходят монстры и до куда падают монетки 


let waveCurrent = 0; //текущая волна нападения (-1 = нет волны)
let waveStartTime = Date.now();
let waveMonsters = [{ //монстры на волнах
	[Zombie.name]: {
		count: 500,
		frequencyCreating: 60 //начальное количество в минуту
	}
}];  
let zombieWasCreated = 0;
let zombieWasCreatedLastTime = 0;

//*** LOGIC FUNCTIONS ***//
function mouseLogic(millisecondsDifferent){
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

function gameOverLogic(millisecondsDifferent){
	Cursor.setCursor(Cursor.default);

	if(Buildings.flyEarthRope.y < Draw.canvas.height - bottomShiftBorder - 20){
		Buildings.flyEarthRope.y += 100 * millisecondsDifferent / 1000;
	}

	if(Buildings.flyEarth.y > -FlyEarth.height){
		Buildings.flyEarth.y -= 100 * millisecondsDifferent / 1000;
	}
}


//*** Жизненный цикл игры ***//
let animationId = null;
let isGameStarted = true;
let lastDrawTime = 0;
let isGameOver = false;
let isEndAfterGameOver = false;
function go(millisecondsFromStart){
	if(!isGameStarted){
		return;
	}

	//проверка что все изображения загружены - иначе будет краш хрома
	if(images.some(x => !x.complete)){
		animationId = window.requestAnimationFrame(go);
		return;
	}

	let millisecondsDifferent = millisecondsFromStart - lastDrawTime; //сколько времени прошло с прошлой прорисовки

	///** logics **//
	if(isGameOver){
		gameOverLogic(millisecondsDifferent);

		if(Buildings.flyEarth.y <= -FlyEarth.height){
			isEndAfterGameOver = true;
		}
	}
	else{
		if(Buildings.flyEarthRope.health <= 0){
			isGameOver = true;
		}
		
		mouseLogic(millisecondsDifferent); //логика обработки мыши

		//Wave logic
		//логика создания монстров
		var waveData = waveMonsters[waveCurrent][Zombie.name];
		var periodTime = 1000 * 60 / waveData.frequencyCreating;
		if(waveData.count > zombieWasCreated && Date.now() > zombieWasCreatedLastTime + periodTime + Helper.getRandom(-periodTime / 2, periodTime / 2)) 
		{ 
			let isLeftSide = Math.random() < 0.5;
			let x = isLeftSide ? -50 : Draw.canvas.width;
			let y = Draw.canvas.height - bottomShiftBorder - Zombie.image.height;
	
			Monsters.all.push(new Zombie(x, y, isLeftSide));
			zombieWasCreated++;
			zombieWasCreatedLastTime = Date.now();
		}
	
	
		Monsters.logic(millisecondsDifferent, Buildings.flyEarth, Buildings.all);
	}
	
	Coins.logic(millisecondsDifferent, bottomShiftBorder);
	
	Labels.logic();

	FPS.counting();

	drawAll(millisecondsFromStart);

	if(!isEndAfterGameOver){
		window.requestAnimationFrame(go);
	}
}
animationId = window.requestAnimationFrame(go);

function drawAll(millisecondsFromStart){
	Draw.clear(); //очищаем холст
	Draw.drawBlackout(); //затемняем фон

	Buildings.draw(millisecondsFromStart, isGameOver);

	Coins.draw();

	Monsters.draw(isGameOver);

	Draw.drawGrass(grassImage); 

	Labels.draw();

	Draw.drawCoinsInterface(Coin.image, Gamer.coins);

	if(isGameOver && Buildings.flyEarth.y <= -FlyEarth.height){
		Draw.drawGameOver();
	}

	lastDrawTime = millisecondsFromStart;
}

window.addEventListener('keypress', event => {
	if(!isEndAfterGameOver){
		if(event.key == ' '){
			if(isGameStarted){
				cancelAnimationFrame(animationId);
				isGameStarted = false;
			}
			else{
				isGameStarted = true;
				animationId = window.requestAnimationFrame(go);
			}
		}
	}
});