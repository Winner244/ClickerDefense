import {Building} from '../buildings/Building';
import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';
import {ILogicalObject} from '../../models/objects/ILogicalObject';


/** Система управления движущимися объектами со своей внутренней логикой - единичный статичный класс */
export class MovingObjects{
	static all: ILogicalObject[] = []; //все объекты под управлением класса

	static logic(drawsDiffMs: number, isGameOver: boolean, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(isGameOver){
			return;
		}

		for(let i = 0; i < this.all.length; i++)
		{
			let item = this.all[i];

			//логика 
			item.logic(drawsDiffMs, buildings, monsters, units, bottomShiftBorder)

			//уничтожение
			if (item.isEnd){
                this.all.splice(i, 1);
                i--;
                continue;
			}
		}
	}

	static draw(drawsDiffMs: number, isGameOver: boolean): void{
		this.all.forEach(magic => magic.draw(drawsDiffMs, isGameOver));
	}
}