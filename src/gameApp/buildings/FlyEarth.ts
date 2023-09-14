

import {Building} from './Building';

import {ImageHandler} from '../ImageHandler';

import {Coins} from '../coins/Coins';

import {AudioSystem} from '../gameSystems/AudioSystem';
import {Draw} from '../gameSystems/Draw';

import {Particle} from '../../models/Particle';
import Animation from '../../models/Animation';

import {Cursor} from '../gamer/Cursor';

import FlyEarthImage from '../../assets/img/buildings/flyEarth.png';  
import ExplosionImage from '../../assets/img/explosionBomb.png'; 

import PickSoundUrl1 from '../../assets/sounds/buildings/flyEarth/pick1.mp3'; 
import PickSoundUrl2 from '../../assets/sounds/buildings/flyEarth/pick2.mp3'; 
import PickSoundUrl3 from '../../assets/sounds/buildings/flyEarth/pick3.mp3'; 
import PickSoundUrl4 from '../../assets/sounds/buildings/flyEarth/pick4.mp3'; 

import ExplosionSound from '../../assets/sounds/buildings/explosion_building.mp3'; 

/** Летающая земля - главное здание в еденичном экземпляре */
export class FlyEarth extends Building{
	static readonly imageHandler: ImageHandler = new ImageHandler();
	static readonly image: HTMLImageElement = new Image();
	static readonly explosionAnimation: Animation = new Animation(8, 800); //анимация взрыва 

	private _explosionParticles: Particle[] = [];

	constructor(x: number, y: number) {
		super(x, y, false, false, FlyEarth.name, 0.75,
			FlyEarth.image, 4, 700, 15, 
			100, 0, false, false,
			FlyEarth.imageHandler);

		FlyEarth.init(true);
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			FlyEarth.imageHandler.new(FlyEarth.image).src = FlyEarthImage;
			AudioSystem.load(PickSoundUrl1);
			AudioSystem.load(PickSoundUrl2);
			AudioSystem.load(PickSoundUrl3);
			AudioSystem.load(PickSoundUrl4);
		}
	}

	static loadExplosionResources(){
		this.explosionAnimation.image.src = ExplosionImage;
		AudioSystem.load(ExplosionSound);
	}

	private static playSoundPick(x: number){
		const listOfSounds = [
			PickSoundUrl1,
			PickSoundUrl2,
			PickSoundUrl3,
			PickSoundUrl4
		];
		AudioSystem.playRandomV(x, listOfSounds, 0.05);
		AudioSystem.playRandomTone(x, 0.02, 5000, 10000);
	}

	mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isWaveStarted: boolean, isWaveEnded: boolean, isMouseIn: boolean, isBuilderActive: boolean): boolean{
		if(isWaveStarted && isMouseIn)
		{
			Cursor.setCursor(Cursor.pick);
	
			if(isClick){
				let coinX = this.x + this.reduceHover + Math.random() * (this.width - this.reduceHover * 2);
				let coinY = this.y + this.height / 2;
				Coins.create(coinX, coinY);
				Cursor.setCursor(Cursor.pickYellow);
				FlyEarth.playSoundPick(mouseX);
			}
			
			return true;
		}

		return super.mouseLogic(mouseX, mouseY, isClick, isWaveStarted, isWaveEnded, isMouseIn, isBuilderActive);
	}

	createExplosionParticles(){
		if(this._explosionParticles.length){
			return;
		}

		this._explosionParticles = [];

		const imgData = Draw.ctx.getImageData(this.x, this.y, this.width, this.height);
		for (let i = 0, y = 0; y < imgData.height; y += 2){
			for (let x = 0; x < imgData.width; x += 2) {
				i = x * 4 + y * imgData.width * 4;
				if(imgData.data[i + 3] == 255){
					const xIn = Math.round(this.x + x);
					const yIn = Math.round(this.y + y);
					const dx = (xIn - this.centerX) / 10 * Math.random();
					const dy = (yIn - this.centerY) / 10 * Math.random();
					this._explosionParticles.push(new Particle(xIn, yIn, 1, 1, 0, dx, dy, 0, imgData.data[i + 0], imgData.data[i + 1], imgData.data[i + 2]));
				}
			}
		}
	}

	startExplosion(){
		AudioSystem.play(this.centerX, ExplosionSound, 0.5, 1, false);
	}

	draw(drawsDiffMs: number, isGameOver: boolean): void {
		if(this.health <= 0){
			this.drawExplosion(drawsDiffMs);
		}
		else{
			super.draw(drawsDiffMs, isGameOver, false, false);
			if(!this._explosionParticles.length){
				this.createExplosionParticles(); //requires image on canvas without excess elements around
			}
		}
	}

	drawExplosion(drawsDiffMs: number): void {
		if(FlyEarth.explosionAnimation.leftTimeMs > 0){
			FlyEarth.explosionAnimation.draw(drawsDiffMs, false, this.x - this.width, this.y - this.height, this.width * 3, this.height * 3);
		}

		this._explosionParticles = this._explosionParticles.filter(p => {
			p.location.x += p.dx;
			p.location.y += p.dy;
			//p.dy += 0.1
			Draw.ctx.fillStyle = `rgb(${p.red}, ${p.green}, ${p.blue})`;
			Draw.ctx.fillRect(p.location.x, p.location.y, 3, 3);

			Draw.ctx.beginPath(); 
			Draw.ctx.moveTo(p.location.x - p.dx * 5, p.location.y - p.dy * 5); 
			Draw.ctx.lineTo(p.location.x, p.location.y); 
			Draw.ctx.strokeStyle = `rgb(${p.red}, ${p.green}, ${p.blue})`;
			Draw.ctx.lineWidth = 1;
			Draw.ctx.stroke(); 

			return p.location.x > 0 && p.location.x < Draw.canvas.width &&
				p.location.y > 0 && p.location.y < Draw.canvas.height && 
				Math.random() > 0.05;
		});
	}
}