import {Building} from '../gameObjects/Building';
import {Gamer} from '../gameObjects/Gamer';
import {Labels} from './Labels';
import {Buildings} from './Buildings';
import {Draw} from './Draw';

import SmokeImage from '../../assets/img/smoke.png'; 

/** Режим строительства */
export class Builder {

	static selectedBuildingForBuild: Building | null = null; //выбранное строение для постройки
	static smokeImage: HTMLImageElement = new Image();  
	static isDrawSmoke: boolean = false; //пора отрисовывать дым при постройке?
	static buildTime: number; //время постройки
	static readonly smokeFrames: number = 10; 
	static readonly smokeLifeTime: number = 1000; //в миллисекундах

	static init(isLoadImage: boolean = true){
		if(isLoadImage){
			this.smokeImage.src = SmokeImage;
		}
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isRightClick: boolean){
		if(this.selectedBuildingForBuild && !this.isDrawSmoke){
			this.selectedBuildingForBuild.x = mouseX - this.selectedBuildingForBuild.width / 2;
			if(isClick){
				Gamer.coins -= this.selectedBuildingForBuild.price;
				Labels.createRed(
					this.selectedBuildingForBuild.x + this.selectedBuildingForBuild.width, 
					this.selectedBuildingForBuild.y + this.selectedBuildingForBuild.height / 3, 
					'-' + this.selectedBuildingForBuild.price,
					2);
				
				Buildings.all.push(this.selectedBuildingForBuild);
				this.isDrawSmoke = true;
				this.buildTime = Date.now();
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
				Draw.ctx.drawImage(this.smokeImage, 
					this.smokeImage.width / this.smokeFrames * frame, //crop from x
					0, //crop from y
					this.smokeImage.width / this.smokeFrames, //crop by width
					this.smokeImage.height,    //crop by height
					this.selectedBuildingForBuild.x - this.selectedBuildingForBuild.width / 2, //draw from x
					this.selectedBuildingForBuild.y + this.selectedBuildingForBuild.height - newHeight,  //draw from y
					smokeWidth, //draw by width 
					newHeight); //draw by height 
			}
			else{
				this.selectedBuildingForBuild.draw(millisecondsFromStart, isGameOver);
			}
		}
	}
}