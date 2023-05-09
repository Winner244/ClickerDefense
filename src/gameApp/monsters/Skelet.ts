import {ImageHandler} from '../ImageHandler';

import {AudioSystem} from '../gameSystems/AudioSystem';

import Animation from '../../models/Animation';

import {Building} from '../buildings/Building';

import {Monster} from './Monster';

import {Helper} from '../helpers/Helper';

import {AttackedObject} from '../../models/AttackedObject';
import {WaveData} from '../../models/WaveData';

import Skelet1Image from '../../assets/img/monsters/skelet/skelet.png'; 

import SkeletAttack1Image from '../../assets/img/monsters/skelet/skeletAttack.png'; 

import SkeletCreating1Image from '../../assets/img/monsters/skelet/creating.png'; 

import SkeletCreating1Sound from '../../assets/sounds/monsters/skeletes/creating.mp3'; 
import SkeletCreating2Sound from '../../assets/sounds/monsters/skeletes/creating2.mp3'; 



/** Скелет - тип монстров, которые вызываются Некромантом */
export class Skelet extends Monster{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly images: HTMLImageElement[] = []; //разные окраски монстра
	private static readonly imageFrames = 6;

	private static readonly attackImages: HTMLImageElement[] = [];  //разные окраски атаки монстра
	private static readonly attackImageFrames = 6;

	private static readonly creatingImages: HTMLImageElement[] = [];  //разные окраски появления монстра
	private static readonly creatingImageFrames = 16;
	private readonly creatingAnimation: Animation; //анимация повяления из под земли от вызова Некроманта

	isDisplayCreatingFromUndegroundAnimation: boolean; //отображать анимацию появления монстра из под земли?
	isStartedSoundOfCreating: boolean; //началось ли воспроизведение звука появления скелета из под земли?

	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		let random = Helper.getRandom(1, Skelet.images.length) - 1;
		let selectedImage = Skelet.images[random];
		let selectedAttackImage = Skelet.attackImages[random];
		let selectedCreatingImage = Skelet.creatingImages[random];

		super(x, y,
			scaleSize,
			isLeftSide,
			true,  //isLand
			Skelet.name,
			selectedImage,
			Skelet.imageFrames,
			500,   //speed animation
			selectedAttackImage,
			Skelet.attackImageFrames,
			500,  //speed animation attack
			5,     //reduce hover
			3,     //health
			3,     //damage
			500,   //time attack wait
			150,    //speed
			Skelet.imageHandler,
			3000); //avrTimeSoundWaitMs

			Skelet.init(true); //reserve init

			this.isDisplayCreatingFromUndegroundAnimation = false;
			this.isStartedSoundOfCreating = false;
			this.creatingAnimation = new Animation(Skelet.creatingImageFrames, Skelet.creatingImageFrames * 100, selectedCreatingImage);
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && !Skelet.images.length){
			Skelet.imageHandler.add(Skelet.images).src = Skelet1Image;
			
			Skelet.imageHandler.add(Skelet.attackImages).src = SkeletAttack1Image;

			Skelet.imageHandler.add(Skelet.creatingImages).src = SkeletCreating1Image;

			AudioSystem.load(SkeletCreating1Sound);
			AudioSystem.load(SkeletCreating2Sound);
		}
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], bottomBorder: number, waveData: { [id: string] : WaveData; }): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this.isDisplayCreatingFromUndegroundAnimation){
			if(this.creatingAnimation.leftTimeMs <= 0){
				this.isDisplayCreatingFromUndegroundAnimation = false;
			}
			else{
				if(!this.isStartedSoundOfCreating){
					this.isStartedSoundOfCreating = true;
					AudioSystem.play(this.centerX, SkeletCreating1Sound, 0.1, 1, true, true, 0, 0, false, false);
					AudioSystem.play(this.centerX, SkeletCreating2Sound, 0.2, 1, true, true, 0, 0, false, false);
				}
				return;
			}
		}

		super.logic(drawsDiffMs, buildings, monsters, bottomBorder, waveData);
	}

	playSound(): void {
		/*AudioSystem.playRandom(this.centerX, 
			[Sound1, Sound2, Sound3, Sound4, Sound5, Sound6, Sound7, Sound8, Sound9, Sound10], 
			[0.1, 0.1, 0.1, 0.1, 0.1, 0.05, 0.2, 0.05, 0.07, 0.08], false, 1, true);*/
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null, attackingObject: AttackedObject|null = null): number{
		var damage = super.applyDamage(damage, x, y, attackingObject);
		if(damage > 0){
			/*AudioSystem.playRandom(this.centerX, 
				[SoundAttacked1, SoundAttacked2, SoundAttacked3, SoundAttacked4, SoundAttacked5, SoundAttacked6, SoundAttacked7, SoundAttacked8, SoundAttacked9, SoundAttacked10, SoundAttacked11, SoundAttacked12], 
				[0.05, 0.05, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08], false, 1, true);*/
		}
		return damage;
	}

	
	drawObject(drawsDiffMs: number, isGameOver: boolean, invertSign: number = 1){
		if(this.isDisplayCreatingFromUndegroundAnimation){
			this.creatingAnimation.draw(drawsDiffMs, isGameOver, invertSign * this.x, this.y, invertSign * this.width, this.height);
		}
		else{
			super.drawObject(drawsDiffMs, isGameOver, invertSign);
		}
	}

	drawHealth(){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this.isDisplayCreatingFromUndegroundAnimation){
			super.drawHealthBase(this.x + 10, this.y - 2 + this.height * (this.creatingAnimation.leftTimeMs / this.creatingAnimation.durationMs), this.width - 20);
		}
		else{
			super.drawHealth();
		}
	}
}