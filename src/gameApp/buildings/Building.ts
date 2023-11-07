import {Monster} from '../monsters/Monster';
import {Unit} from '../units/Unit';

import {UpgradebleObject} from '../../models/UpgradebleObject';

import {ImageHandler} from '../ImageHandler';

import {Draw} from '../gameSystems/Draw';
import {AudioSystem} from '../gameSystems/AudioSystem';

import {BuildingButtons} from '../../reactApp/components/BuildingButtons/BuildingButtons';

import RepairSoundUrl from '../../assets/sounds/buildings/repair.m4a'; 
import RepairHammerSoundUrl from '../../assets/sounds/buildings/repair_hammer.mp3'; 

import HammerImage from '../../assets/img/buttons/hammer.png';

/** Базовый класс для всех зданий */
export class Building extends UpgradebleObject{
	static readonly repairImage: HTMLImageElement = new Image(); //картинка для анимации починки
	static readonly repairAnimationDurationMs: number = 1800; //продолжительность анимации починки (миллисекунды)


	//технические поля экземпляра
	protected _impulsePharos: number; //маятниковый импульс от сверх ударов и сотрясений (0 - середина, значение движется от Z образно между отрицательными и положительными велечинами в пределах максимального значения по abs)
	protected _impulsePharosSign: boolean; //знак маятникового импульса в данный момент (0 - уменьшение, 1 - увеличение), нужен для указания Z образного движение по мере затухания импульса
	protected _impulsePharosForceDecreasing: number; //сила уменьшения маятникового импульса
	
	protected _repairAnimationLeftTimeMs: number; //оставшееся время отображения анимации починки (миллисекунды)
	protected _repairAnimationAngle: number; //угол поворота картинки в анимации
	protected _repairAnimationSign: boolean; //ударяет ли молоток? иначе возвращается обратно

	constructor(
		x: number, 
		y: number, 
		isLeftSide: boolean, 
		isLand: boolean, 
		name: string, 
		scaleSize: number,
		image: HTMLImageElement, 
		frames: number, 
		animationDurationMs: number,
		reduceHover: number, 
		healthMax: number,
		price: number,
		isSupportRepair: boolean,
		isSupportUpgrade: boolean,
		imageHandler: ImageHandler)
	{
		super(x, y, isLeftSide, isLand, name, scaleSize, image, frames, animationDurationMs, reduceHover, healthMax, price, isSupportRepair, isSupportUpgrade, imageHandler);

		this.maxImpulse = 10;
		this.impulseForceDecreasing = 1;
		
		this._impulsePharos = 0;
		this._impulsePharosSign = false;
		this._impulsePharosForceDecreasing = 5;

		this._repairAnimationSign = false;
		this._repairAnimationLeftTimeMs = this._repairAnimationAngle = 0;
	}

	static loadRepairResources(): void{
		Building.repairImage.src = HammerImage;
		AudioSystem.load(RepairSoundUrl);
		AudioSystem.load(RepairHammerSoundUrl);
	}


	public set impulseX(value: number){
		if(value > this.maxImpulse){
			value = this.maxImpulse;
		}
		if(value < this.maxImpulse * -1){
			value = this.maxImpulse * -1;
		}

		this._impulsePharosSign = value < 0 ? true : false;
		this._impulsePharos = value;
		this._impulseX = value >= -1 && value <= 1 ? 0 : value;
	}
	public get impulseX(): number{
		if(this._impulseX >= -1 && this._impulseX <= 1){
			return 0;
		}

		return this._impulseX;
	}

	logic(drawsDiffMs: number, buildings: Building[], monsters: Monster[], units: Unit[], bottomShiftBorder: number){
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.logicBase(drawsDiffMs);
		
		if(this._impulseX < -1 || this._impulseX > 1){
			this._impulsePharos -= (this._impulsePharosSign ? -1 : 1) * drawsDiffMs / 1000 * (this._impulseX * this._impulsePharosForceDecreasing);

			if(this._impulsePharos < -this._impulseX){
				this._impulsePharosSign = !this._impulsePharosSign;
				this._impulsePharos = -this._impulseX;
			}

			if(this._impulsePharos > this._impulseX){
				this._impulsePharosSign = !this._impulsePharosSign;
				this._impulsePharos = this._impulseX;
			}
		}

		if(this.y + this.height - bottomShiftBorder > Draw.canvas.height){
			this.y = Draw.canvas.height - this.height;
		}
	}

	displayRecoveryAnimationLogic(drawsDiffMs: number){
		this._repairAnimationLeftTimeMs -= drawsDiffMs;
		if(this._repairAnimationLeftTimeMs <= 0){
			this._isDisplayRecoveryAnimation = this._repairAnimationSign = false;
			this._repairAnimationAngle = 0;
		}
		else{
			if(this._repairAnimationSign){
				this._repairAnimationAngle += 23;

				if(this._repairAnimationAngle > 90){
					this._repairAnimationSign = false;
				}
			}
			else{
				this._repairAnimationAngle-=8;

				if(this._repairAnimationAngle < 0){
					this._repairAnimationSign = true;
				}
			}
		}
	}

	recovery(): boolean{
		let result = super.recovery();
		if(result){
			AudioSystem.play(this.centerX, RepairSoundUrl, -5, 1, false, true);
			AudioSystem.play(this.centerX, RepairHammerSoundUrl, -10, 1, false, true);
			this._repairAnimationLeftTimeMs = Building.repairAnimationDurationMs;
		}

		return result;
	}

	buttonsLogic(isDisplayRecoveryButton: boolean){
		if(!BuildingButtons.isEnterMouse){
			let x = (this.x + this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
			let y = (this.y + this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
			let width = (this.width - 2 * this.reduceHover) * Draw.canvas.clientWidth / Draw.canvas.width;
			let height = (this.height - 2 * this.reduceHover) * Draw.canvas.clientHeight / Draw.canvas.height;
			let repairPrice = this.getRecoveryPrice();
			let isDisplayUpgradeButton = this.isSupportUpgrade && !this.isDisplayedUpgradeWindow && this.health > 0;
			BuildingButtons.show(x, y, width, height, isDisplayRecoveryButton, isDisplayUpgradeButton, repairPrice, this);
		}
	}

	draw(drawsDiffMs: number, isGameOver: boolean, isBuildingMode: boolean = false, isAnotherBuildingHereInBuildingMode: boolean = false): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		let x = this.x;
		let y = this.y;

		if(this.impulseX != 0){
			Draw.ctx.setTransform(1, 0, 0, 1, this.x + this.width / 2, this.y + this.height); 
			Draw.ctx.rotate(this._impulsePharos * Math.PI / 180);
			x = -this.width / 2;
			y = -this.height;
		}

		let filter: string|null = null;
		if (this.isDisplayedUpgradeWindow) {
			filter = 'brightness(1.7)';
		}
		else if (isAnotherBuildingHereInBuildingMode) {
			filter = 'grayscale(1)';
		}

		super.drawBase(drawsDiffMs, isGameOver, x, y, filter);

		if(this.impulseX != 0){
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);
		}
	}

	drawHealth(): void{
		if(!this.imageHandler.isImagesCompleted){
			return;
		}

		super.drawHealthBase(this.x + 15, this.y - 10, this.width - 30);
	}

	drawRepairingAnimation(): void{
		if(this._isDisplayRecoveryAnimation){
			Draw.ctx.setTransform(1, 0, 0, 1, this.x + 50, this.y + this.height / 2 + 50 / 2); 
			Draw.ctx.rotate((this._repairAnimationAngle - 45) * Math.PI / 180);
			Draw.ctx.drawImage(Building.repairImage, -25, -50, 50, 50);
			Draw.ctx.setTransform(1, 0, 0, 1, 0, 0);
			Draw.ctx.rotate(0);
		}
	}
}