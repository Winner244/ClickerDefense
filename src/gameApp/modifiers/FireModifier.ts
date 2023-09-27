import {Modifier} from "./Modifier";

import {AttackedObject} from "../../models/AttackedObject";

import AnimationInfinite from "../../models/AnimationInfinite";

import fireImage from '../../assets/img/fire.png'; 

/* Горит
 * наносит утихающий урон
 */
export class FireModifier extends Modifier{
	static readonly defenceMultiplier: number = -0.1; //на 10% уменьшает защиту
	static readonly damageInMultiplier: number = 0.1; //на 10% увеличивает входящий урон
	static readonly damageOutMultiplier: number = -0.1; //на 10% уменьшает исходящий урон

	static fireImage: HTMLImageElement = new Image(); //изображение огня

	fireDamageInSecond: number; //урона от огня стрел в секунду

	protected readonly damageDecreasingEndGoalPercentage: number = 50; //до скольки должен уменьшится урон к концу своей жизни (в процентах, чем ментше, тем меньше урон будет в конце)
	protected readonly viewDecreasingEndGoalPercentage: number = 50; //до скольки должен уменьшится внешне огонь к концу своей жизни (в процентах, чем ментше, тем меньше визуально будет огонь в конце)
	protected readonly damageTimeWaitingMs: number = 400; //частота урона (выражается во времени ожидания после атаки в миллисекундах)

	_damageLeftTimeMs: number = 0; //оставшееся время до следующего получения урона (миллисекунды)
	_isReadyToSpread: boolean = false; //можно ли запустить логику распространения на данном цикле обновлений?
	_damageDecreasingInSecond: number = 0; //на сколько угосает урон в секунду
	_fireAnimation: AnimationInfinite = new AnimationInfinite(35, 1000, FireModifier.fireImage);
	_lifeTimeMsInitial: number; //изначальное время жизни - нужно для сравнения в % оставшегося времени

	static loadResources(){
		FireModifier.fireImage.src = fireImage;
	}

	constructor(fireDamageInSecond: number, lifeTimeMs: number = 5000, lifeTimeMsInitial: number|null = null) {
		super(FireModifier.name, 0, FireModifier.damageInMultiplier, FireModifier.damageOutMultiplier, 0, FireModifier.defenceMultiplier, lifeTimeMs);

		this.fireDamageInSecond = fireDamageInSecond;
		this._damageDecreasingInSecond = fireDamageInSecond / (lifeTimeMs / 1000) * (1 - this.damageDecreasingEndGoalPercentage / 100);
		this._damageLeftTimeMs = this.damageTimeWaitingMs;
		this._lifeTimeMsInitial = lifeTimeMsInitial || lifeTimeMs;
	}

	logic(object: AttackedObject, drawsDiffMs: number){
		super.logic(object, drawsDiffMs);

		//ожидания времени нанесения урона
		if(this._damageLeftTimeMs > 0){
			this._damageLeftTimeMs -= drawsDiffMs;
			this._isReadyToSpread = false;
		}
		else{
			//наносим урон и перезаряжаем время
			object.applyDamage(this.fireDamageInSecond * (this.damageTimeWaitingMs  / 1000));
			this._damageLeftTimeMs = this.damageTimeWaitingMs;

			//ослабеваем урон 
			this.fireDamageInSecond -= this._damageDecreasingInSecond * this.damageTimeWaitingMs / 1000;
			if(this.fireDamageInSecond <= 0){
				object.modifiers = object.modifiers.filter(modifier => modifier.name != FireModifier.name);
			}


			this._isReadyToSpread = true;
		}
	}

	//логика распространения огня
	logicSpread(object: AttackedObject, objects: AttackedObject[], isForce: boolean = false){
		super.logicSpread(object, objects);

		if(this._isReadyToSpread || isForce){

			//распространение на других монстров
			objects.forEach(anotherObject => {
				const procentDecreasing = 0.4;
				if(object.x + object.width * procentDecreasing < anotherObject.x + anotherObject.width && 
					object.x + object.width * (1 - procentDecreasing) > anotherObject.x && 
					object.y - object.height / 2 + object.height * procentDecreasing < anotherObject.y + anotherObject.height &&
					object.y + object.height * (1 - procentDecreasing) > anotherObject.y)
				{
					//пересеклись либо один входит в другой - передаём огонь с текущими параметрами
					anotherObject.addModifier(new FireModifier(this.fireDamageInSecond, this.lifeTimeMs || 0, this._lifeTimeMsInitial));
				}
			});
		}
	}

	//drawAheadObject

	drawBehindObject(object: AttackedObject, drawsDiffMs: number){
		const sizeScale = (this.lifeTimeMs || 0) / this._lifeTimeMsInitial * (1 - this.damageDecreasingEndGoalPercentage / 100) + this.damageDecreasingEndGoalPercentage / 100;
		this._fireAnimation.draw(drawsDiffMs, false, 
			object.x + object.width / 5 + (1 - sizeScale) * object.width / 3 + object.shiftXForCenter, 
			object.y - object.height / 2 + (1 - sizeScale) * object.height + object.shiftYForCenter, 
			object.width * sizeScale - object.width * sizeScale / 5 * 2, 
			object.height * sizeScale);
	}
}