import AnimationInfinite from '../../models/AnimationInfinite';

import {ImageHandler} from '../ImageHandler';

import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';

import {Helper} from '../helpers/Helper';


/** Базовый класс для всей активной магии */
export class Magic{
	readonly imageHandler: ImageHandler; //управление lazy загрузкой картинок и их готовности к отображению
	readonly id: string;
	
	x: number;
	y: number;
	name: string;
	image: HTMLImageElement; //для отображения на панели доступа и в магазине
	animation: AnimationInfinite; //анимация магии в действии
	leftTime: number|null; //оставшееся время жизни магии

	constructor(
		x: number, 
		y: number, 
		name: string, 
		image: HTMLImageElement, 
		animation: AnimationInfinite, 
		lifeTime: number|null,
		imageHandler: ImageHandler)
	{
		this.id = Helper.generateUid();
		this.x = x;
		this.y = y;
		this.name = name;
		this.image = image;
		this.animation = animation;
		this.leftTime = lifeTime;
		this.imageHandler = imageHandler;
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}
	}

	draw(drawsDiffMs: number, isGameOver: boolean): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}
		
		this.animation.draw(drawsDiffMs, false, this.x, this.y);
	}
}