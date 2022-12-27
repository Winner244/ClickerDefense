import {Draw} from '../gameSystems/Draw';
import {Game} from '../gameSystems/Game';
import {AudioSystem} from '../gameSystems/AudioSystem';

import {Labels} from '../labels/Labels';

import {Building} from './Building';
import {Buildings} from './Buildings';

import {Gamer} from '../gamer/Gamer';

import Animation from '../../models/Animation';

import SmokeImage from '../../assets/img/smoke.png'; 

import BuildSoundUrl from '../../assets/sounds/buildings/placing.mp3'; 

/** Режим строительства - единичный статичный класс */
export class Builder {

	static readonly smokeAnimation: Animation = new Animation(10, 1000);  
	
	static selectedBuildingForBuild: Building | null = null; //выбранное строение для постройки

	private static _isDrawSmoke: boolean = false; //пора отрисовывать дым при постройке?
	private static _isAnotherBuilding: boolean = false; //курсор наведён на другое здание?

	static init(isLoadResources: boolean = true){
		if(isLoadResources){
			this.smokeAnimation.image.src = SmokeImage; //load image only once
			AudioSystem.load(BuildSoundUrl);
		}
		this.selectedBuildingForBuild = null;
	}

	static addBuilding(building: Building, y: number){
		this.init(true);
		this.selectedBuildingForBuild = building;
		this.selectedBuildingForBuild.y = y;
		this._isDrawSmoke = false;
	}

	static finish(){
		this.selectedBuildingForBuild = null;
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isRightClick: boolean){
		if(this.selectedBuildingForBuild && !this._isDrawSmoke){
			this.selectedBuildingForBuild.x = mouseX - this.selectedBuildingForBuild.width / 2;
			this._isAnotherBuilding = Buildings.all.filter(x => x.isLand).some(x => mouseX > x.x && mouseX < x.x + x.width);
			if(isClick && !this._isAnotherBuilding){
				Gamer.coins -= this.selectedBuildingForBuild.price;
				Labels.createCoinLabel(
					this.selectedBuildingForBuild.x + this.selectedBuildingForBuild.width, 
					this.selectedBuildingForBuild.y + this.selectedBuildingForBuild.height / 3, 
					'-' + this.selectedBuildingForBuild.price,
					2000);
				
				Buildings.all.push(this.selectedBuildingForBuild);
				this._isDrawSmoke = true;
				this.smokeAnimation.restart();
				AudioSystem.play(mouseX, BuildSoundUrl, 0.15);
				Game.loadResourcesAfterBuild(this.selectedBuildingForBuild);
				return;
			}
			else if(isRightClick){
				this.selectedBuildingForBuild = null;
				return;
			}
		}
	}

	static logic(){
		if(this.selectedBuildingForBuild && this._isDrawSmoke){
			if(this.smokeAnimation.leftTimeMs <= 0){
				this.selectedBuildingForBuild = null;
				this._isDrawSmoke = false;
			}
		}
	}

	static draw(drawsDiffMs: number, isGameOver: boolean): void{
		if(this.selectedBuildingForBuild){
			if(this._isDrawSmoke){
				let smokeWidth = this.selectedBuildingForBuild.width * 2;
				let newHeight = this.smokeAnimation.image.height * (smokeWidth / (this.smokeAnimation.image.width / this.smokeAnimation.frames));
				const x = this.selectedBuildingForBuild.x - this.selectedBuildingForBuild.width / 2;
				const y = this.selectedBuildingForBuild.y + this.selectedBuildingForBuild.height - newHeight;
				this.smokeAnimation.draw(drawsDiffMs, isGameOver, x, y, smokeWidth, newHeight);
				Draw.ctx.globalAlpha = 1;
			}
			else{
				if(this._isAnotherBuilding){
					Draw.ctx.filter="grayscale(1) ";
				}
				this.selectedBuildingForBuild.draw(drawsDiffMs, isGameOver, true);
				Draw.ctx.filter="none";
			}
		}
	}
}