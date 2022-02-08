import {SimpleObject} from '../../models/SimpleObject';
import {Size} from "../../models/Size";

import {FlyEarth} from '../buildings/FlyEarth';

import {Zombie} from '../monsters/Zombie';
import {Bat} from '../monsters/Bat';
import {Boar} from '../monsters/Boar';

import {Building} from '../gameObjects/Building';
import {Monster} from '../gameObjects/Monster';
import {Gamer} from '../gameObjects/Gamer';
import {Coin} from '../gameObjects/Coin';

import {Cursor} from '../Cursor';
import {Labels} from './Labels';
import {Coins} from './Coins';
import {Draw} from './Draw';

import ExplosionImage from '../../assets/img/monsters/explosionOfEnergy.png'; 

export class Monsters{
	static all: Monster[] = []; //все созданные и пока ещё живые монстры
	
	static explosionImage: HTMLImageElement = new Image(); //анимация после гибели монстра
	static explosions: SimpleObject[] = []; //анимации гибели монстра 

	static readonly explosionLifeTime = 700; //время жизни анимации гибели монстра (в миллисекундах)
	static readonly explosionFrames = 27;

	static init(isLoadImage: boolean = true){
		Monsters.all = [];

		if(isLoadImage){
			this.explosionImage.src = ExplosionImage;
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
				mouseY < monster.y + monster.image.height - monster.reduceHover)
			{
				Cursor.setCursor(Cursor.sword);

				//игрок наносит урон по монстру
				if(isClick){
					monster.health -= Gamer.cursorDamage;
					monster.onClicked();
					Labels.createGamerDamageLabel(mouseX, mouseY - 10, '-' + Gamer.cursorDamage)
					Cursor.setCursor(Cursor.swordRed);
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
					this.explosions.push(new SimpleObject(monster.x, monster.y, monster.width, monster.image.height, this.explosionLifeTime));
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
			let frame = Math.floor((this.explosionLifeTime - x.lifeTime) / this.explosionLifeTime * this.explosionFrames);
			let newWidth = (this.explosionImage.width / this.explosionFrames) * (x.size.height / (this.explosionImage.height));
			Draw.ctx.drawImage(this.explosionImage, 
				this.explosionImage.width / this.explosionFrames * frame, //crop from x
				0, //crop from y
				this.explosionImage.width / this.explosionFrames, //crop by width
				this.explosionImage.height,    //crop by height
				x.location.x - (newWidth - x.size.width) / 2, //x
				x.location.y,  //y
				newWidth, //displayed width 
				x.size.height); //displayed height 

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