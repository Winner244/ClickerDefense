import {SimpleObject} from '../../models/SimpleObject';
import Animation from '../../models/Animation';

import {FlyEarth} from '../buildings/FlyEarth';

import {Zombie} from '../monsters/Zombie';
import {Bat} from '../monsters/Bat';
import {Boar} from '../monsters/Boar';

import {Building} from '../gameObjects/Building';
import {Monster} from '../gameObjects/Monster';
import {Gamer} from '../gameObjects/Gamer';
import {Coin} from '../gameObjects/Coin';

import {AudioSystem} from './AudioSystem';
import {Cursor} from '../Cursor';
import {Labels} from './Labels';
import {Coins} from './Coins';
import {Draw} from './Draw';

import ExplosionImage from '../../assets/img/monsters/explosionOfEnergy.png'; 

import Explosion1Sound from '../../assets/sounds/monsters/explosion1.mp3'; 
import Explosion2Sound from '../../assets/sounds/monsters/explosion2.mp3'; 
import Explosion3Sound from '../../assets/sounds/monsters/explosion3.mp3'; 
import Explosion4Sound from '../../assets/sounds/monsters/explosion4.mp3'; 
import Explosion5Sound from '../../assets/sounds/monsters/explosion5.mp3'; 
import Explosion6Sound from '../../assets/sounds/monsters/explosion6.mp3'; 

import SwordAttack1Sound from '../../assets/sounds/gamer/sword_attack1.mp3'; 
import SwordAttack2Sound from '../../assets/sounds/gamer/sword_attack2.mp3'; 
import SwordAttack3Sound from '../../assets/sounds/gamer/sword_attack3.mp3'; 


export class Monsters{
	static all: Monster[] = []; //все созданные и пока ещё живые монстры
	
	static explosionAnimation: Animation = new Animation(27, 700); //анимация после гибели монстра
	static explosions: SimpleObject[] = []; //анимации гибели монстра 

	static init(isLoadImage: boolean = true){
		Monsters.all = [];

		if(isLoadImage){
			this.explosionAnimation.image.src = ExplosionImage;
		}
	}

	//pre load monsters
	static initMonster(monsterName: string): void {
		switch(monsterName) {
			case Zombie.name: Zombie.init(true); break;
			case Boar.name: Boar.init(true); break;
			case Bat.name: Bat.init(true); break;
			default: throw `unexpected name of the monster (initMonster(${monsterName})).`;
		}
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean): boolean{
		for(let i = 0; i < Monsters.all.length; i++){
			let monster = Monsters.all[i];
			if(mouseX > monster.x + monster.reduceHover && 
				mouseX < monster.x + monster.width - monster.reduceHover &&
				mouseY > monster.y + monster.reduceHover && 
				mouseY < monster.y + monster.animation.image.height - monster.reduceHover)
			{
				Cursor.setCursor(Cursor.sword);

				//игрок наносит урон по монстру
				if(isClick){
					monster.health -= Gamer.cursorDamage;
					monster.onClicked();
					Labels.createGamerDamageLabel(mouseX, mouseY - 10, '-' + Gamer.cursorDamage)
					Cursor.setCursor(Cursor.swordRed);
					AudioSystem.playRandom([SwordAttack1Sound, SwordAttack2Sound, SwordAttack3Sound], [0.1, 0.1, 0.1]);
				}

				return true;
			}
		}

		return false;
	}

	static logic(millisecondsDifferent: number, flyEarth: FlyEarth, buildings: Building[], isGameOver: boolean, bottomBorder: number): void{
		//уничтожение монстров
		if(!isGameOver && Monsters.all.length){
			for(let i = 0; i < Monsters.all.length; i++){
				let monster = Monsters.all[i];
				if(monster.health <= 0){
					Labels.createCoinLabel(monster.x, monster.y, '+1');
					Monsters.all.splice(i, 1);
					i--;
					Gamer.coins += Math.round(monster.healthMax);
					this.explosions.push(new SimpleObject(monster.x, monster.y, monster.width, monster.animation.image.height, this.explosionAnimation.duration));
					//AudioSystem.playRandom([Explosion1Sound, Explosion2Sound], [0.1, 0.2]);
					AudioSystem.play(Explosion6Sound, 0.1);
				}
			}
		}

		//логика исчезновение погибших монстров
		if(this.explosions.length){
			for(let i = 0; i < this.explosions.length; i++){
				this.explosions[i].lifeTime -= millisecondsDifferent;
				if(this.explosions[i].lifeTime <= 0){
					this.explosions.splice(i, 1);
					i--;
				}
			}
		}

		if(Monsters.all.length && !isGameOver){
			//логика передвижения
			Monsters.all.map(monster => monster.logic(millisecondsDifferent, buildings, bottomBorder));
		
			//логика взаимодействия с монетками
			if(Coins.all.length){
				var availableMonsters = Monsters.all.filter(monster => monster.x > flyEarth.x && monster.x < flyEarth.x + flyEarth.width);
				availableMonsters.forEach(monster => {
					for(let i = 0; i < Coins.all.length; i++){
						if(Coins.all[i].y > monster.y && monster.x < Coins.all[i].x + Coin.image.width / 2 && monster.x + monster.width > Coins.all[i].x + Coin.image.width / 2){
							Labels.createCoinLabel(Coins.all[i].x + 10, Coins.all[i].y + 10, '-');
							Coins.delete(i);
						}
					}
				});
			}
		}
	}

	static draw(isGameOver: boolean): void{
		//исчезновение погибших монстров
		this.explosions.forEach(x => {
			let newWidth = (this.explosionAnimation.image.width / this.explosionAnimation.frames) * (x.size.height / (this.explosionAnimation.image.height));
			this.explosionAnimation.draw(false, x.location.x - (newWidth - x.size.width) / 2, x.location.y, newWidth, x.size.height, x.lifeTime);
		});

		Monsters.all.forEach(monster => monster.draw(isGameOver));
	}

	static create(name: string, isLeftSide: boolean, scaleSize: number): Monster{
		var newMonster: Monster;

		switch (name){
			case Zombie.name: newMonster = new Zombie(0, 0, isLeftSide, scaleSize); break;
			case Boar.name: newMonster = new Boar(0, 0, isLeftSide, scaleSize); break;
			case Bat.name: newMonster = new Bat(0, 0, isLeftSide, scaleSize); break;
			default: throw `unexpected name of the monster (add(${name}, ...)).`;
		}

		return newMonster;
	}

	static add(monster: Monster){
		Monsters.all.push(monster);
	}
}