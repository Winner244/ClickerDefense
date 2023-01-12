import {MovingObject} from './MovingObject';


export class Arrow extends MovingObject{
	public isFire: boolean;
	public isDynamit: boolean;

	constructor(x: number, y: number, width: number, height: number, lifeTimeMs: number, dx: number, dy: number, rotate: number, isFire: boolean = false, isDynamit: boolean = false){
		super(x, y, width, height, lifeTimeMs, dx, dy, rotate);
		this.isFire = isFire;
		this.isDynamit = isDynamit;
	}
}