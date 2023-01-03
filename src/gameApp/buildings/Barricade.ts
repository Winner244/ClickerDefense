import {Building} from './Building';

import {Draw} from '../gameSystems/Draw';

import {Labels} from '../labels/Labels';

import {Monster} from '../monsters/Monster';

import Improvement from '../../models/Improvement';
import ImprovementInfoItem from '../../models/ImprovementInfoItem';

import BarricadeImage from '../../assets/img/buildings/barricade/barricade.png';  
import BarricadeIronImage from '../../assets/img/buildings/barricade/barricadeIron.png';  

import SwordIcon from '../../assets/img/icons/sword.png';  
import ShieldIcon from '../../assets/img/icons/shield.png';

/** Баррикада - тип здания */
export class Barricade extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 226 * 0.7;
	static readonly height: number = 189 * 0.7;

	static readonly damageMirrorPercentage: number = 10; //количество возвращаемого монстрам урона (%)
	static readonly damageIronMirrorPercentage: number = 20; //количество возвращаемого монстрам урона от железной версии (%)
	readonly damageMirrorPercentage: number = 10; //количество возвращаемого монстрам урона (%) - у экземпляра

	static readonly improvementIronShield: number = 1; //кол-во добавляемой брони для железной версии

	static readonly improvementIron = new Improvement('Железные шипы', 100, 'Прочнее и возвращает больше урона.');

	constructor(x: number) {
		super(x, 
			(Draw.canvas ? Draw.canvas.height : 0) - Barricade.height + 10, 
			false,
			true, //isLand
			'Баррикада', 
			Barricade.image, 0, 0, Barricade.width, Barricade.height, 15,
			250, //health max
			25, // price
			'Колючая и непроходимая. Сдерживает монстров и возвращает часть полученного урона, обратно, монстрам.',
			true, true);
			
		this.maxImpulse = 2;
		this.impulseForceDecreasing = 5;
		this.improvements.push(Barricade.improvementIron);

		Barricade.init(true); //reserve
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			this.image.src = BarricadeImage;  //load image only once
		}
	}
	
	static loadResourcesAfterBuild() {
		this.improvementIron.image.src = BarricadeIronImage;
		this.improvementIron.infoItems = [
			new ImprovementInfoItem(`+${(Barricade.damageIronMirrorPercentage - Barricade.damageMirrorPercentage)}%`, SwordIcon),
			new ImprovementInfoItem(`+${Barricade.improvementIronShield}`, ShieldIcon)
		];
	}

	get centerY(){
		return this.y + this.height / 4;
	}

	applyDamage(damage: number, monster: Monster): number{
		var realDamage = super.applyDamage(damage, monster);

		var mirrorDamage = damage / 100 * this.damageMirrorPercentage;
		monster.health -= mirrorDamage;
		Labels.createMonsterDamageLabel(monster.x + monster.width / 2 + (monster.isLeftSide ? 0: -17), monster.y + monster.height / 2, '-' + mirrorDamage.toFixed(1), 3000);

		return realDamage;
	}
}