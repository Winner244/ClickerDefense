//*** INIT ***//
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let heightOfCanvas = canvas.height;
let widthOfCanvas = canvas.width;

let monsters = []; //все монстры
let buildings = []; //все строения
let images = []; //все изображения (кроме курсоров)

let grassImage = new Image();   
grassImage.src = './media/img/grass1.png';
images.push(grassImage);


FlyEarth.init();
images.push(FlyEarth.image);
let flyEarth = new FlyEarth(
	widthOfCanvas / 2 - FlyEarth.width / 2, 
	heightOfCanvas / 2 - FlyEarth.height / 2);
buildings.push(flyEarth);

let defaultCursor = './media/cursors/Standart.png';
let pickCursor = './media/cursors/Pick.png';
let handCursor = './media/cursors/Hand.png';
let swordCursor = './media/cursors/Sword.png';
let swordCursorRed = './media/cursors/SwordRed.png';
setCursor(defaultCursor);

let coinImage = new Image();  
coinImage.src = './media/img/coin.png';
images.push(coinImage);
let coins = []; // все монеты на карте [{x, y, timeCreated, impulseY}}]
let coinLifetime = 8; //время жизни моентки (в секундах)
let coinsCount = 0; //монет у игрока

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

var cursorDamage = 1;



//*** DRAW FUNCTIONS ***//
/** прорисовка травы на веё нижней части canvas */
function drawGrass(){
	for(let i = 0; i < widthOfCanvas / grassImage.width; i++){
		ctx.drawImage(grassImage, grassImage.width * i, heightOfCanvas - grassImage.height);
	}
}

/** прорисовка исчезающих надписей */
function drawLabels(){
	for(let i = 0; i < labels.length; i++){
		let leftTime = Date.now() - (labels[i].timeCreated + labelLifetime * 1000);

		ctx.fillStyle = `rgba(${labels[i].red},${labels[i].green},${labels[i].blue},${Math.abs(leftTime / 1000 / labelLifetime)})`;
		ctx.font = "14px Calibri";
		ctx.fillText(labels[i].text, labels[i].x, labels[i].y);
	}
}

/** прорисовка монеток  */
function drawCoins(){
	for(let i = 0; i < coins.length; i++){
		ctx.drawImage(coinImage, coins[i].x, coins[i].y);
	}
}

/** прорисовка интерфейса - сколько у игрока монеток */
function drawCoinsInterface(){
	ctx.drawImage(coinImage, 10, 10);

	ctx.fillStyle = `rgba(255, 255, 0)`;
	ctx.font = "16px Calibri";
	ctx.fillText(`: ${coinsCount}`, 10 + coinImage.width + 3, 25);
}

function drawGameOver(){
	if(flyEarth.y <= -FlyEarth.height){
		ctx.fillStyle = `orange`;
		ctx.font = "72px Calibri";
		ctx.fillText('Game Over!', widthOfCanvas / 2 - 150, heightOfCanvas / 2 - 32);
		ctx.fillStyle = `red`;
		ctx.fillText('Game Over!', widthOfCanvas / 2 - 152, heightOfCanvas / 2 - 33);
	}
}


//*** LOGIC FUNCTIONS ***//
var cursorWait = 0;
function mouseLogic(){
	//при изменении размера canvas, мы должны масштабировать координаты мыши
	let kofX = canvas.clientWidth / widthOfCanvas; 
	let kofY = canvas.clientHeight / heightOfCanvas;

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
			createCoin();
		}
	}

	if(!isSetCursor && coins.length){
		for(let i = 0; i < coins.length; i++){
			if(Math.pow(x - coins[i].x - coinImage.width / 2, 2) + Math.pow(y - coins[i].y - coinImage.height / 2, 2) < Math.pow(coinImage.width / 2, 2)){
				setCursor(handCursor);
				isSetCursor = true;

				if(isClick){
					createLabel(x - 10, y - 10, '+1', 0, 255, 0);
					coins.splice(i, 1);
					coinsCount++;
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
					monster.health -= cursorDamage;
					if(monster.health <= 0){
						createLabel(x - 10, y - 10, '+1', 0, 255, 0);
						monsters.splice(i, 1);
						coinsCount++;
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

function coinsLogic(millisecondsDifferent){
	for(let i = 0; i < coins.length; i++){
		let coin = coins[i];

		if(coin.timeCreated + coinLifetime * 1000 < Date.now()){
			coins.splice(i, 1);
			i--;
			continue;
		}

		if(coin.y + coinImage.height < heightOfCanvas - bottomShiftBorder){ //ускорение свободного падения
			if (coin.impulseY < 0)
				coin.impulseY += 0.02;
			else
				coin.impulseY += 0.01;
		}

		coin.y += millisecondsDifferent * coin.impulseY;

		if(coin.y + coinImage.height > heightOfCanvas - bottomShiftBorder){
			coin.y = heightOfCanvas - bottomShiftBorder - coinImage.height;
			coin.impulseY = -coin.impulseY * Helper.getRandom(1, 6) / 10;
		}
	}
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
		let x = isLeftSide ? -50 : widthOfCanvas;
		let y = heightOfCanvas - bottomShiftBorder - Zombie.image.height;

		monsters.push(new Zombie(x, y, isLeftSide));
		zombieWasCreated++;
		zombieWasCreatedLastTime = Date.now();
	}

	//логика передвижения
	monsters.map(monster => monster.logic(millisecondsDifferent, buildings));

	//логика взаимодействия с монетками
	if(monsters.length){
		monsters.sortByField(monster => Math.abs(widthOfCanvas / 2 - monster.x));
		if(monsters[0].x > flyEarth.x && monsters[0].x < flyEarth.x + flyEarth.width){
			var availableMonsters = monsters.filter(monster => monster.x > flyEarth.x && monster.x < flyEarth.x + flyEarth.width);
			availableMonsters.forEach(monster => {
				for(let i = 0; i < coins.length; i++){
					if(coins[i].y > monster.y && monster.x < coins[i].x + coinImage.width / 2 && monster.x + monster.width > coins[i].x + coinImage.width / 2){
						createLabel(coins[i].x + 10, coins[i].y + 10, '-', 255, 0, 0);
						coins.splice(i, 1);
					}
				}
			});
		}
	}
}

function gameOverLogic(millisecondsDifferent){
	setCursor(defaultCursor);

	if(flyEarthRope.y < heightOfCanvas - bottomShiftBorder - 20){
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

function createCoin(){
	coins.push({
		x: flyEarth.x + flyEarth.reduceHover + Math.random() * (FlyEarth.width - flyEarth.reduceHover * 2), 
		y: flyEarth.y + FlyEarth.height / 2, 
		timeCreated: Date.now(),
		impulseY: 0
	});
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
function draw(millisecondsFromStart){
	if(!isGameStarted){
		return;
	}

	//проверка что все изображения загружены - иначе будет краш хрома
	if(images.some(x => !x.complete)){
		animationId = window.requestAnimationFrame(draw);
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
	
	coinsLogic(millisecondsDifferent);
	
	labelsLogic();

	checkFPS();
	



	///** draw **//
	//очищаем холст
	ctx.clearRect(0, 0, widthOfCanvas, heightOfCanvas);

	//затемняем фон
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(0, 0, widthOfCanvas, heightOfCanvas);

	drawCoins();

	for(let i = 0; i < buildings.length; i++){
		buildings[i].draw(ctx, isGameOver, millisecondsFromStart);
	} 
	
	if(waveCurrent == 0){
		for(let i = 0; i < monsters.length; i++){
			monsters[i].draw(ctx, isGameOver);
		} 
	}

	drawGrass(); 

	drawLabels();

	drawCoinsInterface();

	if(isGameOver){
		drawGameOver();
	}

	lastDrawTime = millisecondsFromStart;
	if(!isEndAfterGameOver){
		window.requestAnimationFrame(draw);
	}
}
var z = 1;
animationId = window.requestAnimationFrame(draw);



window.addEventListener('keypress', event => {
	if(!isEndAfterGameOver){
		if(event.key == ' '){
			if(isGameStarted){
				cancelAnimationFrame(animationId);
				isGameStarted = false;
			}
			else{
				isGameStarted = true;
				animationId = window.requestAnimationFrame(draw);
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
window.addEventListener('click', () => isClick = true);