import {AnimatedObject} from "../../models/AnimatedObject";

/** Система управления отдельными анимациями - единичный статичный класс */
export class AnimationsSystem{
	private static all: AnimatedObject[] = [];

	public static add(animation: AnimatedObject) {
		this.all.push(animation);
	}

	public static logic(): void {
		for(let i = 0; i < this.all.length; i++){
			if(this.all[i].leftTimeMs <= 0){
				this.all.splice(i, 1);
				i--;
			}
		}
	}

	static draw(drawsDiffMs: number, isGameOver: boolean): void{
		this.all.forEach(element => element.draw(drawsDiffMs, isGameOver));
	}

}

