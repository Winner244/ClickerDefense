import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';

import {ImageHandler} from '../ImageHandler';

import {Helper} from '../helpers/Helper';

import {Mouse} from '../gamer/Mouse';

import {Draw} from '../gameSystems/Draw';
import {AudioSystem} from '../gameSystems/AudioSystem';

import Animation from '../../models/animations/Animation';

import {Point} from '../../models/Point';
import {MovingObject} from '../../models/objects/MovingObject';

import {Magic} from './Magic';

import ShopItem from '../../models/shop/ShopItem';
import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';
import ParameterItem from '../../models/shop/ParameterItem'; 

import {PileStones} from '../buildings/PileStones';

import Improvement from '../../models/shop/Improvement';
import ImprovementParameterItem from '../../models/shop/ImprovementParameterItem';

import {MassDamageModifier} from '../modifiers/MassDamageModifier';

import AnimationInfinite from '../../models/animations/AnimationInfinite';

import BaseImage from '../../assets/img/magics/meteor/image.png';  
import ImageGif from '../../assets/img/magics/meteor/imageGif.gif';  
import AnimationImage from '../../assets/img/magics/meteor/animation.png'; 
import ExplosionImage from '../../assets/img/magics/meteor/explosion.svg'; 
import SmokeImage from '../../assets/img/magics/meteor/smoke.png'; 
import FireImage from '../../assets/img/magics/meteor/fire.png'; 

import fireIcon from '../../assets/img/icons/fire.png';  
import swordIcon from '../../assets/img/icons/sword.png'; 
import timerIcon from '../../assets/img/icons/timer.png';
import shieldIcon from '../../assets/img/icons/shield.png'; 
import healthCoreIcon from '../../assets/img/icons/healthCore.png';  

import PileStoneImage from '../../assets/img/buildings/pileStones/pileStones.png';  
import PileStoneHotImage from '../../assets/img/buildings/pileStones/pileStonesHot.png';  

import FireSoundUrl from '../../assets/sounds/magic/meteor/fire-moving.mp3'; 
import ExplosionSoundUrl from '../../assets/sounds/magic/meteor/explosion.mp3'; 

/** Метеорит - тип магии */
export class Meteor extends Magic{
	static readonly distanceBetweenToAddAngle: number = 50; //дистанция между нажатой мышей и текущим положением мыши, при котором появляется возможность менять наклон падения метеорита
	static readonly minHorizontalAngle: number = 30; //минимальный угол наклона от горизонта
	static readonly defaultAngle: number = 90; //если не выбирать угол наклона, то будет использовано это значение (90 - it is bottom)
	static readonly initialSize: number = 0.5;
	static readonly initialSpeed: number = 1;
	static readonly initialTimeRecoveryMs: number = 3000; //начальное время восстановления магии  (миллисекунды)

	static readonly imageHandler: ImageHandler = new ImageHandler();

	public static readonly PILE_STONES_IMPROVEMENT = 'pile_stones_improvement';
	public static readonly HOT_PILE_STONES_IMPROVEMENT = 'hot_pile_stones_improvement';
	public static readonly DAMAGE_PARAMETER = 'meteor_damage_parameter';
	public static readonly HEALTH_CORE_PARAMETER = 'meteor_health_core_parameter';
	public static readonly FIRE_DAMAGE_PERCENT_PARAMETER = 'meteor_fire_damage_percent_parameter';
	public static readonly FIRE_DAMAGE_MIN_PARAMETER = 'meteor_fire_damage_min_parameter';
	public static readonly FIRE_DURATION_PARAMETER = 'meteor_fire_duration_parameter';
	public static readonly CORE_RETURN_DAMAGE_PARAMETER = 'meteor_core_return_damage_parameter';

	private static readonly image: HTMLImageElement = new Image(); //для отображения на панели доступа и в магазине
	private static readonly imageGif: HTMLImageElement = new Image(); //для отображения на панели доступа при наведении
	private static readonly imageFire: HTMLImageElement = new Image(); //картинка огня
	private static readonly imageSmoke: HTMLImageElement = new Image(); //картинка дыма
	private static readonly imageAnimation: HTMLImageElement = new Image(); //картинка анимации магии
	private static readonly imageAnimationFrames: number = 4;
	private static readonly imageAnimationDuration: number = 100;
	private static readonly imageAnimationForCursor: HTMLImageElement = new Image(); //картинка анимации магии для курсора после выбора магии и до момента её активации
	private static readonly imageAnimationExplosion: HTMLImageElement = new Image(); //картинка анимации взрыва

	private readonly explosionAnimation: Animation; //анимация Взрыва

	static readonly shopItem: ShopItem = new ShopItem('Метеор', Meteor.image, 10, 'Вызывает падение метеорита на летающих и ходячих монстров', ShopCategoryEnum.MAGIC, 30);

	private damageEnd: number = 5; //Конечный урон при взрыве
	private damageInAirSecond: number = 15; //урон в секунду при падении в воздухе
	private damageEndSizeKof: number = 1; //ширина метеорита которая наносит урон НА ЗЕМЛЕ (0.%)
	private damageInAirSizeKof: number = 0.5; //ширина метеорита которая наносит урон В ВОЗДУХЕ (0.%) 

	private angle: number;
	private dx: number;
	private dy: number;
	private speed: number;
	private isEndLogic: boolean;
	private intersectionWithEarch: Point;

	static readonly smokeLifeTimeMs: number = 1000; //время существования спрайта дыма
	static readonly smokeFrequencyInSecond: number = 5; //количество создаваемых спрайтов дыма за секунду
	private lastTimeCreatingSmoke: number; //время последнего создания картинки дыма
	private smokeElements: MovingObject[];

	static readonly fireLifeTimeMs: number = 200; //время существования спрайта огня
	private fireElements: MovingObject[];
	private fireElementShifts: Point[]; //массив сдвигов, что бы спрайт не в рандомном месте появлялся, а как огонь - струёй был

	private isSoundExplosionStarted: boolean; //звук взрыва уже начался?
	static readonly fireSoundDistanceSpeedOk: number = 1200; //дистанция для обычной скорости звука огня

	isHasPileStones: boolean = false; //оставляет ли после себя каменную гору на земле?
	isHasHotPileStones: boolean = false; //оставляет ли после себя раскалённую каменную гору на земле?

	healthCore: number = 10; //минимальные хп ядра (так же хп добавляется от урона метеорита)
	fireDamageCoreInSecondPercentage: number = 5; //урона от раскалённых камней в секунду (в процентах от максимальных хп монстра)
	fireDamageCoreInSecondMinimal: number = 0.1; //урона от раскалённых камней в секунду (минимальный)
	fireDamageCoreDuration: number = 2000; //время горения монстров от удара по раскалённым камням
	damageCoreMirrorPercentage: number = 20; //количество возвращаемого монстрам урона при ударе по раскалённым камням(%)

	constructor(x: number, y: number, 
		angle: number = 90, 
		size: number|null = null, 
		timeRecoveryMs: number|null = null)
	{
		super(x, y, 
			size || Meteor.initialSize,
			Meteor.name, 
			Meteor.shopItem.name, 
			Meteor.image, 
			Meteor.imageGif, 
			new AnimationInfinite(Meteor.imageAnimationFrames, Meteor.imageAnimationFrames * Meteor.imageAnimationDuration, Meteor.imageAnimation), 
			new AnimationInfinite(Meteor.imageAnimationFrames, Meteor.imageAnimationFrames * Meteor.imageAnimationDuration, Meteor.imageAnimationForCursor), 
			new Point(0, 30),
			null, //lifeTime
			timeRecoveryMs || Meteor.initialTimeRecoveryMs,
			Meteor.imageHandler,
			Meteor.shopItem.price);
		
		this.speed = Meteor.initialSpeed;
		this.angle = angle - 45 - 90;
		this.angle += this.angle > 90 ? 5 : -5;
		this.dy = this.speed * Math.sin(angle * Math.PI / 180);
		this.dx = this.speed * Math.cos(angle * Math.PI / 180);
		this.isEndLogic = false;
		this.explosionAnimation = new Animation(10, 10 * 75, Meteor.imageAnimationExplosion);
		this.explosionAnimation.leftTimeMs = 0;

		this.lastTimeCreatingSmoke = 0;
		this.smokeElements = [];

		this.fireElementShifts = [];
		this.fireElements = [];

		this.isSoundExplosionStarted = false;


		let isShop = x == 0 && y == 0;
		if (isShop){
			this.intersectionWithEarch = new Point(0, 0);
			Meteor.init(true);
		}
		else{
			AudioSystem.load(ExplosionSoundUrl);

			let bottom = Draw.canvas.height - Draw.bottomShiftBorder;
			let xCenter = x + this.width / 2;
			let yCenter = y + this.height / 2;
			this.intersectionWithEarch = Helper.getPointOfIntersection2Lines(xCenter, yCenter, xCenter + this.dx, yCenter + this.dy, 0, bottom, 1, bottom);

			for(let i = 0; i < 5; i++){
				let fireX = Math.cos((this.angle + 142) * Math.PI / 180) * this.height / 4 + Helper.getRandom(-this.width / 7, this.width / 7);
				let fireY = Math.sin((this.angle + 142) * Math.PI / 180) * this.height / 4 + Helper.getRandom(-this.width / 7, this.width / 7);
				this.fireElementShifts.push(new Point(fireX, fireY));
			}

			let distanceToGoal = Helper.getDistance(x, y, this.intersectionWithEarch.x, this.intersectionWithEarch.y) / Math.max(1, this.size);
			let fireSoundSpeed = distanceToGoal > Meteor.fireSoundDistanceSpeedOk 
				? 1 - (distanceToGoal / Meteor.fireSoundDistanceSpeedOk - 1) / 1.5 
				: 1 + 1 - distanceToGoal / Meteor.fireSoundDistanceSpeedOk 
			AudioSystem.play(x, FireSoundUrl, 0, fireSoundSpeed);
		}
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
			Meteor.imageHandler.new(Meteor.imageSmoke).src = SmokeImage;
			Meteor.imageHandler.new(Meteor.imageFire).src = FireImage;
			AudioSystem.load(FireSoundUrl);
		}
	}

	loadedResourcesAfterBuy(){
		super.loadedResourcesAfterBuy();

		this.infoItems.push(new ParameterItem(Meteor.DAMAGE_PARAMETER, 'Урон', 
			() => this.damageEnd, swordIcon, 13, 
			() => this.price * this.damageEnd / 2, 
			() => {
				this.damageEnd += 1;
				this.damageInAirSecond += 1;
				this.timeRecoveryMs += 250;
				this.size += 0.05;
			}));

		this.improvements.push( new Improvement(Meteor.PILE_STONES_IMPROVEMENT, 'Каменное ядро', 100, PileStoneImage, () => this.improveToPileStones(), [
			new ImprovementParameterItem('+', shieldIcon)
		]));

		this.improvements.push( new Improvement(Meteor.HOT_PILE_STONES_IMPROVEMENT, 'Раскалённое ядро', 150, PileStoneHotImage, () => this.improveToHotPileStones(), [
			new ImprovementParameterItem('+', swordIcon)
		], true));
			
		PileStones.init(true);
	}

	improveToPileStones(){
		this.isHasPileStones = true;
		this.timeRecoveryMs += 4500;
		PileStones.init(true);

		this.infoItems.push(new ParameterItem(Meteor.HEALTH_CORE_PARAMETER, 'Хп ядра', () => this.healthCore, healthCoreIcon, 13, () => this.price / 2, () => this.healthCore += 1));

		let t = this.improvements.find(x => x.id == Meteor.PILE_STONES_IMPROVEMENT);
		if(t) t.isImproved = true;
	}

	improveToHotPileStones(){
		this.isHasHotPileStones = true;
		this.timeRecoveryMs += 3500;
		PileStones.init(true);

		this.infoItems.push(new ParameterItem(Meteor.FIRE_DAMAGE_PERCENT_PARAMETER, 'Урон огня ядра', () => this.fireDamageCoreInSecondPercentage + '%/сек', fireIcon, 13, () => this.price / 2, () => this.fireDamageCoreInSecondPercentage += 1));
		this.infoItems.push(new ParameterItem(Meteor.FIRE_DAMAGE_MIN_PARAMETER, 'Урон огня ядра', () => this.fireDamageCoreInSecondMinimal.toFixed(1) + 'хп/сек', fireIcon, 13, () => this.price / 2, () => this.fireDamageCoreInSecondMinimal += 0.1));
		this.infoItems.push(new ParameterItem(Meteor.FIRE_DURATION_PARAMETER, 'Горение от ядра', () => (this.fireDamageCoreDuration / 1000).toFixed(0) + 'сек', timerIcon, 13, () => this.price, () => this.fireDamageCoreDuration += 1000));
		this.infoItems.push(new ParameterItem(Meteor.CORE_RETURN_DAMAGE_PARAMETER, 'Возврат урона от ядра', () => this.damageCoreMirrorPercentage + '%', swordIcon));

		let t = this.improvements.find(x => x.id == Meteor.HOT_PILE_STONES_IMPROVEMENT);
		if(t) t.isImproved = true;
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

		var newMeteor = new Meteor(x, y, angle, this.size, this.timeRecoveryMs);
		newMeteor.damageEnd = this.damageEnd;
		newMeteor.damageInAirSecond = this.damageInAirSecond;
		newMeteor.isHasPileStones = this.isHasPileStones;
		newMeteor.isHasHotPileStones = this.isHasHotPileStones;
		newMeteor.healthCore = this.healthCore;
		newMeteor.fireDamageCoreInSecondPercentage = this.fireDamageCoreInSecondPercentage;
		newMeteor.fireDamageCoreInSecondMinimal = this.fireDamageCoreInSecondMinimal;
		newMeteor.fireDamageCoreDuration = this.fireDamageCoreDuration;
		newMeteor.damageCoreMirrorPercentage = this.damageCoreMirrorPercentage;
		return newMeteor;
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logic(drawsDiffMs, buildings, monsters, units, bottomShiftBorder);

		this.smokeElements.forEach(x => x.logic(drawsDiffMs));
		this.smokeElements = this.smokeElements.filter(x => x.leftTimeMs > 0);

		this.fireElements.forEach(x => x.logic(drawsDiffMs));
		this.fireElements.forEach(x => {
			x.size.width -= 3 / drawsDiffMs; 
			x.size.height -= 3 / drawsDiffMs;
		});
		this.fireElements = this.fireElements.filter(x => x.leftTimeMs > 0);

		if(this.isEndLogic){
			if(this.explosionAnimation.leftTimeMs <= 0 && this.smokeElements.length == 0){
				this.isEnd = true;
			}
			return;
		}

		if((this.angle + 45 > 0 && this.x + this.width < 0 || this.angle < -45 && this.x > Draw.canvas.width) && this.smokeElements.length == 0){
			this.isEnd = true;
		}

		this.x += this.dx * this.speed * drawsDiffMs;
		this.y += this.dy * this.speed * drawsDiffMs;

		let isInAir = this.y + this.height / 1.2 < Draw.canvas.height - bottomShiftBorder;
		if (isInAir){  //метеорит в воздухе ?

			//наносим урон при падении всем кто попал под траекторию движения метеорита
			//для оптимизации - высчитываем не попадание края монстра внутрь повёрнутого квадрата, а расстояние между монстром и метеоритом с вычитом их радиусов
			let radiusMeteorit = this.width * this.damageInAirSizeKof / 2;
			let centerX = this.x + this.width / 2;
			let centerY = this.y + this.height / 2;
			let xDamageCenter = centerX + Math.cos((this.angle + 142) * Math.PI / 180) * this.width / 2;
			let yDamageCenter = centerY + Math.sin((this.angle + 142) * Math.PI / 180) * this.height / 2;
			monsters
				.filter(monster => Helper.getDistance(xDamageCenter, yDamageCenter, monster.centerX, monster.centerY) < radiusMeteorit + Math.min(monster.width, monster.height) / 2)
				.forEach(monster => monster.applyDamage(this.damageInAirSecond * drawsDiffMs / 1000));

			//создаём дым от метеора
			if(this.lastTimeCreatingSmoke < this.lastTimeCreatingSmoke + 1000 / Meteor.smokeFrequencyInSecond){
				let smokeX = centerX + Math.cos((this.angle + 142) * Math.PI / 180) * this.height / 4;
				let smokeY = centerY + Math.sin((this.angle + 142) * Math.PI / 180) * this.height / 4;
				let smokeWidth = this.width / 2;
				let dx = (Math.random() - 0.5) * 250;
				let dy = (Math.random() - 0.5) * 250;
				this.smokeElements.push(new MovingObject(smokeX - smokeWidth / 2, smokeY - smokeWidth / 2, smokeWidth, smokeWidth, Meteor.smokeLifeTimeMs / this.speed, dx, dy, this.angle));
				this.lastTimeCreatingSmoke = Date.now();
			}

			//создаём огонь от метеора
			let location = this.fireElementShifts[Helper.getRandom(0, this.fireElementShifts.length - 1)];
			let fireX = centerX + location.x;
			let fireY = centerY + location.y;
			let fireWidth = this.width / 20;
			this.fireElements.push(new MovingObject(fireX - fireWidth / 2, fireY - fireWidth / 2, fireWidth, fireWidth, Meteor.fireLifeTimeMs / this.speed, 0, 0, this.angle));
			
		}
		//высчитываем урон от столкновения метеора о землю
		else if(this.explosionAnimation.leftTimeMs <= 0){
			this.explosionAnimation.restart();

			let radiusMeteorit = this.width / 2 * this.damageEndSizeKof;
			monsters.forEach(monster => {
				let distance = Helper.getDistance(this.intersectionWithEarch.x, this.intersectionWithEarch.y, monster.centerX, monster.centerY);
				let distanceMax = radiusMeteorit + monster.width / 2;
				if(distance < distanceMax){
					monster.applyDamage((Math.min(1, (distanceMax - distance) / (distanceMax / 2))) * this.damageEnd);
					monster.addModifier(new MassDamageModifier())
				}
			});

			//оставляем груду камней
			if(this.isHasPileStones || this.isHasHotPileStones){
				const pileStones = new PileStones(this.intersectionWithEarch.x, 0.5 * this.size * 0.8, this.healthCore * this.damageEnd / 3, this.isHasHotPileStones, 
					this.fireDamageCoreInSecondMinimal, 
					this.fireDamageCoreInSecondPercentage,
					this.fireDamageCoreDuration,
					this.damageCoreMirrorPercentage);
				pileStones.x -= pileStones.width / 2;
				buildings.push(pileStones);
				monsters.forEach(m => m.clearGoal());
			}
		}
		//дым после взрыва
		else{
			let smokeWidth = this.width / 2;
			let dx = (Math.random() - 0.5) * 500;
			let dy = (Math.random() - 0.5) * 300;
			let x = this.intersectionWithEarch.x - smokeWidth / 2;
			let y = this.intersectionWithEarch.y - smokeWidth / 2;
			this.smokeElements.push(new MovingObject(x, y, smokeWidth, smokeWidth, Meteor.smokeLifeTimeMs / this.speed, dx, dy, this.angle));
		}

		//звук чуть раньше запускается
		if(this.y + this.height / 1.2 + 75 > Draw.canvas.height - bottomShiftBorder && this.explosionAnimation.leftTimeMs <= 0 && !this.isSoundExplosionStarted){
			this.isSoundExplosionStarted = true;
			AudioSystem.play(this.intersectionWithEarch.x, ExplosionSoundUrl, -2, 1, false, true);
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

		this.smokeElements.forEach(smoke => {
			Draw.ctx.globalAlpha = smoke.leftTimeMs / smoke.initialLeftTimeMs;
			Draw.ctx.drawImage(Meteor.imageSmoke, smoke.x, smoke.y, smoke.width, smoke.height);
			Draw.ctx.globalAlpha = 1;
		});

		

		if(!this.isEndLogic){
			Draw.ctx.setTransform(1, 0, 0, 1, this.x + this.width / 2, this.y + this.height / 2); 
			Draw.ctx.rotate(this.angle * Math.PI / 180);
			this.animation.draw(drawsDiffMs, isGameOver, -this.width / 2, -this.height / 2, this.width, this.height);
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);
		}

		this.fireElements.forEach(fire => {
			Draw.ctx.globalAlpha = fire.leftTimeMs / fire.initialLeftTimeMs;
			let i = 0;
			while(Draw.ctx.globalAlpha > 0.05 && i < 50){
				Draw.ctx.drawImage(Meteor.imageFire, fire.x - this.dx * i, fire.y - this.dy * i, fire.width, fire.height);
				Draw.ctx.globalAlpha -= 0.1;
				i+=3;
			}
			//Draw.ctx.drawImage(Meteor.imageFire, fire.x, fire.y, fire.width, fire.height);
			Draw.ctx.globalAlpha = 1;
		});

		if(this.explosionAnimation.leftTimeMs > 0){
			let size = this.width * this.damageEndSizeKof * 2;
			Draw.ctx.globalAlpha = this.explosionAnimation.leftTimeMs / this.explosionAnimation.durationMs * 4;
			this.explosionAnimation.draw(drawsDiffMs, isGameOver, this.intersectionWithEarch.x - size / 2, this.intersectionWithEarch.y - size / 2, size, size);
			Draw.ctx.globalAlpha = 1;
		}
	}

	displayMagicOnCursor(drawsDiffMs: number, pointStart: Point|null, cursorMagicWidth: number, cursorMagicHeight: number){
		let pointEnd = Mouse.getCanvasMousePoint();
		pointStart = pointStart || pointEnd;

		this.displayTrajectory(pointStart, pointEnd);
		this.displayMagicOnCursorCore(drawsDiffMs, pointStart, pointEnd, cursorMagicWidth, cursorMagicHeight);

	}

	displayMagicOnCursorCore(drawsDiffMs: number, pointStart: Point, pointEnd: Point, cursorMagicWidth: number, cursorMagicHeight: number){
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
			let width = this.width * this.damageInAirSizeKof;
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
			Draw.ctx.arc(intersectionWithEarch.x, intersectionWithEarch.y, this.width * this.damageEndSizeKof, 0, 2 * Math.PI);
			Draw.ctx.stroke();
			Draw.ctx.fill();

		}
	}
}
Object.defineProperty(Meteor, "name", { value: 'Meteor', writable: false }); //fix production minification class names