import {Monster} from '../gameObjects/Monster';
import {Helper} from '../helpers/Helper';

import Boar1Image from '../../assets/img/monsters/boar.png';
import BoarAttack1Image from '../../assets/img/monsters/boarAttack.png';
import BoarSpecial1Image from '../../assets/img/monsters/boarSpecial.png';

import {Building} from "../gameObjects/Building";
import {BoarSpecialAbility} from "../modifiers/BoarSpecialAbility";
import {Draw} from "../gameSystems/Draw";

export class Boar extends Monster{

	static images: HTMLImageElement[] = [];
	static imageFrames = 8;

	static attackImages: HTMLImageElement[] = [];
	static attackImageFrames = 3;

	static specialAbilityImages: HTMLImageElement[] = [];
	static specialAbilityImageFrames = 10;

	/* Спец Способность - каждый некоторый кабан останавливается перед атакуемым зданием на расстоянии z пикселей,
		активирует анимацию "злой бык" и начинает бежать с ускорением с доп анимацией "Пыль", первая атака наносит 10x урон
		 спец способность отменяется при нанесении урона монстру */
	static probabilitySpecialAbilityPercentage = 33; //(%) Вероятность срабатывания спец способности
	static maxDistanceActivateSpecialAbility = 300; //(px) Дистанция до ближайшего строения - цели, при котором активируется спец способность
	static minDistanceActivateSpecialAbility = 50; //(px) Дистанция до ближайшего строения - цели, при котором активируется спец способность
	static timeAnimatedSpecialAbility = 3000; //(milliseconds) время анимации способности
	isWillUseSpecialAbility: boolean;
	isActivatedSpecialAbility: boolean;
	specialAbilityImage: HTMLImageElement; //анимация спец способности
	specialAbilityAdditionalDamage: number; //Доп урон от спец способности (единократный)
	timeSpecialAbilityActivated: number; //время активации спец способности


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
			3,
			150);

		this.isWillUseSpecialAbility = Helper.getRandom(0, 100) <= Boar.probabilitySpecialAbilityPercentage;
		this.specialAbilityImage = selectedSpecialImage;
		this.isActivatedSpecialAbility = false;
		this.timeSpecialAbilityActivated = 0;
		this.specialAbilityAdditionalDamage = 10;
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
		}
	}

	logic(millisecondsDifferent: number, buildings: Building[], bottomBorder: number) {
		if(this.isActivatedSpecialAbility){
			if(Date.now() - this.timeSpecialAbilityActivated < Boar.timeAnimatedSpecialAbility){
				return; //игнорируем базовую логику движения и атаки
			}
		}
		else if(this.isWillUseSpecialAbility){
			//активация спец способности
			if(this.buildingGoal != null &&
				this.buildingGoal.health > 0 &&
				Math.abs(this.buildingGoal.x - this.x) <= Boar.maxDistanceActivateSpecialAbility &&
				Math.abs(this.buildingGoal.x - this.x) > Boar.minDistanceActivateSpecialAbility)
			{
				this.isActivatedSpecialAbility = true;
				this.timeSpecialAbilityActivated = Date.now();
				this.modifiers.push(new BoarSpecialAbility());
			}
			else if(this.isActivatedSpecialAbility && this.isAttack && this.buildingGoal){
				this.buildingGoal.health -= this.specialAbilityAdditionalDamage; //наносим доп урон
				this.stopSpecialAbility();
			}
		}

		super.logic(millisecondsDifferent, buildings, bottomBorder);
	}

	onClicked(): void{
		this.stopSpecialAbility();
	}

	stopSpecialAbility(): void{
		this.modifiers = this.modifiers.filter(x => x.name != BoarSpecialAbility.name);
		this.isWillUseSpecialAbility = Helper.getRandom(0, 100) <= Boar.probabilitySpecialAbilityPercentage;
		this.isActivatedSpecialAbility = false;
		this.timeSpecialAbilityActivated = 0;
	}

	draw(isGameOver: boolean) {
		if(this.isActivatedSpecialAbility && Date.now() - this.timeSpecialAbilityActivated < Boar.timeAnimatedSpecialAbility){
			let isInvert = this.isLeftSide;
			let scale = isInvert ? -1 : 1;

			if(isInvert){
				Draw.ctx.save();
				Draw.ctx.scale(-1, 1);
			}

			//передвижение
			let currentFrame = isGameOver ? 0 : (Date.now() - this.timeSpecialAbilityActivated) / Boar.timeAnimatedSpecialAbility * Boar.specialAbilityImageFrames;
			Draw.ctx.drawImage(this.specialAbilityImage,
				this.widthFrame * currentFrame, //crop from x
				0, //crop from y
				this.widthFrame, 	   //crop by width
				this.specialAbilityImage.height, //crop by height
				scale * this.x,  //draw from x
				this.y,  		 //draw from y
				scale * this.width, //draw by width
				this.height); //draw by height

			if(isInvert){
				Draw.ctx.restore();
			}

			super.drawHealth();
		}
		else{
			super.draw(isGameOver);
		}
	}
}
