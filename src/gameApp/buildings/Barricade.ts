import {Building} from './Building';

import {Draw} from '../gameSystems/Draw';

import {ImageHandler} from '../ImageHandler';

import {AttackedObject} from '../../models/AttackedObject';

import Improvement from '../../models/Improvement';
import ImprovementParameterItem from '../../models/ImprovementParameterItem';
import ParameterItem from '../../models/ParameterItem';
import ShopItem from '../../models/ShopItem';

import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

import BarricadeImage from '../../assets/img/buildings/barricade/barricade.png';  
import BarricadeIronImage from '../../assets/img/buildings/barricade/barricadeIron.png';  

import SwordIcon from '../../assets/img/icons/sword.png';  
import ShieldIcon from '../../assets/img/icons/shield.png';
import HealthIcon from '../../assets/img/icons/health.png';

/** Баррикада - тип здания */
export class Barricade extends Building{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	static readonly image: HTMLImageElement = new Image();

	static readonly damageMirrorPercentage: number = 10; //количество возвращаемого монстрам урона (%)
	static readonly damageIronMirrorPercentage: number = 20; //количество возвращаемого монстрам урона от железной версии (%)
	damageMirrorPercentage: number = 10; //количество возвращаемого монстрам урона (%) - у экземпляра

	static readonly improvementIronShield: number = 1; //кол-во добавляемой брони для железной версии

	static readonly shopItem: ShopItem = new ShopItem('Баррикада', Barricade.image, 25, 'Колючая и непроходимая. Сдерживает монстров и возвращает часть полученного урона, обратно, монстрам.', ShopCategoryEnum.BUILDINGS, 20);

	constructor(x: number) {
		super(x, 
			(Draw.canvas ? Draw.canvas.height : 0) - Barricade.image.height * 0.7 + 10, 
			false,
			true, //isLand
			Barricade.name, 0.7,
			Barricade.image, 0, 0, 15,
			250, //health max
			Barricade.shopItem.price, 
			true, true,
			Barricade.imageHandler);
			
		this.maxImpulse = 2;
		this.impulseForceDecreasing = 5;
		this.shopItemName = Barricade.shopItem.name;

		Barricade.init(true); //reserve
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && Barricade.imageHandler.isEmpty){
			Barricade.imageHandler.new(Barricade.image).src = BarricadeImage;
		}
	}
	
	static loadResourcesAfterBuild() {}

	loadedResourcesAfterBuild(){
		super.loadedResourcesAfterBuild();

		this.infoItems.splice(1, 0, new ParameterItem('Возврат урона', () => this.damageMirrorPercentage + '%', SwordIcon));

		this.improvements.push(new Improvement('Железные шипы', 100, BarricadeIronImage, () => this.impoveToIron(), [
			new ImprovementParameterItem(`+${(Barricade.damageIronMirrorPercentage - Barricade.damageMirrorPercentage)}%`, SwordIcon),
			new ImprovementParameterItem(`+${Barricade.improvementIronShield}`, ShieldIcon),
		]));
	}

	impoveToIron(){
		this.defense += Barricade.improvementIronShield;
		this.damageMirrorPercentage = Barricade.damageIronMirrorPercentage;
		this.image = new Image();
		this.image.src = BarricadeIronImage;
	}

	get centerY(){
		return this.y + this.height / 4;
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null, attackingObject: AttackedObject|null = null): number{
		if(damage <= 0){
			return 0;
		}

		var realDamage = super.applyDamage(damage, x, y, attackingObject);

		if(attackingObject){
			var mirrorDamage = damage / 100 * this.damageMirrorPercentage;
			if(mirrorDamage > 0){
				attackingObject.applyDamage(mirrorDamage, attackingObject.x + attackingObject.width / 2 + (attackingObject.isLeftSide ? 0: -17), attackingObject.y + attackingObject.height / 2);
			}
		}

		return realDamage;
	}
}
Object.defineProperty(Barricade, "name", { value: 'Barricade', writable: false }); //fix production minification class names