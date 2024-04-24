import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';

import {ImageHandler} from '../ImageHandler';

import {Helper} from '../helpers/Helper';

import {Mouse} from '../gamer/Mouse';

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
	static readonly distanceBetweenToAddAngle: number = 30; //дистанция между нажатой мышей и текущим положением мыши, при котором появляется возможность менять наклон падения метеорита
	static readonly minHorizontalAngle: number = 10; //минимальный угол наклона от горизонта

	static readonly imageHandler: ImageHandler = new ImageHandler();

	private static readonly image: HTMLImageElement = new Image(); //для отображения на панели доступа и в магазине
	private static readonly imageGif: HTMLImageElement = new Image(); //для отображения на панели доступа при наведении
	private static readonly imageAnimation: HTMLImageElement = new Image(); //картинка анимации магии
	private static readonly imageAnimationFrames: number = 4;
	private static readonly imageAnimationDuration: number = 100;
	private static readonly imageAnimationForCursor: HTMLImageElement = new Image(); //картинка анимации магии для курсора после выбора магии и до момента её активации

	static readonly shopItem: ShopItem = new ShopItem('Метеор', Meteor.image, 10, 'Вызывает падение метеорита на летающих и ходячих монстров', ShopCategoryEnum.MAGIC, 30);

	private angle: number;
	private dx: number;
	private dy: number;
	private speed: number;
	private isEndLogic: boolean;

	static readonly initialSize: number = 0.5;
	static readonly initialSpeed: number = 0.3;

	constructor(x: number, angle: number, size: number|null = null)
	{
		super(0, 0, 
			size || Meteor.initialSize,
			Meteor.name, 
			Meteor.image, 
			Meteor.imageGif, 
			new AnimationInfinite(Meteor.imageAnimationFrames, Meteor.imageAnimationFrames * Meteor.imageAnimationDuration, Meteor.imageAnimation), 
			new AnimationInfinite(Meteor.imageAnimationFrames, Meteor.imageAnimationFrames * Meteor.imageAnimationDuration, Meteor.imageAnimationForCursor), 
			new Point(-8, -40),
			null, //lifeTime
			Meteor.imageHandler);
		
		this.speed = Meteor.initialSpeed;
		this.angle = angle - 45;
		this.dx = angle;  //0 - it is bottom, 90 - it is right, 360-90 it is left, 180 it is top
		this.dy = 1;
		this.x = x - this.animation.image.width / this.animation.frames * this.size / 2;
		this.y = -this.animation.image.height * this.size;
		this.isEndLogic = false;

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

		if(this.isEndLogic){
			return;
		}

		this.x += this.dx * this.speed * drawsDiffMs;
		this.y += this.dy * this.speed * drawsDiffMs;

		if(this.y + this.animation.image.height * this.size / 1.2 > Draw.canvas.height - bottomShiftBorder){
			//TODO: урон монстрам в радиусе взрыва monsters
			//TODO: взрыв
		}

		if(this.y + this.animation.image.height * this.size / 3 > Draw.canvas.height - bottomShiftBorder){
			this.isEndLogic = true;
		}
	}

	draw(drawsDiffMs: number, isGameOver: boolean): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		let width = this.animation.image.width / this.animation.frames * this.size;
		let height = this.animation.image.height * this.size;

		Draw.ctx.setTransform(1, 0, 0, 1, this.x + width / 2, this.y + height / 2); 
		Draw.ctx.rotate(this.angle * Math.PI / 180);
		this.animation.draw(drawsDiffMs, false, -width / 2, -height / 2, width, height);
		Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
		Draw.ctx.rotate(0);
	}

	drawTrajectory(drawsDiffMs: number, pointStart: Point|null){
		let angle = 0;

		let pointEnd = Mouse.getCanvasMousePoint();
		if(pointStart && pointEnd){
			let distance = Helper.getDistance(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y); 
			if (distance > Meteor.distanceBetweenToAddAngle){
				angle = Helper.getRotateAngle(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y); //0 - it is right, 90 - it is bottom, 180 it is left, 270 it is top

				if(angle > 180 - Meteor.minHorizontalAngle && angle < 270){
					angle = 180 - Meteor.minHorizontalAngle;
				}
				else if(angle >= 270 || angle < Meteor.minHorizontalAngle){
					angle = Meteor.minHorizontalAngle;
				}

				Draw.ctx.setTransform(1, 0, 0, 1, pointEnd.x, pointEnd.y); 
				Draw.ctx.rotate(angle * Math.PI / 180);
				Draw.ctx.beginPath();
				let width = this.image.width * this.size;
				Draw.ctx.rect(-Draw.ctx.canvas.height * 5, -width / 2, Draw.ctx.canvas.height * 10, width);
				Draw.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
				Draw.ctx.fill();
				Draw.ctx.lineWidth = 2;
				Draw.ctx.strokeStyle = 'rgb(0, 255, 0)';
				Draw.ctx.stroke();
				Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
				Draw.ctx.rotate(0);
			} 
		}
	}
}
Object.defineProperty(Meteor, "name", { value: 'Meteor', writable: false }); //fix production minification class names