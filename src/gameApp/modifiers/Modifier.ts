import {AttackedObject} from "../../models/AttackedObject";

/* Баф/дебаф - повышение/понижение характеристик юнитов/монстров/строений */
export class Modifier{
	readonly name: string;

	//(если надо увеличить здоровье на 10%, то healthMultiplier должен быть равен 0.1)
	//если уменьшить, то -0.1
	// 1 - будет равно увеличению на 100% (2x)
	healthMultiplier: number; //кратное увеличение здоровья
	damageInMultiplier: number; //кратное увеличение входящего урона
	damageOutMultiplier: number; //кратное увеличение исходящего урона
	speedMultiplier: number; //кратное увеличение скорости передвижения
	defenceMultiplier: number; //кратное увеличение защиты

	lifeTimeMs: number|null; //время существования (если временное)

	constructor(
		name: string,
		healthMultiplier: number,
		damageInMultiplier: number,
		damageOutMultiplier: number,
		speedMultiplier: number,
		defenceMultiplier: number,
		lifeTimeMs: number|null)
	{
		this.name = name;

		this.healthMultiplier = healthMultiplier;
		this.damageInMultiplier = damageInMultiplier;
		this.damageOutMultiplier = damageOutMultiplier;
		this.speedMultiplier = speedMultiplier;
		this.defenceMultiplier = defenceMultiplier;

		this.lifeTimeMs = lifeTimeMs;
	}

	logic(object: AttackedObject, drawsDiffMs: number, objects: AttackedObject[]): void{
		if(this.lifeTimeMs){
			this.lifeTimeMs -= drawsDiffMs;

			if(this.lifeTimeMs <= 0){
				object.modifiers = object.modifiers.filter(modifier => modifier.name != this.name);
			}
		}
	}

	destroy(): void{}

	//логика распространения 
	logicSpread(object: AttackedObject, objects: AttackedObject[]): void{}

	
	drawBehindObject(object: AttackedObject, drawsDiffMs: number){}
	drawAheadObject(object: AttackedObject, drawsDiffMs: number){}
	drawAheadObjects(object: AttackedObject, drawsDiffMs: number){}
}