let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let heightOfCanvas = canvas.height;
let widthOfCanvas = canvas.width;



//*** INIT ***//
let imageGrass = new Image();   
imageGrass.src = './media/img/grass1.png';

let imageFlyEarch = new Image();  
imageFlyEarch.src = './media/img/builders/flyEarth.png';
let flyEarchWidth = 250;
let flyEarchHeight = 186;
let flyEarchFrames = 4;
let flyEarchX = widthOfCanvas / 2 - flyEarchWidth / 2;
let flyEarchY = heightOfCanvas / 2 - flyEarchHeight / 2;
let flyEarchReduceHover = 15;

let defaultCursor = './media/cursors/Standart.png';
let pickCursor = './media/cursors/Pick.png';
setCursor(defaultCursor);





//*** DRAW FUNCTIONS ***//
/** прорисовка анимированной летающей земли в центре экрана */
function drawFlyEarch(frame){
	ctx.drawImage(imageFlyEarch, 
		imageFlyEarch.width / flyEarchFrames * frame, //crop from x
		0, //crop from y
		imageFlyEarch.width / flyEarchFrames, //crop by width
		imageFlyEarch.height,    //crop by height
		flyEarchX, //draw from x
		flyEarchY,  //draw from y
		flyEarchWidth, //draw by width 
		flyEarchHeight); //draw by height 
}

/** прорисовка травы на веё нижней части canvas */
function drawGrass(){
	for(let i = 0; i < widthOfCanvas / imageGrass.width; i++){
		ctx.drawImage(imageGrass, imageGrass.width * i, heightOfCanvas - imageGrass.height);
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
			console.log('click by fly earch');
		}
	}

	if(!isSetCursor){
		setCursor(defaultCursor);
	}

	isClick = false;
}





//*** Жизненный цикл игры ***//
let animationId = null;
let isGameStarted = true;
function draw(millisecondsFromStart){
	if(!isGameStarted){
		return;
	}

	//проверка что все изображения загружены - иначе будет краш хрома
	if(!imageGrass.complete || !imageFlyEarch.complete){
		animationId = window.requestAnimationFrame(draw);
		return;
	}

	let partOfSecond = millisecondsFromStart % 1000;

	checkFPS();
	
	//очищаем холст
	ctx.clearRect(0, 0, widthOfCanvas, heightOfCanvas);

	//затемняем фон
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(0, 0, widthOfCanvas, heightOfCanvas);

	drawGrass(); //травка
	drawFlyEarch(Math.floor(partOfSecond / (1000 / flyEarchFrames / 2)) % flyEarchFrames); //летающая земля (2 полных цикла анимации за 1 секунду)

	mouseLogic(); //логика обработки мыши

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