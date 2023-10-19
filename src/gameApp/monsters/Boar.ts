import * as Tone from 'tone';

import {ImageHandler} from '../ImageHandler';

import {Helper} from '../helpers/Helper';

import Animation from '../../models/Animation';
import AnimationInfinite from '../../models/AnimationInfinite';

import {AttackedObject} from '../../models/AttackedObject';
import {WaveData} from '../../models/WaveData';

import {Monster} from './Monster';

import {Unit} from '../units/Unit';

import {Draw} from "../gameSystems/Draw";
import {AudioSystem} from '../gameSystems/AudioSystem';

import {Building} from "../buildings/Building";

import {BoarSpecialAbility} from "../modifiers/BoarSpecialAbility";

import Boar1Image from '../../assets/img/monsters/boar/boar.png';
import BoarAttack1Image from '../../assets/img/monsters/boar/boarAttack.png';
import BoarSpecial1Image from '../../assets/img/monsters/boar/boarSpecial.png';
import BoarSpecialSmokeImage from '../../assets/img/monsters/boar/boarSpecial_Smoke.png';
import BoarSpecialDamageParticlesImage from '../../assets/img/monsters/boar/boarSpecial_DamageParticles.png';

import Sound1 from '../../assets/sounds/monsters/boar/1.mp3'; 
import Sound2 from '../../assets/sounds/monsters/boar/2.mp3'; 
import Sound3 from '../../assets/sounds/monsters/boar/3.mp3'; 
import Sound4 from '../../assets/sounds/monsters/boar/4.mp3'; 
import Sound5 from '../../assets/sounds/monsters/boar/5.mp3'; 
import Sound6 from '../../assets/sounds/monsters/boar/6.mp3'; 
import Sound7 from '../../assets/sounds/monsters/boar/7.mp3'; 
import Sound8 from '../../assets/sounds/monsters/boar/8.mp3'; 
import Sound9 from '../../assets/sounds/monsters/boar/9.mp3'; 
import Sound10 from '../../assets/sounds/monsters/boar/10.mp3'; 

import SoundAttacked1 from '../../assets/sounds/monsters/boar/attacked1.mp3'; 
import SoundAttacked2 from '../../assets/sounds/monsters/boar/attacked2.mp3'; 
import SoundAttacked3 from '../../assets/sounds/monsters/boar/attacked3.mp3'; 
import SoundAttacked4 from '../../assets/sounds/monsters/boar/attacked4.mp3'; 
import SoundAttacked5 from '../../assets/sounds/monsters/boar/attacked5.mp3'; 
import SoundAttacked6 from '../../assets/sounds/monsters/boar/attacked6.mp3'; 
import SoundAttacked7 from '../../assets/sounds/monsters/boar/attacked7.mp3'; 
import SoundAttacked8 from '../../assets/sounds/monsters/boar/attacked8.mp3'; 
import SoundAttacked9 from '../../assets/sounds/monsters/boar/attacked9.mp3'; 
import SoundAttacked10 from '../../assets/sounds/monsters/boar/attacked10.mp3'; 

import SoundStartSpecial from '../../assets/sounds/monsters/boar/special/start.mp3'; 
import SoundRunning from '../../assets/sounds/monsters/boar/special/running.mp3'; 

/** Кабан - тип монстров */
export class Boar extends Monster{
	static readonly imageHandler: ImageHandler = new ImageHandler();

	private static readonly images: HTMLImageElement[] = [];  //разные окраски монстра
	private static readonly imageFrames = 8;

	private static readonly attackImages: HTMLImageElement[] = [];  //разные окраски монстра
	private static readonly attackImageFrames = 3;

	private readonly specialAbilityAnimation: Animation; //анимация спец способности
	private static readonly specialAbilityImages: HTMLImageElement[] = [];  //разные окраски монстра

	private readonly specialAbilitySmokeAnimation: AnimationInfinite;
	private static readonly specialAbilitySmokeAnimationImage: HTMLImageElement = new Image();
	private static readonly specialAbilitySmokeAnimationDisplayWidth = 180;
	private static readonly specialAbilitySmokeTimeGrowing = 600; //(milliseconds) время роста анимации пыли у способности

	private readonly specialAbilityDamageParticlesAnimation: Animation;
	private static readonly specialAbilityDamageParticlesAnimationImage: HTMLImageElement = new Image();
	private static readonly specialAbilityDamageParticlesImageDisplayedWidth = 100;
	private static readonly specialAbilityDamageParticlesImageDisplayedHeight = 100;

	/* Спец Способность - каждый кабан останавливается перед атакуемым зданием на расстоянии z пикселей,
		активирует анимацию "злой бык" и начинает бежать с ускорением и с доп анимацией "Пыль", первая атака наносит 10x урон
		 спец способность отменяется при нанесении урона монстру */
	private static readonly probabilitySpecialAbilityPercentage = 70; //(%) Вероятность срабатывания спец способности
	private static readonly maxDistanceActivateSpecialAbility = 700; //(px) Макс Дистанция до ближайшего строения - цели, при котором активируется спец способность
	private static readonly minDistanceActivateSpecialAbility = 200; //(px) Мин Дистанция до ближайшего строения - цели, при котором активируется спец способность
	private static readonly specialAbilityDamage = 18; //начальный урон от спец способности (единократный)
	private readonly specialAbilityDamage: number; //доп урон от спец способности для данного экземпляра монстра (единократный) * размер особи

	//технические поля экземпляра
	private _isWillUseSpecialAbility: boolean; //будет ли использована спец способность у данного экземпляра
	private _isActivatedSpecialAbility: boolean;  //была ли активирована спец способность ?
	private _isActivatedSpecialDamage: boolean;  //был ли нанесён урон от спец способности ?
	private _specialAbilityActivationLeftTimeMs: number; //оставшееся время активации спец способности (миллисекунды)
	private _specialAbilityXStart: number; //координата x на которой будетактивирована спец способность кабана

	private _startSpecialSound: Tone.Player|null; //нужно для отмены звука при гибели монстра или при отмене спец способности
	private _runningSound: Tone.Player|null; //нужно для отмены звука при гибели монстра или при отмене спец способности


	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number, isWillUseSpecialAbility: boolean|null = null) {
		Boar.init(true); //reserve init

		let random = Helper.getRandom(1, Boar.images.length) - 1;
		let selectedImage = Boar.images[random];
		let selectedAttackImage = Boar.attackImages[random];
		let selectedSpecialImage = Boar.specialAbilityImages[random];

		super(x, y,
			scaleSize,
			isLeftSide,
			true,   //isLand
			Boar.name,
			selectedImage,
			Boar.imageFrames,
			500,
			selectedAttackImage,
			Boar.attackImageFrames,
			500,
			5,
			4,    //health
			3,    //damage
			500,  //time attack wait
			150,  //speed
			Boar.imageHandler,
			3000); //avrTimeSoundWait

		this._isWillUseSpecialAbility = isWillUseSpecialAbility ?? Helper.getRandom(0, 100) <= Boar.probabilitySpecialAbilityPercentage;
		this._specialAbilityXStart = 0;
		this.specialAbilityAnimation = new Animation(12, 1000, selectedSpecialImage);
		this.specialAbilitySmokeAnimation = new AnimationInfinite(16, 1000, Boar.specialAbilitySmokeAnimationImage);
		this.specialAbilityDamageParticlesAnimation = new Animation(7, 200, Boar.specialAbilityDamageParticlesAnimationImage);
		this._isActivatedSpecialAbility = false;
		this._isActivatedSpecialDamage = false;
		this._specialAbilityActivationLeftTimeMs = 0;
		this.specialAbilityDamage = Boar.specialAbilityDamage * scaleSize;
		this._startSpecialSound = null;
		this._runningSound = null;
	}

	static init(isLoadResources: boolean = true): void {
		if(isLoadResources && Boar.imageHandler.isEmpty) {
			Boar.imageHandler.add(Boar.images).src = Boar1Image;

			Boar.imageHandler.add(Boar.attackImages).src = BoarAttack1Image;

			Boar.imageHandler.add(Boar.specialAbilityImages).src = BoarSpecial1Image;

			Boar.imageHandler.new(Boar.specialAbilitySmokeAnimationImage).src = BoarSpecialSmokeImage;
			Boar.imageHandler.new(Boar.specialAbilityDamageParticlesAnimationImage).src = BoarSpecialDamageParticlesImage;
		}
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomBorder: number, waveLevel: WaveData[]) {
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this._isActivatedSpecialAbility) {
			if(this._specialAbilityActivationLeftTimeMs > 0) {
				this._specialAbilityActivationLeftTimeMs -= drawsDiffMs;
				super.logicBase(drawsDiffMs, buildings, monsters, units, bottomBorder);
				return; //игнорируем базовую логику движения и атаки
			}
			else if(this._isAttack && this._goal) {
				super.attack(this.specialAbilityDamage); //наносим урон от спец способности
				this._goal.impulse += (this.isLeftSide ? 1 : -1) * this.specialAbilityDamage; //добавляем импульс постройке от удара
				this.stopSpecialAbility();
				this._isActivatedSpecialDamage = true;
				this.specialAbilityDamageParticlesAnimation.restart();
			}
			else {
				this._attackLeftTimeMs = this.attackTimeWaitingMs; //что бы не сработала первая обычная атака в базовом методе
			}
		}
		else if(this._isWillUseSpecialAbility && this._specialAbilityXStart > 0 && this._goal) {
			//активация спец способности
			if ( this.isLeftSide && this.centerX >= this._specialAbilityXStart || 
				!this.isLeftSide && this.centerX <= this._specialAbilityXStart)
			{
				this._isActivatedSpecialAbility = true;
				this._specialAbilityXStart = 0;
				this._specialAbilityActivationLeftTimeMs = this.specialAbilityAnimation.durationMs;
				this.specialAbilitySmokeAnimation.restart();
				this.modifiers.push(new BoarSpecialAbility());

				AudioSystem.play(this.centerX, SoundStartSpecial, 0.3, 1, true, true).then(sourse => this._startSpecialSound = sourse);
				AudioSystem.play(this.centerX, SoundRunning, 0.5, 2, true, true, 1.2).then(sourse => this._runningSound = sourse);
			}
		}

		var oldBuildingGoalX = this._goal?.centerX;
		super.logic(drawsDiffMs, buildings, monsters, units, bottomBorder, waveLevel);
		var newBuildingGoalX = this._goal?.centerX;

		if(newBuildingGoalX && oldBuildingGoalX != newBuildingGoalX && this._isWillUseSpecialAbility && Math.abs(newBuildingGoalX - this.centerX) > Boar.minDistanceActivateSpecialAbility){
			this._specialAbilityXStart = newBuildingGoalX - (this.isLeftSide ? 1 : -1) * Helper.getRandom(Boar.minDistanceActivateSpecialAbility, Boar.maxDistanceActivateSpecialAbility) 
		}
	}

	playSound(): void {
		AudioSystem.playRandomV(this.centerX, 
			[Sound1, Sound2, Sound3, Sound4, Sound5, Sound6, Sound7, Sound8, Sound9, Sound10], -18, false, 1, true);
	}

	onClicked(damage: number, x: number|null = null, y: number|null = null): void{
		this.stopSpecialAbility();
		super.onClicked(damage, x, y);
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null, attackingObject: AttackedObject|null = null): number{
		var damage = super.applyDamage(damage, x, y, attackingObject);
		if(damage > 0){
			this.stopSpecialAbility();
	
			AudioSystem.playRandomV(this.centerX, 
				[SoundAttacked1, SoundAttacked2, SoundAttacked3, SoundAttacked4, SoundAttacked5, SoundAttacked6, SoundAttacked7, SoundAttacked8, SoundAttacked9, SoundAttacked10], 
				-16, false, 1, true);
		}
		return damage;
	}

	stopSpecialAbility(): void{
		this.modifiers = this.modifiers.filter(x => x.name != BoarSpecialAbility.name);
		this._isWillUseSpecialAbility = false;
		this._isActivatedSpecialAbility = false;
		this._specialAbilityActivationLeftTimeMs = 0;
		this._runningSound?.stop();
		this._runningSound = null;
		this._startSpecialSound?.stop();
		this._startSpecialSound = null;
	}

	destroy(){
		super.destroy();
		this._runningSound?.stop();
		this._runningSound = null;
		this._startSpecialSound?.stop();
		this._startSpecialSound = null;
	}

	draw(drawsDiffMs: number, isGameOver: boolean) {
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		let isInvert = this.isLeftSide;
		let scale = isInvert ? -1 : 1;

		//анимация начала спец способности - когда кабан стоит на месте и ногами как бык взбивает пыль
		if(this._isActivatedSpecialAbility && this._specialAbilityActivationLeftTimeMs > 0){
			if(isInvert){
				Draw.ctx.save();
				Draw.ctx.scale(-1, 1);
			}

			this.specialAbilityAnimation.draw(drawsDiffMs, isGameOver, scale * this.x, this.y, scale * this.width, this.height);

			if(isInvert){
				Draw.ctx.restore();
			}

			super.drawHealth();
		}
		else{
			//дым от бега 
			if(this._isActivatedSpecialAbility){
				if(isInvert){
					Draw.ctx.save();
					Draw.ctx.scale(-1, 1);
				}

				const smokeScaleSize = Math.min((Boar.specialAbilitySmokeTimeGrowing + this.specialAbilitySmokeAnimation.displayedTimeMs - Boar.specialAbilitySmokeTimeGrowing) / Boar.specialAbilitySmokeTimeGrowing, 1);
				const x = scale > 0 
					? this.x + this.width / 3
					: scale * this.x + this.width / 3 + (smokeScaleSize * Boar.specialAbilitySmokeAnimationDisplayWidth - this.width);
				const y = this.y + (1 - smokeScaleSize) * this.height;
				const width = smokeScaleSize * scale * Boar.specialAbilitySmokeAnimationDisplayWidth;
				this.specialAbilitySmokeAnimation.draw(drawsDiffMs, isGameOver, x, y, width, smokeScaleSize * this.height);

				if(isInvert){
					Draw.ctx.restore();
				}
			}
			
			//сама модель быка
			super.draw(drawsDiffMs, isGameOver);

			//обломки от спец атаки
			if(this._isActivatedSpecialDamage && this.specialAbilityDamageParticlesAnimation.leftTimeMs > 0){
				scale = scale * -1;
				if(!isInvert){
					Draw.ctx.save();
					Draw.ctx.scale(-1, 1);
				}

				const x = scale > 0 ? this.x + this.width - Boar.specialAbilityDamageParticlesImageDisplayedWidth : -this.x;
				const y = this.y + this.height / 2 - Boar.specialAbilityDamageParticlesImageDisplayedHeight / 2;
				const width = scale * Boar.specialAbilityDamageParticlesImageDisplayedWidth;
				const height = Boar.specialAbilityDamageParticlesImageDisplayedHeight;
				this.specialAbilityDamageParticlesAnimation.draw(drawsDiffMs, isGameOver, x, y, width, height);

				if(!isInvert){
					Draw.ctx.restore();
				}
			}
		}
	}
}
