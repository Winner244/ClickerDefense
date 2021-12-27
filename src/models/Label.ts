export class Label{
	x: number;
	y: number;
	text: string;
	red: number;
	green: number;
	blue: number;
	timeCreated: number;
	lifeTimeMilliseconds: number;

	constructor(x: number, y: number, text: string, red: number, green: number, blue: number, lifeTimeMilliseconds: number){
		this.x = x;
		this.y = y;
		this.text = text;
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.timeCreated = Date.now();
		this.lifeTimeMilliseconds = lifeTimeMilliseconds;
	}
}