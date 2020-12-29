class Zombie extends Monster{

	static image1 = new Image();
	static image2 = new Image();
	static image3 = new Image();
	static attackImage1 = new Image();
	static attackImage2 = new Image();
	static attackImage3 = new Image();
	static name = 'zombie';

	constructor(x, y, isLeftSide) {

		let random = Helper.getRandom(1, 4);
		let selectedImage = random == 1 
			? Zombie.image2 
			: (random == 2 
				? Zombie.image3
				: Zombie.image1);

		let selectedAttackImage = random == 1
			? Zombie.attackImage2
			: (random == 2 
				? Zombie.attackImage3
				: Zombie.attackImage1);

		super(x, y, isLeftSide, true, Zombie.name, selectedImage, 12,  49, selectedAttackImage, 4, 48, 5, 3, 1, 50);
	}

	static init(){
		Zombie.image1.src = './media/img/monsters/zombie.png';
		Zombie.image2.src = './media/img/monsters/zombie2.png'; 
		Zombie.image3.src = './media/img/monsters/zombie3.png'; 
		Zombie.attackImage1.src = './media/img/monsters/zombieAttack.png';
		Zombie.attackImage2.src = './media/img/monsters/zombieAttack2.png';
		Zombie.attackImage3.src = './media/img/monsters/zombieAttack3.png';
	}
}