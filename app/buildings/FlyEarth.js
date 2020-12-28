class FlyEarth extends Building{
	static image = new Image();
	static name = 'flyEarth';
	static width = 250;
	static height = 186;

	constructor(x, y) {
		super(x, y, false, false, FlyEarth.name, FlyEarth.image, 4, FlyEarth.width, FlyEarth.height, 15, 100);
	}

	static init(){
		FlyEarth.image.src = './media/img/builders/flyEarth.png'; 
	}
}