import {AttackedObject} from "../../models/AttackedObject";
import {Monster} from "../monsters/Monster";

/* Баф/дебаф - повышение/понижение характеристик юнитов/монстров/строений */
export class Modifier{
	readonly name: string;

	//(если надо увеличить здоровье на 10%, то healthMultiplier должен быть равен 0.1)
	//если уменьшить, то -0.1
	// 1 - будет равно увеличению на 100% (2x)
	healthMultiplier: number; //кратное увеличение здоровья
	damageMultiplier: number; //кратное увеличение урона
	speedMultiplier: number; //кратное увеличение скорости передвижения

	lifeTimeMs: number|null; //время существования (если временное)

	constructor(
		name: string,
		healthMultiplier: number,
		damageMultiplier: number,
		speedMultiplier: number,
		lifeTimeMs: number|null)
	{
		this.name = name;

		this.healthMultiplier = healthMultiplier;
		this.damageMultiplier = damageMultiplier;
		this.speedMultiplier = speedMultiplier;

		this.lifeTimeMs = lifeTimeMs;
	}

	logic(object: AttackedObject, drawsDiffMs: number, monsters: Monster[]): void{
		if(this.lifeTimeMs){
			this.lifeTimeMs -= drawsDiffMs;

			if(this.lifeTimeMs <= 0){
				object.modifiers = object.modifiers.filter(modifier => modifier.name != this.name);
			}
		}
	}

	//логика распространения 
	logicSpread(monster: Monster, monsters: Monster[]): void{}

	
	drawBehindObject(monster: Monster, drawsDiffMs: number){}
	drawAheadObject(monster: Monster, drawsDiffMs: number){}
}