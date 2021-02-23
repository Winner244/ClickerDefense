import {FlyEarth} from '../buildings/FlyEarth';
import {Zombie} from '../monsters/Zombie';
import {Cursor} from '../Cursor';

import {Gamer} from '../gameObjects/Gamer';
import {Labels} from '../gameObjects/Labels';
import {Coin} from '../gameObjects/Coin';
import {Coins} from '../gameObjects/Coins';
import {Building} from '../gameObjects/Building';
import {SimpleObject} from '../../models/SimpleObject';

import {Monster} from './Monster';

import ExplosionImage from '../../assets/img/explosionOfEnergy.png'; 
import { Draw } from '../gameSystems/Draw';

export class Monsters{
	static all: Monster[] = []; //все монстры
	static explosionImage: HTMLImageElement = new Image(); //анимация после гибели монстра
	static explosions: SimpleObject[] = []; //анимации гибели монстра 
	static readonly explosionLifeTime = 700; //время жизни анимации гибели монстра (в миллисекундах)
	static readonly explosionFrames = 27;

	static init(isLoadImage: boolean = true){
		this.all = [];
		Zombie.init(isLoadImage);
		if(isLoadImage){
			this.explosionImage.src = ExplosionImage;
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

				if(isClick){
					monster.health -= Gamer.cursorDamage;
					if(monster.health <= 0){
						Labels.createGreen(mouseX - 10, mouseY - 10, '+1');
						Monsters.all.splice(i, 1);
						Gamer.coins++;
						this.explosions.push(new SimpleObject(monster.x, monster.y, monster.width, monster.image.height, this.explosionLifeTime));
					}

					Cursor.setCursor(Cursor.swordRed);
				}

				return true;
			}
		}

		return false;
	}

	static logic(millisecondsDifferent: number, flyEarth: FlyEarth, buildings: Building[]): void{
		//логика взрывов погибших монстров
		if(this.explosions.length){
			for(let i = 0; i < this.explosions.length; i++){
				this.explosions[i].lifeTime -= millisecondsDifferent;
				if(this.explosions[i].lifeTime <= 0){
					this.explosions.splice(i, 1);
					i--;
				}
			}
		}

		if(!Monsters.all.length){
			return;
		}

		//логика передвижения
		Monsters.all.map(monster => monster.logic(millisecondsDifferent, buildings));
	
		//логика взаимодействия с монетками
		if(Coins.all.length){
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

	static draw(isGameOver: boolean): void{
		//взрыв погибших монстров
		this.explosions.forEach(x => {
			let frame = Math.floor((this.explosionLifeTime - x.lifeTime) / this.explosionLifeTime * this.explosionFrames);
			let newWidth = (this.explosionImage.width / this.explosionFrames) * (x.size.height / (this.explosionImage.height));
			Draw.ctx.drawImage(this.explosionImage, 
				this.explosionImage.width / this.explosionFrames * frame, //crop from x
				0, //crop from y
				this.explosionImage.width / this.explosionFrames, //crop by width
				this.explosionImage.height,    //crop by height
				x.location.x - (newWidth - x.size.width) / 2, //draw from x
				x.location.y,  //draw from y
				newWidth, //draw by width 
				x.size.height); //draw by height 

		});

		Monsters.all.forEach(monster => monster.draw(isGameOver));
	}
}