import Animation from '../../models/animations/Animation';
import AnimationInfinite from '../../models/animations/AnimationInfinite';

import {ImageHandler} from '../ImageHandler';

import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';

import {BaseCursorModifier} from './BaseCursorModifier';

import ShopItem from '../../models/shop/ShopItem';
import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

import {FireModifier} from '../modifiers/FireModifier';

import {Mouse} from '../gamer/Mouse';
import {Draw} from '../gameSystems/Draw';
import {Helper} from '../helpers/Helper'; 
import {Cursor} from '../gamer/Cursor';

import {SimpleObject} from '../../models/objects/SimpleObject';

import ParameterItem from '../../models/shop/ParameterItem';

import ForShopImage from '../../assets/img/cursorModifiers/fire/forShop.png';
import DefaultCursorAnimationImage from '../../assets/img/cursorModifiers/fire/cursorAnimation.png';
import AnimationImage from '../../assets/img/fire.png';  
import ExplosionAnimationImage from '../../assets/img/fireExplosion.png';
import SwordCursorImage from '../../assets/cursors/SwordRed.png';

import radiusIcon from '../../assets/img/icons/radius2.png';
import timerIcon from '../../assets/img/icons/timer.png';
import swordIcon from '../../assets/img/icons/sword.png';
 


/** огненная мышь */
export class FireCursorModifier extends BaseCursorModifier {
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly image: HTMLImageElement = new Image(); //для отображения вместо курсора и в магазине
	private static readonly imageForDefaultCursorAnimation: HTMLImageElement = new Image(); //для отображения вместо курсора по умолчанию
	private static readonly imageForSwordCursor: HTMLImageElement = new Image(); //для отображения вместо курсора наведения на монстра
	private static readonly fireAngleDirectThreshold: number = 35; //расстояние в пикселях - если мышь улетает дальше этого расстояния за отрисовку, то анмиация огня на мышь направлена ровно
	private static readonly timeRecoveryFireAnimationMs: number = 50; //время восстановления анимации огня после клика (миллисекунды)
	private static readonly timeGrowingFireAnimationMs: number = 150; //время роста анимации огня после восстановления (миллисекунды)
	sizeFireAnimation: number = 1; //размер анимации огня (для роста после восстановления)

	private static readonly animation: AnimationInfinite = new AnimationInfinite(35, 1500); //анимация огня для курсора
	private static readonly fireExplosionAnimation: Animation = new Animation(22, 1000); //анимация после клика мышкой - вспышка огня
	fireExplosions: SimpleObject[] = []; //анимации распыления огня от кликов

	fireDamageInSecondPercentage: number = 5; //урона от огня в секунду (в процентах от максимальных хп монстра)
	fireDamageInSecondMinimal: number = 0.3; //урона от огня в секунду (минимальный)
	fireDurationMs: number = 7000; //время горения монстров

	private static readonly fireRadiusInitial: number = 25; //изначальный радиус поджёга монстров при клике
	fireRadius: number = FireCursorModifier.fireRadiusInitial; //радиус поджёга монстров при клике

	lastMouseCanvasX: number = Mouse.canvasX; 
	lastMouseCanvasY: number = Mouse.canvasY;
	rotateAngleAnimation: number = 0; //угол поворота анимации - движется за мышкой
	lastAngleDiff: number = 0; // для борьбы с багом
	lastClickTime: number = 0; //время последнего клика (связан с timeRecoveryFireAnimationMs)

	static readonly shopItem: ShopItem = new ShopItem('Огненный Курсор', FireCursorModifier.image, 20, 'Поджигает', ShopCategoryEnum.CURSOR, 1);

	// parameter ids
	public static readonly FIRE_DAMAGE_PERCENT_PARAMETER: string = 'fire_cursor_fire_damage_percent_parameter';
	public static readonly FIRE_DAMAGE_MIN_PARAMETER: string = 'fire_cursor_fire_damage_min_parameter';
	public static readonly FIRE_RADIUS_PARAMETER: string = 'fire_cursor_fire_radius_parameter';
	public static readonly FIRE_DURATION_PARAMETER: string = 'fire_cursor_fire_duration_parameter';

	constructor()
	{
		super(
			FireCursorModifier.name, 
			FireCursorModifier.shopItem.name, 
			FireCursorModifier.image,
			new AnimationInfinite(7, 7 * 200, FireCursorModifier.imageForDefaultCursorAnimation),
			FireCursorModifier.imageForSwordCursor,
			null,
			FireCursorModifier.animation, 
			FireCursorModifier.imageHandler,
			FireCursorModifier.shopItem.price,
			true  //isUseNotHardwareCursor
		);

		FireCursorModifier.init(true);
		this.infoItems = [
			new ParameterItem(FireCursorModifier.FIRE_DAMAGE_PERCENT_PARAMETER, 'Урон огня', () => this.fireDamageInSecondPercentage + '%/сек', swordIcon, 13, () => FireCursorModifier.shopItem.price / 3, () => this.fireDamageInSecondPercentage += 1),
			new ParameterItem(FireCursorModifier.FIRE_DAMAGE_MIN_PARAMETER, 'Урон огня', () => this.fireDamageInSecondMinimal.toFixed(1) + 'хп/сек', swordIcon, 13, () => FireCursorModifier.shopItem.price / 3, () => this.fireDamageInSecondMinimal += 0.1),
			new ParameterItem(FireCursorModifier.FIRE_RADIUS_PARAMETER, 'Радиус', () => this.fireRadius, radiusIcon, 16, () => FireCursorModifier.shopItem.price / 3, () => this.fireRadius += 1),
			new ParameterItem(FireCursorModifier.FIRE_DURATION_PARAMETER, 'Горение', () => (this.fireDurationMs / 1000).toFixed(0) + 'сек', timerIcon, 13, () => FireCursorModifier.shopItem.price / 3, () => this.fireDurationMs += 1000)
		];
	}

	get height(): number{
		return 50;
	}

	get width(): number{
		return 20;
	}

	
	static initForShop(): void{
		FireCursorModifier.image.src = ForShopImage;
	}
	
	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && FireCursorModifier.imageHandler.isEmpty){
			FireCursorModifier.imageHandler.new(FireCursorModifier.imageForDefaultCursorAnimation).src = DefaultCursorAnimationImage;
			FireCursorModifier.imageHandler.new(FireCursorModifier.imageForSwordCursor).src = SwordCursorImage;
			FireCursorModifier.animation.changeImage(AnimationImage);
			FireCursorModifier.fireExplosionAnimation.changeImage(ExplosionAnimationImage);
			FireModifier.loadResources();
		}
	}

	clickByMonster(monster: Monster){
		monster.addModifier(new FireModifier(this.fireDamageInSecondMinimal, this.fireDamageInSecondPercentage, this.fireDurationMs));
	}

	click(isHoverFound: boolean, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		var widthHeight = 35 * this.fireRadius / FireCursorModifier.fireRadiusInitial;
		this.fireExplosions.push(new SimpleObject(Mouse.canvasX - widthHeight / 2 + 3, Mouse.canvasY - widthHeight / 2 + 3, widthHeight, widthHeight, FireCursorModifier.fireExplosionAnimation.durationMs));
		this.lastClickTime = Date.now();
		this.rotateAngleAnimation = 0;
		this.size = 0;

		monsters
			.filter(x => Helper.getDistance(x.centerX, x.centerY, Mouse.canvasX, Mouse.canvasY) <= this.fireRadius)
			.forEach(monster => monster.addModifier(new FireModifier(this.fireDamageInSecondMinimal, this.fireDamageInSecondPercentage, this.fireDurationMs)));
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
		
		if(!isGameOver){
			if(this.fireExplosions.length){
				this.drawFireExplosions(drawsDiffMs, isGameOver);
			}
		}

		if(Cursor.currentCursorType != Cursor.pick 
			&& Cursor.currentCursorType != Cursor.pickYellow 
			&& Cursor.currentCursorType != Cursor.hand
			&& Date.now() - this.lastClickTime > FireCursorModifier.timeRecoveryFireAnimationMs)
		{
			this.drawFireAnimation(drawsDiffMs, isGameOver);
		}

		this.lastMouseCanvasX = Mouse.canvasX;
		this.lastMouseCanvasY = Mouse.canvasY;
	}

	drawFireAnimation(drawsDiffMs: number, isGameOver: boolean){
		var targetAngle = Helper.getRotateAngle(this.lastMouseCanvasX, this.lastMouseCanvasY, Mouse.canvasX, Mouse.canvasY); 
		targetAngle -= 90; //initial сдвиг - как буд то курсор вниз идёт
		//bottom it is 0 degrees
		//left - it is 90 degrees
		//top  - it is 180 degrees 
		//right  it is 270 and -90 degrees

		var diff = Helper.getDistance(this.lastMouseCanvasX, this.lastMouseCanvasY, Mouse.canvasX, Mouse.canvasY);
		if (diff == 0){ //если изменений нет - как буд то курсор вниз идёт
			targetAngle = 0;
		}
		
		var delta = targetAngle - this.rotateAngleAnimation;
		delta = ((delta + 540) % 360) - 180; //fix transfer from 270 to -90 degrees for rigth side
		var kof = Math.min(diff, FireCursorModifier.fireAngleDirectThreshold) / FireCursorModifier.fireAngleDirectThreshold;
		var rotateAngleChangeValue = delta / drawsDiffMs * Math.max(kof, 0.05) * 8;
		this.rotateAngleAnimation += rotateAngleChangeValue;
		if(this.rotateAngleAnimation == Number.POSITIVE_INFINITY || this.rotateAngleAnimation == Number.NEGATIVE_INFINITY || Number.isNaN(this.rotateAngleAnimation)){
			this.rotateAngleAnimation = 0;
		}

		this.size += (1 - this.size) * (drawsDiffMs / FireCursorModifier.timeGrowingFireAnimationMs); 
		if(this.size > 1){
			this.size = 1;
		}

		if(Cursor.currentCursorType == Cursor.default){

			Draw.ctx.setTransform(1, 0, 0, 1, Mouse.canvasX + 8, Mouse.canvasY + 12); 
			Draw.ctx.rotate(this.rotateAngleAnimation * Math.PI / 180);
			this.animation.draw(drawsDiffMs, false, 
				(-this.width / 2 + 1) * this.size, //x
				(-this.height / 2 - 18) * this.size, //y
				this.width * this.size,  //width
				this.height * this.size);  //height
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);

		}
		else{ //sword/swordRed
			
			for(var i = 0; i < 3; i++){
				var size = this.size / 1.5;
				Draw.ctx.setTransform(1, 0, 0, 1, Mouse.canvasX + 5 + 6 * i, Mouse.canvasY + 5 + 5 * i); 
				Draw.ctx.rotate(this.rotateAngleAnimation * Math.PI / 180);
				this.animation.draw(i == 0 ? drawsDiffMs : 0, isGameOver, 
					(-this.width / 2 + 0 * size) * size , //x
					(-this.height / 2 - 0 * size) * size, //y
					this.width * size,  //width
					this.height / 2 * size);  //height
				Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
				Draw.ctx.rotate(0);
			}

		}

	}

	drawFireExplosions(drawsDiffMs: number, isGameOver: boolean){
		for(var i = 0; i < this.fireExplosions.length; i++)
		{
			var fireExplosion = this.fireExplosions[i];

			if(!isGameOver){
				fireExplosion.leftTimeMs -= drawsDiffMs;
				if(fireExplosion.leftTimeMs <= 0){
					this.fireExplosions.splice(i, 1);
					i--;
					continue;
				}
			}

			var animation = FireCursorModifier.fireExplosionAnimation;
			let newWidth = (animation.image.width / animation.frames) * (fireExplosion.size.height / (animation.image.height));
			animation.leftTimeMs = fireExplosion.leftTimeMs;
			animation.draw(drawsDiffMs, isGameOver, fireExplosion.location.x - (newWidth - fireExplosion.size.width) / 2, fireExplosion.location.y, newWidth, fireExplosion.size.height);
		}
	}
}
