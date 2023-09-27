import {ImageHandler} from '../ImageHandler';

import {Monster} from './Monster';
import {Monsters} from './Monsters'; 

import {Unit} from '../units/Unit';
import {Miner} from '../units/Miner';

import {Building} from '../buildings/Building';
import {FlyEarth} from '../buildings/FlyEarth';

import {AudioSystem} from '../gameSystems/AudioSystem';

import {Helper} from '../helpers/Helper';

import {Modifier} from '../modifiers/Modifier';

import {AttackedObject} from '../../models/AttackedObject';
import {WaveData} from '../../models/WaveData';

import Bat1Image from '../../assets/img/monsters/bat/bat.png';  

import Sound1 from '../../assets/sounds/monsters/bat/1.mp3'; 
import Sound2 from '../../assets/sounds/monsters/bat/2.mp3'; 

import SoundMany1 from '../../assets/sounds/monsters/bat/many1.mp3'; 
import SoundMany2 from '../../assets/sounds/monsters/bat/many2.mp3'; 
import SoundMany3 from '../../assets/sounds/monsters/bat/many3.mp3'; 

import SoundAttacked1 from '../../assets/sounds/monsters/bat/attacked1.mp3'; 
import SoundAttacked2 from '../../assets/sounds/monsters/bat/attacked2.mp3'; 
import SoundAttacked3 from '../../assets/sounds/monsters/bat/attacked3.mp3'; 
import SoundAttacked4 from '../../assets/sounds/monsters/bat/attacked4.mp3';



/** Летучая  мышь - тип монстров */
export class Bat extends Monster{
	static readonly imageHandler: ImageHandler = new ImageHandler();

	private static readonly images: HTMLImageElement[] = []; //разные окраски монстра
	private static readonly imageFrames = 6; 

	//технические поля экземпляра
	private _zigzagLength: number;
	private _isZigzagToTop: boolean;
	private static readonly zigzagThreshold: number = 20;

	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		Bat.init(true);

		let random = Helper.getRandom(1, Bat.images.length) - 1;
		let selectedImage = Bat.images[random];

		super(x, y,
			scaleSize,
			isLeftSide,
			false,  //isLand
			Bat.name,
			selectedImage,
			Bat.imageFrames,
			300,  //speed animation
			selectedImage,
			Bat.imageFrames,
			300,  //speed animation attack
			5,    //reduce hover
			1,    //health
			0.1,  //damage
			200,  //time attack wait
			200,  //speed
			Bat.imageHandler,
			3000); //avrTimeSoundWaitMs

		this._zigzagLength = 0;
		this._isZigzagToTop = !!Helper.getRandom(0, 1);
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && Bat.imageHandler.isEmpty){
			Bat.imageHandler.add(Bat.images).src = Bat1Image;
		}
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomBorder: number, waveLevel: WaveData[]): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logic(drawsDiffMs, buildings, monsters, units, bottomBorder, waveLevel);

		if(this._goal){
			//напасть на майнера, если он есть на той же половине карты
			const miners = units.filter(x => x.name == Miner.name && x.isLeftSide == this.isLeftSide);
			if(this._goal.name == FlyEarth.name && miners.length && Helper.getRandom(0, 100) == 1){ 
				this._goal = miners[0];
			}

			let speedMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.speedMultiplier);
			let speed = this.speed * (drawsDiffMs / 1000);
			speed += speed * speedMultiplier;

			if(!this._isAttack){
				this.y += (this._goal.centerY - this.centerY) / Helper.getDistance(this.centerX, this.centerY, this._goal.centerX, this._goal.centerY) * speed;
	
				//Зигзагообразное перемещение
				var changes = drawsDiffMs / 10 * (this._isZigzagToTop ? 1 : -1);
				this.y += changes;
				this._zigzagLength += changes;
				if(Math.abs(this._zigzagLength) > Bat.zigzagThreshold){
					this._zigzagLength = 0;
					this._isZigzagToTop = !this._isZigzagToTop;
				}
				
			}
			else{
				if(this.y < this._goal.y + this._goal.reduceHover){
					this.y++;
				}
				else if(this.y > this._goal.y + this._goal.height - this._goal.reduceHover){
					this.y--;
				}
			}
		}
	}

	playSound(): void{
		if(Monsters.all.filter(x => x instanceof Bat).length > 4){
			AudioSystem.playRandom(this.centerX, [SoundMany1, SoundMany2, SoundMany3], [0.02, 0.02, 0.02], false, 1, true);
		}
		else{
			AudioSystem.playRandom(this.centerX, [Sound1, Sound2], [0.06, 0.06], false, 1, true);
		}
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null, attackingObject: AttackedObject|null = null): number{
		var damage = super.applyDamage(damage, x, y, attackingObject);
		if(damage > 0){
			AudioSystem.playRandom(this.centerX, [SoundAttacked1, SoundAttacked2, SoundAttacked3, SoundAttacked4], [0.09, 0.4, 0.3, 0.3], false, 1, true);
		}
		return damage;
	}

}