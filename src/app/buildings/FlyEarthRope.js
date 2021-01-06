class FlyEarthRope extends Building{
	static image = new Image();
	static name = 'flyEarthRope';

	constructor(x, y) {
		super(x, y, false, true, FlyEarthRope.name, FlyEarthRope.image, 1, FlyEarthRope.image.width, FlyEarthRope.image.height, 0, 100);
	}

	static init(){
		FlyEarthRope.image.src = './media/img/builders/flyEarthRope.png'; 
	}
}