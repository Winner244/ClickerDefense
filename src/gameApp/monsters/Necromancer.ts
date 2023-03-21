import {ImageHandler} from '../ImageHandler';

import {MovingObject} from '../../models/MovingObject';
import Animation from '../../models/Animation';

import {AttackedObject} from '../../models/AttackedObject';

import {Modifier} from '../modifiers/Modifier';
import {AcidRainModifier} from '../modifiers/AcidRainModifier';

import {AudioSystem} from '../gameSystems/AudioSystem';
import {Draw} from '../gameSystems/Draw';

import {Building} from '../buildings/Building';
import {FlyEarth} from '../buildings/FlyEarth';
import {FlyEarthRope} from '../buildings/FlyEarthRope';

import {Monster} from './Monster';

import {Helper} from '../helpers/Helper';

import Necromancer1Image from '../../assets/img/monsters/necromancer/necromancer.png'; 
import ChargeImage from '../../assets/img/monsters/necromancer/charge.png'; 

import NecromancerAttack1Image from '../../assets/img/monsters/necromancer/necromancerAttack.png'; 
import SpecialAbilityAcidRainCallImage from '../../assets/img/monsters/necromancer/cloudCall.png'; 
import SpecialAbilityAcidRainCreatingImage from '../../assets/img/monsters/necromancer/cloudCreating.png'; 


import Attack1Sound from '../../assets/sounds/monsters/necromancer/attack1.mp3'; 
import Attack2Sound from '../../assets/sounds/monsters/necromancer/attack2.mp3'; 

import SoundAttacked1 from '../../assets/sounds/monsters/necromancer/attacked1.mp3'; 
import SoundAttacked2 from '../../assets/sounds/monsters/necromancer/attacked2.mp3'; 
import SoundAttacked3 from '../../assets/sounds/monsters/necromancer/attacked3.mp3'; 
import SoundAttacked4 from '../../assets/sounds/monsters/necromancer/attacked4.mp3'; 
import SoundAttacked5 from '../../assets/sounds/monsters/necromancer/attacked5.mp3'; 


/** Некромант - тип монстров */
export class Necromancer extends Monster{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly image: HTMLImageElement = new Image(); //окраска монстра
	private static readonly imageFrames = 6;

	private static readonly attackImage: HTMLImageElement = new Image();  //атака монстра
	private static readonly attackImageFrames = 6;


	static readonly chargeImage: HTMLImageElement = new Image();

	private static readonly maxDistanceDamage = 450; //(px) Макс Дистанция до ближайшего строения - цели, при котором активируется атака
	private static readonly minDistanceDamage = 300; //(px) Мин Дистанция до ближайшего строения - цели, при котором активируется атака
	private _attackXStart: number; //координата x на которой будет активирована атака

	static readonly chargeSpeed: number = 200; //скорость полёта заряда атаки (в пикселях за секунду)
	private _charges: MovingObject[]; //атакующие заряды энергии 

	private static readonly averageCountSimpleAttacksToActivateSpecialAbility = 14; //Среднее кол-во обычных атак для активации спец способности
	countSimpleAttacksToActivateSpecialAbility: number; //Кол-во обычных атак для активации спец способности  (используется для тестирования)
	
	/* Спец Способность 1 - "Кислотный дождь", отменяется при нанесении урона монстру */
	private static readonly specialAbilityAcidRainCallImage: HTMLImageElement = new Image();  //вызов спец способности "Кислотный дождь"
	private static readonly specialAbilityAcidRainCreatingImage: HTMLImageElement = new Image();  //создание облаков "Кислотный дождь" над целью
	private static readonly startCreatingAcidRainAfterStartCallMs = 700; //через сколько миллисекунд начнётся создание облака над целью?
	private static readonly endCreatingAcidRainAfterStartCallMs = 1800; //через сколько миллисекунд закончится создание облака над целью и будет добавлен модификатор "Кислотный дождь" объекту?
	private static readonly acidRainCallDurationMs = 2500; //длительность анимации вызова кислотного дождя (миллисекунды)
	private static readonly acidRainDurationMs = 15000; //длительность анимации кислотного дождя (миллисекунды)
	private readonly specialAbilityAcidRainCallAnimation: Animation; //анимация вызова спец способности "Кислотный дождь"
	private readonly specialAbilityAcidRainCreatingAnimation: Animation; //анимация создания облаков "Кислотный дождь" над целью
	private _isSpecialAbilityAcidRainCallStarted: boolean; //начался вызов спес способности "Кислотный дождь"
	private _isSpecialAbilityAcidRainCreatingStarted: boolean; //началось формирование облаков "Кислотный дождь" над целью 
	private _isSpecialAbilityAcidRainCreatingEnded: boolean; //закончилось формирование облаков "Кислотный дождь" над целью и цели присвоен модификатор "Килостный дождь"
	static readonly acidBlobDamage = 0.1; //урон от кислотных капель
	countSimpleAttacks:number;

	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		Necromancer.init(true); //reserve init

		super(x, y,
			scaleSize,
			isLeftSide,
			true,  //isLand
			Necromancer.name,
			Necromancer.image,
			Necromancer.imageFrames,
			700,   //speed animation
			Necromancer.attackImage,
			Necromancer.attackImageFrames,
			1000,  //speed animation attack
			5,     //reduce hover
			3,     //health
			3,     //damage
			990,   //time attack wait
			55,    //speed
			Necromancer.imageHandler,
			7000); //avrTimeSoundWaitMs

		this._attackXStart = 0;
		this._charges = [];
		this.specialAbilityAcidRainCallAnimation = new Animation(25, Necromancer.acidRainCallDurationMs, Necromancer.specialAbilityAcidRainCallImage);
		this.specialAbilityAcidRainCreatingAnimation = new Animation(12, 12 * 100, Necromancer.specialAbilityAcidRainCreatingImage);
		this._isSpecialAbilityAcidRainCallStarted  = false;
		this._isSpecialAbilityAcidRainCreatingStarted = false;
		this._isSpecialAbilityAcidRainCreatingEnded = false;
		this.countSimpleAttacksToActivateSpecialAbility = Necromancer.getCountSimpleAttacksToActivateSpecialAbility();
		this.countSimpleAttacks = 0;

	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			Necromancer.imageHandler.new(Necromancer.image).src = Necromancer1Image;
			Necromancer.imageHandler.new(Necromancer.attackImage).src = NecromancerAttack1Image;
			Necromancer.imageHandler.new(Necromancer.chargeImage).src = ChargeImage;
			Necromancer.imageHandler.new(Necromancer.specialAbilityAcidRainCallImage).src = SpecialAbilityAcidRainCallImage;
			Necromancer.imageHandler.new(Necromancer.specialAbilityAcidRainCreatingImage).src = SpecialAbilityAcidRainCreatingImage;
			AudioSystem.load(Attack1Sound);
			AudioSystem.load(Attack2Sound);
		}
	}

	static getCountSimpleAttacksToActivateSpecialAbility(): number{
		return Helper.getRandom(Necromancer.averageCountSimpleAttacksToActivateSpecialAbility / 2, Necromancer.averageCountSimpleAttacksToActivateSpecialAbility * 2);
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], bottomBorder: number) {
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		//движение атакующих зарядов энергии
		for(let i = 0; i < this._charges.length; i++)
		{
			let charge = this._charges[i];
			charge.rotate += 1000 * Math.random() / drawsDiffMs;
			charge.leftTimeMs -= drawsDiffMs;
			charge.location.x -= charge.dx * (drawsDiffMs / 1000);
			charge.location.y -= charge.dy * (drawsDiffMs / 1000);

			//delete - выход за границу экрана или по истечению времени жизни
			if(charge.location.x + charge.size.width < 0 || charge.location.x > Draw.canvas.width || 
				charge.location.y + charge.size.height < 0 || charge.location.y > Draw.canvas.height ||
				charge.leftTimeMs < 0)
			{
				this._charges.splice(i, 1);
				i--;
			}
			else {
				let buildingGoal = buildings.find(building => 
					charge.centerX > building.x + building.reduceHover && charge.centerX < building.x + building.width - building.reduceHover && 
					charge.centerY > building.y + building.reduceHover && charge.centerY < building.y + building.height - building.reduceHover);

				//попадание в цель
				if(buildingGoal){ 
					buildingGoal.applyDamage(this.damage, charge.centerX, charge.centerY);
					this._charges.splice(i, 1);
					i--;
				}
			}
		}

		//активация атаки
		if(this._buildingGoal && this._buildingGoal.health > 0 && this._attackXStart)
		{
			if ( this.isLeftSide && this.centerX >= this._attackXStart || 
				!this.isLeftSide && this.centerX <= this._attackXStart)
			{
				this.attackLogic(drawsDiffMs);
				this.animation?.restart();
				super.logicBase(drawsDiffMs, buildings, monsters, bottomBorder);
				return; //игнорируем базовую логику движения и атаки
			}
		}

		var oldBuildingGoalX = this._buildingGoal?.centerX;
		super.logic(drawsDiffMs, buildings, monsters, bottomBorder);
		var newBuildingGoalX = this._buildingGoal?.centerX;

		if(newBuildingGoalX && oldBuildingGoalX != newBuildingGoalX){
			this._attackXStart = newBuildingGoalX - (this.isLeftSide ? 1 : -1) * Helper.getRandom(Necromancer.minDistanceDamage, Necromancer.maxDistanceDamage);
			if(oldBuildingGoalX){
				this.countSimpleAttacks = 0;
				this._isSpecialAbilityAcidRainCallStarted = false;
				this._isSpecialAbilityAcidRainCreatingStarted = false;
				this._isSpecialAbilityAcidRainCreatingEnded = false;
				this._attackLeftTimeMs = 700;
				this.countSimpleAttacksToActivateSpecialAbility = Necromancer.getCountSimpleAttacksToActivateSpecialAbility();
			}
		}
	}

	attackLogic(drawsDiffMs: number): void {
		const isNotBaseBuildings = this._buildingGoal != null && this._buildingGoal.name != FlyEarth.name && this._buildingGoal.name != FlyEarthRope.name;
		const isNotHaveAcidModifier = this._buildingGoal != null && !this._buildingGoal.modifiers.find(x => x.name == AcidRainModifier.name);

		if(this.countSimpleAttacks >= this.countSimpleAttacksToActivateSpecialAbility && isNotBaseBuildings && isNotHaveAcidModifier || this._isSpecialAbilityAcidRainCreatingStarted){ //Кислотный дождь

			if(!this._isSpecialAbilityAcidRainCallStarted){
				this._isSpecialAbilityAcidRainCallStarted = true;
				this.specialAbilityAcidRainCallAnimation.restart();
				this._attackLeftTimeMs = this.specialAbilityAcidRainCallAnimation.leftTimeMs;
				this._isAttack = true; 
				AcidRainModifier.loadResources();
			}

			if(!this._isSpecialAbilityAcidRainCreatingStarted && this._attackLeftTimeMs <= Necromancer.acidRainCallDurationMs - Necromancer.startCreatingAcidRainAfterStartCallMs){
				this._isSpecialAbilityAcidRainCreatingStarted = true;
				this.specialAbilityAcidRainCreatingAnimation.restart();
			}


			if(!this._isSpecialAbilityAcidRainCreatingEnded && isNotBaseBuildings && isNotHaveAcidModifier && this._attackLeftTimeMs <= Necromancer.acidRainCallDurationMs - Necromancer.endCreatingAcidRainAfterStartCallMs){
				this._isSpecialAbilityAcidRainCreatingEnded = true;
				this._buildingGoal?.addModifier(new AcidRainModifier(Necromancer.acidRainDurationMs, Necromancer.acidBlobDamage));
			}
	
			if(this._attackLeftTimeMs <= 0 || !isNotBaseBuildings){
				this._isSpecialAbilityAcidRainCallStarted = false;
				this._isSpecialAbilityAcidRainCreatingStarted = false;
				this._isSpecialAbilityAcidRainCreatingEnded = false;
				this._isAttack = false; 
				this._attackLeftTimeMs = 700;
				this.countSimpleAttacks = 0;
				this.countSimpleAttacksToActivateSpecialAbility = Necromancer.getCountSimpleAttacksToActivateSpecialAbility();
			}
		}
		else{ //энергетический шар

			//start attack infinite animation
			if(!this._isAttack){ 
				this._attackLeftTimeMs = 450;
				this.attackAnimation.restart();
				this._isAttack = true; 
			}
	
			//attack
			if(this._attackLeftTimeMs <= 0){ 
				let damageMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.damageMultiplier);
				let damage = this.damage + this.damage * damageMultiplier;
				this.attackSimple(damage);
				this.countSimpleAttacks++;
			}
		}
	
		if(this._attackLeftTimeMs > 0)
			this._attackLeftTimeMs -= drawsDiffMs;
	}

	attackSimple(damage: number): void { //энергетический шар
		if(damage > 0 && this._buildingGoal != null){
			let x1 = this.isLeftSide 
				? this.x + this.width 
				: this.x;
			let y1 = this.centerY - 15;
			let x2 = this._buildingGoal.centerX - Necromancer.chargeImage.width / 2;
			let y2 = this._buildingGoal.centerY - Necromancer.chargeImage.height / 2;

			let rotate = 0;
			let distance = Helper.getDistance(x1, y1, x2, y2);
			let dx = (x1 - x2) / (distance / Necromancer.chargeSpeed);
			let dy = (y1 - y2) / (distance / Necromancer.chargeSpeed);

			this._charges.push(new MovingObject(x1, y1, Necromancer.chargeImage.width, Necromancer.chargeImage.height, 1000 * 20, dx, dy, rotate));
			AudioSystem.play(this.centerX, Attack1Sound, 0.00001, 1, true);
			AudioSystem.play(this.centerX, Attack2Sound, 0.00001, 1, true);

			this._attackLeftTimeMs = this.attackTimeWaitingMs;
		}
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null, attackingObject: AttackedObject|null = null): number{
		var damage = super.applyDamage(damage, x, y, attackingObject);
		if(damage > 0){
			//this._attackLeftTimeMs = 350;
			AudioSystem.playRandomV(this.centerX, 
				[SoundAttacked1, SoundAttacked2, SoundAttacked3, SoundAttacked4, SoundAttacked5], 
				0.1, false, 1, true);
	
			//отмена спец способности
			if(this._isSpecialAbilityAcidRainCallStarted){
				this._isSpecialAbilityAcidRainCallStarted = false;
				this._isSpecialAbilityAcidRainCreatingStarted = false;
				this._isSpecialAbilityAcidRainCreatingEnded = false;
				this._attackLeftTimeMs = this.attackTimeWaitingMs;
				this.animation?.restart();
				this.attackAnimation.restart();
				this._attackLeftTimeMs = 0;
			}
		}
		return damage;
	}

	draw(drawsDiffMs: number, isGameOver: boolean): void {
		//атакующие заряды энергии
		for(let i = 0; i < this._charges.length; i++)
		{
			let charge = this._charges[i];

			Draw.ctx.setTransform(1, 0, 0, 1, charge.location.x + charge.size.width / 2, charge.location.y + charge.size.height / 2); 
			Draw.ctx.rotate(charge.rotate * Math.PI / 180);
			Draw.ctx.drawImage(Necromancer.chargeImage, -charge.size.width / 2, -charge.size.height / 2, charge.size.width, charge.size.height);
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);
		}

		super.draw(drawsDiffMs, isGameOver);
	}

	drawObject(drawsDiffMs: number, isGameOver: boolean, invertSign: number){
		
		if(this._isSpecialAbilityAcidRainCallStarted){
			const newWidth = this.specialAbilityAcidRainCallAnimation.image.width / this.specialAbilityAcidRainCallAnimation.frames;
			const newHeight = this.specialAbilityAcidRainCallAnimation.image.height;
			this.specialAbilityAcidRainCallAnimation.draw(drawsDiffMs, isGameOver, invertSign * this.x - invertSign * 27, this.y - 17, invertSign * newWidth, newHeight);

			if(this._isSpecialAbilityAcidRainCreatingStarted && this._buildingGoal && this.specialAbilityAcidRainCreatingAnimation.leftTimeMs > 0){
				const width = this.specialAbilityAcidRainCreatingAnimation.image.width / this.specialAbilityAcidRainCreatingAnimation.frames / 2;
				const height = this.specialAbilityAcidRainCreatingAnimation.image.height / 2;
				const x = this._buildingGoal.centerX - width / 2;
				const y = this._buildingGoal.y - height * 2;
				this.specialAbilityAcidRainCreatingAnimation.draw(drawsDiffMs, isGameOver, invertSign * x, y, invertSign * width, height);
			}
		}
		else{
			super.drawObject(drawsDiffMs, isGameOver, invertSign);
		}
	}

	drawHealth(){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.drawHealthBase(this.x + (this.isLeftSide ? -2 : 23), this.y + 2, this.width - 20);
	}
}