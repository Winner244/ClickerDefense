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

	leftTimeMilliseconds: number;
	readonly lifeTimeMilliseconds: number;

	constructor(
		x: number, y: number, 
		text: string, 
		red: number, green: number, blue: number, 
		lifeTimeMilliseconds: number,
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

		this.leftTimeMilliseconds = lifeTimeMilliseconds;
		this.lifeTimeMilliseconds = lifeTimeMilliseconds;
	}

	logic(millisecondsDifferent: number){
		this.leftTimeMilliseconds -= millisecondsDifferent;
	}

	draw(){
		let opacity = this.isDecreaseOpacity && this.leftTimeMilliseconds < this.lifeTimeMilliseconds / 2
			? Math.abs(this.leftTimeMilliseconds / (this.lifeTimeMilliseconds / 2))
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