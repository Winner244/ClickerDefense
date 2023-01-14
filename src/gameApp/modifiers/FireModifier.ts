import {Monster} from "../monsters/Monster";
import {Modifier} from "./Modifier";

import AnimationInfinite from "../../models/AnimationInfinite";

import fireImage from '../../assets/img/buildings/tower/fire/fire.png'; 

/* Горит
 * наносит утихающий урон
 */
export class FireModifier extends Modifier{
	static fireImage: HTMLImageElement = new Image(); //изображение огня

	public fireDamageInSecond: number; //урона от огня стрел в секунду

	protected readonly damageDecreasingInSecond: number = 0.1; //на сколько угосает урон в секунду
	protected readonly damageTimeWaitingMs: number = 300; //частота урона (выражается во времени ожидания после атаки в миллисекундах)
	_damageLeftTimeMs: number = 0; //оставшееся время до следующего получения урона (миллисекунды)
	_fireAnimation: AnimationInfinite = new AnimationInfinite(35, 1000, FireModifier.fireImage);

	static loadResources(){
		FireModifier.fireImage.src = fireImage;
	}

	constructor(fireDamageInSecond: number, lifeTimeMs: number = 5000) {
		super(FireModifier.name, 0, 0, 0, lifeTimeMs);

		this.fireDamageInSecond = fireDamageInSecond;
	}

	logic(monster: Monster, drawsDiffMs: number, monsters: Monster[]){
		super.logic(monster, drawsDiffMs, monsters);

		if(this._damageLeftTimeMs > 0){
			this._damageLeftTimeMs -= drawsDiffMs;
		}
		else{
			monster.attacked(this.fireDamageInSecond * (this.damageTimeWaitingMs  / 1000));
			this._damageLeftTimeMs = this.damageTimeWaitingMs;

			this.fireDamageInSecond -= this.damageDecreasingInSecond * this.damageTimeWaitingMs / 1000;
			if(this.fireDamageInSecond <= 0){
				monster.modifiers = monster.modifiers.filter(modifier => modifier.name != FireModifier.name);
			}
		}

		//TODO: распространение на других монстров, передавать текущий оставшийся lifeTime что бы огонь небыл бесконечным
		//TODO: добавить время огня как улучшения для башни
	}

	drawBehindMonster(monster: Monster, drawsDiffMs: number){
		this._fireAnimation.draw(drawsDiffMs, false, 
			monster.x - monster.width / 5, 
			monster.y - monster.height / 2, 
			monster.width + monster.width / 5 * 2, 
			monster.height);
	}
}