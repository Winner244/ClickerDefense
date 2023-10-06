

import {Building} from './Building';

import {ImageHandler} from '../ImageHandler';

import {Coins} from '../coins/Coins';

import {AudioSystem} from '../gameSystems/AudioSystem';
import {Draw} from '../gameSystems/Draw';

import {Particle} from '../../models/Particle';
import Animation from '../../models/Animation';
import AnimationInfinite from '../../models/AnimationInfinite';

import {SimpleObject} from '../../models/SimpleObject';

import {Cursor} from '../gamer/Cursor';

import FlyEarthImage from '../../assets/img/buildings/flyEarth/flyEarth.png';  
import Crystal1Image from '../../assets/img/buildings/flyEarth/crystal1.png';  
import Crystal2Image from '../../assets/img/buildings/flyEarth/crystal2.png';  
import Crystal3Image from '../../assets/img/buildings/flyEarth/crystal3.png';  
import Crystal4Image from '../../assets/img/buildings/flyEarth/crystal4.png';  
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

	private static readonly frames: number = 4;
	private static readonly animationDuration: number = 700;
	private static readonly scaleSize: number = 0.75;


	//отдельные кристаллы - нужны для отрисовки золотодобытчиков на летающей земле за кристаллами (сама картинка земли так же имеет эти кристаллы)
	private static readonly crystal1Image: AnimationInfinite = new AnimationInfinite(FlyEarth.frames, FlyEarth.animationDuration);
	private static readonly crystal2Image: AnimationInfinite = new AnimationInfinite(FlyEarth.frames, FlyEarth.animationDuration);
	private static readonly crystal3Image: AnimationInfinite = new AnimationInfinite(FlyEarth.frames, FlyEarth.animationDuration);
	private static readonly crystal4Image: AnimationInfinite = new AnimationInfinite(FlyEarth.frames, FlyEarth.animationDuration);

	private _explosionParticles: Particle[] = [];

	constructor(x: number, y: number) {
		super(x, y, false, false, FlyEarth.name, FlyEarth.scaleSize,
			FlyEarth.image, FlyEarth.frames, FlyEarth.animationDuration, 15, 
			100, 0, false, false,
			FlyEarth.imageHandler);

		FlyEarth.init(true);
	}

	//позиция кристалов, если нижняя часть майнера внутри него - то нужно отрисовать кристалл поверх
	public get crystal1PositionReDraw(): SimpleObject{
		return new SimpleObject(this.x + 50 * FlyEarth.scaleSize, this.y + 160 * FlyEarth.scaleSize, 37 * FlyEarth.scaleSize, 37 * FlyEarth.scaleSize, 0);
	}
	public get crystal2PositionReDraw(): SimpleObject{
		return new SimpleObject(this.x + 139 * FlyEarth.scaleSize, this.y + 165 * FlyEarth.scaleSize, 41 * FlyEarth.scaleSize, 46 * FlyEarth.scaleSize, 0);
	}
	public get crystal3PositionReDraw(): SimpleObject{
		return new SimpleObject(this.x + 257 * FlyEarth.scaleSize, this.y + 153 * FlyEarth.scaleSize, 37 * FlyEarth.scaleSize, 35 * FlyEarth.scaleSize, 0);
	}
	public get crystal4PositionReDraw(): SimpleObject{
		return new SimpleObject(this.x + 374 * FlyEarth.scaleSize, this.y + 155 * FlyEarth.scaleSize, 35 * FlyEarth.scaleSize, 36 * FlyEarth.scaleSize, 0);
	}

	//позиция кристаллов, где майнеры не должны находится и пробегать
	public get crystal1PositionBlocking(): SimpleObject{
		return new SimpleObject(this.x + 57 * FlyEarth.scaleSize, this.y + 187 * FlyEarth.scaleSize, 27 * FlyEarth.scaleSize, 10 * FlyEarth.scaleSize, 0);
	}
	public get crystal2PositionBlocking(): SimpleObject{
		return new SimpleObject(this.x + 145 * FlyEarth.scaleSize, this.y + 197 * FlyEarth.scaleSize, 31 * FlyEarth.scaleSize, 14 * FlyEarth.scaleSize, 0);
	}
	public get crystal3PositionBlocking(): SimpleObject{
		return new SimpleObject(this.x + 260 * FlyEarth.scaleSize, this.y + 176 * FlyEarth.scaleSize, 23 * FlyEarth.scaleSize, 12 * FlyEarth.scaleSize, 0);
	}
	public get crystal4PositionBlocking(): SimpleObject{
		return new SimpleObject(this.x + 380 * FlyEarth.scaleSize, this.y + 177 * FlyEarth.scaleSize, 25 * FlyEarth.scaleSize, 17 * FlyEarth.scaleSize, 0);
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources && FlyEarth.imageHandler.isEmpty){
			FlyEarth.imageHandler.new(FlyEarth.image).src = FlyEarthImage;
			AudioSystem.load(PickSoundUrl1);
			AudioSystem.load(PickSoundUrl2);
			AudioSystem.load(PickSoundUrl3);
			AudioSystem.load(PickSoundUrl4);
		}
	}

	static loadSeparateCrystals(){
		if(!this.crystal1Image.image.src){
			this.crystal1Image.image.src = Crystal1Image;
			this.crystal2Image.image.src = Crystal2Image;
			this.crystal3Image.image.src = Crystal3Image;
			this.crystal4Image.image.src = Crystal4Image;
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

	drawCrystal1(drawsDiffMs: number, isGameOver: boolean){
		FlyEarth.crystal1Image.draw(drawsDiffMs, isGameOver, this.crystal1PositionReDraw.location.x, this.crystal1PositionReDraw.location.y, this.crystal1PositionReDraw.size.width, this.crystal1PositionReDraw.size.height);
	}
	drawCrystal2(drawsDiffMs: number, isGameOver: boolean){
		FlyEarth.crystal2Image.draw(drawsDiffMs, isGameOver, this.crystal2PositionReDraw.location.x, this.crystal2PositionReDraw.location.y, this.crystal2PositionReDraw.size.width, this.crystal2PositionReDraw.size.height);
	}
	drawCrystal3(drawsDiffMs: number, isGameOver: boolean){
		FlyEarth.crystal3Image.draw(drawsDiffMs, isGameOver, this.crystal3PositionReDraw.location.x, this.crystal3PositionReDraw.location.y, this.crystal3PositionReDraw.size.width, this.crystal3PositionReDraw.size.height);
	}
	drawCrystal4(drawsDiffMs: number, isGameOver: boolean){
		FlyEarth.crystal4Image.draw(drawsDiffMs, isGameOver, this.crystal4PositionReDraw.location.x, this.crystal4PositionReDraw.location.y, this.crystal4PositionReDraw.size.width, this.crystal4PositionReDraw.size.height);
	}
}