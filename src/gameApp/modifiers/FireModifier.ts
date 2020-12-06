import {Modifier} from "./Modifier";

import {AttackedObject} from "../../models/AttackedObject";

import AnimationInfinite from "../../models/animations/AnimationInfinite";

import fireImage from '../../assets/img/fire.png'; 

/* Горит
 * наносит утихающий урон
 */
export class FireModifier extends Modifier{
	static readonly defenceMultiplier: number = -0.1; //на 10% уменьшает защиту
	static readonly damageInMultiplier: number = 0.1; //на 10% увеличивает входящий урон
	static readonly damageOutMultiplier: number = -0.1; //на 10% уменьшает исходящий урон

	static fireImage: HTMLImageElement = new Image(); //изображение огня

	protected readonly damageDecreasingEndGoalPercentage: number = 50; //до скольки должен уменьшится урон к концу своей жизни (в процентах, чем меньше, тем меньше урон будет в конце)
	protected readonly viewDecreasingEndGoalPercentage: number = 50; //до скольки должен уменьшится внешне огонь к концу своей жизни (в процентах, чем меньше, тем меньше визуально будет огонь в конце)
	protected readonly damageTimeWaitingMs: number = 400; //частота урона (выражается во времени ожидания после атаки в миллисекундах)

	_damageLeftTimeMs: number = 0; //оставшееся время до следующего получения урона (миллисекунды)
	_isReadyToSpread: boolean = false; //можно ли запустить логику распространения на данном цикле обновлений?

	fireDamageInSecondPercentage: number; //урона от огня стрел в секунду (В процентах от максимальных хп монстра)
	fireDamageInSecondMinimal: number; //урона от огня стрел в секунду (минимальный)

	_damagePercentageDecreasingInSecond: number = 0; //на сколько угосает урон (fireDamageInSecondPercentage) в секунду
	_damageMinimalDecreasingInSecond: number = 0; //на сколько угосает урон (fireDamageInSecondMinimal) в секунду

	_fireAnimation: AnimationInfinite = new AnimationInfinite(35, 1000, FireModifier.fireImage);
	_lifeTimeMsInitial: number; //изначальное время жизни - нужно для сравнения в % оставшегося времени

	static loadResources(){
		FireModifier.fireImage.src = fireImage;
	}

	constructor(
		fireDamageInSecondMinimal: number = 0.3, 
		fireDamageInSecondPercentage: number = 1, 
		lifeTimeMs: number = 5000, 
		lifeTimeMsInitial: number|null = null) 
	{
		super(FireModifier.name, 0, FireModifier.damageInMultiplier, FireModifier.damageOutMultiplier, 0, FireModifier.defenceMultiplier, lifeTimeMs);

		this.fireDamageInSecondMinimal = fireDamageInSecondMinimal;
		this.fireDamageInSecondPercentage = fireDamageInSecondPercentage;

		this._damagePercentageDecreasingInSecond = fireDamageInSecondPercentage / (lifeTimeMs / 1000) * (1 - this.damageDecreasingEndGoalPercentage / 100);
		this._damageMinimalDecreasingInSecond = fireDamageInSecondMinimal / (lifeTimeMs / 1000) * (1 - this.damageDecreasingEndGoalPercentage / 100);

		this._damageLeftTimeMs = this.damageTimeWaitingMs;
		this._lifeTimeMsInitial = lifeTimeMsInitial || lifeTimeMs;

		FireModifier.loadResources(); //reserve
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
			var damage = Math.max(object.healthMax / 100 * this.fireDamageInSecondPercentage, this.fireDamageInSecondMinimal);
			object.applyDamage(damage * (this.damageTimeWaitingMs  / 1000));
			this._damageLeftTimeMs = this.damageTimeWaitingMs;

			//ослабеваем урон 
			this.fireDamageInSecondPercentage -= this._damagePercentageDecreasingInSecond * this.damageTimeWaitingMs / 1000;
			this.fireDamageInSecondMinimal -= this._damageMinimalDecreasingInSecond * this.damageTimeWaitingMs / 1000;
			if(this.fireDamageInSecondPercentage <= 0 || this.fireDamageInSecondMinimal <= 0){
				object.modifiers = object.modifiers.filter(modifier => modifier.name != FireModifier.name);
			}

			this._isReadyToSpread = true;
		}
	}

	//логика распространения огня
	logicSpread(object: AttackedObject, otherObjects: AttackedObject[], isForce: boolean = false){
		super.logicSpread(object, otherObjects);

		if(this._isReadyToSpread || isForce){

			//распространение на других монстров
			otherObjects.forEach(anotherObject => {
				const conditionByX =  object.isLeftSide 
					? object.centerX < anotherObject.centerX + anotherObject.width / 2 && 
					  object.centerX + object.width / 2 > anotherObject.x + anotherObject.width
					: object.centerX > anotherObject.centerX - anotherObject.width / 2 && 
					  object.centerX - object.width / 2 < anotherObject.x + anotherObject.width;
				const procentDecreasing = 0.4;
				const conditionByXwide = object.x + object.width * procentDecreasing < anotherObject.x + anotherObject.width && 
									  	 object.x + object.width * (1 - procentDecreasing) > anotherObject.x;

				if((conditionByX || conditionByXwide) && 
					object.centerY - object.height * procentDecreasing < anotherObject.y + anotherObject.height &&
					object.y + object.height * (1 - procentDecreasing) > anotherObject.y)
				{
					//пересеклись либо один входит в другой - передаём огонь с текущими параметрами
					anotherObject.addModifier(new FireModifier(this.fireDamageInSecondMinimal, this.fireDamageInSecondPercentage, this.lifeTimeMs || 0, this._lifeTimeMsInitial));
				}
			});
		}
	}

	//drawAheadObject

	drawBehindObject(object: AttackedObject, drawsDiffMs: number, isGameOver: boolean, shiftX: number, shiftY: number, sizeScaleStart: number|null = null){
		const lifePercent = (this.lifeTimeMs || 0) / (this._lifeTimeMsInitial || 1);
		const endMultiplier = this.viewDecreasingEndGoalPercentage / 100;
		const currentMultiplier = lifePercent * (1 - endMultiplier) + endMultiplier;
		const sizeScale = (sizeScaleStart ?? 1) * currentMultiplier;

		this._fireAnimation.draw(drawsDiffMs, isGameOver,
			object.x + object.width / 5 + (1 - sizeScale) * object.width / 3 + object.shiftXForCenter + shiftX,
			object.y - object.height / 2 + (1 - sizeScale) * object.height + object.shiftYForCenter + shiftY,
			object.width * sizeScale - object.width * sizeScale / 5 * 2,
			object.height * sizeScale);
	}
}
Object.defineProperty(FireModifier, "name", { value: 'FireModifier', writable: false }); //fix production minification class names