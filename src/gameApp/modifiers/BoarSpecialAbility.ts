import {Modifier} from "../gameObjects/Modifier";

/* Используется монстром Boar */
export class BoarSpecialAbility extends Modifier{
	constructor() {
		super(BoarSpecialAbility.name, 0, 0, 1, null);
	}
}