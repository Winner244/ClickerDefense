import {Point} from "../../models/Point";

import {Draw} from "../gameSystems/Draw";

/** Данные по вводу клавиш через мышку - единичный статичный класс */
export class Mouse{
	static x: number;
	static y: number;
	static isClick: boolean;
	static isRightClick: boolean;

	static get canvasX(): number{
		return Mouse.x / (Draw.canvas.clientWidth / Draw.canvas.width)
	}

	static get canvasY(): number{
		return Mouse.y / (Draw.canvas.clientHeight / Draw.canvas.height);
	}

	static init(): void{
		window.removeEventListener('mousemove', Mouse.onMove);
		window.removeEventListener('mousedown', Mouse.onClick);
		window.addEventListener('mousemove', Mouse.onMove);
		window.addEventListener('mousedown', Mouse.onClick);
		this.isClick = false;
	}

	static onClick(event: MouseEvent): void{
		Mouse.isClick = event.button == 0;
		Mouse.isRightClick = event.button == 2;
	}

	static onMove(event: MouseEvent): void{
		let reactDiv = document.getElementById('react');
		let scrollTopMain = reactDiv?.scrollTop ?? 0;

		Mouse.x = event.pageX;
		Mouse.y = event.pageY + scrollTopMain;
	}

	static getCanvasMousePoint(): Point{
		let x = Mouse.x / (Draw.canvas.clientWidth / Draw.canvas.width);
		let y = Mouse.y / (Draw.canvas.clientHeight / Draw.canvas.height);
		return new Point(x, y);
	}
}