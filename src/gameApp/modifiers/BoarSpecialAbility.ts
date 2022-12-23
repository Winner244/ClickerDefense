import {Modifier} from "./Modifier";

/* Используется монстром Boar 
 * даёт x2 скорость
 */
export class BoarSpecialAbility extends Modifier{
	constructor() {
		super(BoarSpecialAbility.name, 0, 0, 1, null);
	}
}