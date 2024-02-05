import {Helper} from '../gameApp/helpers/Helper';

import AnimationInfinite from './AnimationInfinite';

import {FireModifier} from '../gameApp/modifiers/FireModifier';
import {Modifier} from '../gameApp/modifiers/Modifier';
import {AcidRainModifier} from '../gameApp/modifiers/AcidRainModifier';

import {Labels} from '../gameApp/labels/Labels';

import {Draw} from '../gameApp/gameSystems/Draw';

import {ImageHandler} from '../gameApp/ImageHandler';

import Animation from './Animation';


/** атакуемый объект (Монстр или Строение) */
export class AttackedObject {
	readonly imageHandler: ImageHandler; //управление lazy загрузкой картинок и их готовности к отображению
	readonly id: string;
	
	name: string;
	shopItemName: string|null; //нужно для связи с Shop логикой

	image: HTMLImageElement;
	animation: AnimationInfinite|null;

	initialHealthMax: number; //изначальный максимум хп
	healthMax: number; //максимум хп
	defense: number = 0; //защита (уменьшает урон)
	
	get health(): number{
		return this._health;
	}
	set health(value: number){
		if(value < this._health){
			this.applyDamage(this._health - value);
		}
		else{
			this._health = value;
		}
	}
	protected _health: number;

	isLeftSide: boolean; // с левой стороны ? (если это не центральное здание) isRightMoving?
	isLand: boolean; //наземное? (иначе - воздушное)

	scaleSize: number; //1 - размер монстра по размеру картинки, 0.5 - монстр в 2 раза меньше картинки по высоте и ширине, 1.5 - монстр в 2 раза больше.

	reduceHover: number; //на сколько пикселей уменьшить зону наведения для игрока?

	x: number;
	y: number;

	modifiers: Modifier[]; //бафы/дебафы

	maxImpulse: number; //максимальное значение импульса 
	impulseForceDecreasing: number; //сила уменьшения импульса
	
	//технические поля экземпляра
	protected _impulseX: number; //импульс от сверх ударов и сотрясений
	protected _impulseY: number; //импульс от сверх ударов и сотрясений по оси Y


	constructor(x: number, y: number, healthMax: number, scaleSize: number, image: HTMLImageElement, isLeftSide: boolean, isLand: boolean, reduceHover: number, name: string, imageHandler: ImageHandler,
		frames: number, 
		animationDurationMs: number)
	{
		this.id = Helper.generateUid();

		this.animation = frames > 1 
			? new AnimationInfinite(frames, animationDurationMs, image) 
			: null;
		this.image = image;

		this.initialHealthMax = this.healthMax = this._health = healthMax; //максимум хп

		this.isLeftSide = isLeftSide; // с левой стороны движется?
		this.isLand = isLand; //наземный?

		this.scaleSize = scaleSize;

		this.reduceHover = reduceHover; //на сколько пикселей уменьшить зону наведения?

		this.x = x;
		this.y = y;

		this.name = name;

		this.imageHandler = imageHandler;

		this.modifiers = [];

		this.maxImpulse = 0; //отключён по умолчанию
		this.impulseForceDecreasing = 1;

		this._impulseX = 0;
		this._impulseY = 0;

		this.shopItemName = null;
	}

	get height(): number {
		if(this.animation){
			return this.width / ((this.animation.image.width || 1) / this.animation.frames) * (this.animation.image.height || 1);
		}

		return this.image.height * this.scaleSize;
	}
	get width(): number {
		if(this.animation){
			return this.animation.image.width / this.animation.frames * this.scaleSize;
		}

		return this.image.width * this.scaleSize;
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

	public set impulseX(value: number){
		if(value > this.maxImpulse){
			value = this.maxImpulse;
		}
		if(value < this.maxImpulse * -1){
			value = this.maxImpulse * -1;
		}

		this._impulseX = value <= 1 && value >= -1 ? 0 : value;
	}
	public get impulseX(): number{
		if(this._impulseX >= -1 && this._impulseX <= 1){
			return 0;
		}

		return this._impulseX;
	}
	
	logicBase(drawsDiffMs: number): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(this._impulseX < -1 || this._impulseX > 1){
			this._impulseX -= drawsDiffMs / 1000 * (this._impulseX * this.impulseForceDecreasing);
		}
		
		if(this._impulseY > 1){
			this._impulseY -= drawsDiffMs / 1000 * (Math.max(this._impulseY, 1) * this.impulseForceDecreasing);
			this.y -= this._impulseY / drawsDiffMs;
		}

		this.modifiers.forEach(modifier => modifier.logic(this, drawsDiffMs));
	}

	applyDamage(damage: number, x: number|null = null, y: number|null = null, attackingObject: AttackedObject|null = null): number{
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
		
		this._health -= realDamage;
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

	get isInvertDraw(): boolean{
		return  this.isLeftSide;
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
		let isInvert = this.isInvertDraw;
		let invertSign = isInvert ? -1 : 1;

		if(isInvert){
			Draw.ctx.save();
			Draw.ctx.scale(-1, 1);
		}

		this.drawObject(drawsDiffMs, this.animation ?? this.image, isGameOver, invertSign, x, y, filter);

		if(isInvert){
			Draw.ctx.restore();
		}

		this.modifiers.forEach(modifier => modifier.drawAheadObject(this, drawsDiffMs));
	}

	drawModifiersAhead(drawsDiffMs: number, isGameOver: boolean){
		this.modifiers.forEach(modifier => modifier.drawAheadObjects(this, drawsDiffMs));
	}

	drawObject(drawsDiffMs: number, imageOrAnimation: AnimationInfinite|Animation|HTMLImageElement|ImageBitmap, 
		isGameOver: boolean, invertSign: number = 1, x: number|null = null, y: number|null = null, filter: string|null = null,
		isInvertAnimation: boolean = false){
		x = x ?? this.x;
		y = y ?? this.y;
		if(imageOrAnimation instanceof ImageBitmap){ //without filter (ImageBitmap doesn't have any specific parameters as name, src, path, size....)
			Draw.ctx.drawImage(imageOrAnimation, invertSign * x, y, invertSign * this.width, this.height);
		}
		else if(imageOrAnimation instanceof HTMLImageElement){
			let image = Draw.getFilteredImage(filter, imageOrAnimation, this.width, this.height);
			Draw.ctx.drawImage(image, invertSign * x, y, invertSign * this.width, this.height);
		}
		else{
			imageOrAnimation.draw(drawsDiffMs, isGameOver, invertSign * x, y, invertSign * this.width, this.height, filter, isInvertAnimation);
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