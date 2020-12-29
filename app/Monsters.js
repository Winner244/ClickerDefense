class Monsters{
	static all = []; //все монстры

	static init(){
		Zombie.init();
	}

	static mouseLogic(mouseX, mouseY, isClick){
		for(let i = 0; i < Monsters.all.length; i++){
			let monster = Monsters.all[i];
			if(mouseX > monster.x + monster.reduceHover && 
				mouseX < monster.x + monster.width - monster.reduceHover &&
				mouseY > monster.y + monster.reduceHover && 
				mouseY < monster.y + monster.image.height - monster.reduceHover)
			{
				Cursor.setCursor(Cursor.sword);

				if(isClick){
					monster.health -= Gamer.cursorDamage;
					if(monster.health <= 0){
						Labels.createGreen(mouseX - 10, mouseY - 10, '+1');
						Monsters.all.splice(i, 1);
						Gamer.coins++;
					}

					Cursor.setCursor(Cursor.swordRed);
				}

				return true;
			}
		}

		return false;
	}

	static logic(millisecondsDifferent, flyEarth){
		//логика передвижения
		Monsters.all.map(monster => monster.logic(millisecondsDifferent, buildings));
	
		//логика взаимодействия с монетками
		if(Monsters.all.length){
			Monsters.all.sortByField(monster => Math.abs(Draw.canvas.width / 2 - monster.x));
			if(Monsters.all[0].x > flyEarth.x && Monsters.all[0].x < flyEarth.x + flyEarth.width){
				var availableMonsters = Monsters.all.filter(monster => monster.x > flyEarth.x && monster.x < flyEarth.x + flyEarth.width);
				availableMonsters.forEach(monster => {
					for(let i = 0; i < Coins.all.length; i++){
						if(Coins.all[i].y > monster.y && monster.x < Coins.all[i].x + Coin.image.width / 2 && monster.x + monster.width > Coins.all[i].x + Coin.image.width / 2){
							Labels.createRed(Coins.all[i].x + 10, Coins.all[i].y + 10, '-');
							Coins.delete(i);
						}
					}
				});
			}
		}
	}

	static draw(isGameOver){
		Monsters.all.forEach(monster => monster.draw(isGameOver));
	}
}