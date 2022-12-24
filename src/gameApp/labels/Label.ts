import {Draw} from "../gameSystems/Draw";

import {Helper} from "../helpers/Helper";


export class Label{
	id: string;
	x: number;
	y: number;
	text: string;

	red: number;
	green: number;
	blue: number;
	
	isDecreaseOpacity: boolean;

	isDisplayBackground: boolean;
	backgroundRed: number;
	backgroundGreen: number;
	backgroundBlue: number;

	leftTimeMs: number;
	readonly lifeTimeMs: number;

	constructor(
		x: number, y: number, 
		text: string, 
		red: number, green: number, blue: number, 
		lifeTimeMs: number,
		isDecreaseOpacity: boolean = true,
		isDisplayBackground: boolean = false,
		backgroundRed: number = 0, backgroundGreen: number = 0, backgroundBlue: number = 0)
	{
		this.id = Helper.generateUid();
		this.x = x;
		this.y = y;
		this.text = text;

		this.isDecreaseOpacity = isDecreaseOpacity;

		this.isDisplayBackground = isDisplayBackground;
		this.red = red;
		this.green = green;
		this.blue = blue;
		
		this.backgroundRed = backgroundRed;
		this.backgroundGreen = backgroundGreen;
		this.backgroundBlue = backgroundBlue;

		this.leftTimeMs = lifeTimeMs;
		this.lifeTimeMs = lifeTimeMs;
	}

	logic(drawsDiffMs: number){
		this.leftTimeMs -= drawsDiffMs;
	}

	draw(){
		let opacity = this.isDecreaseOpacity && this.leftTimeMs < this.lifeTimeMs / 2
			? Math.abs(this.leftTimeMs / (this.lifeTimeMs / 2))
			: 1;

		if(this.isDisplayBackground){
			Draw.ctx.fillStyle = `rgba(${this.backgroundRed},${this.backgroundGreen},${this.backgroundBlue},${opacity})`;
			Draw.ctx.font = "16px Calibri";
			Draw.ctx.fillText(this.text, this.x -1, this.y - 1);
		}

		Draw.ctx.fillStyle = `rgba(${this.red},${this.green},${this.blue},${opacity})`;
		Draw.ctx.font = "14px Calibri";
		Draw.ctx.fillText(this.text, this.x, this.y);
	}
}