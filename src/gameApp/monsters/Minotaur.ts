import {ImageHandler} from '../ImageHandler';

import {Monster} from './Monster';
import {Building} from '../buildings/Building';
import {Draw} from '../gameSystems/Draw';
import {Particle} from '../../models/objects/Particle';
import {Helper} from '../helpers/Helper';

import MinotaurImage from '../../assets/img/monsters/minotaur/minotaur.png'; 

import MinotaurAttack1Image from '../../assets/img/monsters/minotaur/attack.png'; 


/** Минотавр - наземный монстр */
export class Minotaur extends Monster{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	
	private static readonly image: HTMLImageElement = new Image();
	private static readonly attackImage: HTMLImageElement = new Image();

	private _attackParticles: Particle[] = [];
	private static _attackParticlesLifeTimeMs: number = 1000; // время жизни частиц отлетаемых от зданий от удара (в Миллисекундах)
	private static _attackParticlesSpeed: number = 20; // скорость частиц отлетаемых от зданий от удара

	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		super(x, y,
			scaleSize,
			isLeftSide,
			true,  //isLand
			Minotaur.name,
			Minotaur.image, 10,
			2000,   //speed animation
			Minotaur.attackImage, 10,
			1500,  //speed animation attack
			25,    //reduce hover
			50,    //health
			25,    //damage
			1480,   //time attack waiting
			1400,   //time first attack waiting
			40,    //speed
			Minotaur.imageHandler,
			3000); //avrTimeSoundWaitMs

		this._shiftY = -10;
		this._attackParticles = [];
		this.explositionScaleSize = 0.6;

		Minotaur.init(true); //reserve init
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && Minotaur.imageHandler.isEmpty){
			Minotaur.imageHandler.new(Minotaur.image).src = MinotaurImage;
			Minotaur.imageHandler.new(Minotaur.attackImage).src = MinotaurAttack1Image;
		}
	}

	get shiftXForCenter(){
		return (this.isLeftSide ? -1 : 1) * this.width * 0.13;
	}
	get shiftYForCenter(){
		return this.height / 10;
	}

	attack(damage: number): void{
		super.attack(damage);

		//создаём анимацию разлёта частиц 
		if(damage > 0 && this._goal && this._goal.currentCanvas){
			var context = this._goal.currentCanvas.getContext('2d');
			if(context){
				const goalAnim = this._goal.animation;
				const goalFrame = goalAnim ? goalAnim.getCurrentFrame(false) : 0;
				const goalImg: HTMLImageElement = goalAnim ? goalAnim.image.getImage() : this._goal.image;
				const goalFrames: number = goalAnim ? goalAnim.frames : 1;
				const goalFrameWidth = Math.floor(goalImg.width / Math.max(1, goalFrames));
				var goalData = context.getImageData(goalFrame * goalFrameWidth, 0, goalFrameWidth, goalImg.height).data; //быстрее весь кусок достать, чем по пикселю потом доставать
				for (let i = 0, y = 0; y < goalImg.height; y += 11){
					for (let x = 0; x < goalFrameWidth; x += 11) {
						if(Math.random() > 0.5){
							i = x * 4 + y * goalFrameWidth * 4;

							if(goalData[i + 3] > 179){
								const speed = Helper.getRandom(Minotaur._attackParticlesSpeed / 3, Minotaur._attackParticlesSpeed);
								const xx = x * this._goal.scaleSize + this._goal.x
								const yy = y * this._goal.scaleSize + this._goal.y;
								const dx = (xx > this._goal.centerX ? 1 : -1) * speed;
								const dy = (yy > this._goal.centerY + goalImg.height / 3 ? 1 : -1) * speed;
								
								var particle = new Particle(
									xx, 
									yy, 
									2, 2, 
									Minotaur._attackParticlesLifeTimeMs, 
									dx, dy, 
									0, 
									goalData[i + 0], goalData[i + 1], goalData[i + 2]);
								this._attackParticles.push(particle);
							}
						}
					}
				}
			}
		}
	}

	draw(drawsDiffMs: number, isGameOver: boolean): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.draw(drawsDiffMs, isGameOver);

		// draw flying particles
		this._attackParticles = this._attackParticles.filter(p => {
			p.logic(drawsDiffMs);

			Draw.ctx.fillStyle = `rgba(${p.red}, ${p.green}, ${p.blue}, ${p.leftTimeMs / Minotaur._attackParticlesLifeTimeMs})`;
			Draw.ctx.fillRect(p.location.x, p.location.y, p.width, p.height);

			Draw.ctx.beginPath();
			Draw.ctx.moveTo(p.location.x - p.dx / 4, p.location.y - p.dy / 4);
			Draw.ctx.lineTo(p.location.x, p.location.y);
			Draw.ctx.strokeStyle = `rgba(${p.red}, ${p.green}, ${p.blue}, ${p.leftTimeMs / Minotaur._attackParticlesLifeTimeMs})`;
			Draw.ctx.lineWidth = p.width / 2;
			Draw.ctx.stroke();

			return p.location.x > 0 && p.location.x < Draw.canvas.width &&
				p.location.y > 0 && p.location.y < Draw.canvas.height &&
				p.leftTimeMs > 0;
		});
	}

	drawHealth(){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.drawHealthBase(this.isLeftSide ? this.x + 50 : this.x + this.width / 2 - 50, this.y + this.height / 5, this.width / 2);
	}

	drawMofidiersBehindObject(drawsDiffMs: number, isGameOver: boolean){
		var scaleSize = 0.125 * this.scaleSize + 0.275; //0.4 for scale 1, 0.35 for scale 0.6
		var shiftX = (this.isLeftSide ? -this.width / 3 : this.width / 3.8) * scaleSize;
		var shiftY = (this.height / 3) * scaleSize;

		if(this._isAttack){
			var frame = this.attackAnimation.getCurrentFrame(false);
			shiftX = frame < 7 ? shiftX - frame * 5 * (this.isLeftSide ? 1 : -1) : shiftX + 10 * (this.isLeftSide ? 1 : -1);
		}

		this.modifiers.forEach(modifier => modifier.drawBehindObject(this, drawsDiffMs, isGameOver, shiftX - this.shiftXForCenter, shiftY - this.shiftYForCenter, scaleSize));
	}

}
Object.defineProperty(Minotaur, "name", { value: 'Minotaur', writable: false }); //fix production minification class names
