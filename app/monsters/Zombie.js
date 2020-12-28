class Zombie extends Monster{

	static image = new Image();
	static attackImage = new Image();
	static name = 'zombie';

	constructor(x, y, isLeftSide) {
		super(x, y, isLeftSide, true, Zombie.name, Zombie.image, 12,  49, Zombie.attackImage, 4, 48, 5, 3, 1, 50);
	}

	static init(){
		Zombie.image.src = './media/img/monsters/zombie.png' 
		Zombie.attackImage.src = './media/img/monsters/zombieAttack.png'
	}
}