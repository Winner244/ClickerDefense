import {Draw} from '../gameSystems/Draw';

import {UpgradebleObject} from '../../models/UpgradebleObject';

import {AudioSystem} from '../gameSystems/AudioSystem';

import {ImageHandler} from '../../gameApp/ImageHandler';

import {UnitButtons} from '../../reactApp/components/UnitButtons/UnitButtons';

import Animation from '../../models/Animation';
import {AnimatedObject} from '../../models/AnimatedObject';

import {Coins} from '../coins/Coins';

import {Monster} from '../monsters/Monster';
import {Building} from '../buildings/Building';

import HealingImage from '../../assets/img/buildings/upgrade.png';

import CreatingImage from '../../assets/img/units/creating.png'; 

import CreatingSound from '../../assets/sounds/units/creating.mp3'; 
import End1Sound from '../../assets/sounds/units/end1.mp3'; 
import End2Sound from '../../assets/sounds/units/end2.mp3'; 
import End3Sound from '../../assets/sounds/units/end3.mp3'; 
import End4Sound from '../../assets/sounds/units/end4.mp3'; 
import End5Sound from '../../assets/sounds/units/end5.mp3'; 
import End6Sound from '../../assets/sounds/units/end6.mp3';
import End7Sound from '../../assets/sounds/units/end7.mp3';


/** Базовый класс для всех Юнитов пользователя */
export class Unit extends UpgradebleObject {
	readonly healingAnimation: Animation = new Animation(1, 1800); //продолжительность анимации лечения (миллисекунды)

	//поля свойства экземпляра
	speed: number; //скорость передвижения (пикселей в секунду)

	readonly endingAnimation: AnimatedObject; //анимация появления юнита


	constructor(x: number, y: number, 
		healthMax: number, 
		image: HTMLImageElement, 
		name: string, 
		imageHandler: ImageHandler,
		frames: number, 
		animationDurationMs: number,
		price: number, 
		speed: number,
		isLand: boolean = true, 
		reduceHover: number = 0,
		isSupportHealing: boolean = true,
		isSupportUpgrade: boolean = true)
	{
		super(x, y, true, isLand, name, 1, image, frames, animationDurationMs, reduceHover, healthMax, price, isSupportHealing, isSupportUpgrade, imageHandler);

		this.speed = speed;

		this.healingAnimation.image.src = HealingImage;

		this.endingAnimation = new AnimatedObject(x, y, this.width, this.height, true, new Animation(6, 600)); //анимация появления юнита
		this.endingAnimation.animation.image.src = CreatingImage;

		AudioSystem.load(CreatingSound);
		AudioSystem.load(End1Sound);
		AudioSystem.load(End2Sound);
		AudioSystem.load(End3Sound);
		AudioSystem.load(End4Sound);
		AudioSystem.load(End5Sound);
		AudioSystem.load(End6Sound);
		AudioSystem.load(End7Sound);
	}

	
	static loadHealingResources(): void{
		//TODO: Unit.healingImage.src = HealingImage;
		//TODO: AudioSystem.load(HealingSoundUrl);
	}

	recovery(): boolean{
		let result = super.recovery();
		if(result){
			//TODO: AudioSystem.play(this.centerX, HealingSoundUrl, 0, 1, false, true);
			Coins.playSoundGet(this.centerX, 0);
			this.healingAnimation.restart();
		}

		return result;
	}

	buttonsLogic(isDisplayRecoveryButton: boolean){
		if(!UnitButtons.isEnterMouse){
			let x = (this.x + this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
			let y = (this.y + this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
			let width = (this.width - 2 * this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
			let height = (this.height - 2 * this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
			let repairPrice = this.getRecoveryPrice();
			let isDisplayUpgradeButton = this.isSupportUpgrade && !this.isDisplayedUpgradeWindow && this.health > 0;
			UnitButtons.show(x, y, width, height, isDisplayRecoveryButton, isDisplayUpgradeButton, repairPrice, this);
		}
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number, isWaveStarted: boolean){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this.health <= 0){
			if(this.endingAnimation.animation.leftTimeMs == this.endingAnimation.animation.durationMs){
				AudioSystem.play(this.centerX, CreatingSound);
				AudioSystem.playRandomV(this.centerX, [End1Sound, End2Sound, End3Sound, End4Sound, End5Sound, End6Sound, End7Sound], 0);
			}
		}

		super.logicBase(drawsDiffMs);

		if(this.y + this.height > Draw.canvas.height){
			this.y = Draw.canvas.height - this.height;
		}
	}

	draw(drawsDiffMs: number, isGameOver: boolean, isWaveStarted: boolean, waveDelayStartLeftTimeMs: number): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this.health <= 0){
			if(this.endingAnimation.animation.leftTimeMs > 0){
				this.endingAnimation.draw(drawsDiffMs, isGameOver);
			}
			return;
		}

		let x = this.x;
		let y = this.y;

		let filter: string|null = null;
		if (this.isDisplayedUpgradeWindow) {
			filter = 'brightness(1.3)';
		}

		super.drawBase(drawsDiffMs, isGameOver, x, y, filter);
	}

	drawHealth(): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.drawHealthBase(this.x + 15, this.y - 10, this.width - 30);
	}


	drawHealingingAnimation(drawsDiffMs: number): void{
		if(this._isDisplayRecoveryAnimation){
			//this.healingAnimation.draw(drawsDiffMs, false, this.x, this.y, this.width, this.height, false);
		}
	}
}