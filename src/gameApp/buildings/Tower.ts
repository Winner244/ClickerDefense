import {Building} from '../gameObjects/Building';
import {Monster} from '../gameObjects/Monster';
import {Draw} from '../gameSystems/Draw';

import towerImage from '../../assets/img/buildings/tower/tower.png';  
import arrowImage from '../../assets/img/buildings/tower/arrow.png';  

import sortBy from 'lodash/sortBy';
import { MovingObject } from '../../models/MovingObject';
import { Helper } from '../helpers/Helper';

export class Tower extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 200 * 0.7;
	static readonly height: number = 425 * 0.7;

	static readonly radiusAttack: number = 400; //радиус атаки
	static readonly rechargeTime: number = 1000; //время перезарядки (в миллисекундах)
	static readonly damage: number = 1; //урон от 1 атаки

	static readonly imageArrow: HTMLImageElement = new Image();
	static readonly arrowSpeed: number = 500; //скорость полёта стрелы (в пикселях за секунду)

	rechargeLeft: number = 0; //сколько осталось времени перезарядки
	arrows: MovingObject[] = [];

	constructor(x: number) {
		super(x, 
			(Draw.canvas ? Draw.canvas.height : 0) - Tower.height + 10, 
			false,
			true, 
			'Сторожевая башня', 
			Tower.image, 0, Tower.width, Tower.height, 15, 
			25, 
			50,
			'Стреляет по наземным и воздушным монстрам в радиусе действия.');
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage){
			this.image.src = towerImage; 
			this.imageArrow.src = arrowImage; 
		}
	}

	get centerY(){
		return this.y + this.height / 4;
	}

	logic(millisecondsDifferent: number, monsters: Monster[], bottomShiftBorder: number)
	{
		if(this.rechargeLeft > 0){ //перезарядка
			this.rechargeLeft -= millisecondsDifferent;
		}
		else{
			if(monsters.length){
				var monstersInRadius = monsters.filter(monster => Helper.getDistance(this.centerX, this.centerY, monster.centerX, monster.centerY) < Tower.radiusAttack);
				let monsterGoal = sortBy(monstersInRadius, [monster => Helper.getDistance(this.centerX, this.centerY, monster.centerX, monster.centerY)])[0];
				if(monsterGoal){ //в радиусе атаки
					let x1 = this.centerX - Tower.imageArrow.width / 2;
					let y1 = this.centerY - Tower.imageArrow.height / 2;
					let x2 = monsterGoal.centerX - Tower.imageArrow.width / 2;
					let y2 = monsterGoal.centerY - Tower.imageArrow.height / 2;

					let rotate = Helper.getRotateAngle(x1, y1, x2, y2);
					let distance = Helper.getDistance(x1, y1, x2, y2);
					let dx = (x1 - x2) / (distance / Tower.arrowSpeed);
					let dy = (y1 - y2) / (distance / Tower.arrowSpeed);

					this.arrows.push(new MovingObject(x1, y1, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 20, dx, dy, rotate));
					this.rechargeLeft = Tower.rechargeTime;
				}
			}
		}

		for(let i = 0; i < this.arrows.length; i++)
		{
			let arrow = this.arrows[i];
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
				this.arrows.splice(i, 1);
				i--;
			}
			else if(!endMoving){
				let arrowCenterX = arrow.location.x + arrow.size.width / 2;
				let arrowCenterY = arrow.location.y + arrow.size.height / 2;
				let monsterGoal = monsters.find(monster => 
					arrowCenterX > monster.x && arrowCenterX < monster.x + monster.width && 
					arrowCenterY > monster.y && arrowCenterY < monster.y + monster.image.height);
				if(monsterGoal){
					monsterGoal.health -= Tower.damage;
					this.arrows.splice(i, 1);
					i--;
				}
			}
		}
	}

	draw(millisecondsFromStart: number, isGameOver: boolean, isBuildingMode: boolean = false): void{
		for(let i = 0; i < this.arrows.length; i++)
		{
			let arrow = this.arrows[i];

			Draw.ctx.setTransform(1, 0, 0, 1, arrow.location.x + arrow.size.width / 2, arrow.location.y + arrow.size.height / 2); 
			Draw.ctx.rotate(arrow.rotate * Math.PI / 180);
			Draw.ctx.drawImage(Tower.imageArrow, -arrow.size.width / 2, -arrow.size.height / 2, arrow.size.width, arrow.size.height);
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);
		}

		//display radius attack
		if(isBuildingMode){
			Draw.ctx.beginPath();
			Draw.ctx.arc(this.centerX, this.centerY, Tower.radiusAttack, 0, 2 * Math.PI, false);
			Draw.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
			Draw.ctx.fill();
			Draw.ctx.lineWidth = 2;
			Draw.ctx.strokeStyle = 'rgb(0, 255, 0)';
			Draw.ctx.stroke();
		}

		super.draw(millisecondsFromStart, isGameOver, isBuildingMode);
	}
}