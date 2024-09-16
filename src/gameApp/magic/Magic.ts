import AnimationInfinite from '../../models/AnimationInfinite';

import {ImageHandler} from '../ImageHandler';

import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';

import {Point} from '../../models/Point';
import {UpgradableMagicObject} from '../../models/UpgradableMagicObject';

import {Helper} from '../helpers/Helper';


/** Базовый класс для всей активной магии */
export class Magic extends UpgradableMagicObject{
	readonly imageHandler: ImageHandler; //управление lazy загрузкой картинок и их готовности к отображению
	readonly id: string;
	
	x: number;
	y: number;
	imageGif: HTMLImageElement; //для отображения на панели доступа при наведении
	animation: AnimationInfinite; //анимация магии в действии
	animationForCursor: AnimationInfinite; //анимация магии для курсора после выбора магии и до момента её активации
	shiftAnimationForCursor: Point; //сдвиг для анимации для курсора
	leftTime: number|null; //оставшееся время жизни магии
	size: number; //множитель размера (1 - оригинальный)
	isEnd: boolean; //действие магии закончено ?
	timeRecoveryLeftMs: number; //оставшееся время восстановления магии (миллисекунды)

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
		timeRecoveryMs: number,
		imageHandler: ImageHandler,
		price: number)
	{
		super(name, image, timeRecoveryMs, price);

		this.id = Helper.generateUid();
		this.x = x;
		this.y = y;
		this.size = size;
		this.imageGif = imageGif;
		this.animation = animation;
		this.animationForCursor = animationForCursor;
		this.shiftAnimationForCursor = shiftAnimationForCursor;
		this.leftTime = lifeTime;
		this.imageHandler = imageHandler;
		this.isEnd = false;
		this.timeRecoveryLeftMs = 0;
	}

	get height(): number{
		return this.animation.image.height * this.size;
	}

	get width(): number{
		return this.animation.image.width / this.animation.frames * this.size;
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
		
		this.animation.draw(drawsDiffMs, isGameOver, this.x, this.y, this.animation.image.width / this.animation.frames * this.size, this.animation.image.height * this.size);
	}

	restartTimeRecovery(){
		this.timeRecoveryLeftMs = this.timeRecoveryMs;
	}

	displayMagicOnCursor(drawsDiffMs: number, pointStart: Point|null, cursorMagicWidth: number, cursorMagicHeight: number){}
}