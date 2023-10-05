import {Helper} from "../helpers/Helper";

import {SimpleObject} from "../../models/SimpleObject";

import {Building} from "../buildings/Building";
import {Buildings} from "../buildings/Buildings";

import {Monster} from "../monsters/Monster";

import {Miner} from "./Miner";

import {Unit} from "./Unit";


/** Система управления всеми юнитами - единичный статичный класс */
export class Units {
	static all: Unit[] = []; //все созданные и пока ещё живые юниты
	static deaths: SimpleObject[] = []; //анимации гибели юнитов 

	
	static init(){
		Units.all = [];
	}

	static loadResources(){
		//this.deathAnimation.image.src = DeathImage;
		//AudioSystem.load(DeathSound);
	}

	static addMiner(){
		const flyEarth = Buildings.flyEarth;
		const miners = Units.all.filter(x => x.name == Miner.name).map(x => <Miner>x);
		const xMin = Buildings.flyEarth.x;
		const xMax = Buildings.flyEarth.x + Buildings.flyEarth.width - Miner.imageWidth - 10;
		var x = Helper.getRandom(xMin, xMax);
		var goalY = 0;

		//нельзя на других майнерах появляться
		if(miners.length < 20){
			var miner: Miner|null = null;
			var attemptsXMax = 150;
			do {
				var yMin = flyEarth.centerY - (flyEarth.width - Math.abs(flyEarth.centerX - x - Miner.imageWidth / 2)) / 6 + 32;
				var yMax = flyEarth.centerY + (flyEarth.width - Math.abs(flyEarth.centerX - x - Miner.imageWidth / 2)) / 7 - 32;
				goalY = Helper.getRandom(yMin, yMax);
				var xScaleSize = 1 - miners.length / 100 * 2;
				var yScaleSize = 0.75 - miners.length / 100 * 2;
				var xCompare = x + Miner.imageWidth * (1 - xScaleSize) / 2;
				var widthCompare = Miner.imageWidth * xScaleSize;
				var heightCompare = Miner.imageHeight * yScaleSize;

				var attemptsYMax = 10;
				do{
					var yCompare = goalY + Miner.imageHeight * (1 - yScaleSize) / 2;
					miner = miners.find(miner => Helper.isIntersectByCenter(miner.x, miner.goalY, miner.width, miner.height, xCompare, yCompare, widthCompare, heightCompare)) ?? null;
					if(miner){
						goalY += (yMax - yMin) / 10;
						if(goalY > yMax){
							goalY = yMin;
						}
						attemptsYMax--;
					}
				} while(miner && attemptsYMax > 0);

				if(miner){
					x += (xMax - xMin) / 150;
					if(x > xMax){
						x = xMin;
					}
					attemptsXMax--;
				}

				if(attemptsXMax == 0){
					console.log("can't find position for miner, created on another miner!");
				}
			} while(miner && attemptsXMax > 0);
		}

		//TODO: нельзя на кристаллах появляться
		const unit = new Miner(x, Buildings.flyEarth.y, goalY); //final 'y' will be changed inside Miner to equal 'goalY'
		Units.all.push(unit);
	}

	static add(unit: Unit){
		Units.all.push(unit);
	}

	static mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isHoverFound: boolean, isWaveStarted: boolean, isWaveEnded: boolean, isBuilderActive: boolean): boolean{
		let isProcessed = false;
		let isAnyMouseIn = false;

		if(isHoverFound){
			let units = this.all.slice().reverse();
			for(var i = 0; i < units.length; i++){
				let unit = units[i];
				let isMouseIn = 
					mouseX > unit.x + unit.reduceHover && 
					mouseX < unit.x + unit.width - unit.reduceHover &&
					mouseY > unit.y + unit.reduceHover && 
					mouseY < unit.y + unit.height - unit.reduceHover;
				isAnyMouseIn = isAnyMouseIn || isMouseIn;
				
				isProcessed = unit.mouseLogic(mouseX, mouseY, isClick, isWaveStarted, isWaveEnded, isMouseIn, isBuilderActive);
				if(isProcessed){
					break;
				}
			}
		}

		if(!isAnyMouseIn){
			//UnitsButtons.isEnterMouse = false;
		}

		return isProcessed;
	}

	static logic(drawsDiffMs: number, isWaveStarted: boolean, isGameOver: boolean, buildings: Building[], monsters: Monster[], bottomShiftBorder: number){
		//логика анимации гибели юнита
		if(this.deaths.length){
			for(let i = 0; i < this.deaths.length; i++){
				this.deaths[i].leftTimeMs -= drawsDiffMs;
				if(this.deaths[i].leftTimeMs <= 0){
					this.deaths.splice(i, 1);
					i--;
				}
			}
		}

		if(!isGameOver){
			for(let i = 0; i < this.all.length; i++)
			{
				let unit = this.all[i];
				if(this.all[i].health <= 0){ //проверка здоровья
					unit.destroy();
					//this.deaths.push(new SimpleObject(unit.x, unit.y, unit.width, unit.height, this.deathAnimation.durationMs));
					this.all.splice(i, 1);
					i--;
					//AudioSystem.play(unit.centerX, DeathSound, 0.1, 2, false, true);
				}
				else{
					unit.logic(drawsDiffMs, buildings, monsters, this.all, bottomShiftBorder, isWaveStarted)
				}
			}
		}
	}

	static clearModifiers(){
		Units.all.forEach(unit => unit.modifiers = []);
	}

	static draw(drawsDiffMs: number, isGameOver: boolean): void{
		//гибель юнитов
		this.deaths.forEach(explosion => {
			//let newHeight = this.deathAnimation.image.height * (explosion.size.width / (this.deathAnimation.image.width / this.deathAnimation.frames));
			//this.deathAnimation.leftTimeMs = explosion.leftTimeMs;
			//this.deathAnimation.draw(drawsDiffMs, false, explosion.location.x, explosion.location.y + explosion.size.height - newHeight, explosion.size.width, newHeight);
		});

		//отдельная отрисовка золотодобытчиков на летающей земле
		var miners = Units.all
			.filter(x => x.name == Miner.name)
			.map(x => <Miner>x)
			.sort((a: Miner, b: Miner) => a.goalY > b.goalY ? 1 : -1);
		
		if(miners.length){
			var prevMiner: Miner|null = null;

			miners.forEach(unit => {
				unit.draw(drawsDiffMs, isGameOver);
				this.drawFlyEarthCrystals(drawsDiffMs, isGameOver, prevMiner, <Miner>unit);
				prevMiner = <Miner>unit;
			});
			
			this.drawFlyEarthCrystals(drawsDiffMs, isGameOver, prevMiner);
		}

		//отрисовка остальных юнитов
		Units.all
			.filter(x => x.name != Miner.name)
			.forEach(unit => unit.draw(drawsDiffMs, isGameOver));
	}

	static drawFlyEarthCrystals(drawsDiffMs: number, isGameOver: boolean, prevMiner: Miner|null, nextMiner: Miner|null = null){
		if(!prevMiner){
			return;
		}

		var crystal1YBottom = Buildings.flyEarth.crystal1PositionReDraw.location.y + Buildings.flyEarth.crystal1PositionReDraw.size.height;
		var crystal2YBottom = Buildings.flyEarth.crystal2PositionReDraw.location.y + Buildings.flyEarth.crystal2PositionReDraw.size.height;
		var crystal3YBottom = Buildings.flyEarth.crystal3PositionReDraw.location.y + Buildings.flyEarth.crystal3PositionReDraw.size.height;
		var crystal4YBottom = Buildings.flyEarth.crystal4PositionReDraw.location.y + Buildings.flyEarth.crystal4PositionReDraw.size.height;

		if((!nextMiner || nextMiner.goalY > crystal1YBottom) && prevMiner.goalY < crystal1YBottom){
			Buildings.flyEarth.drawCrystal1(drawsDiffMs, isGameOver);
		}
		
		if((!nextMiner || nextMiner.goalY > crystal2YBottom) && prevMiner.goalY < crystal2YBottom){
			Buildings.flyEarth.drawCrystal2(drawsDiffMs, isGameOver);
		}

		if((!nextMiner || nextMiner.goalY > crystal3YBottom) && prevMiner.goalY < crystal3YBottom - 10){
			Buildings.flyEarth.drawCrystal3(drawsDiffMs, isGameOver);
		}

		if((!nextMiner || nextMiner.goalY > crystal4YBottom) && prevMiner.goalY < crystal4YBottom - 5){
			Buildings.flyEarth.drawCrystal4(drawsDiffMs, isGameOver);
		}
	}

	static drawHealth(): void{
		Units.all.forEach(unit => unit.drawHealth());
	}

	static drawRepairingAnumation(): void{
		Units.all.forEach(unit => unit.drawRepairingAnumation());
	}

	static drawModifiersAhead(drawsDiffMs: number, isGameOver: boolean): void{
		Units.all.forEach(unit => unit.drawModifiersAhead(drawsDiffMs, isGameOver));
	}
}