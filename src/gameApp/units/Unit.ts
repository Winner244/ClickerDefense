import {FireModifier} from '../gameApp/modifiers/FireModifier';
import {Modifier} from '../gameApp/modifiers/Modifier';
import {AcidRainModifier} from '../gameApp/modifiers/AcidRainModifier';

import {Labels} from '../gameApp/labels/Labels';

import {Draw} from '../gameApp/gameSystems/Draw';

import {ImageHandler} from '../gameApp/ImageHandler';

import {Helper} from '../helpers/Helper';

import {AttackedObject} from '../../models/AttackedObject';


/** Базовый класс для всех Юнитов пользователя */
export class Unit {
	readonly imageHandler: ImageHandler; //управление lazy загрузкой картинок и их готовности к отображению
	readonly id: string;
	
	name: string;

	image: HTMLImageElement;
	filteredImages: { [Key: string]: OffscreenCanvas };

	initialHealthMax: number; //изначальный максимум хп
	healthMax: number; //максимум хп
	health: number;
	defense: number = 0; //защита (уменьшает урон)
	
	isLeftDirection: boolean; // движется налево?

	x: number;
	y: number;


	modifiers: Modifier[]; //бафы/дебафы

	constructor(x: number, y: number, healthMax: number, image: HTMLImageElement, name: string, imageHandler: ImageHandler)
	{
		this.id = Helper.generateUid();

		this.image = image;

		this.initialHealthMax = this.healthMax = this.health = healthMax; //максимум хп

		this.isLeftDirection = false; // движется налево?

		this.x = x;
		this.y = y;

		this.name = name;

		this.imageHandler = imageHandler;

		this.filteredImages = {};

		this.modifiers = [];
	}

	get height(): number {
		return this.image.height;
	}
	get width(): number {
		return this.image.width;
	}

	get shiftXForCenter(){
		return 0;
	}
	get shiftYForCenter(){
		return 0;
	}

	get centerX(): number {
		return this.x + this.width / 2;
	}
	get centerY(): number {
		return this.y + this.height / 2;
	}
	
	logicBase(drawsDiffMs: number, monsters: AttackedObject[], bottomBorder: number): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		this.modifiers.forEach(modifier => modifier.logic(this, drawsDiffMs, monsters));
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null): number{
		if(damage <= 0){
			console.error('negative damage', damage);
			return 0;
		}

		let defense = Math.max(0, this.defense + this.defense * this.modifiers.reduce((sum, el) => sum + el.defenceMultiplier, 0));
		let damageMultiplier = Helper.sum(this.modifiers, (modifier: Modifier) => modifier.damageInMultiplier);

		const realDamage = Math.max(0, damage + damage * damageMultiplier - defense);
		if(realDamage <= 0){
			return 0;
		}
		
		this.health -= realDamage;
		Labels.createDamageLabel(x || this.centerX, y || this.centerY, '-' + realDamage.toFixed(1), 3000);
		return realDamage;
	}

	destroy(): void{
		this.modifiers.forEach(modifier => modifier.destroy());
	}

	addModifier(newModifier: Modifier): void{
		const existedModifier = this.modifiers.find(modifier => modifier.name == newModifier.name);
		if(existedModifier){
			if(existedModifier instanceof FireModifier && newModifier instanceof FireModifier){
				existedModifier.fireDamageInSecond = Math.max(existedModifier.fireDamageInSecond || 0, newModifier.fireDamageInSecond || 0);
				existedModifier.lifeTimeMs = Math.max(existedModifier.lifeTimeMs || 0, newModifier.lifeTimeMs || 0);
			}
			else{
				existedModifier.damageOutMultiplier += newModifier.damageOutMultiplier;
				existedModifier.damageInMultiplier += newModifier.damageInMultiplier;
				existedModifier.healthMultiplier += newModifier.healthMultiplier;
				existedModifier.speedMultiplier += newModifier.speedMultiplier;
			}
		}
		else{
			this.modifiers.push(newModifier);
		}
	}

	drawBase(drawsDiffMs: number, isGameOver: boolean, x: number|null = null, y: number|null = null, filter: string|null = null){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		this.modifiers.forEach(modifier => modifier.drawBehindObject(this, drawsDiffMs));
		const isAcidRain = this.modifiers.find(x => x.name == AcidRainModifier.name);
		if(isAcidRain){
			filter = 'hue-rotate(40deg)';
		}


		x = x ?? this.x;
		y = y ?? this.y;
		let isInvert = !this.isLeftDirection;
		let invertSign = isInvert ? -1 : 1;

		if(isInvert){
			Draw.ctx.save();
			Draw.ctx.scale(-1, 1);
		}

		this.drawObject(drawsDiffMs, isGameOver, invertSign, x, y, filter);

		if(isInvert){
			Draw.ctx.restore();
		}

		this.modifiers.forEach(modifier => modifier.drawAheadObject(this, drawsDiffMs));
	}

	drawModifiersAhead(drawsDiffMs: number, isGameOver: boolean){
		this.modifiers.forEach(modifier => modifier.drawAheadObjects(this, drawsDiffMs));
	}

	drawObject(drawsDiffMs: number, isGameOver: boolean, invertSign: number = 1, x: number|null = null, y: number|null = null, filter: string|null = null){
		x = x ?? this.x;
		y = y ?? this.y;
		if(filter){
			if(filter in this.filteredImages){
				Draw.ctx.drawImage(this.filteredImages[filter], invertSign * x, y, invertSign * this.width, this.height);
			}
			else {
				//create filtered image
				this.filteredImages[filter] = new OffscreenCanvas(this.width, this.height);
				let context = this.filteredImages[filter].getContext('2d');
				if(context){
					context.filter = filter;
					context.drawImage(this.image, 0, 0, this.width, this.height);
				}
				else{
					console.error('offscreen context to fileting image is empty!');
				}
			}
		}
		else {
			Draw.ctx.drawImage(this.image, invertSign * x, y, invertSign * this.width, this.height);
		}
	}

	drawHealthBase(x: number|null = null, y: number|null = null, width: number|null = null): void{
		x = x ?? this.x;
		y = y ?? this.y;
		width = width ?? this.width;

		if(this.health < this.healthMax && this.health > 0){
			Draw.drawHealth(x, y, width, this.healthMax, this.health);
		}
	}
}