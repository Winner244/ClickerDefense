import {SimpleObject} from '../../models/SimpleObject';
import {WaveData} from '../../models/WaveData';
import Animation from '../../models/Animation';

import {Building} from '../buildings/Building';
import {FlyEarth} from '../buildings/FlyEarth';

import {Monster} from './Monster';
import {Zombie} from './Zombie';
import {Bat} from './Bat';
import {Boar} from './Boar';
import {Necromancer} from './Necromancer';
import {Skelet} from './Skelet';

import {Gamer} from '../gamer/Gamer';
import {Cursor} from '../gamer/Cursor';

import {Coin} from '../coins/Coin';
import {Coins} from '../coins/Coins';

import {AudioSystem} from '../gameSystems/AudioSystem';

import {Labels} from '../labels/Labels';

import ExplosionImage from '../../assets/img/monsters/explosionOfEnergy.png'; 

import ExplosionSound from '../../assets/sounds/monsters/explosion.mp3'; 
import SwordAttackSound from '../../assets/sounds/gamer/sword_attack.mp3'; 



/** Система управления всеми монстрами - единичный статичный класс */
export class Monsters{
	static readonly explosionAnimation: Animation = new Animation(27, 700); //анимация после гибели монстра

	static all: Monster[] = []; //все созданные и пока ещё живые монстры
	static explosions: SimpleObject[] = []; //анимации гибели монстра 

	static init(isLoadResources: boolean = true){
		Monsters.all = [];

		if(isLoadResources){
			this.explosionAnimation.image.src = ExplosionImage;
			AudioSystem.load(SwordAttackSound);
			AudioSystem.load(ExplosionSound);
		}
	}

	//pre load monsters
	static initMonster(monsterName: string): void {
		switch(monsterName) {
			case Zombie.name: Zombie.init(true); break;
			case Boar.name: Boar.init(true); break;
			case Bat.name: Bat.init(true); break;
			case Necromancer.name: Necromancer.init(true); break;
			case Skelet.name: Skelet.init(true); break;
			default: throw `unexpected name of the monster (initMonster(${monsterName})).`;
		}
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isHoverFound: boolean): boolean{
		if(!isHoverFound){
			return false;
		}

		for(let i = Monsters.all.length - 1; i >= 0; i--){ //в обратном порядке, что бы кликался сперва тот - который виден первым 
			let monster = Monsters.all[i];
			if(mouseX > monster.x + monster.reduceHover && 
				mouseX < monster.x + monster.width - monster.reduceHover &&
				mouseY > monster.y + monster.reduceHover && 
				mouseY < monster.y + monster.height - monster.reduceHover)
			{
				Cursor.setCursor(Cursor.sword);

				//игрок наносит урон по монстру
				if(isClick){
					monster.onClicked(Gamer.cursorDamage, mouseX, mouseY - 10);
					Cursor.setCursor(Cursor.swordRed);
					AudioSystem.play(mouseX, SwordAttackSound, 0.15, 1, true);
				}

				return true;
			}
		}

		return false;
	}

	static logic(drawsDiffMs: number, flyEarth: FlyEarth, buildings: Building[], isGameOver: boolean, bottomBorder: number, waveData: { [id: string] : WaveData; }): void{
		//уничтожение монстров
		if(!isGameOver && Monsters.all.length){
			for(let i = 0; i < Monsters.all.length; i++){
				let monster = Monsters.all[i];
				if(monster.health <= 0){
					waveData[monster.name].wasKilledCount++;
					monster.destroy();
					Labels.createCoinLabel(monster.x, monster.y, '+1');
					Monsters.all.splice(i, 1);
					i--;
					Gamer.coins += Math.round(monster.healthMax);
					this.explosions.push(new SimpleObject(monster.x, monster.y, monster.width, monster.height, this.explosionAnimation.durationMs));
					AudioSystem.play(monster.centerX, ExplosionSound, 0.1, 1, true);
					AudioSystem.playRandomTone(monster.centerX, 0.001, 0, 200, AudioSystem.iirFilters.low);
				}
			}
		}

		//логика исчезновение погибших монстров
		if(this.explosions.length){
			for(let i = 0; i < this.explosions.length; i++){
				this.explosions[i].leftTimeMs -= drawsDiffMs;
				if(this.explosions[i].leftTimeMs <= 0){
					this.explosions.splice(i, 1);
					i--;
				}
			}
		}

		if(Monsters.all.length && !isGameOver){
			//логика передвижения
			Monsters.all.forEach(monster => monster.logic(drawsDiffMs, buildings, this.all, bottomBorder, waveData));

			//вторичная логика модификаторов
			Monsters.all.forEach(monster => monster.modifiers.forEach(modifier => modifier.logicSpread(monster, this.all)));
		
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

	static draw(drawsDiffMs: number, isGameOver: boolean): void{
		//исчезновение погибших монстров
		this.explosions.forEach(x => {
			let newWidth = (this.explosionAnimation.image.width / this.explosionAnimation.frames) * (x.size.height / (this.explosionAnimation.image.height));
			this.explosionAnimation.leftTimeMs = x.leftTimeMs;
			this.explosionAnimation.draw(drawsDiffMs, false, x.location.x - (newWidth - x.size.width) / 2, x.location.y, newWidth, x.size.height);
		});

		Monsters.all.forEach(monster => monster.draw(drawsDiffMs, isGameOver));
	}

	static drawModifiersAhead(drawsDiffMs: number, isGameOver: boolean): void{
		Monsters.all.forEach(monster => monster.drawModifiersAhead(drawsDiffMs, isGameOver));
	}

	static create(name: string, isLeftSide: boolean, scaleSize: number): Monster{
		var newMonster: Monster;

		switch (name){
			case Zombie.name: newMonster = new Zombie(0, 0, isLeftSide, scaleSize); break;
			case Boar.name: newMonster = new Boar(0, 0, isLeftSide, scaleSize); break;
			case Bat.name: newMonster = new Bat(0, 0, isLeftSide, scaleSize); break;
			case Necromancer.name: newMonster = new Necromancer(0, 0, isLeftSide, scaleSize); break;
			case Skelet.name: newMonster = new Skelet(0, 0, isLeftSide, scaleSize); break;
			default: throw `unexpected name of the monster (add(${name}, ...)).`;
		}

		return newMonster;
	}

	static add(monster: Monster){
		Monsters.all.push(monster);
	}
}