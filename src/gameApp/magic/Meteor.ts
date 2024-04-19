import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';

import {ImageHandler} from '../ImageHandler';

import {Draw} from '../gameSystems/Draw';
import {AudioSystem} from '../gameSystems/AudioSystem';

import {Point} from '../../models/Point';

import {Magic} from './Magic';

import ShopItem from '../../models/ShopItem';
import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

import AnimationInfinite from '../../models/AnimationInfinite';

import BaseImage from '../../assets/img/magics/meteor/image.png';  
import ImageGif from '../../assets/img/magics/meteor/imageGif.gif';  
import AnimationImage from '../../assets/img/magics/meteor/animation.png'; 

/** Метеорит - тип магии */
export class Meteor extends Magic{
	static readonly imageHandler: ImageHandler = new ImageHandler();

	private static readonly image: HTMLImageElement = new Image(); //для отображения на панели доступа и в магазине
	private static readonly imageGif: HTMLImageElement = new Image(); //для отображения на панели доступа при наведении
	private static readonly imageAnimation: HTMLImageElement = new Image(); //картинка анимации магии
	private static readonly imageAnimationFrames: number = 4;
	private static readonly imageAnimationDuration: number = 100;
	private static readonly imageAnimationForCursor: HTMLImageElement = new Image(); //картинка анимации магии для курсора после выбора магии и до момента её активации

	static readonly shopItem: ShopItem = new ShopItem('Метеор', Meteor.image, 10, 'Вызывает падение метеорита на летающих и ходячих монстров', ShopCategoryEnum.MAGIC, 30);

	constructor(x: number, y: number)
	{
		super(x, y, 
			Meteor.name, 
			Meteor.image, 
			Meteor.imageGif, 
			new AnimationInfinite(Meteor.imageAnimationFrames, Meteor.imageAnimationFrames * Meteor.imageAnimationDuration, Meteor.imageAnimation), 
			new AnimationInfinite(Meteor.imageAnimationFrames, Meteor.imageAnimationFrames * Meteor.imageAnimationDuration, Meteor.imageAnimationForCursor), 
			new Point(-8, -40),
			null, //lifeTime
			Meteor.imageHandler);

		Meteor.init(true);
	}

	static initForShop(): void{
		Meteor.image.src = BaseImage;
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && Meteor.imageHandler.isEmpty){
			Meteor.imageHandler.new(Meteor.image).src = BaseImage;
			Meteor.imageHandler.new(Meteor.imageGif).src = ImageGif;
			Meteor.imageHandler.new(Meteor.imageAnimation).src = AnimationImage;
			Meteor.imageHandler.new(Meteor.imageAnimationForCursor).src = AnimationImage;
		}
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logic(drawsDiffMs, buildings, monsters, units, bottomShiftBorder);
	}

	draw(drawsDiffMs: number, isGameOver: boolean): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.draw(drawsDiffMs, isGameOver);
	}
}
Object.defineProperty(Meteor, "name", { value: 'Meteor', writable: false }); //fix production minification class names