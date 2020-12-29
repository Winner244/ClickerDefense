//*** INIT ***//
let monsters = []; //все монстры
let buildings = []; //все строения
let images = []; //все изображения (кроме курсоров)

let grassImage = new Image();   
grassImage.src = './media/img/grass1.png';
images.push(grassImage);


FlyEarth.init();
images.push(FlyEarth.image);
let flyEarth = new FlyEarth(
	Draw.canvas.width / 2 - FlyEarth.width / 2, 
	Draw.canvas.height / 2 - FlyEarth.height / 2);
buildings.push(flyEarth);

let defaultCursor = './media/cursors/Standart.png';
let pickCursor = './media/cursors/Pick.png';
let handCursor = './media/cursors/Hand.png';
let swordCursor = './media/cursors/Sword.png';
let swordCursorRed = './media/cursors/SwordRed.png';
setCursor(defaultCursor);

Coin.init();
images.push(Coin.image);

let bottomShiftBorder = 10; //нижняя граница по которой ходят монстры и до куда падают монетки 

let labels = []; // мини надписи, типо "+1" при сборе монеток
let labelLifetime = 1; //время жизни сообщения (в секундах)

FlyEarthRope.init();
images.push(FlyEarthRope.image);
let flyEarthRope = new FlyEarthRope(0, 0);
FlyEarthRope.image.onload = () => {
	flyEarthRope.x = flyEarth.x + FlyEarth.width / 2 - FlyEarthRope.image.width / 2;
	flyEarthRope.y = flyEarth.y + FlyEarth.height - 8;
	flyEarthRope.width = FlyEarthRope.image.width;
	flyEarthRope.height = FlyEarthRope.image.height;
}
buildings.push(flyEarthRope);

Zombie.init();
images.push(Zombie.image);
images.push(Zombie.attackImage);

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
var cursorWait = 0;
function mouseLogic(){
	//при изменении размера canvas, мы должны масштабировать координаты мыши
	let kofX = Draw.canvas.clientWidth / Draw.canvas.width; 
	let kofY = Draw.canvas.clientHeight / Draw.canvas.height;

	let x = mouseX / kofX;
	let y = mouseY / kofY;

	let isSetCursor = false;
	if(x > flyEarth.x + flyEarth.reduceHover && 
		x < flyEarth.x + FlyEarth.width - flyEarth.reduceHover &&
		y > flyEarth.y + flyEarth.reduceHover && 
		y < flyEarth.y + FlyEarth.height - flyEarth.reduceHover)
	{
		setCursor(pickCursor);
		isSetCursor = true;

		if(isClick){
			let coinX = flyEarth.x + flyEarth.reduceHover + Math.random() * (FlyEarth.width - flyEarth.reduceHover * 2);
			let coinY = flyEarth.y + FlyEarth.height / 2;
			Coins.create(coinX, coinY);
		}
	}

	if(!isSetCursor && Coins.all.length){
		for(let i = 0; i < Coins.all.length; i++){
			if(Math.pow(x - Coins.all[i].x - Coin.image.width / 2, 2) + Math.pow(y - Coins.all[i].y - Coin.image.height / 2, 2) < Math.pow(Coin.image.width / 2, 2)){
				setCursor(handCursor);
				isSetCursor = true;

				if(isClick){
					createLabel(x - 10, y - 10, '+1', 0, 255, 0);
					Coins.delete(i);
					Gamer.coins++;
				}

				break;
			}
		}
	}

	if(!isSetCursor && monsters.length){
		for(let i = 0; i < monsters.length; i++){
			let monster = monsters[i];
			if(x > monster.x + monster.reduceHover && 
				x < monster.x + monster.width - monster.reduceHover &&
				y > monster.y + monster.reduceHover && 
				y < monster.y + monster.image.height - monster.reduceHover)
			{
				if(cursorWait <= 0){
					setCursor(swordCursor);
				}
				isSetCursor = true;

				if(isClick){
					monster.health -= Gamer.cursorDamage;
					if(monster.health <= 0){
						createLabel(x - 10, y - 10, '+1', 0, 255, 0);
						monsters.splice(i, 1);
						Gamer.coins++;
					}
					else{
						setCursor(swordCursorRed);
						cursorWait = 5;
					}
				}

				break;
			}
		}
	}

	if(cursorWait > 0){
		cursorWait--;
	}

	if(!isSetCursor && cursorWait <= 0){
		setCursor(defaultCursor);
	}

	isClick = false;
}



function labelsLogic(){
	for(let i = 0; i < labels.length; i++){
		let leftTime = Date.now() - (labels[i].timeCreated + labelLifetime * 1000);
		if(leftTime > 0){
			labels.splice(i, 1);
			i--;
			continue;
		}
	}
}

function monstersLogic(millisecondsDifferent){
	//логика создания
	var waveData = waveMonsters[waveCurrent][Zombie.name];
	var periodTime = 1000 * 60 / waveData.frequencyCreating;
	if(waveData.count > zombieWasCreated && Date.now() > zombieWasCreatedLastTime + periodTime + Helper.getRandom(-periodTime / 2, periodTime / 2)) 
	{ 
		let isLeftSide = Math.random() < 0.5;
		let x = isLeftSide ? -50 : Draw.canvas.width;
		let y = Draw.canvas.height - bottomShiftBorder - Zombie.image.height;

		monsters.push(new Zombie(x, y, isLeftSide));
		zombieWasCreated++;
		zombieWasCreatedLastTime = Date.now();
	}

	//логика передвижения
	monsters.map(monster => monster.logic(millisecondsDifferent, buildings));

	//логика взаимодействия с монетками
	if(monsters.length){
		monsters.sortByField(monster => Math.abs(Draw.canvas.width / 2 - monster.x));
		if(monsters[0].x > flyEarth.x && monsters[0].x < flyEarth.x + flyEarth.width){
			var availableMonsters = monsters.filter(monster => monster.x > flyEarth.x && monster.x < flyEarth.x + flyEarth.width);
			availableMonsters.forEach(monster => {
				for(let i = 0; i < Coins.all.length; i++){
					if(Coins.all[i].y > monster.y && monster.x < Coins.all[i].x + Coin.image.width / 2 && monster.x + monster.width > Coins.all[i].x + Coin.image.width / 2){
						createLabel(Coins.all[i].x + 10, Coins.all[i].y + 10, '-', 255, 0, 0);
						Coins.delete(i);
					}
				}
			});
		}
	}
}

function gameOverLogic(millisecondsDifferent){
	setCursor(defaultCursor);

	if(flyEarthRope.y < Draw.canvas.height - bottomShiftBorder - 20){
		flyEarthRope.y += 100 * millisecondsDifferent / 1000;
	}

	if(flyEarth.y > -FlyEarth.height){
		flyEarth.y -= 100 * millisecondsDifferent / 1000;
	}
}



//*** OTHER FUNCTIONS ***//
let fps = 0;
let oldFPStime = '';
function checkFPS(){
	let newDate = new Date();
	let newKey = newDate.getMinutes() + '_' + newDate.getSeconds();
	if(oldFPStime != newKey){
		console.log('fps: ' + fps);
		fps = 0;
		oldFPStime = newKey;
	}

	fps++;
}

function setCursor(img){
	document.body.style.cursor = "url(" + img + "), auto";
}

function createLabel(x, y, text, red, green, blue){
	labels.push({
		x: x,
		y: y,
		text: text,
		red: red,
		green: green,
		blue: blue,
		timeCreated: Date.now()
	});
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

		if(flyEarth.y <= -FlyEarth.height){
			isEndAfterGameOver = true;
		}
	}
	else{
		if(flyEarthRope.health <= 0){
			isGameOver = true;
		}
		
		mouseLogic(); //логика обработки мыши
	
		if(waveCurrent == 0){
			monstersLogic(millisecondsDifferent);
		}
	}
	
	Coins.logic(millisecondsDifferent, bottomShiftBorder);
	
	labelsLogic();

	checkFPS();
	

	drawAll(millisecondsFromStart);

	if(!isEndAfterGameOver){
		window.requestAnimationFrame(go);
	}
}
animationId = window.requestAnimationFrame(go);

function drawAll(millisecondsFromStart){
	Draw.clear(); //очищаем холст
	Draw.drawBlackout(); //затемняем фон

	Coins.draw();

	buildings.forEach(building => building.draw(isGameOver, millisecondsFromStart));

	monsters.forEach(monster => monster.draw(isGameOver));

	Draw.drawGrass(grassImage); 

	Draw.drawLabels(labels);

	Draw.drawCoinsInterface(Coin.image, Gamer.coins);

	if(isGameOver && flyEarth.y <= -FlyEarth.height){
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


let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', event => {
	mouseX = event.pageX;
	mouseY = event.pageY;
});

let isClick = false;
window.addEventListener('mousedown', () => isClick = true);