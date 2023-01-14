import {SimpleObject} from "../../models/SimpleObject";
import { Draw } from "./Draw";

/** Система для помощи в тестировании - единичный статичный класс */
export class TestSystem{
	private static all: SimpleObject[] = [];

	public static add(point: SimpleObject) {
		this.all.push(point);
	}

	public static logic(drawsDiffMs: number): void {
		for(let i = 0; i < this.all.length; i++){
			this.all[i].leftTimeMs -= drawsDiffMs;
			if(this.all[i].leftTimeMs <= 0){
				this.all.splice(i, 1);
				i--;
			}
		}
	}

	static draw(drawsDiffMs: number, isGameOver: boolean): void{
		this.all.forEach(element => {
			Draw.ctx.beginPath();
			Draw.ctx.arc(element.location.x, element.location.y + element.size.height - 50, element.size.width, 0, 2 * Math.PI, false);
			Draw.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
			Draw.ctx.fill();
			Draw.ctx.lineWidth = 2;
			Draw.ctx.strokeStyle = 'rgb(0, 255, 0)';
			Draw.ctx.stroke();
		});
	}

}

