

import {Building} from './Building';

import {Coins} from '../coins/Coins';

import {AudioSystem} from '../gameSystems/AudioSystem';
import {Draw} from '../gameSystems/Draw';

import {Particle} from '../../models/Particle';

import {Cursor} from '../gamer/Cursor';

import flyEarthImage from '../../assets/img/buildings/flyEarth.png';  

import PickSoundUrl1 from '../../assets/sounds/buildings/flyEarth/pick1.mp3'; 
import PickSoundUrl2 from '../../assets/sounds/buildings/flyEarth/pick2.mp3'; 
import PickSoundUrl3 from '../../assets/sounds/buildings/flyEarth/pick3.mp3'; 
import PickSoundUrl4 from '../../assets/sounds/buildings/flyEarth/pick4.mp3'; 


/** Летающая земля - главное здание в еденичном экземпляре */
export class FlyEarth extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 375;
	static readonly height: number = 279;

	static readonly animationExplosionLifeTimeMs: number = 3000;
	animationExplosionLifeTimeLeftMs: number = FlyEarth.animationExplosionLifeTimeMs;
	private _particles: Particle[] = [];

	constructor(x: number, y: number) {
		super(x, y, false, false, FlyEarth.name, FlyEarth.image, 4, 700, FlyEarth.width, FlyEarth.height, 15, 100, 0, '', false, false);

		FlyEarth.init(true);
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			this.image.src = flyEarthImage;  //load image only once
			AudioSystem.load(PickSoundUrl1);
			AudioSystem.load(PickSoundUrl2);
			AudioSystem.load(PickSoundUrl3);
			AudioSystem.load(PickSoundUrl4);
		}
	}

	private static playSoundPick(x: number){
		var listOfSounds = [
			PickSoundUrl1,
			PickSoundUrl2,
			PickSoundUrl3,
			PickSoundUrl4
		];
		AudioSystem.playRandomV(x, listOfSounds, 0.05);
		AudioSystem.playRandomTone(x, 0.01, 5000, 10000);
	}

	mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isWaveStarted: boolean, isWaveEnded: boolean, isMouseIn: boolean): boolean{
		if(isWaveStarted && isMouseIn)
		{
			Cursor.setCursor(Cursor.pick);
	
			if(isClick){
				let coinX = this.x + this.reduceHover + Math.random() * (FlyEarth.width - this.reduceHover * 2);
				let coinY = this.y + FlyEarth.height / 2;
				Coins.create(coinX, coinY);
				Cursor.setCursor(Cursor.pickYellow);
				FlyEarth.playSoundPick(mouseX);
			}
			
			return true;
		}

		return super.mouseLogic(mouseX, mouseY, isClick, isWaveStarted, isWaveEnded, isMouseIn);
	}

	createExplosionParticles(){
		if(this._particles.length){
			return;
		}

		this.animationExplosionLifeTimeLeftMs = FlyEarth.animationExplosionLifeTimeMs;
		this._particles = [];

		const imgData = Draw.ctx.getImageData(this.x, this.y, this.width, this.height);
		for (let i = 0, y = 0; y < imgData.height; y++){
			for (let x = 0; x < imgData.width; x++, i+= 4) {
				if(imgData.data[i + 3] == 255){
					const xIn = Math.round(this.x + x);
					const yIn = Math.round(this.y + y);
					let dx = (xIn - this.centerX) / 3 * Math.random();
					let dy = (yIn - this.centerY) / 3 * Math.random();
					this._particles.push(new Particle(xIn, yIn, 1, 1, 0, dx, dy, 0, imgData.data[i + 0], imgData.data[i + 1], imgData.data[i + 2]));
				}
			}
		}
	}

	draw(drawsDiffMs: number, isGameOver: boolean, isBuildingMode?: boolean): void {
		if(this.health <= 0){
			if(this.animationExplosionLifeTimeLeftMs > 0){
				this.drawExplosion(drawsDiffMs);
			}
		}
		else{
			super.draw(drawsDiffMs, isGameOver, isBuildingMode);
			if(!this._particles.length){
				this.createExplosionParticles();
			}
		}
	}

	drawExplosion(drawsDiffMs: number): void {
		this.animationExplosionLifeTimeLeftMs -= drawsDiffMs;
		for (let i = 0; i < this._particles.length; i++) {
			const particle = this._particles[i];
			particle.location.x += particle.dx;
			particle.location.y += particle.dy;
			Draw.ctx.fillStyle = `rgb(${particle.red}, ${particle.green}, ${particle.blue})`;
			//Draw.ctx.fillStyle = `black`;
			Draw.ctx.fillRect(particle.location.x, particle.location.y, 1, 1);
		  }
	}
}