import {Building} from '../gameObjects/Building';
import {Gamer} from '../gameObjects/Gamer';
import {Labels} from './Labels';
import {Buildings} from './Buildings';
import {Draw} from './Draw';
import {AudioSystem} from './AudioSystem';

import SmokeImage from '../../assets/img/smoke.png'; 
import BuildSoundUrl from '../../assets/sounds/buildings/placing.mp3'; 

/** Режим строительства */
export class Builder {

	private static selectedBuildingForBuild: Building | null = null; //выбранное строение для постройки
	private static smokeImage: HTMLImageElement = new Image();  
	private static isDrawSmoke: boolean = false; //пора отрисовывать дым при постройке?
	private static buildTime: number; //время постройки
	private static readonly smokeFrames: number = 10; 
	private static readonly smokeLifeTime: number = 1000; //в миллисекундах
	private static isAnotherBuilding: boolean = false; //курсор наведён на другое здание?

	static init(isLoadImage: boolean = true){
		if(isLoadImage){
			this.smokeImage.src = SmokeImage; //load image only once
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
				this.buildTime = Date.now();
				this.playSoundBuild();
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
			if(this.buildTime + this.smokeLifeTime < Date.now()){
				this.selectedBuildingForBuild = null;
				this.isDrawSmoke = false;
			}
		}
	}

	static draw(millisecondsFromStart: number, isGameOver: boolean): void{
		if(this.selectedBuildingForBuild){
			if(this.isDrawSmoke){
				let frame = isGameOver ? 0 : Math.floor((Date.now() - this.buildTime) / this.smokeLifeTime * this.smokeFrames);
				let smokeWidth = this.selectedBuildingForBuild.width * 2;
				let newHeight = this.smokeImage.height * (smokeWidth / (this.smokeImage.width / this.smokeFrames));
				//Draw.ctx.globalAlpha = Math.max(0, (this.smokeLifeTime - (Date.now() - this.buildTime)) / this.smokeLifeTime);  // opacity
				Draw.ctx.drawImage(this.smokeImage,
					this.smokeImage.width / this.smokeFrames * frame, //crop from x
					0, //crop from y
					this.smokeImage.width / this.smokeFrames, //crop by width
					this.smokeImage.height,    //crop by height
					this.selectedBuildingForBuild.x - this.selectedBuildingForBuild.width / 2, //x
					this.selectedBuildingForBuild.y + this.selectedBuildingForBuild.height - newHeight,  //y
					smokeWidth, //displayed width 
					newHeight); //displayed height
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

	

	private static playSoundBuild(){
		AudioSystem.play(BuildSoundUrl, 0.2);
	}
}