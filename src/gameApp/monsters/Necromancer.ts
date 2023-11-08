import * as Tone from 'tone';

import {ImageHandler} from '../ImageHandler';

import {AttackedObject} from '../../models/AttackedObject';
import {MovingObject} from '../../models/MovingObject';
import {WaveData} from '../../models/WaveData';

import Animation from '../../models/Animation';
import AnimationInfinite from '../../models/AnimationInfinite';
import AnimationRandom from '../../models/AnimationRandom';

import {Modifier} from '../modifiers/Modifier';
import {AcidRainModifier} from '../modifiers/AcidRainModifier';
import {FireModifier} from '../modifiers/FireModifier';

import {AudioSystem} from '../gameSystems/AudioSystem';
import {Draw} from '../gameSystems/Draw';

import {Building} from '../buildings/Building';
import {FlyEarth} from '../buildings/FlyEarth';
import {FlyEarthRope} from '../buildings/FlyEarthRope';

import {Unit} from '../units/Unit';

import {Monster} from './Monster';
import {Skelet} from './Skelet';

import {Helper} from '../helpers/Helper';

import Necromancer1Image from '../../assets/img/monsters/necromancer/necromancer.png'; 
import ChargeImage from '../../assets/img/monsters/necromancer/charge.png'; 

import AttackImage from '../../assets/img/monsters/necromancer/necromancerAttack.png'; 

import SpecialAbilityAcidRainCallImage from '../../assets/img/monsters/necromancer/cloudCall.png'; 
import SpecialAbilityAcidRainCreatingImage from '../../assets/img/monsters/necromancer/cloudCreating.png'; 

import SpecialAbilityCallSkeletesImage from '../../assets/img/monsters/necromancer/skeletesCall.png'; 


import DebufImage from '../../assets/img/monsters/necromancer/debuf.png'; 

import DefenseCreatingImage from '../../assets/img/monsters/necromancer/defenseCreating.png'; 
import DefenseInfinityImage from '../../assets/img/monsters/necromancer/defenseInfinity.png'; 

import AttackStartingSound from '../../assets/sounds/monsters/necromancer/attackStarting.mp3'; 
import Attack1Sound from '../../assets/sounds/monsters/necromancer/attack1.mp3'; 
import Attack2Sound from '../../assets/sounds/monsters/necromancer/attack2.mp3'; 


import SoundAttacked1 from '../../assets/sounds/monsters/necromancer/attacked1.mp3'; 
import SoundAttacked2 from '../../assets/sounds/monsters/necromancer/attacked2.mp3'; 
import SoundAttacked3 from '../../assets/sounds/monsters/necromancer/attacked3.mp3'; 
import SoundAttacked4 from '../../assets/sounds/monsters/necromancer/attacked4.mp3'; 
import SoundAttacked5 from '../../assets/sounds/monsters/necromancer/attacked5.mp3'; 

import SoundCloudCall from '../../assets/sounds/monsters/necromancer/cloudCall.mp3'; 
import SoundCloudCreated from '../../assets/sounds/monsters/necromancer/cloudCreated.mp3'; 

import ShieldSound from '../../assets/sounds/monsters/necromancer/shield.mp3'; 

import SkeletesCall1Sound from '../../assets/sounds/monsters/necromancer/skeletesCall1.mp3'; 
import SkeletesCall2Sound from '../../assets/sounds/monsters/necromancer/skeletesCall2.mp3'; 



/** Некромант - тип монстров */
export class Necromancer extends Monster{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly image: HTMLImageElement = new Image(); //внешний вид 
	private static readonly imageFrames = 6;

	private static readonly attackImage: HTMLImageElement = new Image();  //атака 
	private static readonly attackImageFrames = 7;

	static readonly chargeImage: HTMLImageElement = new Image();

	private static readonly maxDistanceDamage = 550; //(px) Макс Дистанция до ближайшего строения - цели, при котором активируется атака
	private static readonly minDistanceDamage = 300; //(px) Мин Дистанция до ближайшего строения - цели, при котором активируется атака
	private _attackXStart: number; //координата x на которой будет активирована атака
	private _isAattackStartingSoundStarted: boolean; //уже начато звуковое воспроизведение начала атаки?

	static readonly chargeSpeed: number = 200; //скорость полёта заряда атаки (в пикселях за секунду)
	private _charges: MovingObject[]; //атакующие заряды энергии 

	private static readonly averageCountSimpleAttacksToActivateSpecialAbility = 9; //Среднее кол-во обычных атак для активации спец способности
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
	private _isSpecialAbilityAcidRainCreatedSoundPlayed: boolean; //была ли уже запущена озвучка появления облака?
	private _acidRainCallSound: Tone.Player|null; //звук вызова облаков
	static readonly acidBlobDamage = 0.1; //урон от кислотных капель
	isForceSpecialAbilityAcidRain: boolean; //использовать только спец способность "Кислотный дождь" (для тестов)

	countSimpleAttacks: number;

	/* Спец Способность 2 - "Вызов скелетов", отменяется при нанесении урона монстру */
	private static readonly specialAbilityCallSkeletesImage: HTMLImageElement = new Image();  //спец способность "Вызов скелетов"
	private static readonly skeletesCallDurationMs = 3000; //длительность анимации вызова скелетов (миллисекунды)
	private static readonly skeletesCount = 3; //Количество создаваемых скелетов
	private static readonly skeletesSizeDifferentScalePercentage = 50; //(в процентах) разница в размерах создаваемых скелетов
	private static readonly appersSkeletesAfterStartCallMs = 2000; //через сколько миллисекунд начнут появляться скелеты после начала их вызова?
	private readonly specialAbilityCallSkeletesAnimation: Animation; //анимация спец способности "Вызов скелетов"
	private _isSpecialAbilitySkeletesCallStarted: boolean; //началась спес способность "Вызов скелетов"
	private _isSpecialAbilitySkeletesCreatingStarted: boolean; //началось создание скелетов
	isForceSpecialAbilitySkeletons: boolean; //использовать только спец способность "Вызов скелетонов" (для тестов)
	

	/* Способность - дебафф - снятие побочных заклинаний */
	private static readonly debufImage: HTMLImageElement = new Image();  //снятие побочных заклинаний
	private static readonly debufImageFrames = 10;
	private readonly debufAnimation: Animation; //анимация снятие побочных заклинаний
	private _isDebufStarted: boolean; //началась анимация дебафа


	/* Способность - щит - поглощает почти весь урон */
	private static readonly defensePercentage: number = 95; //сколько в процентах съедается урона щитом
	private static readonly defenseModifierName: string = 'Defense'; //имя модифатора защиты
	private static readonly defenseMinDurationMs: number = 3000; //минимальное время действия щита - если никто больше не атакует

	private static readonly defenseCreatingImage: HTMLImageElement = new Image();  //создание щита
	private static readonly defenseCreatingFrames = 9;
	private readonly defenseCreatingAnimation: Animation; //анимация создания щита
	private _isDefenseCreatingStarted: boolean; //началась анимация создания щита

	private static readonly defenseInfinityImage: HTMLImageElement = new Image();  //удержание щита
	private static readonly defenseInfinityFrames = 7;
	private readonly defenseInfinityAnimation: AnimationRandom; //анимация удержания щита
	private _isDefenseInfinityStarted: boolean; //началась анимация удержания щита

	private _isDefenseEnding: boolean; //заканчивается анимация удержания щита

	private _shieldSound: Tone.Player|null; //звук щита



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
		this.specialAbilityCallSkeletesAnimation = new Animation(30, Necromancer.skeletesCallDurationMs, Necromancer.specialAbilityCallSkeletesImage);
		this.debufAnimation = new Animation(Necromancer.debufImageFrames, 1000, Necromancer.debufImage);
		this.defenseCreatingAnimation = new Animation(Necromancer.defenseCreatingFrames, 400, Necromancer.defenseCreatingImage);
		this.defenseInfinityAnimation = new AnimationRandom(Necromancer.defenseInfinityFrames, 700, Necromancer.defenseInfinityImage);
		this._isAattackStartingSoundStarted = false;
		this._isSpecialAbilityAcidRainCallStarted  = false;
		this._isSpecialAbilityAcidRainCreatingStarted = false;
		this._isSpecialAbilityAcidRainCreatingEnded = false;
		this._isSpecialAbilityAcidRainCreatedSoundPlayed = false;
		this._isDefenseInfinityStarted = false;
		this._isDefenseCreatingStarted = false;
		this._isDefenseEnding = false;
		this.countSimpleAttacksToActivateSpecialAbility = Necromancer.getCountSimpleAttacksToActivateSpecialAbility();
		this.countSimpleAttacks = 0;
		this._isDebufStarted = false;
		this._acidRainCallSound = null;
		this._shieldSound = null;
		this.isForceSpecialAbilityAcidRain = false;
		this.isForceSpecialAbilitySkeletons = false;
		this._isSpecialAbilitySkeletesCallStarted = false;
		this._isSpecialAbilitySkeletesCreatingStarted = false;

	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && Necromancer.imageHandler.isEmpty){
			Necromancer.imageHandler.new(Necromancer.image).src = Necromancer1Image;
			Necromancer.imageHandler.new(Necromancer.attackImage).src = AttackImage;
			Necromancer.imageHandler.new(Necromancer.chargeImage).src = ChargeImage;
			Necromancer.imageHandler.new(Necromancer.debufImage).src = DebufImage;
			Necromancer.imageHandler.new(Necromancer.defenseCreatingImage).src = DefenseCreatingImage;
			Necromancer.imageHandler.new(Necromancer.defenseInfinityImage).src = DefenseInfinityImage;
			Necromancer.imageHandler.new(Necromancer.specialAbilityAcidRainCallImage).src = SpecialAbilityAcidRainCallImage;
			Necromancer.imageHandler.new(Necromancer.specialAbilityAcidRainCreatingImage).src = SpecialAbilityAcidRainCreatingImage;
			Necromancer.imageHandler.new(Necromancer.specialAbilityCallSkeletesImage).src = SpecialAbilityCallSkeletesImage;
			AudioSystem.load(Attack1Sound);
			AudioSystem.load(Attack2Sound);
			AudioSystem.load(AttackStartingSound);
			AudioSystem.load(SoundCloudCall);
			AudioSystem.load(SoundCloudCreated);
			AudioSystem.load(ShieldSound);
			AudioSystem.load(SkeletesCall1Sound);
			AudioSystem.load(SkeletesCall2Sound);
		}
	}

	get shiftXForCenter(){
		return this.isLeftSide ? -16 * this.scaleSize : 18 * this.scaleSize;
	}
	get shiftYForCenter(){
		return 20 * this.scaleSize;
	}

	static getCountSimpleAttacksToActivateSpecialAbility(): number{
		return Helper.getRandom(Necromancer.averageCountSimpleAttacksToActivateSpecialAbility / 3, Necromancer.averageCountSimpleAttacksToActivateSpecialAbility * 2);
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomBorder: number, waveLevel: WaveData[]) {
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

		//дебаф
		const isBadModifierExists = this.modifiers.some(x => x.name == FireModifier.name);
		if(isBadModifierExists || this._isDebufStarted){
			if(!this._isDebufStarted){ //start
				this.debufAnimation.restart();
				this._isDebufStarted = true;
				this._isDefenseCreatingStarted = false;
				this._isDefenseInfinityStarted = false;
				this._isDefenseEnding = false;
				this.modifiers = this.modifiers.filter(x => x.name != Necromancer.defenseModifierName);

				//если был щит - убираем звук
				if(this._shieldSound){
					this._shieldSound.autostart = false;
					this._shieldSound.stop();
					this._shieldSound = null;
				}
			}
			else if(this.debufAnimation.leftTimeMs <= 0){ //end
				this._isDebufStarted = false;
				this._isDefenseEnding = false;
			}
			else if(this.debufAnimation.leftTimeMs <= this.debufAnimation.durationMs / 2){ //clear from modifiers
				this.modifiers = this.modifiers.filter(x => x.name != FireModifier.name);
			}

			super.logicBase(drawsDiffMs);
			return; //игнорируем базовую логику движения и атаки
		}

		//создание щита
		if(this._isDefenseCreatingStarted){
			let defenseModifier = this.modifiers.find(x => x.name == Necromancer.defenseModifierName);
			if(this.defenseCreatingAnimation.leftTimeMs <= 0) {
				this._isDefenseInfinityStarted = true;
				this._isDefenseCreatingStarted = false;
				if(!defenseModifier){
					this.addModifier(new Modifier(Necromancer.defenseModifierName, 0, -Necromancer.defensePercentage / 100, 0, 0, 0, Necromancer.defenseMinDurationMs));
				}
				AudioSystem.play(this.centerX, ShieldSound, -7, 1, true, true, 0, 0, false, true).then(sourse => this._shieldSound = sourse);
			}
			else if(this.defenseCreatingAnimation.leftTimeMs <= 200 && !defenseModifier){
				this.addModifier(new Modifier(Necromancer.defenseModifierName, 0, -Necromancer.defensePercentage / 100, 0, 0, 0, Necromancer.defenseMinDurationMs));
			}

			super.logicBase(drawsDiffMs);
			return; //игнорируем базовую логику движения и атаки
		}

		//удержание щита
		if(this._isDefenseInfinityStarted){
			let defenseModifier = this.modifiers.find(x => x.name == Necromancer.defenseModifierName);
			if(!defenseModifier){
				this._isDefenseInfinityStarted = false;
				this._isDefenseEnding = true;
				this.defenseCreatingAnimation.restart();
			}
			else{
				super.logicBase(drawsDiffMs);
				return; //игнорируем базовую логику движения и атаки
			}
		}

		//звук щита не должен оставаться при любых случаев если он не активен
		if(this._shieldSound){
			this._shieldSound.autostart = false;
			this._shieldSound.stop();
			this._shieldSound = null;
		}

		//убираем щит
		if(this._isDefenseEnding){
			if(this.defenseCreatingAnimation.leftTimeMs <= 0){
				this._isDefenseEnding = false;
			}

			super.logicBase(drawsDiffMs);
			return; //игнорируем базовую логику движения и атаки
		}

		//активация атаки
		if(this._goal && this._goal.health > 0 && this._attackXStart)
		{
			if ( this.isLeftSide && this.centerX >= this._attackXStart || 
				!this.isLeftSide && this.centerX <= this._attackXStart)
			{
				this.attackLogic(drawsDiffMs, monsters, bottomBorder, waveLevel);
				this.animation?.restart();
				super.logicBase(drawsDiffMs);
				return; //игнорируем базовую логику движения и атаки
			}
		}

		var oldBuildingGoalX = this._goal?.centerX;
		super.logic(drawsDiffMs, buildings, monsters, units, bottomBorder, waveLevel);
		var newBuildingGoalX = this._goal?.centerX;

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

	attackLogic(drawsDiffMs: number, monsters: Monster[], bottomBorder: number, waveLevel: WaveData[]): void {
		const isNotBaseBuildings = this._goal != null && this._goal.name != FlyEarth.name && this._goal.name != FlyEarthRope.name;
		const isNotHaveAcidModifier = this._goal != null && !this._goal.modifiers.find(x => x.name == AcidRainModifier.name);
		const isCallSpecialAbility = this.countSimpleAttacks >= this.countSimpleAttacksToActivateSpecialAbility;

		
		if (this._isSpecialAbilityAcidRainCallStarted){ //процесс вызова кислотного дождя
			if(!this._isSpecialAbilityAcidRainCreatingStarted && this._attackLeftTimeMs <= Necromancer.acidRainCallDurationMs - Necromancer.startCreatingAcidRainAfterStartCallMs){
				this._isSpecialAbilityAcidRainCreatingStarted = true;
				this.specialAbilityAcidRainCreatingAnimation.restart();
			}

			if(!this._isSpecialAbilityAcidRainCreatedSoundPlayed && isNotBaseBuildings && isNotHaveAcidModifier && this._attackLeftTimeMs <= Necromancer.acidRainCallDurationMs - Necromancer.endCreatingAcidRainAfterStartCallMs + 100){
				if(this._goal){
					AudioSystem.play(this._goal.centerX, SoundCloudCreated, -10, 1, false, true);
				}
				this._isSpecialAbilityAcidRainCreatedSoundPlayed = true;
			}


			if(!this._isSpecialAbilityAcidRainCreatingEnded && isNotBaseBuildings && isNotHaveAcidModifier && this._attackLeftTimeMs <= Necromancer.acidRainCallDurationMs - Necromancer.endCreatingAcidRainAfterStartCallMs){
				this._isSpecialAbilityAcidRainCreatingEnded = true;
				if(this._goal){
					this._goal.addModifier(new AcidRainModifier(Necromancer.acidRainDurationMs, Necromancer.acidBlobDamage));
				}
			}
	
			//end
			if(this._attackLeftTimeMs <= 0 || !isNotBaseBuildings){
				this._isSpecialAbilityAcidRainCallStarted = false;
				this._isSpecialAbilityAcidRainCreatingStarted = false;
				this._isSpecialAbilityAcidRainCreatingEnded = false;
				this._isSpecialAbilityAcidRainCreatedSoundPlayed = false;
				this._isAttack = false; 
				this._attackLeftTimeMs = 700;
				this.countSimpleAttacks = 0;
				this.countSimpleAttacksToActivateSpecialAbility = Necromancer.getCountSimpleAttacksToActivateSpecialAbility();
			}
		}
		else if (this._isSpecialAbilitySkeletesCallStarted) { //процесс вызова скелетонов
			//creating skeletes
			if (!this._isSpecialAbilitySkeletesCreatingStarted && this._attackLeftTimeMs < Necromancer.skeletesCallDurationMs - Necromancer.appersSkeletesAfterStartCallMs) {
				this._isSpecialAbilitySkeletesCreatingStarted = true;

				let listSkins: number[] = [];
				for(let i = 0; i < Skelet.countSkins; i++){
					listSkins.push(i);
				}

				for(let i = 0; i < Necromancer.skeletesCount; i++){
					let scaleSkeletSize = 1 - Necromancer.skeletesSizeDifferentScalePercentage / 100 * Math.random();
					let randomSkin = Helper.getRandom(0, listSkins.length - 1);
					let newSkelet = new Skelet(this.x, this.y, this.isLeftSide, scaleSkeletSize, listSkins[randomSkin]);
					listSkins.splice(randomSkin, 1);

					newSkelet.isDisplayCreatingFromUndegroundAnimation = true;
					newSkelet.y = bottomBorder - newSkelet.height;
					if(this._goal) {
						let from = this.isLeftSide 
							? this.x + this.width + 10 
							: this._goal.x + this._goal.width + 10;
						let to = this.isLeftSide 
							? this._goal.x - newSkelet.width - 10
							: this.x - newSkelet.width - 10;
						let length = to - from;
						
						let allowedLength = length / Necromancer.skeletesCount;
						
						let shiftFrom = i > 0 
							? newSkelet.width / 2 
							: 0;
						let shiftTo = i > 0 && i < Necromancer.skeletesCount - 1 
							? newSkelet.width 
							: newSkelet.width / 2;

						from = from + i * allowedLength + shiftFrom;
						to = from + allowedLength - shiftTo;
						newSkelet.x = Helper.getRandom(from, to);
					}

					monsters.push(newSkelet);
					
					let newMonsterOfLevel = waveLevel.find(x => x.monsterName == newSkelet.name);
					if(!newMonsterOfLevel){
						newMonsterOfLevel = new WaveData(newSkelet.name, 0, 0, 0);
						waveLevel.push(newMonsterOfLevel);
					}

					newMonsterOfLevel.count++;
					newMonsterOfLevel.wasCreatedCount++;
				}
			}

			//end
			if (this._attackLeftTimeMs <= 0) {
				this._isSpecialAbilitySkeletesCallStarted = false;
				this._isSpecialAbilitySkeletesCreatingStarted = false;
				this._isAttack = false; 
				this._attackLeftTimeMs = 700;
				this.countSimpleAttacks = 0;
				this.countSimpleAttacksToActivateSpecialAbility = Necromancer.getCountSimpleAttacksToActivateSpecialAbility();
			}
		}
		else if (isCallSpecialAbility){ //start special ability

			const isCallAcidRain = (Math.random() > 0.5 && isNotBaseBuildings && isNotHaveAcidModifier || this.isForceSpecialAbilityAcidRain) && !this.isForceSpecialAbilitySkeletons;
			if (isCallAcidRain){
				this._isSpecialAbilityAcidRainCallStarted = true;
				this.specialAbilityAcidRainCallAnimation.restart();
				this._attackLeftTimeMs = this.specialAbilityAcidRainCallAnimation.leftTimeMs;
				this._isAttack = true; 
				AcidRainModifier.loadResources();
				AudioSystem.play(this.centerX, SoundCloudCall, 0, 1.3, false, true).then(sourse => this._acidRainCallSound = sourse);
			}
			else {
				Skelet.init(true);
				this._isSpecialAbilitySkeletesCallStarted = true;
				this.specialAbilityCallSkeletesAnimation.restart();
				this._attackLeftTimeMs = this.specialAbilityCallSkeletesAnimation.leftTimeMs;
				this._isAttack = true; 
				AudioSystem.play(this.centerX, SkeletesCall1Sound, -3, 1, true, true, 0.4, 0, false, false);
				AudioSystem.play(this.centerX, SkeletesCall2Sound, -3, 1, true, true, 0.5, 0, false, false);
			}
		}
		else { //энергетический шар

			//start attack infinite animation
			if (!this._isAttack){ 
				this._attackLeftTimeMs = 450;
				this.attackAnimation.restart();
				this._isAttack = true; 
			}
	
			//attack
			if (this._attackLeftTimeMs <= 0){ 
				let damageMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.damageOutMultiplier);
				let damage = this.damage + this.damage * damageMultiplier;
				this.attackSimple(damage);
				this.countSimpleAttacks++;
				this._isAattackStartingSoundStarted = false;
			}
			else if (this._attackLeftTimeMs < 700 && !this._isAattackStartingSoundStarted){
				AudioSystem.play(this.centerX, AttackStartingSound, -16, 1, true, true);
				this._isAattackStartingSoundStarted = true;
			}
		}
	
		if(this._attackLeftTimeMs > 0)
			this._attackLeftTimeMs -= drawsDiffMs;
	}

	attackSimple(damage: number): void { //энергетический шар
		if(damage > 0 && this._goal != null){
			let x1 = this.isLeftSide 
				? this.x + this.width 
				: this.x;
			let y1 = this.centerY - 15;
			let x2 = this._goal.centerX - Necromancer.chargeImage.width / 2;
			let y2 = this._goal.centerY - Necromancer.chargeImage.height / 2;

			let rotate = 0;
			let distance = Helper.getDistance(x1, y1, x2, y2);
			let dx = (x1 - x2) / (distance / Necromancer.chargeSpeed);
			let dy = (y1 - y2) / (distance / Necromancer.chargeSpeed);

			this._charges.push(new MovingObject(x1, y1, Necromancer.chargeImage.width, Necromancer.chargeImage.height, 1000 * 20, dx, dy, rotate));
			AudioSystem.play(this.centerX, Attack1Sound, -16, 1, true);
			AudioSystem.play(this.centerX, Attack2Sound, -16, 1, true);

			this._attackLeftTimeMs = this.attackTimeWaitingMs;
		}
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null, attackingObject: AttackedObject|null = null): number{
		var damage = super.applyDamage(damage, x, y, attackingObject);
		if(damage > 0){
			//this._attackLeftTimeMs = 350;
			AudioSystem.playRandomV(this.centerX, 
				[SoundAttacked1, SoundAttacked2, SoundAttacked3, SoundAttacked4, SoundAttacked5], 
				-18, false, 1, true);
	
			//отмена спец способности
			if(this._isSpecialAbilityAcidRainCallStarted || this._isSpecialAbilitySkeletesCallStarted){
				this._isSpecialAbilityAcidRainCallStarted = false;
				this._isSpecialAbilityAcidRainCreatingStarted = false;
				this._isSpecialAbilityAcidRainCreatingEnded = false;
				this._isSpecialAbilityAcidRainCreatedSoundPlayed = false;
				this._isSpecialAbilitySkeletesCallStarted = false;
				this._isSpecialAbilitySkeletesCreatingStarted = false;
				this._attackLeftTimeMs = this.attackTimeWaitingMs;
				this.animation?.restart();
				this.attackAnimation.restart();
				this._attackLeftTimeMs = 0;
				this._acidRainCallSound?.stop();
				this._acidRainCallSound = null;
				this.isForceSpecialAbilityAcidRain = false;
				this.isForceSpecialAbilitySkeletons = false;
				this.countSimpleAttacksToActivateSpecialAbility = Necromancer.getCountSimpleAttacksToActivateSpecialAbility();
			}

			//активация щита
			if(!this._isDefenseCreatingStarted && !this._isDefenseInfinityStarted && !this._isDebufStarted){
				this._isDefenseCreatingStarted = true;
				this._isDefenseEnding = false;
				this.defenseCreatingAnimation.restart();
			}
		}

		//если щит активен и снова атакуют - продлеваем щит
		if(this._isDefenseInfinityStarted){
			let modifier = this.modifiers.find(x => x.name == Necromancer.defenseModifierName);
			if(modifier){
				modifier.lifeTimeMs = Necromancer.defenseMinDurationMs;
			}
		}
		return damage;
	}

	
	destroy(): void{
		this._acidRainCallSound?.stop();
		this._acidRainCallSound = null;
		if(this._shieldSound){
			this._shieldSound.autostart = false;
			this._shieldSound.stop();
			this._shieldSound = null;
		}
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

	drawObject(drawsDiffMs: number, imageOrAnimation: AnimationInfinite|Animation|HTMLImageElement, isGameOver: boolean, invertSign: number){
		
		if (this._isDebufStarted){
			const newWidth = this.debufAnimation.image.width / this.debufAnimation.frames * this.scaleSize;
			const newHeight = this.debufAnimation.image.height * this.scaleSize;
			this.debufAnimation.draw(drawsDiffMs, isGameOver, invertSign * this.x + (invertSign < 0 ? 27 * this.scaleSize : 0), this.y - 17 * this.scaleSize, invertSign * newWidth, newHeight);
		}
		else if (this._isDefenseInfinityStarted){
			const newWidth = this.defenseInfinityAnimation.image.width / this.defenseInfinityAnimation.frames * this.scaleSize;
			const newHeight = this.defenseInfinityAnimation.image.height * this.scaleSize;
			this.defenseInfinityAnimation.draw(drawsDiffMs, isGameOver, invertSign * this.x + (invertSign < 0 ? 27 * this.scaleSize : 0), this.y - 17 * this.scaleSize, invertSign * newWidth, newHeight);
		}
		else if (this._isDefenseCreatingStarted){
			const newWidth = this.defenseCreatingAnimation.image.width / this.defenseCreatingAnimation.frames * this.scaleSize;
			const newHeight = this.defenseCreatingAnimation.image.height * this.scaleSize;
			this.defenseCreatingAnimation.draw(drawsDiffMs, isGameOver, invertSign * this.x + (invertSign < 0 ? 27 * this.scaleSize : 0), this.y - 17 * this.scaleSize, invertSign * newWidth, newHeight);
		}
		else if (this._isDefenseEnding){
			const newWidth = this.defenseCreatingAnimation.image.width / this.defenseCreatingAnimation.frames * this.scaleSize;
			const newHeight = this.defenseCreatingAnimation.image.height * this.scaleSize;
			this.defenseCreatingAnimation.draw(drawsDiffMs, isGameOver, invertSign * this.x + (invertSign < 0 ? 27 * this.scaleSize : 0), this.y - 17 * this.scaleSize, invertSign * newWidth, newHeight, true);
		}
		else if (this._isSpecialAbilityAcidRainCallStarted){
			const newWidth = this.specialAbilityAcidRainCallAnimation.image.width / this.specialAbilityAcidRainCallAnimation.frames * this.scaleSize;
			const newHeight = this.specialAbilityAcidRainCallAnimation.image.height * this.scaleSize;
			this.specialAbilityAcidRainCallAnimation.draw(drawsDiffMs, isGameOver, invertSign * this.x + (invertSign < 0 ? 27 * this.scaleSize : 0), this.y - 17 * this.scaleSize, invertSign * newWidth, newHeight);

			if(this._isSpecialAbilityAcidRainCreatingStarted && this._goal && this.specialAbilityAcidRainCreatingAnimation.leftTimeMs > 0){
				const width = this.specialAbilityAcidRainCreatingAnimation.image.width / this.specialAbilityAcidRainCreatingAnimation.frames / 2;
				const height = this.specialAbilityAcidRainCreatingAnimation.image.height / 2;
				const x = this._goal.centerX - width / 2;
				const y = this._goal.y - height * 2;
				this.specialAbilityAcidRainCreatingAnimation.draw(drawsDiffMs, isGameOver, invertSign * x, y, invertSign * width, height);
			}
		}
		else if (this._isSpecialAbilitySkeletesCallStarted){
			const newWidth = this.specialAbilityCallSkeletesAnimation.image.width / this.specialAbilityCallSkeletesAnimation.frames * this.scaleSize;
			const newHeight = this.specialAbilityCallSkeletesAnimation.image.height * this.scaleSize;
			this.specialAbilityCallSkeletesAnimation.draw(drawsDiffMs, isGameOver, invertSign * this.x + (invertSign < 0 ? 27 * this.scaleSize : 0), this.y - 17 * this.scaleSize, invertSign * newWidth, newHeight);
		}
		else{
			super.drawObject(drawsDiffMs, imageOrAnimation, isGameOver, invertSign);
		}
	}

	drawHealth(){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.drawHealthBase(this.x + (this.isLeftSide ? -2 : 23), this.y + 2, this.width - 20);
	}
}
Object.defineProperty(Necromancer, "name", { value: 'Necromancer', writable: false }); //fix production minification class names