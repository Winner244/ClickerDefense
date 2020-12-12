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
let coinTimeOfLife = 8; //время жизни моентки (в секундах)
let coinsCount = 0; //монет у игрока
let bottomShiftBorder = 10; //нижняя граница по которой ходят монстры и до куда падают монетки 



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

	if(coins.length){
		for(var i = 0; i < coins.length; i++){
			if(Math.pow(x - coins[i].x - coinImage.width / 2, 2) + Math.pow(y - coins[i].y - coinImage.height / 2, 2) < Math.pow(coinImage.width / 2, 2)){
				setCursor(handCursor);
				isSetCursor = true;

				if(isClick){
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

function createCoin(){
	coins.push({
		x: flyEarchX + flyEarchReduceHover + Math.random() * (flyEarchWidth - flyEarchReduceHover * 2), 
		y: flyEarchY + flyEarchHeight / 2, 
		timeCreated: Date.now(),
		impulseY: 0
	});
}

function coinsLogic(millisecondsDifferent){
	if(!coins.length){
		return;
	}
	
	for(var i = 0; i < coins.length; i++){
		let coin = coins[i];

		if(coin.timeCreated + coinTimeOfLife * 1000 < Date.now()){
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

		ctx.drawImage(coinImage, coin.x, coin.y);
	}
}

function getRandom(min, max){
	return Math.floor(Math.random() * (max - min)) + min;
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
	if(!grassImage.complete || !flyEarchImage.complete){
		animationId = window.requestAnimationFrame(draw);
		return;
	}

	let secondsFromStart = millisecondsFromStart % 1000;
	let millisecondsDifferent = millisecondsFromStart - lastDrawTime; //сколько времени прошло с прошлой прорисовки

	checkFPS();
	
	//очищаем холст
	ctx.clearRect(0, 0, widthOfCanvas, heightOfCanvas);

	//затемняем фон
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(0, 0, widthOfCanvas, heightOfCanvas);

	drawGrass(); //травка
	drawFlyEarch(Math.floor(secondsFromStart / (1000 / flyEarchFrames / 2)) % flyEarchFrames); //летающая земля (2 полных цикла анимации за 1 секунду)

	mouseLogic(); //логика обработки мыши

	coinsLogic(millisecondsDifferent);

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