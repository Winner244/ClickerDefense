import {Building} from './Building';

import {Draw} from '../gameSystems/Draw';

import {ImageHandler} from '../ImageHandler';

import {AttackedObject} from '../../models/AttackedObject';

import Animation from '../../models/animations/Animation';
import AnimationInfinite from '../../models/animations/AnimationInfinite';

import {WavesState} from '../WavesState';

import {FireModifier} from '../modifiers/FireModifier';

import PileStoneImage from '../../assets/img/buildings/pileStones/pileStones.png';  
import PileStoneHotImage from '../../assets/img/buildings/pileStones/pileStonesHot.png';  

/** Груда камней - остаётся от Метеорита */
export class PileStones extends Building{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	static readonly image: HTMLImageElement = new Image();
	static readonly imageHot: HTMLImageElement = new Image();

	isHot: boolean = false; //раскалённая глыба камней ?

	fireDamageInSecondPercentage: number; //урона от раскалённых камней в секунду (в процентах от максимальных хп монстра)
	fireDamageInSecondMinimal: number; //урона от раскалённых камней в секунду (минимальный)
	fireDamageDuration: number; //время горения монстров от удара по раскалённым камням
	damageCoreMirrorPercentage: number; //количество возвращаемого монстрам урона при ударе по раскалённым камням(%)

	constructor(x: number, scale: number, maxHealth: number, isHot: boolean, 
		fireDamageInSecondMinimal: number, 
		fireDamageInSecondPercentage: number,
		fireDamageDuration: number,
		damageCoreMirrorPercentage: number) 
	{
		super(x, 
			(Draw.canvas ? Draw.canvas.height : 0) - PileStones.image.height * scale + PileStones.image.height * scale / 10, 
			false,
			true, //isLand
			PileStones.name, "", scale,
			isHot ? PileStones.imageHot : PileStones.image, 0, 0, 15,
			maxHealth,
			0, 
			true, true,
			PileStones.imageHandler);
			
		this.maxImpulse = 1.2;
		this.isSupportRecovery = false;
		this.isSupportUpgrade = false;
		this.isHot = isHot;
		this.isFixedY = true;

		this.fireDamageInSecondPercentage = fireDamageInSecondPercentage;
		this.fireDamageInSecondMinimal = fireDamageInSecondMinimal;
		this.fireDamageDuration = fireDamageDuration;
		this.damageCoreMirrorPercentage = damageCoreMirrorPercentage;

		PileStones.init(true); //reserve

		if(isHot){
			FireModifier.loadResources();
		}
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && PileStones.imageHandler.isEmpty){
			PileStones.imageHandler.new(PileStones.image).src = PileStoneImage;
			PileStones.imageHandler.new(PileStones.imageHot).src = PileStoneHotImage;
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

		if(this.isHot && attackingObject){
			var mirrorDamage = damage / 100 * this.damageCoreMirrorPercentage;
			if(mirrorDamage > 0){
				attackingObject.applyDamage(mirrorDamage, attackingObject.x + attackingObject.width / 2 + (attackingObject.isLeftSide ? 0: -17), attackingObject.y + attackingObject.height / 2);
				attackingObject.addModifier(new FireModifier(this.fireDamageInSecondMinimal, this.fireDamageInSecondPercentage, this.fireDamageDuration));
			}
		}

		return realDamage;
	}

	drawObject(drawsDiffMs: number, imageOrAnimation: AnimationInfinite | Animation | HTMLImageElement | OffscreenCanvas, isGameOver: boolean, invertSign?: number, x?: number | null, y?: number | null, filter?: string | null, isInvertAnimation?: boolean): void {
		//исчезновение после окончания волны
		if(WavesState.isWaveEnded && WavesState.delayEndLeftTimeMs > 0){
			Draw.ctx.globalAlpha = WavesState.delayEndLeftTimeMs / WavesState.delayEndTimeMs;
		}
		super.drawObject(drawsDiffMs, imageOrAnimation, isGameOver, invertSign, x, y, filter, isInvertAnimation);
		Draw.ctx.globalAlpha = 1;
	}

	drawHealth(){
		//исчезновение после окончания волны
		if(!WavesState.isWaveEnded){
			super.drawHealth();
		}
	}
}
Object.defineProperty(PileStones, "name", { value: 'PileStones', writable: false }); //fix production minification class names