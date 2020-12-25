//*** INIT ***//
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let heightOfCanvas = canvas.height;
let widthOfCanvas = canvas.width;

let grassImage = new Image();   
grassImage.src = './media/img/grass1.png';

let flyEarchImage = new Image();  
flyEarchImage.src = './media/img/builders/flyEarth.png';
let flyEarchWidth = 250;
let flyEarchHeight = 186;
let flyEarchFrames = 4;
let flyEarchX = widthOfCanvas / 2 - flyEarchWidth / 2;
let flyEarchY = heightOfCanvas / 2 - flyEarchHeight / 2;
let flyEarchReduceHover = 15;

let defaultCursor = './media/cursors/Standart.png';
let pickCursor = './media/cursors/Pick.png';
let handCursor = './media/cursors/Hand.png';
setCursor(defaultCursor);

let coinImage = new Image();  
coinImage.src = './media/img/coin.png';
let coins = []; // все монеты на карте [{x, y, timeCreated, impulseY}}]
let coinLifetime = 8; //время жизни моентки (в секундах)
let coinsCount = 0; //монет у игрока

let bottomShiftBorder = 10; //нижняя граница по которой ходят монстры и до куда падают монетки 

let labels = []; // мини надписи, типо "+1" при сборе монеток
let labelLifetime = 1; //время жизни сообщения (в секундах)

let ropeImage = new Image();  
ropeImage.src = './media/img/builders/flyEarthRope.png';
let reopHealthMax = 100;
let reopHealth = reopHealthMax;


let zombieImage = new Image();
zombieImage.src = './media/img/monsters/zombie.png';
let zombieAttackImage = new Image();
zombieAttackImage.src = './media/img/monsters/zombieAttack.png';
let zombieWidth = 49;
let zombieAttackWidth = 48;
let zombies = []; //все зомби [{x, y, health, isAttack, currentFrame, createdTime}]
let zombieHealthMax = 3;
let zombieDamage = 1; //урон (в секунду)
let zombieSpeed = 50; //скорость (пикселей в секунду)
let zombieKey = 'zombie';
let zombiesWasCreated = 0;
let zombiesWasCreatedLastTime = 0;
let zombiesFrames = 12;
let zombiesAttackFrames = 4;

let waveCurrent = 0; //текущая волна нападения (-1 = нет волны)
let waveStartTime = Date.now();
let waveMonsters = [{ //монстры на волнах
	[zombieKey]: {
		count: 500,
		frequencyCreating: 60 //начальное количество в минуту
	}
}];  




//*** DRAW FUNCTIONS ***//
/** прорисовка анимированной летающей земли в центре экрана */
function drawFlyEarch(frame){
	ctx.drawImage(flyEarchImage, 
		flyEarchImage.width / flyEarchFrames * frame, //crop from x
		0, //crop from y
		flyEarchImage.width / flyEarchFrames, //crop by width
		flyEarchImage.height,    //crop by height
		flyEarchX, //draw from x
		flyEarchY,  //draw from y
		flyEarchWidth, //draw by width 
		flyEarchHeight); //draw by height 
}

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

/** прорисовка каната - держащего летающую землю */
function drawFlyEarchRope(){
	ctx.drawImage(ropeImage, flyEarchX + flyEarchWidth / 2 - ropeImage.width / 2, flyEarchY + flyEarchHeight - 8);
}

/** прорисовка анимированных зомби */
function drawZombies(){
	for(let i = 0; i < zombies.length; i++){
		if(zombies[i].isAttack){
			//атака
			zombies[i].currentFrame = Math.floor(((Date.now() - zombies[i].createdTime) % 1000) / (1000 / zombiesAttackFrames)) % zombiesAttackFrames;
			ctx.drawImage(zombieAttackImage, 
				zombieAttackWidth * zombies[i].currentFrame, //crop from x
				0, //crop from y
				zombieAttackWidth,
				zombieAttackImage.height,
				zombies[i].x, 
				zombies[i].y,
				zombieAttackWidth,
				zombieAttackImage.height);
		}
		else{
			//передвижение
			zombies[i].currentFrame = Math.floor(((Date.now() - zombies[i].createdTime) % 1000) / (1000 / zombiesFrames)) % zombiesFrames;
			ctx.drawImage(zombieImage, 
				zombieWidth * zombies[i].currentFrame, //crop from x
				0, //crop from y
				zombieWidth,
				zombieImage.height,
				zombies[i].x, 
				zombies[i].y,
				zombieWidth,
				zombieImage.height);
		}
	}
}



//*** LOGIC FUNCTIONS ***//
function mouseLogic(){
	//при изменении размера canvas, мы должны масштабировать координаты мыши
	let kofX = canvas.clientWidth / widthOfCanvas; 
	let kofY = canvas.clientHeight / heightOfCanvas;

	let x = mouseX / kofX;
	let y = mouseY / kofY;

	let isSetCursor = false;
	if(x > flyEarchX + flyEarchReduceHover && 
		x < flyEarchX + flyEarchWidth - flyEarchReduceHover &&
		y > flyEarchY + flyEarchReduceHover && 
		y < flyEarchY + flyEarchHeight - flyEarchReduceHover)
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

	if(!isSetCursor){
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
			coin.impulseY = -coin.impulseY * getRandom(1, 6) / 10;
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

function zombieLogic(millisecondsDifferent){
	//логика создания
	var waveData = waveMonsters[waveCurrent][zombieKey];
	var periodTime = 1000 * 60 / waveData.frequencyCreating;
	if(waveData.count > zombiesWasCreated && Date.now() > zombiesWasCreatedLastTime + periodTime + getRandom(-periodTime / 2, periodTime / 2)) 
	{ 
		//let isLeftSide = Math.random() < 0.5;
		//createZombie(isLeftSide ? -zombieWidth : widthOfCanvas, heightOfCanvas - bottomShiftBorder - zombieImage.height);
	}

	//логика передвижения
	zombies.map(zombie => {
		var placeGoal = widthOfCanvas / 2;

		zombie.isAttack = false;
		if(zombie.x < widthOfCanvas / 2) //если монстр идёт с левой стороны
		{
			if (zombie.x + zombieWidth < placeGoal + zombieWidth / 5) //ещё не дошёл
				zombie.x += zombieSpeed * (millisecondsDifferent / 1000);
			else //дошёл
				zombie.isAttack = true; //атакует
		}
		else 
		{
			if (zombie.x > placeGoal - zombieWidth / 5) //ещё не дошёл
				zombie.x -= zombieSpeed * (millisecondsDifferent / 1000);
			else //дошёл
				zombie.isAttack = true; //атакует
		}

		if(zombie.isAttack) //если атакует
		{
			var damage = 0 - zombieDamage * (millisecondsDifferent / 1000);
			if(damage < 0)
				reopHealth += damage; //наносим урон
		}
	});
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
		x: flyEarchX + flyEarchReduceHover + Math.random() * (flyEarchWidth - flyEarchReduceHover * 2), 
		y: flyEarchY + flyEarchHeight / 2, 
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

function getRandom(min, max){
	return Math.floor(Math.random() * (max - min)) + min;
}

function createZombie(x, y){
	zombies.push({
		x: x,
		y: y,
		health: zombieHealthMax,
		isAttack: false,
		createdTime: Date.now()
	});
	zombiesWasCreated++;
	zombiesWasCreatedLastTime = Date.now();
}


//*** Жизненный цикл игры ***//
let animationId = null;
let isGameStarted = true;
let lastDrawTime = 0;
function draw(millisecondsFromStart){
	if(!isGameStarted){
		return;
	}

	//проверка что все изображения загружены - иначе будет краш хрома
	if(!grassImage.complete || !flyEarchImage.complete || !ropeImage.complete || !coinImage.complete || !zombieImage.complete || !zombieAttackImage.complete){
		animationId = window.requestAnimationFrame(draw);
		return;
	}

	let millisecondsDifferent = millisecondsFromStart - lastDrawTime; //сколько времени прошло с прошлой прорисовки



	///** logics **//
	mouseLogic(); //логика обработки мыши

	coinsLogic(millisecondsDifferent);

	labelsLogic();

	if(waveCurrent == 0){
		zombieLogic(millisecondsDifferent);
	}

	checkFPS();
	



	///** draw **//
	//очищаем холст
	ctx.clearRect(0, 0, widthOfCanvas, heightOfCanvas);

	//затемняем фон
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(0, 0, widthOfCanvas, heightOfCanvas);

	drawFlyEarchRope();

	drawFlyEarch(Math.floor((millisecondsFromStart % 1000) / (500 / flyEarchFrames)) % flyEarchFrames); //летающая земля 

	drawCoins();

	if(waveCurrent == 0){
		drawZombies(); 
	}

	drawGrass(); 

	drawLabels();

	drawCoinsInterface();

	lastDrawTime = millisecondsFromStart;
	window.requestAnimationFrame(draw);
}
animationId = window.requestAnimationFrame(draw);



window.addEventListener('keypress', event => {
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
});


let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', event => {
	mouseX = event.pageX;
	mouseY = event.pageY;
});

let isClick = false;
window.addEventListener('click', () => isClick = true);