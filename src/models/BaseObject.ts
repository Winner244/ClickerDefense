import {Point} from './Point';
import {Size} from './Size';


export class BaseObject{
	public size: Size;
	public location: Point;

	constructor(x: number, y: number, width: number, height: number){
		this.location = new Point(x, y);
		this.size = new Size(width, height);
	}

	get centerX(){
		return this.location.x + this.size.width / 2;
	}
	get centerY(){
		return this.location.y + this.size.height / 2;
	}
}