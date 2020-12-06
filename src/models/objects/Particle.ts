import { MovingObject } from './MovingObject';


export class Particle extends MovingObject{
	public red: number;
	public green: number;
	public blue: number;

	constructor(x: number, y: number, width: number, height: number, lifeTimeMs: number, dx: number, dy: number, rotate: number, red: number, green: number, blue: number){
		super(x, y, width, height, lifeTimeMs, dx, dy, rotate);
		this.red = red;
		this.green = green;
		this.blue = blue;
	}
}