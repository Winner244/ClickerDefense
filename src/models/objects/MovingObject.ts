import {SimpleObject} from './SimpleObject';


export class MovingObject extends SimpleObject{
	public dx: number;
	public dy: number;
	public rotate: number;
	// optional damage carried by this moving object (used for projectiles)
	public damage?: number;
	// optional image to draw for this moving object
	public image?: HTMLImageElement;

	constructor(x: number, y: number, width: number, height: number, lifeTimeMs: number, dx: number, dy: number, rotate: number, damage: number = 0, image?: HTMLImageElement){
		super(x, y, width, height, lifeTimeMs);
		this.dx = dx;
		this.dy = dy;
		this.rotate = rotate;
		this.damage = damage;
		this.image = image;
	}

	public logic(drawsDiffMs: number){
		this.location.x += this.dx * (drawsDiffMs / 1000);
		this.location.y += this.dy * (drawsDiffMs / 1000);
		this.leftTimeMs -= drawsDiffMs;
	}
}