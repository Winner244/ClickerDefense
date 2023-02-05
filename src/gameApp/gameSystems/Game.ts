import {Draw} from './Draw';
import {AudioSystem} from './AudioSystem';
import {AnimationsSystem} from './AnimationsSystem';
import {TestSystem} from './TestSystem';

import {Waves} from './Waves';

import {Labels} from '../labels/Labels';

import {FPS} from '../FPS';

import {Mouse} from '../gamer/Mouse';
import {Keypad} from '../gamer/Keypad';
import {Cursor} from '../gamer/Cursor';
import {Gamer} from '../gamer/Gamer';

import {Coin} from '../coins/Coin';
import {Coins} from '../coins/Coins';

import {Monster} from '../monsters/Monster';
import {Monsters} from '../monsters/Monsters';

import {Builder} from '../buildings/Builder';
import {Building} from '../buildings/Building';
import {Buildings} from '../buildings/Buildings';
import {FlyEarth} from '../buildings/FlyEarth';
import {FlyEarthRope} from '../buildings/FlyEarthRope';
import {Tower} from '../buildings/Tower';
import {Barricade} from '../buildings/Barricade';

import {Helper} from '../helpers/Helper';

import {Menu} from '../../reactApp/components/Menu/Menu';
import {Shop} from '../../reactApp/components/Shop/Shop';
import {Upgrade} from '../../reactApp/components/Upgrade/Upgrade';
import {BuildingButtons} from '../../reactApp/components/BuildingButtons/BuildingButtons';

import ShopItem from '../../models/ShopItem';

import {ShopCategoryEnum} from '../../enum/ShopCategoryEnum';

import GrassImage from '../../assets/img/grass1.png'; 

import SwordEmptySound from '../../assets/sounds/gamer/sword_empty.mp3'; 
import GameOverSound from '../../assets/sounds/gameOver.mp3'; 



/** Система управления игрой - единичный статичный экземпляр */
export class Game {
	static readonly bottomShiftBorder: number = 10; //нижняя граница по которой ходят монстры и до куда падают монетки 

	private static readonly grassImage: HTMLImageElement = new Image(); //трава

	static isGameRun: boolean = false; //если false - значит на паузе 
	static isGameOver: boolean = false; //игра заканчивается
	static isEndAfterGameOver: boolean = false; //игра закончилась
	static isWasInit: boolean = false; //инициализация уже была?

	static gameOverTime: number = 0; //время окончания игры
	static lastDrawTime: number = 0; //время последней отрисовки (нужно для высчита drawsDiffMs)

	static isBlockMouseLogic: boolean = false; //if user's mouse enter to interface buttons (menu/shop/nextWave)

	private static _primaryImages: HTMLImageElement[] = [];  // изображения (кроме курсоров) загрузку которых нужно дождаться перед началом игры
	private static _animationId: number = 0; //техническая переменная для браузера

	/** Инициализация игры */
	static init(canvas: HTMLCanvasElement, isLoadResources: boolean = true): void{
		Game.isWasInit = true;
		Game.isGameRun = false;
		Game.isGameOver = false;
		Game.isEndAfterGameOver = false;
		Game.isBlockMouseLogic = false;
		Game.lastDrawTime = 0;

		Cursor.setCursor(Cursor.default);

		Draw.init(canvas);
		Mouse.init();
		Buildings.init(isLoadResources);
		Monsters.init(isLoadResources);
		Coins.init(isLoadResources);
		Gamer.init();
		Labels.init();
		Waves.init(isLoadResources);

		if(isLoadResources){
			Menu.loadSelectSound();
			
			Game.grassImage.src = GrassImage;

			this._primaryImages = [];
			this._primaryImages.push(Game.grassImage);
			this._primaryImages.push(FlyEarth.image);
			this._primaryImages.push(FlyEarthRope.image);
			this._primaryImages.push(Coin.image);
		}

		document.removeEventListener('keydown', Game.onKey);
		document.addEventListener('keydown', Game.onKey);

		if(this._animationId == 0 && this._primaryImages.length){
			this._animationId = window.requestAnimationFrame(Game.go.bind(this));
		}
	}

	static loadResourcesAfterStartOfWave(startedWave: number){
		if (startedWave == 0){
			Monster.loadHitSounds();
			AudioSystem.load(SwordEmptySound);
		}
	}

	static loadResourcesAfterEndOfWave(endedWave: number){
		if (endedWave == 0){ //first wave
			Tower.init(true);
			Barricade.init(true);
			Builder.init(true);
		}
		else{
			if(Buildings.all.find(x => x.health < x.healthMax)){
				Building.loadRepairResources();
			}
		}
	}

	static loadResourcesAfterBuild(building: Building){
		building.loadedResourcesAfterBuild();
		
		if (building  instanceof  Tower){ 
			Tower.loadResourcesAfterBuild();
		}
		else if(building  instanceof  Barricade){ 
			Barricade.loadResourcesAfterBuild();
		}

		Buildings.loadResources();
		Building.loadUpgradeResources();
		Upgrade.loadResources();
	}

	/** основной цикл игры */
	private static go(millisecondsFromStart: number) : void{
		if(!Game.isGameRun){
			this._animationId = 0;
			return;
		}

		//проверка что все изображения загружены - иначе будет краш хрома
		if(this._primaryImages.some(x => !x.complete)){
			this._animationId = window.requestAnimationFrame(Game.go.bind(this));
			return;
		}

		if(!Game.lastDrawTime){
			Game.lastDrawTime = millisecondsFromStart - 100;
		}

		let drawsDiffMs = millisecondsFromStart - Game.lastDrawTime; //сколько времени прошло с прошлой прорисовки
		if(drawsDiffMs > 100) { //защита от долгого отсутствия
			drawsDiffMs = 100;
		}

		///** logics **//
		if(Game.isGameOver){
			Game.gameOverLogic(drawsDiffMs);

			if(Buildings.flyEarth.y <= -FlyEarth.height){
				Game.isEndAfterGameOver = true;
			}
		}
		else{
			if(Buildings.flyEarthRope.health <= 0 || Buildings.flyEarth.health <= 0){
				Game.isGameOver = true;
				AudioSystem.pauseSounds();
				AudioSystem.play(-1, GameOverSound, 0.5);
			}

			Builder.logic();
			
			Game.mouseLogic(drawsDiffMs); //логика обработки мыши

			Waves.logic(drawsDiffMs, Game.bottomShiftBorder);
		}

		Buildings.logic(drawsDiffMs, Waves.isStarted, Game.isGameOver, Monsters.all, Game.bottomShiftBorder);
		
		Monsters.logic(drawsDiffMs, Buildings.flyEarth, Buildings.all, Game.isGameOver, Draw.canvas.height - Game.bottomShiftBorder);
		
		Coins.logic(drawsDiffMs, Game.bottomShiftBorder);
		
		Labels.logic(drawsDiffMs);

		TestSystem.logic(drawsDiffMs);
		AnimationsSystem.logic();

		FPS.counting();

		Game.drawAll(millisecondsFromStart, drawsDiffMs);

		if(!Game.isEndAfterGameOver){
			window.requestAnimationFrame(Game.go.bind(this));
		}
	}

	private static mouseLogic(drawsDiffMs: number) : void {
		if(Game.isBlockMouseLogic){
			return;
		}

		//при изменении размера canvas, мы должны масштабировать координаты мыши
		let x = Mouse.x / (Draw.canvas.clientWidth / Draw.canvas.width);
		let y = Mouse.y / (Draw.canvas.clientHeight / Draw.canvas.height);
		let isWaveStarted = Waves.isStarted && Waves.delayStartLeftTimeMs <= 0;
		let isWaveEnded = !Waves.isStarted && Waves.delayEndLeftTimeMs <= 0;

		Builder.mouseLogic(x, y, Mouse.isClick, Mouse.isRightClick, Buildings.all, this.loadResourcesAfterBuild.bind(this));

		let isSetCursor = false;
		if(!isSetCursor){
			isSetCursor = Monsters.mouseLogic(x, y, Mouse.isClick);
		}

		if(!isSetCursor){
			isSetCursor = Coins.mouseLogic(x, y, Mouse.isClick);
		}

		if(!isSetCursor){
			isSetCursor = Buildings.mouseLogic(x, y, Mouse.isClick, isWaveStarted, isWaveEnded);
		}

		if(Cursor.cursorWaitLeftTimeMs > 0){
			Cursor.cursorWaitLeftTimeMs -= drawsDiffMs;
		}

		if(!isSetCursor){
			Cursor.setCursor(Cursor.default);
		}

		if(Mouse.isClick && !isSetCursor && isWaveStarted && !isWaveEnded && Monsters.all.find(m => Helper.getDistance(x, y, m.centerX, m.centerY) < Math.max(m.width, m.height) * 2)){
			AudioSystem.play(x, SwordEmptySound, 0.5, 1, true);
		}

		Mouse.isClick = false;
	}

	private static onKey(event: KeyboardEvent) : void{
		Keypad.isEnter = true;
		switch(event.key){
			case 'Escape':
				if(Game.isGameRun && !Upgrade.isOpened() && !Shop.isOpened()){
					Game.pause();
				}
				else{
					Game.continue();
					Menu.hide();
					Shop.hide();
					Upgrade.hide();
				}
			break;
		}
		Keypad.isEnter = false;
	}

	private static drawAll(millisecondsFromStart: number, drawsDiffMs: number, isPausedMode: boolean = false) : void{
		Draw.clear(); //очищаем холст
		Draw.drawBlackout(); //затемняем фон
	
		Buildings.draw(drawsDiffMs, Game.isGameOver);
		Buildings.drawHealth();
		Buildings.drawRepairingAnumation();

		Builder.draw(drawsDiffMs, Game.isGameOver);
	
		Coins.draw();
	
		Monsters.draw(drawsDiffMs, Game.isGameOver);
	
		Draw.drawGrass(Game.grassImage); 
	
		Labels.draw();
	
		Draw.drawCoinsInterface(Coin.image, Gamer.coins);

		Waves.draw();

		TestSystem.draw(drawsDiffMs, Game.isGameOver);
		AnimationsSystem.draw(drawsDiffMs, Game.isGameOver);
	
		if(Game.isGameOver && (Buildings.flyEarth.y <= -FlyEarth.height || Buildings.flyEarth.animationExplosionLifeTimeLeftMs <= 0)){
			Draw.drawGameOver();
		}

		if(isPausedMode){
			Draw.drawBlackout(); //затемняем фон
		}
	
		Game.lastDrawTime = millisecondsFromStart;
	}
		
	private static gameOverLogic(drawsDiffMs: number) : void{
		Cursor.setCursor(Cursor.default);

		if(Buildings.flyEarth.health <= 0){
			//logic in Buildings.flyEarthRope.drawExplosion
		}
		else{
			if(Buildings.flyEarth.y > -FlyEarth.height){
				Buildings.flyEarth.y -= 150 * drawsDiffMs / 1000;
			}
		}

		if(Buildings.flyEarthRope.y < Draw.canvas.height - Game.bottomShiftBorder - 20){
			Buildings.flyEarthRope.y += 150 * drawsDiffMs / 1000;
		}
	}




	
	/** Начать новую игру */
	static startNew(){
		Game.init(Draw.canvas, false);
		Game.continue();
		Draw.canvas.classList.remove("hide");
		Waves.startFirstWave();
	}

	/** Поставить игру на паузу */
	static pause() : void{
		if(!Game.isWasInit || !Game.isGameRun){
			return;
		}

		Cursor.setCursor(Cursor.default);
		Game.isBlockMouseLogic = true;
		cancelAnimationFrame(this._animationId);
		this._animationId = 0;
		Game.isGameRun = false;
		Menu.show();
		Game.drawAll(0, 0, true);
		BuildingButtons.hide();
		AudioSystem.pauseSounds();
	}

	/** Продолжить игру */
	static continue() : void{
		if(!Game.isWasInit){
			return;
		}

		if(!Game.isGameRun){
			AudioSystem.resumeSounds();
		}

		Game.isGameRun = true;
		Game.lastDrawTime = 0;
		if(!this._animationId)
		this._animationId = window.requestAnimationFrame(Game.go.bind(this));
		Mouse.isClick = false;
		Game.isBlockMouseLogic = false;
		BuildingButtons.hide();
	}

	/** Начать новую волну */
	static startNewWave(): void{
		Builder.finish();
		Game.continue();
		Waves.startNewWave();
		Upgrade.hide();
	}

	/** Игрок купил вещь в магазине */
	static buyThing(item: ShopItem){
		Game.continue();
		if(item.category == ShopCategoryEnum.BUILDINGS){
			var building = <Building>item;
			Builder.addBuilding(building, Draw.canvas.height - building.height + Game.bottomShiftBorder);
		}
	}
}