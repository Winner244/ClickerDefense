import {Building} from '../gameObjects/Building';
import {Gamer} from '../gameObjects/Gamer';
import Animation from '../../models/Animation';
import {Labels} from './Labels';
import {Buildings} from './Buildings';
import {Draw} from './Draw';
import {AudioSystem} from './AudioSystem';

import SmokeImage from '../../assets/img/smoke.png'; 
import BuildSoundUrl from '../../assets/sounds/buildings/placing.mp3'; 

/** Режим строительства */
export class Builder {

	private static selectedBuildingForBuild: Building | null = null; //выбранное строение для постройки
	private static smokeAnimation: Animation = new Animation(10, 1000);  
	private static isDrawSmoke: boolean = false; //пора отрисовывать дым при постройке?
	private static isAnotherBuilding: boolean = false; //курсор наведён на другое здание?

	static init(isLoadResources: boolean = true){
		if(isLoadResources){
			this.smokeAnimation.image.src = SmokeImage; //load image only once
		}
		this.selectedBuildingForBuild = null;
	}

	static addBuilding(building: Building, y: number){
		this.init(true);
		this.selectedBuildingForBuild = building;
		this.selectedBuildingForBuild.y = y;
		this.isDrawSmoke = false;
	}

	static finish(){
		this.selectedBuildingForBuild = null;
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isRightClick: boolean){
		if(this.selectedBuildingForBuild && !this.isDrawSmoke){
			this.selectedBuildingForBuild.x = mouseX - this.selectedBuildingForBuild.width / 2;
			this.isAnotherBuilding = Buildings.all.filter(x => x.isLand).some(x => mouseX > x.x && mouseX < x.x + x.width);
			if(isClick && !this.isAnotherBuilding){
				Gamer.coins -= this.selectedBuildingForBuild.price;
				Labels.createCoinLabel(
					this.selectedBuildingForBuild.x + this.selectedBuildingForBuild.width, 
					this.selectedBuildingForBuild.y + this.selectedBuildingForBuild.height / 3, 
					'-' + this.selectedBuildingForBuild.price,
					2000);
				
				Buildings.all.push(this.selectedBuildingForBuild);
				this.isDrawSmoke = true;
				this.smokeAnimation.timeCreated = Date.now();
				this.playSoundBuild(mouseX);
				return;
			}
			else if(isRightClick){
				this.selectedBuildingForBuild = null;
				return;
			}
		}
	}

	static logic(){
		if(this.selectedBuildingForBuild && this.isDrawSmoke){
			if(this.smokeAnimation.timeCreated + this.smokeAnimation.duration < Date.now()){
				this.selectedBuildingForBuild = null;
				this.isDrawSmoke = false;
			}
		}
	}

	static draw(millisecondsFromStart: number, isGameOver: boolean): void{
		if(this.selectedBuildingForBuild){
			if(this.isDrawSmoke){
				let smokeWidth = this.selectedBuildingForBuild.width * 2;
				let newHeight = this.smokeAnimation.image.height * (smokeWidth / (this.smokeAnimation.image.width / this.smokeAnimation.frames));
				const x = this.selectedBuildingForBuild.x - this.selectedBuildingForBuild.width / 2;
				const y = this.selectedBuildingForBuild.y + this.selectedBuildingForBuild.height - newHeight;
				this.smokeAnimation.draw(isGameOver, x, y, smokeWidth, newHeight);
				Draw.ctx.globalAlpha = 1;
			}
			else{
				if(this.isAnotherBuilding){
					Draw.ctx.filter="grayscale(1) ";
				}
				this.selectedBuildingForBuild.draw(millisecondsFromStart, isGameOver, true);
				Draw.ctx.filter="none";
			}
		}
	}

	

	private static playSoundBuild(x: number){
		AudioSystem.play(x, BuildSoundUrl, 0.15);
	}
}