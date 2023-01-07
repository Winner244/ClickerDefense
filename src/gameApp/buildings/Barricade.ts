import {Building} from './Building';

import {Draw} from '../gameSystems/Draw';

import {Labels} from '../labels/Labels';

import {Monster} from '../monsters/Monster';

import Improvement from '../../models/Improvement';
import ImprovementParameterItem from '../../models/ImprovementParameterItem';

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
	damageMirrorPercentage: number = 10; //количество возвращаемого монстрам урона (%) - у экземпляра

	static readonly improvementIronShield: number = 1; //кол-во добавляемой брони для железной версии

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

		Barricade.init(true); //reserve
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			this.image.src = BarricadeImage;  //load image only once
		}
	}
	
	static loadResourcesAfterBuild() {}

	loadedResourcesAfterBuild(){
		super.loadedResourcesAfterBuild();

		this.improvements.push(new Improvement('Железные шипы', 100, BarricadeIronImage, () => this.impoveToIron(), [
			new ImprovementParameterItem(`+${(Barricade.damageIronMirrorPercentage - Barricade.damageMirrorPercentage)}%`, SwordIcon),
			new ImprovementParameterItem(`+${Barricade.improvementIronShield}`, ShieldIcon)
		]));
	}

	impoveToIron(){
		this.defense += Barricade.improvementIronShield;
		this.damageMirrorPercentage = Barricade.damageIronMirrorPercentage;
		this.image.src = BarricadeIronImage;
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