import {SimpleObject} from './SimpleObject';


export class MovingObject extends SimpleObject{
	public dx: number;
	public dy: number;
	public rotate: number;

	constructor(x: number, y: number, width: number, height: number, lifeTime: number, dx: number, dy: number, rotate: number){
		super(x, y, width, height, lifeTime);
		this.dx = dx;
		this.dy = dy;
		this.rotate = rotate;
	}
}