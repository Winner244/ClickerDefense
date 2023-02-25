import {Modifier} from "./Modifier";

/* Кислотный дождь
	даёт деффаб уменьшения брони и увеличение получаемого урона + постоянный урон от капель + уменьшает наносимый урон
	Создаётся монстром Necromancer
 */
export class AcidRainModifier extends Modifier{
	static readonly damageMultiplier: number = -0.1; //на 10% уменьшает урон

	constructor(lifeTimeMs: number|null) {
		super(AcidRainModifier.name, 0, AcidRainModifier.damageMultiplier, 0, lifeTimeMs); //TODO: дебаф брони на -1 + увеличение получаемого урона
	}
}