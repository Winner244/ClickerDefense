import {Building} from '../gameObjects/Building';
import {Monster} from '../gameObjects/Monster';
import {Draw} from '../gameSystems/Draw';
import towerImage from '../../assets/img/buildings/tower.png';  
import sortBy from 'lodash/sortBy';

export class Tower extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 200 * 0.7;
	static readonly height: number = 425 * 0.7;

	static readonly radiusAttack: number = 400; //радиус атаки
	static readonly rechargeTime: number = 1000; //время перезарядки (в миллисекундах)
	static readonly damage: number = 1; //урон от 1 атаки

	rechargeLeft: number = 0; //сколько осталось времени перезарядки

	constructor(x: number) {
		super(x, 
			(Draw.canvas ? Draw.canvas.height : 0) - Tower.height + 10, 
			false,
			true, 
			'Сторожевая башня', 
			Tower.image, 0, Tower.width, Tower.height, 15, 
			100, 
			500, 
			'Стреляет по наземным и воздушным монстрам в радиусе действия.');
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage){
			this.image.src = towerImage; 
		}
	}

	logic(millisecondsDifferent: number, monsters: Monster[])
	{
		if(this.rechargeLeft > 0){ //перезарядка
			this.rechargeLeft -= millisecondsDifferent;
		}
		else{
			if(monsters.length){
				let monsterGoal = sortBy(monsters, [monster => Math.abs(this.x - monster.x)])[0];
				if(Math.abs(this.x - monsterGoal.x) < Tower.radiusAttack){ //в радиусе атаки
					monsterGoal.health -= Tower.damage;
					this.rechargeLeft = Tower.rechargeTime;
				}
			}
		}
	}
}