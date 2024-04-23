import AnimationInfinite from '../../models/AnimationInfinite';

import {ImageHandler} from '../ImageHandler';

import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';

import {Point} from '../../models/Point';

import {Helper} from '../helpers/Helper';


/** Базовый класс для всей активной магии */
export class Magic{
	readonly imageHandler: ImageHandler; //управление lazy загрузкой картинок и их готовности к отображению
	readonly id: string;
	
	x: number;
	y: number;
	name: string;
	image: HTMLImageElement; //для отображения на панели доступа и в магазине
	imageGif: HTMLImageElement; //для отображения на панели доступа при наведении
	animation: AnimationInfinite; //анимация магии в действии
	animationForCursor: AnimationInfinite; //анимация магии для курсора после выбора магии и до момента её активации
	shiftAnimationForCursor: Point; //сдвиг для анимации для курсора
	leftTime: number|null; //оставшееся время жизни магии
	size: number; //множитель размера (1 - оригинальный)

	constructor(
		x: number, 
		y: number,
		size: number, 
		name: string, 
		image: HTMLImageElement, 
		imageGif: HTMLImageElement, 
		animation: AnimationInfinite, 
		animationForCursor: AnimationInfinite, 
		shiftAnimationForCursor: Point,
		lifeTime: number|null,
		imageHandler: ImageHandler)
	{
		this.id = Helper.generateUid();
		this.x = x;
		this.y = y;
		this.size = size;
		this.name = name;
		this.image = image;
		this.imageGif = imageGif;
		this.animation = animation;
		this.animationForCursor = animationForCursor;
		this.shiftAnimationForCursor = shiftAnimationForCursor;
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
		
		this.animation.draw(drawsDiffMs, false, this.x, this.y, this.animation.image.width * this.size, this.animation.image.height * this.size);
	}

	drawTrajectory(drawsDiffMs: number, pointStart: Point|null){}
}