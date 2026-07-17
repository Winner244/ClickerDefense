import {ImageHandler} from '../ImageHandler';

import {Monster} from './Monster';

import {Draw} from '../gameSystems/Draw';
import {AudioSystem} from '../gameSystems/AudioSystem';

import {Building} from '../buildings/Building';

import {Unit} from '../units/Unit';

import {WaveData} from '../../models/WaveData';
import {AttackedObject} from '../../models/AttackedObject';

import EyeJupiterImage from '../../assets/img/monsters/eyeJupiter/eyeJupiter.png';
import AttackSound from '../../assets/sounds/monsters/eyeJupiter/attack.mp3';


/** Eye Jupiter - тип монстров */
export class EyeJupiter extends Monster{
	static readonly imageHandler: ImageHandler = new ImageHandler();

	private static readonly image: HTMLImageElement = new Image();
	private static readonly imageFrames = 1;

	private static readonly laserLength = 20;
	private static readonly laserSpeed = 720;
	public static laserSpawnOffsetX = -15;
	public static laserSpawnOffsetY = 6;
	private static readonly attackDistance = 100;
	public static readonly hoverShiftBase = 150;
	public static hoverShiftAmplitudePx = 1;
	private static readonly hoverWaveSpeed = 0.007;

	private _wavePhaseMs: number;
	private _laserHeadOffset: number;
	private _isLaserFlying: boolean;
	private _laserStartX: number;
	private _laserStartY: number;
	private _laserTargetX: number;
	private _laserTargetY: number;
	private _laserTargetObject: AttackedObject|null;
	private _laserDamage: number;

	constructor(x: number, y: number, isLeftSide: boolean, scaleSize: number) {
		EyeJupiter.init(true);

		super(x, y,
			scaleSize,
			isLeftSide,
			true, //isLand
			EyeJupiter.name,
			EyeJupiter.image,
			EyeJupiter.imageFrames,
			500,  //speed animation
			EyeJupiter.image,
			EyeJupiter.imageFrames,
			500,  //speed animation attack
			5,    //reduce hover
			10,    //health
			9,    //damage
			500,  //time attack wait
			0,    //time first attack waiting
			150,   //speed
			EyeJupiter.imageHandler,
			3000);//avrTimeSoundWaitMs

		this._wavePhaseMs = Math.random() * 1000;
		this._shiftY = EyeJupiter.hoverShiftBase;
		this._laserHeadOffset = 0;
		this._isLaserFlying = false;
		this._laserStartX = this.centerX;
		this._laserStartY = this.centerY;
		this._laserTargetX = this.centerX;
		this._laserTargetY = this.centerY;
		this._laserTargetObject = null;
		this._laserDamage = 0;
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			AudioSystem.load(AttackSound);
		}

		if(isLoadResources && EyeJupiter.imageHandler.isEmpty){
			EyeJupiter.imageHandler.new(EyeJupiter.image).src = EyeJupiterImage;
		}
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomBorder: number, waveLevel: WaveData[]): void{
		super.logic(drawsDiffMs, buildings, monsters, units, bottomBorder, waveLevel);

		this._wavePhaseMs += drawsDiffMs;
		this._shiftY = EyeJupiter.hoverShiftBase + Math.sin(this._wavePhaseMs * EyeJupiter.hoverWaveSpeed) * EyeJupiter.hoverShiftAmplitudePx;

		if(this._isLaserFlying){
			this._laserHeadOffset += EyeJupiter.laserSpeed * (drawsDiffMs / 1000);
			this._laserHeadOffset = Math.min(this._laserHeadOffset, this.getLaserMaxDistance());
		}

	}

	attack(damage: number): void{
		if(this._goal && !this._isLaserFlying){
			const direction = this.isLeftSide ? -1 : 1;
			this._laserStartX = this.centerX + EyeJupiter.laserSpawnOffsetX * direction;
			this._laserStartY = this.centerY + EyeJupiter.laserSpawnOffsetY;

			const spreadX = this._goal.width * 0.2;
			const spreadY = this._goal.height * 0.2;
			const targetX = this._goal.centerX + (Math.random() * 2 - 1) * spreadX;
			const targetY = this._goal.centerY + (Math.random() * 2 - 1) * spreadY;
			this._laserTargetX = Math.max(this._goal.x + 2, Math.min(this._goal.x + this._goal.width - 2, targetX));
			this._laserTargetY = Math.max(this._goal.y + 2, Math.min(this._goal.y + this._goal.height - 2, targetY));
			this._laserTargetObject = this._goal;
			this._laserDamage = damage;

			this._laserHeadOffset = 0;
			this._isLaserFlying = true;
			this._attackLeftTimeMs = this.attackTimeWaitingMs;
			AudioSystem.play(this.centerX, AttackSound, -10, 1, true);
		}
	}

	private getLaserStartPoint(): { x: number, y: number } {
		return {
			x: this._laserStartX,
			y: this._laserStartY,
		};
	}

	private getLaserTargetPoint(): { x: number, y: number } {
		if(this._isLaserFlying){
			return {
				x: this._laserTargetX,
				y: this._laserTargetY,
			};
		}

		if(this._goal){
			return {
				x: this._goal.centerX,
				y: this._goal.centerY,
			};
		}

		const start = { x: this.centerX, y: this.centerY };
		const direction = this.isLeftSide ? 1 : -1;
		return {
			x: start.x + direction * EyeJupiter.attackDistance,
			y: start.y,
		};
	}

	private getLaserDirection(): { x: number, y: number } {
		const start = this.getLaserStartPoint();
		const target = this.getLaserTargetPoint();
		const distance = Math.hypot(target.x - start.x, target.y - start.y) || 1;

		return {
			x: (target.x - start.x) / distance,
			y: (target.y - start.y) / distance,
		};
	}

	private getLaserMaxDistance(): number {
		const start = this.getLaserStartPoint();
		const target = this.getLaserTargetPoint();
		return Math.max(EyeJupiter.laserLength, Math.hypot(target.x - start.x, target.y - start.y));
	}

	logicMoving(drawsDiffMs: number, speed: number){
		if(this.testNumber == 555){
			return;
		}

		if(this._goal){
			if(this.isLeftSide){
				const attackStartX = this._goal.x - EyeJupiter.attackDistance;
				const isNeedMove = this.x + this.width < attackStartX;

				if(isNeedMove){
					if(this._isAttack && this._attackLeftTimeMs > this.attackTimeWaitingMs / 2){
						return;
					}
					this.x += speed;
					this._isAttack = false;
				}
				else{
					if(!this._isAttack){
						this.attackAnimation.restart();
					}
					this._isAttack = true;
				}
			}
			else{
				const attackStartX = this._goal.x + this._goal.width + EyeJupiter.attackDistance;
				const isNeedMove = this.x > attackStartX;

				if(isNeedMove){
					if(this._isAttack && this._attackLeftTimeMs > this.attackTimeWaitingMs / 2){
						return;
					}
					this.x -= speed;
					this._isAttack = false;
				}
				else{
					if(!this._isAttack){
						this.attackAnimation.restart();
					}
					this._isAttack = true;
				}
			}
		}
	}

	playSound(): void {
	}

	drawObject(drawsDiffMs: number, imageOrAnimation: any, isGameOver: boolean, invertSign: number = 1){
		if(this._isAttack){
			const frame = this.attackAnimation.draw(drawsDiffMs, isGameOver, invertSign * this.x, this.y, invertSign * this.attackWidth, this.attackHeight);
			this.setCanvas(this.attackAnimation, frame);
		}
		else{
			super.drawObject(drawsDiffMs, imageOrAnimation, isGameOver, invertSign);
		}

		if(this._isLaserFlying){
			const start = this.getLaserStartPoint();
			const laserDirection = this.getLaserDirection();
			const headX = start.x + laserDirection.x * this._laserHeadOffset;
			const headY = start.y + laserDirection.y * this._laserHeadOffset;
			const tailX = headX - laserDirection.x * EyeJupiter.laserLength;
			const tailY = headY - laserDirection.y * EyeJupiter.laserLength;

			Draw.ctx.save();
			Draw.ctx.strokeStyle = 'rgba(255, 0, 0, 0.95)';
			Draw.ctx.lineWidth = 2;
			Draw.ctx.beginPath();
			Draw.ctx.moveTo(invertSign * tailX, tailY);
			Draw.ctx.lineTo(invertSign * headX, headY);
			Draw.ctx.stroke();
			Draw.ctx.restore();

			if(this._laserHeadOffset >= this.getLaserMaxDistance()){
				if(this._laserTargetObject && this._laserDamage > 0 && this._laserTargetObject.health > 0){
					this._laserTargetObject.applyDamage(this._laserDamage, this._laserTargetX, this._laserTargetY, this);
				}
				this._laserTargetObject = null;
				this._laserDamage = 0;
				this._isLaserFlying = false;
			}
		}
	}
}
Object.defineProperty(EyeJupiter, "name", { value: 'EyeJupiter', writable: false }); //fix production minification class names