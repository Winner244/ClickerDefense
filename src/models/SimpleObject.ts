import {Point} from './Point';
import {Size} from './Size';


export class SimpleObject{
	public size: Size;
	public location: Point;
	public leftTimeMs: number; //оставшеея время жизни объекта (миллисекунды)
	public readonly initialLeftTimeMs: number; //изначальное время жизни

	constructor(x: number, y: number, width: number, height: number, lifeTimeMs: number){
		this.location = new Point(x, y);
		this.size = new Size(width, height);
		this.leftTimeMs = lifeTimeMs;
		this.initialLeftTimeMs = lifeTimeMs;
	}

	get centerX(){
		return this.location.x + this.size.width / 2;
	}
	get centerY(){
		return this.location.y + this.size.height / 2;
	}

	get width(){
		return this.size.width;
	}
	get height(){
		return this.size.height;
	}

	get x(){
		return this.location.x;
	}
	get y(){
		return this.location.y;
	}
}