import Animation from './Animation';

import {SimpleObject} from './SimpleObject';


export class AnimatedObject extends SimpleObject{
	public animation: Animation;

	constructor(x: number, y: number, width: number, height: number, animation: Animation){
		super(x, y, width, height, animation.leftTimeMs);

		this.animation = animation;
	}

	draw(drawsDiffMs: number, isGameOver: boolean){
		this.animation.draw(drawsDiffMs, isGameOver, this.location.x, this.location.y, this.size.width, this.size.height);
		this.leftTimeMs = this.animation.leftTimeMs;
	}
}