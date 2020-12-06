let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let heightOfCanvas = canvas.height;
let widthOfCanvas = canvas.width;

//draw grass
let imageGrass = new Image();   
imageGrass.onload = drawGrass;;
imageGrass.src = './media/img/grass1.png';

/** прорисовка травы на веё нижней части canvas */
function drawGrass(){
	for(let i = 0; i < widthOfCanvas / imageGrass.width; i++){
		ctx.drawImage(imageGrass, imageGrass.width * i, heightOfCanvas - imageGrass.height);
	}
}

//draw fly earch
let imageFlyEarch = new Image();  
imageFlyEarch.onload = drawFlyEarch;
imageFlyEarch.src = './media/img/builders/flyEarth.png';

/** прорисовка анимированной летающей земли в центре экрана */
function drawFlyEarch(){
	ctx.drawImage(imageFlyEarch, 
		0, //crop from x
		0, //crop from y
		imageFlyEarch.width / 4, //crop by width
		imageFlyEarch.height,    //crop by height
		widthOfCanvas / 2 - imageFlyEarch.width / 4 / 2, //draw from x
		heightOfCanvas / 2 - imageFlyEarch.height / 2,  //draw from y
		imageFlyEarch.width / 4, //draw by width 
		imageFlyEarch.height); //draw by height 
}