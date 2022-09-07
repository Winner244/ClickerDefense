import { Draw } from "../gameApp/gameSystems/Draw";

export default class Animation{
	image: HTMLImageElement; //изображение с несколькими кадрами в ряд
	frames: number; //количество кадров на изображении
	duration: number; //время полной анимации в миллисекундах
	timeCreated: number;

	constructor(frames: number, duration: number, image: HTMLImageElement|null = null)
	{
		this.image = image || new Image();
		this.frames = frames;
		this.duration = duration;
		this.timeCreated = Date.now();
	}

	draw(isGameOver: boolean, x: number, y: number, width: number, height: number, lifeTime: number|null = null, timeCreated: number|null = null){
		let lifeTimeAnimation = lifeTime != null 
			? this.duration - lifeTime 
			: (Date.now() - (timeCreated || this.timeCreated));
		let frame = isGameOver ? 0 : Math.floor(lifeTimeAnimation % this.duration / (this.duration / this.frames));
		Draw.ctx.drawImage(this.image, 
			this.image.width / this.frames * frame, //crop from x
			0, //crop from y
			this.image.width / this.frames, //crop by width
			this.image.height,    //crop by height
			x, //x
			y,  //y
			width, //displayed width 
			height); //displayed height 
	}
}