/* Баф/дебаф - повышение/понижение характеристик юнитов/монстров/строений */
export class Modifier{
	name: string;

	//(если надо увеличить здоровье на 10%, то healthMultiplier должен быть равен 0.1)
	//если уменьшить, то -0.1
	// 1 - будет равно увеличению на 100% (2x)
	healthMultiplier: number; //кратное увеличение здоровья
	damageMultiplier: number; //кратное увеличение урона
	speedMultiplier: number; //кратное увеличение скорости передвижения

	timeAdded: number; //время добавления
	lifeTime: number|null; //время существования (если временное)

	constructor(
		name: string,
		healthMultiplier: number,
		damageMultiplier: number,
		speedMultiplier: number,
		lifeTime: number|null)
	{
		this.name = name;

		this.healthMultiplier = healthMultiplier;
		this.damageMultiplier = damageMultiplier;
		this.speedMultiplier = speedMultiplier;

		this.timeAdded = Date.now();
		this.lifeTime = lifeTime;
	}
}