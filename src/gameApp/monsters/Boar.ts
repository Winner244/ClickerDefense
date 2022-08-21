import {Helper} from '../helpers/Helper';

import Boar1Image from '../../assets/img/monsters/boar/boar.png';
import BoarAttack1Image from '../../assets/img/monsters/boar/boarAttack.png';
import BoarSpecial1Image from '../../assets/img/monsters/boar/boarSpecial.png';
import BoarSpecialSmokeImage from '../../assets/img/monsters/boar/boarSpecial_Smoke.png';
import BoarSpecialDamageParticlesImage from '../../assets/img/monsters/boar/boarSpecial_DamageParticles.png';

import {BoarSpecialAbility} from "../modifiers/BoarSpecialAbility";

import {Monster} from '../gameObjects/Monster';
import {Building} from "../gameObjects/Building";
import {Draw} from "../gameSystems/Draw";
import { Game } from '../gameSystems/Game';

import Animation from '../../models/Animation';

import { ImageHandler } from '../ImageHandler';

export class Boar extends Monster{

	static readonly images: HTMLImageElement[] = [];  //разные окраски монстра
	static readonly imageFrames = 8;

	static readonly attackImages: HTMLImageElement[] = [];  //разные окраски монстра
	static readonly attackImageFrames = 3;

	static readonly specialAbilityImages: HTMLImageElement[] = [];  //разные окраски монстра
	static readonly specialAbilityImageFrames = 12;
	static readonly specialAbilityImageFrameWidth = 375;

	static readonly specialAbilitySmokeAnimation: Animation = new Animation(16, 1000);
	static readonly specialAbilitySmokeImageDisplayedWidth = 180;

	static readonly specialAbilityDamageParticlesImage: HTMLImageElement = new Image();
	static readonly specialAbilityDamageParticlesImageFrames = 7;
	static readonly specialAbilityDamageParticlesImageFrameWidth = 200;
	static readonly specialAbilityDamageParticlesImageDisplayedWidth = 100;
	static readonly specialAbilityDamageParticlesImageDisplayedHeight = 100;

	/* Спец Способность - каждый некоторый кабан останавливается перед атакуемым зданием на расстоянии z пикселей,
		активирует анимацию "злой бык" и начинает бежать с ускорением с доп анимацией "Пыль", первая атака наносит 10x урон
		 спец способность отменяется при нанесении урона монстру */
	static readonly probabilitySpecialAbilityPercentage = 70; //(%) Вероятность срабатывания спец способности
	static readonly maxDistanceActivateSpecialAbility = 700; //(px) Макс Дистанция до ближайшего строения - цели, при котором активируется спец способность
	static readonly minDistanceActivateSpecialAbility = 200; //(px) Мин Дистанция до ближайшего строения - цели, при котором активируется спец способность
	static readonly timeAnimateSpecialAbility = 1000; //(milliseconds) время анимации способности
	static readonly timeAnimateSpecialAbilitySmokeGrowing = 600; //(milliseconds) время роста анимации пыли у способности
	static readonly timeAnimateSpecialDamageParticles = 200; //(milliseconds) время анимации отлёта ошмётков от урона спец способности
	static readonly specialAbilityDamage = 18; //начальный урон от спец способности (единократный)
	
	isWillUseSpecialAbility: boolean;
	isActivatedSpecialAbility: boolean;
	isActivatedSpecialDamage: boolean;  //урон от спец способности был нанесён
	specialAbilityImage: HTMLImageElement; //анимация спец способности
	specialAbilityDamage: number; //Доп урон от спец способности (единократный)
	timeSpecialAbilityWasActivated: number; //время когда спец способности была активирована
	timeSpecialDamageWasActivated: number; //время когда урона от спец способности был активирован

	private static readonly imageHandler: ImageHandler = new ImageHandler();
	private static wasInit: boolean; //вызов функции init уже произошёл?


	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		Boar.init(true); //reserve init

		let random = Helper.getRandom(1, Boar.images.length) - 1;
		let selectedImage = Boar.images[random];
		let selectedAttackImage = Boar.attackImages[random];
		let selectedSpecialImage = Boar.specialAbilityImages[random];

		super(x, y,
			scaleSize,
			isLeftSide,
			true, //isLand
			Boar.name,
			selectedImage,
			Boar.imageFrames,
			500,
			selectedAttackImage,
			Boar.attackImageFrames,
			500,
			5,
			4,  //health
			180, //damage
			500,  //time attack wait
			150,  //speed
			Boar.imageHandler);

		this.isWillUseSpecialAbility = Helper.getRandom(0, 100) <= Boar.probabilitySpecialAbilityPercentage;
		this.specialAbilityImage = selectedSpecialImage;
		this.isActivatedSpecialAbility = false;
		this.isActivatedSpecialDamage = false;
		this.timeSpecialAbilityWasActivated = this.timeSpecialDamageWasActivated = 0;
		this.specialAbilityDamage = Boar.specialAbilityDamage * scaleSize;
	}

	static init(isLoadImage: boolean = true): void {
		if(isLoadImage && !Boar.wasInit) {
			Boar.wasInit = true;

			Boar.imageHandler.add(Boar.images).src = Boar1Image;

			Boar.imageHandler.add(Boar.attackImages).src = BoarAttack1Image;

			Boar.imageHandler.add(Boar.specialAbilityImages).src = BoarSpecial1Image;

			Boar.imageHandler.new(Boar.specialAbilitySmokeAnimation.image).src = BoarSpecialSmokeImage;
			Boar.imageHandler.new(Boar.specialAbilityDamageParticlesImage).src = BoarSpecialDamageParticlesImage;
		}
	}

	logic(millisecondsDifferent: number, buildings: Building[], bottomBorder: number) {
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this.isActivatedSpecialAbility) {
			if(Date.now() - this.timeSpecialAbilityWasActivated < Boar.timeAnimateSpecialAbility) {
				return; //игнорируем базовую логику движения и атаки
			}
			else if(this.isAttack && this.buildingGoal) {
				super.attack(this.specialAbilityDamage); //наносим урон от спец способности
				this.buildingGoal.impulse += (this.isLeftSide ? 1 : -1) * this.specialAbilityDamage; //добавляем импульс постройке от удара
				this.stopSpecialAbility();
				this.isActivatedSpecialDamage = true;
				this.timeSpecialDamageWasActivated = Date.now();
			}
			else {
				this.lastAttackedTime = Date.now(); //что бы не сработала первая обычная атака в базовом методе
			}
		}
		else if(this.isWillUseSpecialAbility) {
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
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

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

				const smokeScaleSize = Math.min((Boar.timeAnimateSpecialAbilitySmokeGrowing + (isGameOver ? Game.gameOverTime : Date.now()) - this.timeSpecialAbilityWasActivated - Boar.timeAnimateSpecialAbility - Boar.timeAnimateSpecialAbilitySmokeGrowing) / Boar.timeAnimateSpecialAbilitySmokeGrowing, 1);
				const x = scale > 0 
					? this.x + this.width / 3
					: scale * this.x + this.width / 3 + (smokeScaleSize * Boar.specialAbilitySmokeImageDisplayedWidth - this.width);
				const y = this.y + (1 - smokeScaleSize) * this.height;
				const width = smokeScaleSize * scale * Boar.specialAbilitySmokeImageDisplayedWidth;
				Boar.specialAbilitySmokeAnimation.draw(isGameOver, x, y, width, smokeScaleSize * this.height);

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
