import {Helper} from '../gameApp/helpers/Helper';

import {FireModifier} from '../gameApp/modifiers/FireModifier';
import {Modifier} from '../gameApp/modifiers/Modifier';

/** атакуемый объект (Монстр или Строение) */
export class AttackedObject {
	readonly id: string;
	
	name: string;

	initialHealthMax: number; //изначальный максимум хп
	healthMax: number; //максимум хп
	health: number;
	
	isLeftSide: boolean; // с левой стороны ? (если это не центральное здание)
	isLand: boolean; //наземное? (иначе - воздушное)

	scaleSize: number; //1 - размер монстра по размеру картинки, 0.5 - монстр в 2 раза меньше картинки по высоте и ширине, 1.5 - монстр в 2 раза больше.

	reduceHover: number; //на сколько пикселей уменьшить зону наведения?

	x: number;
	y: number;


	modifiers: Modifier[]; //бафы/дебафы

	constructor(x: number, y: number, healthMax: number, scaleSize: number, isLeftSide: boolean, isLand: boolean, reduceHover: number, name: string){
		this.id = Helper.generateUid();

		this.initialHealthMax = this.healthMax = this.health = healthMax; //максимум хп

		this.isLeftSide = isLeftSide; // с левой стороны движется?
		this.isLand = isLand; //наземный?

		this.scaleSize = scaleSize;

		this.reduceHover = reduceHover; //на сколько пикселей уменьшить зону наведения?

		this.x = x;
		this.y = y;

		this.name = name;


		this.modifiers = [];
	}

	addModifier(newModifier: Modifier): void{
		const existedModifier = this.modifiers.find(modifier => modifier.name == newModifier.name);
		if(existedModifier){
			if(existedModifier instanceof FireModifier && newModifier instanceof FireModifier){
				existedModifier.fireDamageInSecond = Math.max(existedModifier.fireDamageInSecond || 0, newModifier.fireDamageInSecond || 0);
				existedModifier.lifeTimeMs = Math.max(existedModifier.lifeTimeMs || 0, newModifier.lifeTimeMs || 0);
			}
			else{
				existedModifier.damageMultiplier += newModifier.damageMultiplier;
				existedModifier.healthMultiplier += newModifier.healthMultiplier;
				existedModifier.speedMultiplier += newModifier.speedMultiplier;
			}
		}
		else{
			this.modifiers.push(newModifier);
		}
	}
}