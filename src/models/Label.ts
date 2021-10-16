export class Label{
	x: number;
	y: number;
	text: string;
	red: number;
	green: number;
	blue: number;
	timeCreated: number;
	lifeTime: number;

	constructor(x: number, y: number, text: string, red: number, green: number, blue: number, lifeTime: number){
		this.x = x;
		this.y = y;
		this.text = text;
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.timeCreated = Date.now();
		this.lifeTime = lifeTime;
	}
}