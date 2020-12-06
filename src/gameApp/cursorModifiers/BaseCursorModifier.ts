import AnimationInfinite from '../../models/animations/AnimationInfinite';

import {ImageHandler} from '../ImageHandler';

import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';

import {Mouse} from '../gamer/Mouse';

import ParameterItem from '../../models/shop/ParameterItem';
import Improvement from '../../models/shop/Improvement';

import {IUpgradableObject} from '../../models/shop/IUpgradableObject';


/** базовый класс улучшения курсора */
export class BaseCursorModifier implements IUpgradableObject {
	readonly imageHandler: ImageHandler; //управление lazy загрузкой картинок и их готовности к отображению
	
	name: string;
	shopName: string; //нужно для связи с Shop логикой
	size: number; //множитель размера (1 - оригинальный)
	image: HTMLImageElement; //для отображения в магазине
	imageForDefaultCursor: HTMLImageElement|AnimationInfinite|null; //для отображения вместо курсора по умолчанию
	imageForSwordCursor: HTMLImageElement|AnimationInfinite|null; //для отображения вместо курсора наведения на монстра
	imageForSwordAttackCursor: HTMLImageElement|AnimationInfinite|null; //для отображения вместо курсора нажатия на монстра
	infoItems: ParameterItem[];  //информация отображаемая в окне 
	improvements: Improvement[]; //улучшения объекта
	isDisplayedUpgradeWindow: boolean = false; //открыто ли в данный момент окно по апгрейду данного объекта? если да, то нужно подсвечивать данный объект
	price: number;
	isUseNotHardwareCursor: boolean; //false - использовать курсор системы, true - курсор будет отключён, а на экране будет отображаться canvas курсор
	
	animation: AnimationInfinite; //анимация магии курсора в действии

	constructor(
		name: string,
		shopName: string,
		image: HTMLImageElement,
		imageForDefaultCursor: HTMLImageElement|AnimationInfinite|null,
		imageForSwordCursor: HTMLImageElement|AnimationInfinite|null,
		imageForSwordAttackCursor: HTMLImageElement|AnimationInfinite|null,
		animation: AnimationInfinite, 
		imageHandler: ImageHandler,
		price: number,
		isUseNotHardwareCursor: boolean)
	{
		this.name = name;
		this.shopName = shopName;
		this.size = 1;
		this.image = image;
		this.imageForDefaultCursor = imageForDefaultCursor;
		this.imageForSwordCursor = imageForSwordCursor;
		this.imageForSwordAttackCursor = imageForSwordAttackCursor;
		this.animation = animation;
		this.imageHandler = imageHandler;
		this.infoItems = [];
		this.improvements = [];
		this.price = price;
		this.isUseNotHardwareCursor = isUseNotHardwareCursor;
	}

	get height(): number{
		return this.animation.image.height * this.size;
	}

	get width(): number{
		return this.animation.image.width / this.animation.frames * this.size;
	}

	clickByMonster(monster: Monster){
		
	}

	click(isHoverFound: boolean, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}
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
		
		this.animation.draw(drawsDiffMs, isGameOver, Mouse.canvasX, Mouse.canvasY, this.width, this.height);
	}
}