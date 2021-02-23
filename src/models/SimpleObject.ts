import {Point} from './Point';
import {Size} from './Size';


export class SimpleObject{
	public size: Size;
	public location: Point;
	public lifeTime: number;

	constructor(x: number, y: number, width: number, height: number, lifeTime: number){
		this.location = new Point(x, y);
		this.size = new Size(width, height);
		this.lifeTime = lifeTime;
	}
}