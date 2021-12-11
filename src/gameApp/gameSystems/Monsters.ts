import {FlyEarth} from '../buildings/FlyEarth';
import {Zombie} from '../monsters/Zombie';
import {Boar} from '../monsters/Boar';
import {Cursor} from '../Cursor';

import {Gamer} from '../gameObjects/Gamer';
import {Labels} from './Labels';
import {Coin} from '../gameObjects/Coin';
import {Coins} from './Coins';
import {Building} from '../gameObjects/Building';
import {SimpleObject} from '../../models/SimpleObject';

import {Monster} from '../gameObjects/Monster';

import ExplosionImage from '../../assets/img/monsters/explosionOfEnergy.png'; 
import {Draw } from './Draw';
import {Size} from "../../models/Size";

export class Monsters{
	static all: Monster[] = []; //все созданные и пока ещё живые монстры
	static typeSizes: { [id: string] : Size; } = {}; //размеры монстров
	
	static explosionImage: HTMLImageElement = new Image(); //анимация после гибели монстра
	static explosions: SimpleObject[] = []; //анимации гибели монстра 
	static readonly explosionLifeTime = 700; //время жизни анимации гибели монстра (в миллисекундах)
	static readonly explosionFrames = 27;

	static init(isLoadImage: boolean = true){
		Zombie.init(isLoadImage);
		Boar.init(isLoadImage);

		this.all = [];
		this.typeSizes = {
			[Zombie.name]: new Size(Zombie.images[0].width / Zombie.imageFrames, Zombie.images[0].height),
			[Boar.name]: new Size(Boar.images[0].width / Boar.imageFrames, Boar.images[0].height)
		};

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
					monster.onClicked();
					Cursor.setCursor(Cursor.swordRed);
				}

				return true;
			}
		}

		return false;
	}

	static logic(millisecondsDifferent: number, flyEarth: FlyEarth, buildings: Building[], isGameOver: boolean, bottomBorder: number): void{
		if(!isGameOver && Monsters.all.length){
			for(let i = 0; i < Monsters.all.length; i++){
				let monster = Monsters.all[i];
				if(monster.health <= 0){
					Labels.createGreen(monster.x, monster.y, '+1');
					Monsters.all.splice(i, 1);
					i--;
					Gamer.coins += Math.round(monster.healthMax);
					this.explosions.push(new SimpleObject(monster.x, monster.y, monster.width, monster.image.height, this.explosionLifeTime));
				}
			}
		}

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

		if(Monsters.all.length && !isGameOver){
			//логика передвижения
			Monsters.all.map(monster => monster.logic(millisecondsDifferent, buildings, bottomBorder));
		
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
				x.location.x - (newWidth - x.size.width) / 2, //x
				x.location.y,  //y
				newWidth, //displayed width 
				x.size.height); //displayed height 

		});

		Monsters.all.forEach(monster => monster.draw(isGameOver));
	}

	static add(name: string, x: number, y: number, isLeftSide: boolean, scaleSize: number){
		var newMonster: Monster;

		switch (name){
			case Zombie.name: newMonster = new Zombie(x, y, isLeftSide, scaleSize); break;
			case Boar.name: newMonster = new Boar(x, y, isLeftSide, scaleSize); break;
			default: throw 'unexpected name of monster.';
		}

		Monsters.all.push(newMonster);
	}
}