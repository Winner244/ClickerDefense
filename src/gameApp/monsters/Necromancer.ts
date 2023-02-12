import {ImageHandler} from '../ImageHandler';

import {MovingObject} from '../../models/MovingObject';

import {Modifier} from '../modifiers/Modifier';

import {AudioSystem} from '../gameSystems/AudioSystem';
import {Draw} from '../gameSystems/Draw';

import {Building} from '../buildings/Building';

import {Monster} from './Monster';

import {Helper} from '../helpers/Helper';

import Necromancer1Image from '../../assets/img/monsters/necromancer/necromancer.png'; 
import ChargeImage from '../../assets/img/monsters/necromancer/charge.png'; 

import NecromancerAttack1Image from '../../assets/img/monsters/necromancer/necromancerAttack.png'; 

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
	private static readonly attackImageFrames = 5;

	static readonly chargeImage: HTMLImageElement = new Image();

	private static readonly maxDistanceDamage = 450; //(px) Макс Дистанция до ближайшего строения - цели, при котором активируется атака
	private static readonly minDistanceDamage = 300; //(px) Мин Дистанция до ближайшего строения - цели, при котором активируется атака
	private _attackXStart: number; //координата x на которой будет активирована атака

	static readonly chargeSpeed: number = 200; //скорость полёта заряда (в пикселях за секунду)
	private _charges: MovingObject[]; //атакующие заряды энергии 

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

	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			Necromancer.imageHandler.new(Necromancer.image).src = Necromancer1Image;
			Necromancer.imageHandler.new(Necromancer.attackImage).src = NecromancerAttack1Image;
			Necromancer.imageHandler.new(Necromancer.chargeImage).src = ChargeImage;
			AudioSystem.load(Attack1Sound);
			AudioSystem.load(Attack2Sound);
		}
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
					charge.centerY > building.y + building.reduceHover && charge.centerY < building.y + building.animation.image.height - building.reduceHover);

				//попадание в цель
				if(buildingGoal){ 
					buildingGoal.applyDamage(this.damage, null, charge.centerX, charge.centerY);
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
				if(!this._isAttack){
					this._attackLeftTimeMs = 350;
					this.attackAnimation.restart();
				}
				this._isAttack = true; //атакует
				if(this._attackLeftTimeMs <= 0){
					let damageMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.damageMultiplier);
					let damage = this.damage + this.damage * damageMultiplier;
					this.attack(damage);
				}

				if(this._attackLeftTimeMs > 0)
					this._attackLeftTimeMs -= drawsDiffMs;
				return; //игнорируем базовую логику движения и атаки
			}
		}

		var oldBuildingGoalX = this._buildingGoal?.centerX;
		super.logic(drawsDiffMs, buildings, monsters, bottomBorder);
		var newBuildingGoalX = this._buildingGoal?.centerX;

		if(newBuildingGoalX && oldBuildingGoalX != newBuildingGoalX){
			this._attackXStart = newBuildingGoalX - (this.isLeftSide ? 1 : -1) * Helper.getRandom(Necromancer.minDistanceDamage, Necromancer.maxDistanceDamage) 
		}
	}

	attack(damage: number): void {
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

	attacked(damage: number, x: number|null = null, y: number|null = null): void{
		super.attacked(damage, x, y);
		//this._attackLeftTimeMs = 350;
		AudioSystem.playRandomV(this.centerX, 
			[SoundAttacked1, SoundAttacked2, SoundAttacked3, SoundAttacked4, SoundAttacked5], 
			0.1, false, 1, true);
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

	drawHealth(){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this.health != this.healthMax){
			Draw.drawHealth(this.x + (this.isLeftSide ? -2 : 23), this.y + 2, this.width - 20, this.healthMax, this.health);
		}
	}
}