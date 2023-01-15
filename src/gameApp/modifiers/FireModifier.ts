import {Monster} from "../monsters/Monster";
import {Modifier} from "./Modifier";

import AnimationInfinite from "../../models/AnimationInfinite";

import fireImage from '../../assets/img/buildings/tower/fire/fire.png'; 

/* Горит
 * наносит утихающий урон
 */
export class FireModifier extends Modifier{
	static fireImage: HTMLImageElement = new Image(); //изображение огня

	fireDamageInSecond: number; //урона от огня стрел в секунду

	protected readonly damageDecreasingEndGoalPercentage: number = 50; //до скольки должен уменьшится урон к концу своей жизни (в процентах, чем ментше, тем меньше урон будет в конце)
	protected readonly viewDecreasingEndGoalPercentage: number = 50; //до скольки должен уменьшится внешне огонь к концу своей жизни (в процентах, чем ментше, тем меньше визуально будет огонь в конце)
	protected readonly damageTimeWaitingMs: number = 300; //частота урона (выражается во времени ожидания после атаки в миллисекундах)

	_damageLeftTimeMs: number = 0; //оставшееся время до следующего получения урона (миллисекунды)
	_isReadyToSpread: boolean = false; //можно ли запустить логику распространения на данном цикле обновлений?
	_damageDecreasingInSecond: number = 0; //на сколько угосает урон в секунду
	_fireAnimation: AnimationInfinite = new AnimationInfinite(35, 1000, FireModifier.fireImage);
	_lifeTimeMsInitial: number; //изначальное время жизни - нужно для сравнения в % оставшегося времени

	static loadResources(){
		FireModifier.fireImage.src = fireImage;
	}

	constructor(fireDamageInSecond: number, lifeTimeMs: number = 5000) {
		super(FireModifier.name, 0, 0, 0, lifeTimeMs);

		this.fireDamageInSecond = fireDamageInSecond;
		this._damageDecreasingInSecond = fireDamageInSecond / (lifeTimeMs / 1000) * (1 - this.damageDecreasingEndGoalPercentage / 100);
		this._damageLeftTimeMs = this.damageTimeWaitingMs;
		this._lifeTimeMsInitial = lifeTimeMs;
	}

	logic(monster: Monster, drawsDiffMs: number, monsters: Monster[]){
		super.logic(monster, drawsDiffMs, monsters);

		//ожидания времени нанесения урона
		if(this._damageLeftTimeMs > 0){
			this._damageLeftTimeMs -= drawsDiffMs;
			this._isReadyToSpread = false;
		}
		else{
			//наносим урон и перезаряжаем время
			monster.attacked(this.fireDamageInSecond * (this.damageTimeWaitingMs  / 1000));
			this._damageLeftTimeMs = this.damageTimeWaitingMs;

			//ослабеваем урон 
			this.fireDamageInSecond -= this._damageDecreasingInSecond * this.damageTimeWaitingMs / 1000;
			if(this.fireDamageInSecond <= 0){
				monster.modifiers = monster.modifiers.filter(modifier => modifier.name != FireModifier.name);
			}


			this._isReadyToSpread = true;
		}
	}

	//логика распространения огня
	logicSpread(monster: Monster, monsters: Monster[], isForce: boolean = false){
		super.logicSpread(monster, monsters);

		if(this._isReadyToSpread || isForce){

			//распространение на других монстров
			monsters.forEach(anotherMonster => {
				const procentDecreasing = 0.4;
				if(monster.x + monster.width * procentDecreasing < anotherMonster.x + anotherMonster.width && 
					monster.x + monster.width * (1 - procentDecreasing) > anotherMonster.x && 
					monster.y - monster.height / 2 + monster.height * procentDecreasing < anotherMonster.y + anotherMonster.height &&
					monster.y + monster.height * (1 - procentDecreasing) > anotherMonster.y)
				{
					//пересеклись либо один входит в другой - передаём огонь с текущими параметрами
					anotherMonster.addModifier(new FireModifier(this.fireDamageInSecond, this.lifeTimeMs || 0));
				}
			});
		}
	}

	//drawAheadMonster

	drawBehindMonster(monster: Monster, drawsDiffMs: number){
		const sizeScale = (this.lifeTimeMs || 0) / this._lifeTimeMsInitial * (1 - this.damageDecreasingEndGoalPercentage / 100) + this.damageDecreasingEndGoalPercentage / 100;
		this._fireAnimation.draw(drawsDiffMs, false, 
			monster.x - monster.width / 5 + (1 - sizeScale) * monster.width / 1.5, 
			monster.y - monster.height / 2 + (1 - sizeScale) * monster.height, 
			monster.width * sizeScale + monster.width * sizeScale / 5 * 2, 
			monster.height * sizeScale);
	}
}