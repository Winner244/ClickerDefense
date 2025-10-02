import {Building} from './Building';

import {Draw} from '../gameSystems/Draw';

import {ImageHandler} from '../ImageHandler';

import {AttackedObject} from '../../models/AttackedObject';

import PileStoneImage from '../../assets/img/buildings/pileStones/pileStones.png';  

/** Груда камней - остаётся от Метеорита */
export class PileStones extends Building{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	static readonly image: HTMLImageElement = new Image();

	constructor(x: number, scale: number, maxHealth: number) {
		super(x, 
			(Draw.canvas ? Draw.canvas.height : 0) - PileStones.image.height * scale + (maxHealth * 3 - 50 * 3), 
			false,
			true, //isLand
			PileStones.name, scale,
			PileStones.image, 0, 0, 15,
			maxHealth,
			0, 
			true, true,
			PileStones.imageHandler);
			
		this.maxImpulse = 2;

		PileStones.init(true); //reserve
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && PileStones.imageHandler.isEmpty){
			PileStones.imageHandler.new(PileStones.image).src = PileStoneImage;
		}
	}
	
	static loadResourcesAfterBuild() {}

	loadedResourcesAfterBuild(){
		super.loadedResourcesAfterBuild();
	}

	get centerY(){
		return this.y + this.height / 4;
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null, attackingObject: AttackedObject|null = null): number{
		if(damage <= 0){
			return 0;
		}

		var realDamage = super.applyDamage(damage, x, y, attackingObject);
		return realDamage;
	}
}
Object.defineProperty(PileStones, "name", { value: 'PileStones', writable: false }); //fix production minification class names