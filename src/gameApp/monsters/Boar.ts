import {Monster} from '../gameObjects/Monster';
import {Helper} from '../helpers/Helper';

import Boar1Image from '../../assets/img/monsters/boar.png';
import BoarAttack1Image from '../../assets/img/monsters/boarAttack.png';
import BoarSpecial1Image from '../../assets/img/monsters/boarSpecial.png';
import BoarSpecialSmokeImage from '../../assets/img/monsters/boarSpecial_Smoke.png';
import BoarSpecialDamageParticlesImage from '../../assets/img/monsters/boarSpecial_DamageParticles.png';

import {Building} from "../gameObjects/Building";
import {BoarSpecialAbility} from "../modifiers/BoarSpecialAbility";
import {Draw} from "../gameSystems/Draw";

export class Boar extends Monster{

	static images: HTMLImageElement[] = [];
	static imageFrames = 8;

	static attackImages: HTMLImageElement[] = [];
	static attackImageFrames = 3;

	static specialAbilityImages: HTMLImageElement[] = [];
	static specialAbilityImageFrames = 12;
	static specialAbilityImageFrameWidth = 375;

	static specialAbilitySmokeImage: HTMLImageElement;
	static specialAbilitySmokeImageFrames = 16;
	static specialAbilitySmokeImageFrameWidth = 90;
	static specialAbilitySmokeImageDisplayedWidth = 180;

	static specialAbilityDamageParticlesImage: HTMLImageElement;
	static specialAbilityDamageParticlesImageFrames = 7;
	static specialAbilityDamageParticlesImageFrameWidth = 200;
	static specialAbilityDamageParticlesImageDisplayedWidth = 100;
	static specialAbilityDamageParticlesImageDisplayedHeight = 100;

	/* Спец Способность - каждый некоторый кабан останавливается перед атакуемым зданием на расстоянии z пикселей,
		активирует анимацию "злой бык" и начинает бежать с ускорением с доп анимацией "Пыль", первая атака наносит 10x урон
		 спец способность отменяется при нанесении урона монстру */
	static probabilitySpecialAbilityPercentage = 70; //(%) Вероятность срабатывания спец способности
	static maxDistanceActivateSpecialAbility = 700; //(px) Макс Дистанция до ближайшего строения - цели, при котором активируется спец способность
	static minDistanceActivateSpecialAbility = 200; //(px) Мин Дистанция до ближайшего строения - цели, при котором активируется спец способность
	static timeAnimateSpecialAbility = 1000; //(milliseconds) время анимации способности
	static timeAnimateSpecialAbilitySmoke = 1000; //(milliseconds) время анимации пыли у способности
	static timeAnimateSpecialAbilitySmokeGrowing = 600; //(milliseconds) время роста анимации пыли у способности
	static timeAnimateSpecialDamageParticles = 200; //(milliseconds) время анимации отлёта ошмётков от урона спец способности
	static specialAbilityDamage = 10; //начальный урон от спец способности (единократный)
	isWillUseSpecialAbility: boolean;
	isActivatedSpecialAbility: boolean;
	isActivatedSpecialDamage: boolean;  //урон от спец способности был нанесён
	specialAbilityImage: HTMLImageElement; //анимация спец способности
	specialAbilityDamage: number; //Доп урон от спец способности (единократный)
	timeSpecialAbilityWasActivated: number; //время когда спец способности была активирована
	timeSpecialDamageWasActivated: number; //время когда урона от спец способности был активирован


	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		let random = Helper.getRandom(1, Boar.images.length) - 1;
		let selectedImage = Boar.images[random];
		let selectedAttackImage = Boar.attackImages[random];
		let selectedSpecialImage = Boar.specialAbilityImages[random];

		super(x, y,
			isLeftSide,
			true,
			Boar.name,
			selectedImage,
			Boar.imageFrames,
			selectedImage.width / Boar.imageFrames * scaleSize,
			2,
			selectedAttackImage,
			Boar.attackImageFrames,
			selectedAttackImage.width / Boar.attackImageFrames * scaleSize,
			2,
			5,
			4 * scaleSize,
			3 * scaleSize,
			150);

		this.isWillUseSpecialAbility = Helper.getRandom(0, 100) <= Boar.probabilitySpecialAbilityPercentage;
		this.specialAbilityImage = selectedSpecialImage;
		this.isActivatedSpecialAbility = false;
		this.isActivatedSpecialDamage = false;
		this.timeSpecialAbilityWasActivated = this.timeSpecialDamageWasActivated = 0;
		this.specialAbilityDamage = Boar.specialAbilityDamage * scaleSize;
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage){
			Boar.images.push(new Image()); Boar.images[0].src = Boar1Image;
			//Boar.images.push(new Image()); Boar.images[1].src = Boar2Image;
			//Boar.images.push(new Image()); Boar.images[2].src = Boar3Image;

			Boar.attackImages.push(new Image()); Boar.attackImages[0].src = BoarAttack1Image;
			//Boar.attackImages.push(new Image()); Boar.attackImages[1].src = BoarAttack2Image;
			//Boar.attackImages.push(new Image()); Boar.attackImages[2].src = BoarAttack3Image;

			Boar.specialAbilityImages.push(new Image()); Boar.specialAbilityImages[0].src = BoarSpecial1Image;

			Boar.specialAbilitySmokeImage = new Image(); 
			Boar.specialAbilitySmokeImage.src = BoarSpecialSmokeImage;

			Boar.specialAbilityDamageParticlesImage = new Image();
			Boar.specialAbilityDamageParticlesImage.src = BoarSpecialDamageParticlesImage;
		}
	}

	logic(millisecondsDifferent: number, buildings: Building[], bottomBorder: number) {
		if(this.isActivatedSpecialAbility){
			if(Date.now() - this.timeSpecialAbilityWasActivated < Boar.timeAnimateSpecialAbility){
				return; //игнорируем базовую логику движения и атаки
			}
			else if(this.isAttack && this.buildingGoal){
				this.buildingGoal.health -= this.specialAbilityDamage; //наносим урон от спец способности
				this.buildingGoal.impulse += (this.isLeftSide ? 1 : -1) * this.specialAbilityDamage; //добавляем импульс постройке от удара
				this.stopSpecialAbility();
				this.isActivatedSpecialDamage = true;
				this.timeSpecialDamageWasActivated = Date.now();
			}
		}
		else if(this.isWillUseSpecialAbility){
			//активация спец способности
			if(this.buildingGoal != null &&
				Math.abs(this.buildingGoal.x - this.x) <= Boar.maxDistanceActivateSpecialAbility &&
				Math.abs(this.buildingGoal.x - this.x) > Boar.minDistanceActivateSpecialAbility && 
				Math.random() < 0.1 * millisecondsDifferent / 100)
			{
				this.isActivatedSpecialAbility = true;
				this.timeSpecialAbilityWasActivated = Date.now();
				this.modifiers.push(new BoarSpecialAbility());
			}
		}

		super.logic(millisecondsDifferent, buildings, bottomBorder);
	}

	onClicked(): void{
		this.stopSpecialAbility();
	}

	stopSpecialAbility(): void{
		this.modifiers = this.modifiers.filter(x => x.name != BoarSpecialAbility.name);
		this.isWillUseSpecialAbility = false;
		this.isActivatedSpecialAbility = false;
		this.timeSpecialAbilityWasActivated = 0;
	}

	draw(isGameOver: boolean) {
		let isInvert = this.isLeftSide;
		let scale = isInvert ? -1 : 1;

		//анимация начала спец способности - когда кабан стоит на месте и ногами как бык взбивает пыль
		if(this.isActivatedSpecialAbility && Date.now() - this.timeSpecialAbilityWasActivated < Boar.timeAnimateSpecialAbility){
			if(isInvert){
				Draw.ctx.save();
				Draw.ctx.scale(-1, 1);
			}

			let currentFrame = isGameOver 
				? 0 
				: Math.floor((Date.now() - this.timeSpecialAbilityWasActivated) / Boar.timeAnimateSpecialAbility * Boar.specialAbilityImageFrames);
			Draw.ctx.drawImage(this.specialAbilityImage,
				Boar.specialAbilityImageFrameWidth * currentFrame, //crop from x
				0, //crop from y
				Boar.specialAbilityImageFrameWidth, 	   //crop by width
				this.specialAbilityImage.height, //crop by height
				scale * this.x,  //x
				this.y,  		 //y
				scale * this.width, //displayed width
				this.height); //displayed height


			if(isInvert){
				Draw.ctx.restore();
			}

			super.drawHealth();
		}
		else{
			//дым от бега 
			if(this.isActivatedSpecialAbility){
				if(isInvert){
					Draw.ctx.save();
					Draw.ctx.scale(-1, 1);
				}

				let smokeScaleSize = Math.min((Boar.timeAnimateSpecialAbilitySmokeGrowing + Date.now() - this.timeSpecialAbilityWasActivated - Boar.timeAnimateSpecialAbility - Boar.timeAnimateSpecialAbilitySmokeGrowing) / Boar.timeAnimateSpecialAbilitySmokeGrowing, 1);
				let smokeCurrentFrame = isGameOver 
					? 0 
					: Math.floor((Math.abs(Date.now() - this.timeSpecialAbilityWasActivated) % Boar.timeAnimateSpecialAbilitySmoke * Boar.specialAbilitySmokeImageFrames) / Boar.timeAnimateSpecialAbilitySmoke);
				Draw.ctx.drawImage(Boar.specialAbilitySmokeImage,
					Boar.specialAbilitySmokeImageFrameWidth * smokeCurrentFrame, //crop from x
					0, //crop from y
					Boar.specialAbilitySmokeImageFrameWidth, 	//crop by width
					Boar.specialAbilitySmokeImage.height, 		//crop by height
					scale > 0 
						? this.x + this.width / 3
						: scale * this.x + this.width / 3 + (smokeScaleSize * Boar.specialAbilitySmokeImageDisplayedWidth - this.width),  //x
					this.y + (1 - smokeScaleSize) * this.height,  		 //y
					smokeScaleSize * scale * Boar.specialAbilitySmokeImageDisplayedWidth, //displayed width
					smokeScaleSize * this.height); //displayed height


				if(isInvert){
					Draw.ctx.restore();
				}
			}
			
			//сама модель быка
			super.draw(isGameOver);

			//обломки от спец атаки
			if(this.isActivatedSpecialDamage && Date.now() - this.timeSpecialDamageWasActivated < Boar.timeAnimateSpecialDamageParticles){
				scale = scale * -1;
				if(!isInvert){
					Draw.ctx.save();
					Draw.ctx.scale(-1, 1);
				}

				let currentFrame = isGameOver 
					? 0 
					: Math.floor((Math.abs(Date.now() - this.timeSpecialDamageWasActivated) % Boar.timeAnimateSpecialDamageParticles * Boar.specialAbilityDamageParticlesImageFrames) / Boar.timeAnimateSpecialDamageParticles);
				
				Draw.ctx.drawImage(Boar.specialAbilityDamageParticlesImage,
					Boar.specialAbilityDamageParticlesImageFrameWidth * currentFrame, //crop from x
					0, //crop from y
					Boar.specialAbilityDamageParticlesImageFrameWidth, 	//crop by width
					Boar.specialAbilityDamageParticlesImage.height, 	//crop by height
					scale > 0 ? this.x + this.width - Boar.specialAbilityDamageParticlesImageDisplayedWidth : -this.x,
					this.y + this.height / 2 - Boar.specialAbilityDamageParticlesImageDisplayedHeight / 2,
					scale * Boar.specialAbilityDamageParticlesImageDisplayedWidth, //displayed width
					Boar.specialAbilityDamageParticlesImageDisplayedHeight); //displayed height

				if(!isInvert){
					Draw.ctx.restore();
				}
			}
		}
	}
}
