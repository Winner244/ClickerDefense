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
	static readonly defaultAngle: number = 90; //если не выбирать угол наклона, то будет использовано это значение (90 - it is bottom)

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
	static readonly initialSpeed: number = 0.5;

	constructor(x: number, y: number, angle: number = 90, size: number|null = null)
	{
		super(x, y, 
			size || Meteor.initialSize,
			Meteor.name, 
			Meteor.image, 
			Meteor.imageGif, 
			new AnimationInfinite(Meteor.imageAnimationFrames, Meteor.imageAnimationFrames * Meteor.imageAnimationDuration, Meteor.imageAnimation), 
			new AnimationInfinite(Meteor.imageAnimationFrames, Meteor.imageAnimationFrames * Meteor.imageAnimationDuration, Meteor.imageAnimationForCursor), 
			new Point(0, 30),
			null, //lifeTime
			Meteor.imageHandler);
		
		this.speed = Meteor.initialSpeed;
		this.angle = angle - 45 - 90;
		this.angle += this.angle > 90 ? 5 : -5;
		this.dy = this.speed * Math.sin(angle * Math.PI / 180);
		this.dx = this.speed * Math.cos(angle * Math.PI / 180);
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

	getAngle(pointStart: Point, pointEnd: Point): number{
		let angle = Meteor.defaultAngle;

		let distance = Helper.getDistance(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y); 
		if (distance > Meteor.distanceBetweenToAddAngle) {
			angle = Helper.getRotateAngle(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y); //0 - it is right, 90 - it is bottom, 180 it is left, 270 it is top

			if(angle > 180 - Meteor.minHorizontalAngle && angle < 270){
				angle = 180 - Meteor.minHorizontalAngle;
			}
			else if(angle >= 270 || angle < Meteor.minHorizontalAngle){
				angle = Meteor.minHorizontalAngle;
			}
		}

		return angle;
	}

	createExemplar(pointStart: Point, pointEnd: Point): Meteor{
		let angle = this.getAngle(pointStart, pointEnd);
		let x = pointEnd.x;
		let y = -this.animation.image.height * this.size;
		if(angle != 90){
			let point = Helper.getPointOfIntersection2LinesByPoints(pointStart, pointEnd, new Point(0, y), new Point(1, y));
			x = point.x
		}

		//x -= this.animation.image.width / this.animation.frames * this.size / 2;
		let angleToShift = 90 - angle;
		let kof = angleToShift > 0 && angleToShift < 45 ? 2 : angleToShift;
		//angleToShift += angleToShift > 0 ? 5 : 0;
		//TODO if angleToShift > 55 градусов - начинается возрастающее отклонение траектории
		let xShift = this.animation.image.width / this.animation.frames * this.size / 2 * Math.cos(angleToShift * Math.PI / 180 * kof);
		x -= xShift;

		console.log('angle', angleToShift, xShift, this.animation.image.width / this.animation.frames * this.size / 2);

		//у нас прямоугольник, который повёрнут на 45 (+-5) градусов
		//когда общий угол поворота прямоугольника превышает 90 градусов - тогда надо брать высоту, а не ширину

		//без сдвига - он летит по среденине при 45 градусах
		//при 0 градусов - смещён вправо
		//при 80 градусов - смещён влево

		//shift лишь сдвигает это на 45 градусов вниз
		return new Meteor(x, y, angle, this.size);
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

	displayMagicOnCursor(drawsDiffMs: number, pointStart: Point|null, cursorMagicWidth: number, cursorMagicHeight: number){
		let pointEnd = Mouse.getCanvasMousePoint();
		pointStart = pointStart || pointEnd;

		this.displayTrajectory(pointStart, pointEnd);
		this.displayMagicOnTheCursor(drawsDiffMs, pointStart, pointEnd, cursorMagicWidth, cursorMagicHeight);

	}

	displayMagicOnTheCursor(drawsDiffMs: number, pointStart: Point, pointEnd: Point, cursorMagicWidth: number, cursorMagicHeight: number){
		let angle = this.getAngle(pointStart, pointEnd);  //has distance logic inside.

		//высчитываем катет по гипотенузе и углу
		let angleOfRightTriangle = Math.abs(angle - 90); //angle between hypotenuse and closest cathetus
		angleOfRightTriangle += angle > 90 ? 5 : -5;
		let lengthOfShift = Helper.getDistance(0, 0, this.shiftAnimationForCursor.x, this.shiftAnimationForCursor.y); //hypotenuse
		let shiftX = lengthOfShift * Math.sin(angleOfRightTriangle * Math.PI / 180); 
		let shiftY = lengthOfShift * Math.cos(angleOfRightTriangle * Math.PI / 180);
		if(angle > 90){
			shiftX *= -1;
		}


		Draw.ctx.setTransform(1, 0, 0, 1, Mouse.canvasX - shiftX, Mouse.canvasY - shiftY); 
		Draw.ctx.rotate((angle - 90 - 45) * Math.PI / 180);

		let x = -cursorMagicWidth / 2; 
		let y = -cursorMagicHeight / 2;

		this.animationForCursor.draw(drawsDiffMs, false, x, y, cursorMagicWidth, cursorMagicHeight);

		Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
		Draw.ctx.rotate(0);


		Draw.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
		Draw.ctx.beginPath();
		Draw.ctx.arc(pointEnd.x, pointEnd.y, 1, 0, 2 * Math.PI);
		Draw.ctx.fill();
	}

	displayTrajectory(pointStart: Point, pointEnd: Point){
		let distance = Helper.getDistance(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y); 
		if (distance > Meteor.distanceBetweenToAddAngle){
			let angle = this.getAngle(pointStart, pointEnd);
			let width = this.animation.image.width / this.animation.frames * this.size / 1.7;
			let height = Draw.ctx.canvas.height;

			Draw.ctx.setTransform(1, 0, 0, 1, pointEnd.x, pointEnd.y); 
			Draw.ctx.rotate(angle * Math.PI / 180);
			Draw.ctx.beginPath();
			Draw.ctx.rect(-height * 5, -width / 2, height * 10, width);
			Draw.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
			Draw.ctx.fill();
			Draw.ctx.lineWidth = 2;
			Draw.ctx.strokeStyle = 'rgb(0, 255, 0)';
			Draw.ctx.stroke();
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);

			Draw.ctx.fillStyle = 'rgba(0, 255, 0, 1)';
			Draw.ctx.beginPath();
			Draw.ctx.arc(pointStart.x, pointStart.y, 5, 0, 2 * Math.PI);
			Draw.ctx.fill();

			var notChangedAngle = Helper.getRotateAngle(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y); 
			if (notChangedAngle == angle){
				Draw.ctx.beginPath();
				Draw.ctx.moveTo(pointStart.x, pointStart.y);
				Draw.ctx.lineTo(pointEnd.x, pointEnd.y);
				Draw.ctx.stroke();
			}
		}
	}
}
Object.defineProperty(Meteor, "name", { value: 'Meteor', writable: false }); //fix production minification class names