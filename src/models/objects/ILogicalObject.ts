import { Building } from "../../gameApp/buildings/Building"
import { Monster } from "../../gameApp/monsters/Monster"
import { Unit } from "../../gameApp/units/Unit"

/** Интерфейс для объектов с логикой внутри (создан для отдельно движущихся стрел, шаров, элементов от строений/монстров/юнитов/игрока) */
export interface ILogicalObject {

	isEnd: boolean; //объект пора уничтожать? 

    logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number): void

    draw(drawsDiffMs: number, isGameOver: boolean): void
}