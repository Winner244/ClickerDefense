
import {Draw} from '../gameSystems/Draw';
import {ImageHandler} from '../ImageHandler';

import {ILogicalObject} from '../../models/objects/ILogicalObject';

import {Building} from "../../gameApp/buildings/Building"
import {Monster} from "../../gameApp/monsters/Monster"
import {Unit} from "../../gameApp/units/Unit"
import {MovingObject} from '../../models/objects/MovingObject';

import {FireModifier} from '../modifiers/FireModifier';

import {AnimationsSystem} from '../gameSystems/AnimationsSystem';
import {AnimatedObject} from '../../models/objects/AnimatedObject';
import Animation from '../../models/animations/Animation';
import AnimationInfinite from '../../models/animations/AnimationInfinite';

import {AudioSystem} from '../gameSystems/AudioSystem';

import {Helper} from '../helpers/Helper';

import {Minotaur} from '../monsters/Minotaur';

import arrowImage from '../../assets/img/buildings/tower/arrow.png';  
import fireImage from '../../assets/img/fire.png'; 
import dynamitImage from '../../assets/img/buildings/tower/dynamit/dynamit.png';
import dynamitExplosionImage from '../../assets/img/explosionBomb.png';  

import explosionDynamitSound from '../../assets/sounds/explosionBomb.mp3'; 
import explosionDynamit2Sound from '../../assets/sounds/explosionBomb2.mp3';

export class Arrow implements ILogicalObject{
	private static readonly imageHandler: ImageHandler = new ImageHandler();

	static readonly imageArrow: HTMLImageElement = new Image();
	private static readonly fireImage: HTMLImageElement = new Image(); //изображение огня
	private static readonly dynamitExplosionImage: HTMLImageElement = new Image(); //анимация взрыва динамита
	private static readonly dynamitImage: HTMLImageElement = new Image(); //отображается на стреле после улучшения до взрывных стрел
	
	private _fireAnimation: AnimationInfinite = new AnimationInfinite(35, 1000); //отображается на стреле после улучшения до огненных стрел

	isEnd: boolean = false;

	isFire: boolean;
	isDynamit: boolean;
	arrow: MovingObject;
    damage: number;

	fireDamageInSecondPercentage: number = 5; //урона от огня стрел в секунду (В процентах от максимальных хп монстра)
	fireDamageInSecondMinimal: number = 0.3; //урона от огня стрел в секунду (минимальный)
	fireDurationMs: number = 7000; //время горения монстров

	dynamitRadius: number = 50; //радиус взрыва динамита
	dynamitDamage: number = 1; //урона от взрыва динамита 

	constructor(movingObject: MovingObject, 
		isFire: boolean, 
		isDynamit: boolean, 
		damage: number,
		fireDamageInSecondMinimal: number,
		fireDamageInSecondPercentage: number,
		fireDurationMs: number,
		dynamitRadius: number,
		dynamitDamage: number)
	{
		this.arrow = movingObject;
		this.isFire = isFire;
		this.isDynamit = isDynamit;
		this.damage = damage;
		this.fireDamageInSecondMinimal = fireDamageInSecondMinimal;
		this.fireDamageInSecondPercentage = fireDamageInSecondPercentage;
		this.fireDurationMs = fireDurationMs;
		this.dynamitRadius = dynamitRadius;
		this.dynamitDamage = dynamitDamage;

		this._fireAnimation.changeImage(Arrow.fireImage.src);
	}

	static init(){
		Arrow.imageArrow.src = arrowImage;
	}

	static initFire(){
		Arrow.fireImage.src = fireImage;
	}

	static initDynamit(){
		Arrow.imageHandler.new(Arrow.dynamitExplosionImage).src = dynamitExplosionImage;
		Arrow.imageHandler.new(Arrow.dynamitImage).src = dynamitImage;
		AudioSystem.load(explosionDynamitSound);
		AudioSystem.load(explosionDynamit2Sound);
	}

	
	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number): void{
		let endMoving = true;
		this.arrow.leftTimeMs -= drawsDiffMs;

		//moving
		if(this.arrow.location.y + this.arrow.size.height < Draw.canvas.height - bottomShiftBorder - 10){
			this.arrow.location.x -= this.arrow.dx * (drawsDiffMs / 1000);
			this.arrow.location.y -= this.arrow.dy * (drawsDiffMs / 1000);
			endMoving = false;
		}

		//delete - выход за границу экрана или по истечению времени жизни стрелы
		if(this.arrow.location.x + this.arrow.size.width < 0 || this.arrow.location.x > Draw.canvas.width || 
			this.arrow.location.y + this.arrow.size.height < 0 || this.arrow.location.y > Draw.canvas.height ||
			this.arrow.leftTimeMs < 0)
		{
			this.isEnd = true;
		}
		else if(!endMoving){
			let monsterGoal = monsters.find(monster => 
				monster instanceof Minotaur
				? monster.isLeftSide 
					? this.arrow.centerX > monster.x && this.arrow.centerX < monster.x + monster.width * 0.45 && 
						this.arrow.centerY > monster.y && this.arrow.centerY < monster.y + monster.height * 0.9
					: this.arrow.centerX > monster.x + monster.width * 0.55 && this.arrow.centerX < monster.x + monster.width && 
						this.arrow.centerY > monster.y && this.arrow.centerY < monster.y + monster.height * 0.9
				: this.arrow.centerX > monster.x + monster.reduceHover && this.arrow.centerX < monster.x + monster.width - monster.reduceHover && 
				  this.arrow.centerY > monster.y + monster.reduceHover && this.arrow.centerY < monster.y + monster.height - monster.reduceHover);

			//попадание в цель
			if(monsterGoal){ 
				monsterGoal.applyDamage(this.damage);
				this.isEnd = true;

				if(this.isDynamit){
					this.dynamitExplosion(this.arrow.centerX, this.arrow.centerY, monsters);
				}
				else if(this.isFire){
					const fireModifier = new FireModifier(this.fireDamageInSecondMinimal, this.fireDamageInSecondPercentage, this.fireDurationMs);
					monsterGoal.addModifier(fireModifier);
					//даже если стрела убьёт, то хотя бы подожгёт рядом стоящих монстров
					fireModifier.logicSpread(monsterGoal, monsters, true);
				}
			}
		}
		else if(endMoving){
			this.isFire = false;
			if(this.isDynamit){
				this.dynamitExplosion(this.arrow.centerX, this.arrow.centerY, monsters);
				this.isEnd = true;
			}
		}
	}

	private dynamitExplosion(centerX: number, centerY: number, monsters: Monster[]){
		AnimationsSystem.add(new AnimatedObject(centerX - this.dynamitRadius, centerY - this.dynamitRadius, this.dynamitRadius * 2, this.dynamitRadius * 2, true, 
			new Animation(8, 500, Arrow.dynamitExplosionImage))); 

		monsters
			.forEach(monster => {
				const distance = Helper.getDistance(monster.centerX, monster.centerY, centerX, centerY);
				if(distance <= this.dynamitRadius){
					monster.applyDamage(this.dynamitDamage);
				}
				else if(distance < this.dynamitRadius * 1.5){
					const damage = this.dynamitDamage * ((this.dynamitRadius * 1.5 - distance) / this.dynamitRadius);
					monster.applyDamage(damage);
				}
			})
		
		AudioSystem.playRandomV(centerX, [explosionDynamitSound, explosionDynamit2Sound], -18, false, 1, true);
	}

	
    draw(drawsDiffMs: number, isGameOver: boolean): void {
        if(!Arrow.imageHandler.isImagesCompleted){
            return;
        }

		Draw.ctx.setTransform(1, 0, 0, 1, this.arrow.location.x + this.arrow.size.width / 2, this.arrow.location.y + this.arrow.size.height / 2); 
		Draw.ctx.rotate(this.arrow.rotate * Math.PI / 180);
		Draw.ctx.drawImage(Arrow.imageArrow, -this.arrow.size.width / 2, -this.arrow.size.height / 2, this.arrow.size.width, this.arrow.size.height);
		if(this.isDynamit && Arrow.dynamitImage.complete){
			Draw.ctx.drawImage(Arrow.dynamitImage, -Arrow.dynamitImage.width / 2, -Arrow.dynamitImage.height / 2, Arrow.dynamitImage.width, Arrow.dynamitImage.height);
		}
		if(this.isFire && this._fireAnimation.image.complete){ 
			Draw.ctx.rotate(-90 * Math.PI / 180);
			this._fireAnimation.draw(drawsDiffMs, isGameOver, -this.arrow.size.height / 2, -this.arrow.size.width / 2, this.arrow.size.height, this.arrow.size.width);
		}
		Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
		Draw.ctx.rotate(0);
	}
}