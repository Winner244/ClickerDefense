import {Building} from '../gameObjects/Building';
import {Monster} from '../gameObjects/Monster';
import {Draw} from '../gameSystems/Draw';

import towerImage from '../../assets/img/buildings/tower/tower.png';  
import arrowImage from '../../assets/img/buildings/tower/arrow.png';  
import fireArrowImage from '../../assets/img/buildings/tower/fireArrow.png';  
import fireIcon from '../../assets/img/icons/fire.png';  
import swordIcon from '../../assets/img/icons/sword.png';  
import bowmanIcon from '../../assets/img/icons/bow.png';  
import rechargeIcon from '../../assets/img/icons/recharge.png';  
import radiusIcon from '../../assets/img/icons/radius.png';  

import arrowStrikeSound from '../../assets/sounds/buildings/tower/arrow_strike.mp3';   

import sortBy from 'lodash/sortBy';
import { MovingObject } from '../../models/MovingObject';
import { Helper } from '../helpers/Helper';
import InfoItem from '../../models/InfoItem';
import Improvement from '../../models/Improvement';
import ImprovementInfoItem from '../../models/ImprovementInfoItem';
import { Gamer } from '../gameObjects/Gamer';
import { AudioSystem } from '../gameSystems/AudioSystem';

export class Tower extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 200 * 0.7;
	static readonly height: number = 425 * 0.7;


	static readonly imageArrow: HTMLImageElement = new Image();
	static readonly price: number = 50; //цена здания
	static readonly initArrowSpeed: number = 500; 

	static readonly improvementFireArrows = new Improvement('Огненные стрелы');

	bowmans: number = 1; //кол-во лучников
	damage: number = 1; //урон от одной атаки
	arrowSpeed: number = Tower.initArrowSpeed; //скорость полёта стрелы (в пикселях за секунду)
	radiusAttack: number = 400; //радиус атаки
	rechargeTime: number = 1000; //время перезарядки (в миллисекундах)

	private _rechargeLeft: number = 0; //сколько осталось времени перезарядки
	private _arrows: MovingObject[] = [];
	private _bowmansWaiting: number = 0; //сколько стрелков ещё не отстрелялось?
	private _bowmansDelayLeft: number = 0; //сколько осталось времени до стрельбы следующего лучника
	private _isDisplayRadius: boolean = false; //рисовать радиус атаки? 

	constructor(x: number) {
		super(x, 
			(Draw.canvas ? Draw.canvas.height : 0) - Tower.height + 10, 
			false,
			true, //isLand
			'Сторожевая башня', 
			Tower.image, 0, 0, Tower.width, Tower.height, 15, 
			100, //health max
			Tower.price, // price
			'Стреляет по монстрам в радиусе действия.',
			true, true);

		this.maxImpulse = 5;
		this.impulseForceDecreasing = 5;

		this.infoItems.splice(1, 0, new InfoItem('Урон', () => this.damage, swordIcon, 40, () => this.damage += 1));
		this.infoItems.splice(2, 0, new InfoItem('Лучников', () => this.bowmans, bowmanIcon, 40 * 2, () => this.bowmans += 1));
		this.infoItems.splice(3, 0, new InfoItem('Перезарядка', () => (this.rechargeTime / 1000).toFixed(2) + ' сек', rechargeIcon, 40, () => this.rechargeTime *= 0.9));
		this.infoItems.splice(4, 0, new InfoItem('Радиус атаки', () => this.radiusAttack, radiusIcon, 40, () => this.radiusAttack += 100, this.displayRadius.bind(this), this.hideRadius.bind(this) ));
		this.infoItems.splice(5, 0, new InfoItem('Скорость стрел', () => this.arrowSpeed, '', 10, () => this.arrowSpeed += 150));

		this.improvements.push(Tower.improvementFireArrows);

		Tower.init(true);
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage){
			this.image.src = towerImage; 
			this.imageArrow.src = arrowImage; 
			this.improvementFireArrows.image.src = fireArrowImage;
		}
		this.improvementFireArrows.infoItems = [
			new ImprovementInfoItem('+', fireIcon)
		];
	}

	get centerY(){
		return this.y + this.height / 4;
	}

	displayRadius(){
		this._isDisplayRadius = true;
	}

	hideRadius(){
		this._isDisplayRadius = false;
	}

	logic(millisecondsDifferent: number, monsters: Monster[], bottomShiftBorder: number)
	{
		super.logic(millisecondsDifferent, monsters, bottomShiftBorder);

		if(this._rechargeLeft > 0){ //перезарядка
			this._rechargeLeft -= millisecondsDifferent;
			this._bowmansDelayLeft -= millisecondsDifferent;
		}
		else{
			this._bowmansWaiting = this.bowmans;
		}

		if(this._bowmansDelayLeft <= 0 && this._bowmansWaiting > 0) {
			if(monsters.length){
				let monstersInRadius = monsters.filter(monster => Helper.getDistance(this.centerX, this.centerY, monster.centerX, monster.centerY) < this.radiusAttack);
				if (monstersInRadius.length){

					const skipCount = this.bowmans <= monstersInRadius.length 
						? this.bowmans - this._bowmansWaiting 
						: (this.bowmans - this._bowmansWaiting) % monstersInRadius.length;

					let sortedMonstersByDistance: Monster[] = [];
					if(this.bowmans > 1){
						const landMonsters = sortBy(monstersInRadius.filter(x => x.isLand), [monster => Helper.getDistance(this.centerX, this.centerY, monster.centerX, monster.centerY)]);
						const flyMonsters = sortBy(monstersInRadius.filter(x => !x.isLand), [monster => Helper.getDistance(this.centerX, this.centerY, monster.centerX, monster.centerY)]);
						sortedMonstersByDistance = (skipCount % 2 == 0 ? landMonsters : flyMonsters).concat((skipCount % 2 == 0 ? flyMonsters : landMonsters));
					}
					else{
						sortedMonstersByDistance = sortBy(monstersInRadius, [monster => Helper.getDistance(this.centerX, this.centerY, monster.centerX, monster.centerY)]);
					}
					
					const monsterGoal = sortedMonstersByDistance[skipCount];

					if(monsterGoal){ //в радиусе атаки
						let x1 = this.centerX - Tower.imageArrow.width / 2;
						let y1 = this.centerY - Tower.imageArrow.height / 2;
						let x2 = monsterGoal.centerX - Tower.imageArrow.width / 2;
						let y2 = monsterGoal.centerY - Tower.imageArrow.height / 2;
	
						let rotate = Helper.getRotateAngle(x1, y1, x2, y2);
						let distance = Helper.getDistance(x1, y1, x2, y2);
						let dx = (x1 - x2) / (distance / this.arrowSpeed);
						let dy = (y1 - y2) / (distance / this.arrowSpeed);
	
						this._arrows.push(new MovingObject(x1, y1, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 20, dx, dy, rotate));
						AudioSystem.play(arrowStrikeSound, 1, false, this.arrowSpeed / Tower.initArrowSpeed, true);

						if(this._rechargeLeft <= 0){
							this._rechargeLeft = this.rechargeTime;
						}
						this._bowmansDelayLeft = this.rechargeTime / 10 / this.bowmans;
						this._bowmansWaiting--;
					}
				}
			}
		}

		for(let i = 0; i < this._arrows.length; i++)
		{
			let arrow = this._arrows[i];
			let endMoving = true;
			arrow.lifeTime -= millisecondsDifferent;

			//moving
			if(arrow.location.y + arrow.size.height < Draw.canvas.height - bottomShiftBorder - 10){
				arrow.location.x -= arrow.dx * (millisecondsDifferent / 1000);
				arrow.location.y -= arrow.dy * (millisecondsDifferent / 1000);
				endMoving = false;
			}

			//delete
			if(arrow.location.x + arrow.size.width < 0 || arrow.location.x > Draw.canvas.width || 
				arrow.location.y + arrow.size.height < 0 || arrow.location.y > Draw.canvas.height ||
				arrow.lifeTime < 0)
			{
				this._arrows.splice(i, 1);
				i--;
			}
			else if(!endMoving){
				let arrowCenterX = arrow.location.x + arrow.size.width / 2;
				let arrowCenterY = arrow.location.y + arrow.size.height / 2;
				let monsterGoal = monsters.find(monster => 
					arrowCenterX > monster.x && arrowCenterX < monster.x + monster.width && 
					arrowCenterY > monster.y && arrowCenterY < monster.y + monster.animation.image.height);
				if(monsterGoal){
					monsterGoal.health -= this.damage;
					this._arrows.splice(i, 1);
					i--;
				}
			}
		}
	}

	draw(millisecondsFromStart: number, isGameOver: boolean, isBuildingMode: boolean = false): void{
		//стрелы
		for(let i = 0; i < this._arrows.length; i++)
		{
			let arrow = this._arrows[i];

			Draw.ctx.setTransform(1, 0, 0, 1, arrow.location.x + arrow.size.width / 2, arrow.location.y + arrow.size.height / 2); 
			Draw.ctx.rotate(arrow.rotate * Math.PI / 180);
			Draw.ctx.drawImage(Tower.imageArrow, -arrow.size.width / 2, -arrow.size.height / 2, arrow.size.width, arrow.size.height);
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);
		}

		//display radius attack
		if(isBuildingMode || this._isDisplayRadius){
			Draw.ctx.beginPath();
			Draw.ctx.arc(this.centerX, this.centerY, this.radiusAttack, 0, 2 * Math.PI, false);
			Draw.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
			Draw.ctx.fill();
			Draw.ctx.lineWidth = 2;
			Draw.ctx.strokeStyle = 'rgb(0, 255, 0)';
			Draw.ctx.stroke();
		}

		super.draw(millisecondsFromStart, isGameOver, isBuildingMode);
	}
}