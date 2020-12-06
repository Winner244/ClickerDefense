import {Modifier} from "./Modifier";

/* Используется магией Meteor в момент удара о землю - для отключения звуков исчезновения монстров - для предотвращения звукогого коллапса в момент гибели множества монстров
	ничего не даёт
 */
export class MassDamageModifier extends Modifier{
	constructor() {
		super(MassDamageModifier.name, 0, 0, 0, 0, 0, 100);
	}
}
Object.defineProperty(MassDamageModifier, "name", { value: 'MassDamageModifier', writable: false }); //fix production minification class names