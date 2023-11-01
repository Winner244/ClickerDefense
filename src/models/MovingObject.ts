import {SimpleObject} from './SimpleObject';


export class MovingObject extends SimpleObject{
	public dx: number;
	public dy: number;
	public rotate: number;

	constructor(x: number, y: number, width: number, height: number, lifeTimeMs: number, dx: number, dy: number, rotate: number){
		super(x, y, width, height, lifeTimeMs);
		this.dx = dx;
		this.dy = dy;
		this.rotate = rotate;
	}

	public logic(drawsDiffMs: number){
		this.location.x += this.dx * (drawsDiffMs / 1000);
		this.location.y += this.dy * (drawsDiffMs / 1000);
		this.leftTimeMs -= drawsDiffMs;
	}
}