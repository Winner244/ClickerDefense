import { Monster } from "../monsters/Monster";

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

	logic(monster: Monster, drawsDiffMs: number, monsters: Monster[]): void{
		if(this.lifeTimeMs){
			this.lifeTimeMs -= drawsDiffMs;

			if(this.lifeTimeMs <= 0){
				monster.modifiers = monster.modifiers.filter(modifier => modifier.name != this.name);
			}
		}
	}

	//логика распространения 
	logicSpread(monster: Monster, monsters: Monster[]): void{}

	
	drawBehindMonster(monster: Monster, drawsDiffMs: number){}
	drawAheadMonster(monster: Monster, drawsDiffMs: number){}
}