class Zombie extends Monster{

	static image1 = new Image();
	static image2 = new Image();
	static attackImage = new Image();
	static name = 'zombie';

	constructor(x, y, isLeftSide) {
		let selectedImage = Helper.getRandom(1, 3) == 1 
			? Zombie.image2 
			: Zombie.image1;
		super(x, y, isLeftSide, true, Zombie.name, selectedImage, 12,  49, Zombie.attackImage, 4, 48, 5, 3, 1, 50);
	}

	static init(){
		Zombie.image1.src = './media/img/monsters/zombie.png';
		Zombie.image2.src = './media/img/monsters/zombie2.png'; 
		Zombie.attackImage.src = './media/img/monsters/zombieAttack.png';
	}
}