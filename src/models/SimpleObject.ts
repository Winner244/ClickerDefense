import {Point} from './Point';
import {Size} from './Size';


export class SimpleObject{
	public size: Size;
	public location: Point;
	public leftTimeMs: number; //оставшеея время жизни объекта (миллисекунды)

	constructor(x: number, y: number, width: number, height: number, lifeTimeMs: number){
		this.location = new Point(x, y);
		this.size = new Size(width, height);
		this.leftTimeMs = lifeTimeMs;
	}
}