import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';

import {ImageHandler} from '../ImageHandler';

import {Helper} from '../helpers/Helper';

import {Mouse} from '../gamer/Mouse';

import {Draw} from '../gameSystems/Draw';
import {AudioSystem} from '../gameSystems/AudioSystem';

import Animation from '../../models/Animation';

import {Point} from '../../models/Point';

import {Magic} from './Magic';

import ShopItem from '../../models/ShopItem';
import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

import AnimationInfinite from '../../models/AnimationInfinite';

import BaseImage from '../../assets/img/magics/meteor/image.png';  
import ImageGif from '../../assets/img/magics/meteor/imageGif.gif';  
import AnimationImage from '../../assets/img/magics/meteor/animation.png'; 
import ExplosionImage from '../../assets/img/magics/meteor/explosion.png'; 

/** Метеорит - тип магии */
export class Meteor extends Magic{
	static readonly distanceBetweenToAddAngle: number = 50; //дистанция между нажатой мышей и текущим положением мыши, при котором появляется возможность менять наклон падения метеорита
	static readonly minHorizontalAngle: number = 30; //минимальный угол наклона от горизонта
	static readonly defaultAngle: number = 90; //если не выбирать угол наклона, то будет использовано это значение (90 - it is bottom)
	static readonly damageInAirSizeKof: number = 0.5; //ширина метеорита которая наносит урон (0.%)
	static readonly damageEndSizeKof: number = 1; //ширина метеорита которая наносит урон (0.%)
	static readonly damageInAirSecond: number = 5; //урон в секунду при падении
	static readonly damageEnd: number = 5; //Конечный урон при взрыве
	static readonly initialSize: number = 0.5;
	static readonly initialSpeed: number = 1;

	static readonly imageHandler: ImageHandler = new ImageHandler();

	private static readonly image: HTMLImageElement = new Image(); //для отображения на панели доступа и в магазине
	private static readonly imageGif: HTMLImageElement = new Image(); //для отображения на панели доступа при наведении
	private static readonly imageAnimation: HTMLImageElement = new Image(); //картинка анимации магии
	private static readonly imageAnimationFrames: number = 4;
	private static readonly imageAnimationDuration: number = 100;
	private static readonly imageAnimationForCursor: HTMLImageElement = new Image(); //картинка анимации магии для курсора после выбора магии и до момента её активации
	private static readonly imageAnimationExplosion: HTMLImageElement = new Image(); //картинка анимации взрыва

	private readonly explosionAnimation: Animation; //анимация Взрыва

	static readonly shopItem: ShopItem = new ShopItem('Метеор', Meteor.image, 10, 'Вызывает падение метеорита на летающих и ходячих монстров', ShopCategoryEnum.MAGIC, 30);

	private angle: number;
	private dx: number;
	private dy: number;
	private speed: number;
	private isEndLogic: boolean;
	private intersectionWithEarch: Point;

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
		this.explosionAnimation = new Animation(9, 9 * 50, Meteor.imageAnimationExplosion);
		this.explosionAnimation.leftTimeMs = 0;

		let bottom = Draw.canvas.height - Draw.bottomShiftBorder;
		let xCenter = x + this.width / 2;
		let yCenter = y + this.height / 2;
		this.intersectionWithEarch = Helper.getPointOfIntersection2Lines(xCenter, yCenter, xCenter + this.dx, yCenter + this.dy, 0, bottom, 1, bottom);

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
			Meteor.imageHandler.new(Meteor.imageAnimationExplosion).src = ExplosionImage;
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
		let y = -this.height;
		
		if(angle == Meteor.minHorizontalAngle || angle == 180 - Meteor.minHorizontalAngle){
			pointStart = pointEnd;
			let dy = this.speed * Math.sin(angle * Math.PI / 180);
			let dx = this.speed * Math.cos(angle * Math.PI / 180);
			pointEnd = new Point(pointStart.x + dx, pointStart.y + dy);
		}
		
		if(angle != 90){
			let point = Helper.getPointOfIntersection2LinesByPoints(pointStart, pointEnd, new Point(0, y), new Point(1, y));
			x = point.x;

			if(x < -this.width){
				x = -this.width;
				let point = Helper.getPointOfIntersection2LinesByPoints(pointStart, pointEnd, new Point(x, 0), new Point(x, 1));
				y = point.y;
			}
			else if(x > Draw.canvas.width + this.width){
				x = Draw.canvas.width + this.width;
				let point = Helper.getPointOfIntersection2LinesByPoints(pointStart, pointEnd, new Point(x, 0), new Point(x, 1));
				y = point.y;
			}
		}

		x -= this.width / 2;
		y -= this.height / 2;

		return new Meteor(x, y, angle, this.size);
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logic(drawsDiffMs, buildings, monsters, units, bottomShiftBorder);

		if(this.isEndLogic){
			if(this.explosionAnimation.leftTimeMs <= 0){
				this.isEnd = true;
			}
			return;
		}

		if(this.angle + 45 > 0 && this.x + this.width < 0 || this.angle < -45 && this.x > Draw.canvas.width){
			this.isEnd = true;
			console.log('end', this.angle);
		}

		this.x += this.dx * this.speed * drawsDiffMs;
		this.y += this.dy * this.speed * drawsDiffMs;

		let isInAir = this.y + this.height / 1.2 < Draw.canvas.height - bottomShiftBorder;
		if (isInAir){  //метеорит в воздухе ?

			//наносим урон при падении всем кто попал под траекторию движения метеорита
			//для оптимизации - высчитываем не попадание края монстра внутрь повёрнутого квадрата, а расстояние между монстром и метеоритом с вычитом их окружностей
			let radiusMeteorit = this.width * Meteor.damageInAirSizeKof;
			let centerX = this.x + this.width / 2;
			let centerY = this.y + this.height / 2;
			monsters
				.filter(monster => Helper.getDistance(centerX, centerY, monster.centerX, monster.centerY) < radiusMeteorit + Math.min(monster.width, monster.height) / 2)
				.forEach(monster => monster.applyDamage(Meteor.damageInAirSecond * drawsDiffMs / 1000));
		}
		else if(this.explosionAnimation.leftTimeMs <= 0){
			this.explosionAnimation.restart();

			let radiusMeteorit = this.width * Meteor.damageEndSizeKof;
			monsters.forEach(monster => {
				let distance = Helper.getDistance(this.intersectionWithEarch.x, this.intersectionWithEarch.y, monster.centerX, monster.centerY);
				let distanceMax = radiusMeteorit + Math.min(monster.width, monster.height) / 2;
				if(distance < distanceMax){
					monster.applyDamage((Math.min(1, (distanceMax - distance) / (distanceMax / 2))) * Meteor.damageEnd);
				}
			});

		}

		//полное падение
		if(this.y + this.height / 3 > Draw.canvas.height - bottomShiftBorder){
			this.isEndLogic = true;
		}
	}

	draw(drawsDiffMs: number, isGameOver: boolean): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		if(!this.isEndLogic){
			Draw.ctx.setTransform(1, 0, 0, 1, this.x + this.width / 2, this.y + this.height / 2); 
			Draw.ctx.rotate(this.angle * Math.PI / 180);
			this.animation.draw(drawsDiffMs, isGameOver, -this.width / 2, -this.height / 2, this.width, this.height);
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);
		}

		if(this.explosionAnimation.leftTimeMs > 0){
			let size = this.width * Meteor.damageEndSizeKof * 2;
			this.explosionAnimation.draw(drawsDiffMs, isGameOver, this.intersectionWithEarch.x - size / 2, this.intersectionWithEarch.y - size / 2, size, size);
		}
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
			let width = this.width * Meteor.damageInAirSizeKof;
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
			else{
				pointStart = pointEnd;
				let dy = this.speed * Math.sin(angle * Math.PI / 180);
				let dx = this.speed * Math.cos(angle * Math.PI / 180);
				pointEnd = new Point(pointStart.x + dx, pointStart.y + dy);
			}

			let bottom = Draw.canvas.height - Draw.bottomShiftBorder;
			let intersectionWithEarch = Helper.getPointOfIntersection2LinesByPoints(pointStart, pointEnd, new Point(0, bottom), new Point(1, bottom));

			Draw.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
			Draw.ctx.beginPath();
			Draw.ctx.arc(intersectionWithEarch.x, intersectionWithEarch.y, this.width * Meteor.damageEndSizeKof, 0, 2 * Math.PI);
			Draw.ctx.stroke();
			Draw.ctx.fill();

		}
	}
}
Object.defineProperty(Meteor, "name", { value: 'Meteor', writable: false }); //fix production minification class names