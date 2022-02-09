import {Draw} from './Draw';
import {Building} from '../gameObjects/Building';
import {Buildings} from './Buildings';
import {Monsters} from './Monsters';
import {Coins} from './Coins';
import {Coin} from '../gameObjects/Coin';
import {Gamer} from '../gameObjects/Gamer';
import {Labels} from './Labels';
import {Builder} from './Builder';
import {Waves} from './Waves';

import {FlyEarth} from '../buildings/FlyEarth';
import {FlyEarthRope} from '../buildings/FlyEarthRope';

import {Cursor} from '../Cursor';
import {FPS} from '../FPS';
import {Mouse} from '../Mouse';

import {Menu} from '../../reactApp/components/Menu/Menu';
import {Shop} from '../../reactApp/components/Shop/Shop';
import ShopItem from '../../models/ShopItem';
import { ShopCategoryEnum } from '../../enum/ShopCategoryEnum';

import GrassImage from '../../assets/img/grass1.png'; 


export class Game {
	private static primaryImages: HTMLImageElement[] = [];  // изображения (кроме курсоров) загрузку которых нужно дождаться перед началом игры
	private static grassImage: HTMLImageElement = new Image(); //трава
	private static animationId: number = 0; //техническая переменная для браузера


	static readonly bottomShiftBorder: number = 10; //нижняя граница по которой ходят монстры и до куда падают монетки 

	static isGameRun: boolean = true; //если false - значит на паузе 
	static isGameOver: boolean = false; //игра заканчивается
	static isEndAfterGameOver: boolean = false; //игра закончилась
	static isWasInit: boolean = false; //инициализация уже была?

	static gameOverTime: number = 0; //время окончания игры
	static lastDrawTime: number = 0; //время последней отрисовки (нужно для высчита millisecondsDifferent)

	static isBlockMouseLogic: boolean = false; //if user's mouse enter to interface buttons (menu/shop/nextWave)

	/** Инициализация игры */
	static init(canvas: HTMLCanvasElement, isLoadImage: boolean = true): void{
		Game.isWasInit = true;
		Game.isGameRun = true;
		Game.isGameOver = false;
		Game.isEndAfterGameOver = false;
		Game.isBlockMouseLogic = false;
		Game.lastDrawTime = 0;

		Cursor.setCursor(Cursor.default);

		Draw.init(canvas);
		Mouse.init();
		Buildings.init(isLoadImage);
		Monsters.init(isLoadImage);
		Coins.init(isLoadImage);
		Gamer.init();
		Labels.init();
		Waves.init(isLoadImage);

		if(isLoadImage){
			Game.grassImage.src = GrassImage;

			Game.primaryImages = [];
			Game.primaryImages.push(Game.grassImage);
			Game.primaryImages.push(FlyEarth.image);
			Game.primaryImages.push(FlyEarthRope.image);
			Game.primaryImages.push(Coin.image);
		}

		window.removeEventListener('keypress', Game.onKey);
		window.addEventListener('keypress', Game.onKey);

		if(Game.animationId == 0 && Game.primaryImages.length){
			Game.animationId = window.requestAnimationFrame(Game.go);
		}
	}

	/** Начать новую игру */
	static startNew(){
		Game.init(Draw.canvas, false);
		Draw.canvas.classList.remove("hide");
		Waves.startFirstWave();
	}
		
	private static gameOverLogic(millisecondsDifferent: number) : void{
		Cursor.setCursor(Cursor.default);

		if(Buildings.flyEarthRope.y < Draw.canvas.height - Game.bottomShiftBorder - 20){
			Buildings.flyEarthRope.y += 100 * millisecondsDifferent / 1000;
		}

		if(Buildings.flyEarth.y > -FlyEarth.height){
			Buildings.flyEarth.y -= 100 * millisecondsDifferent / 1000;
		}
	}

	private static mouseLogic(millisecondsDifferent: number) : void{
		if(Game.isBlockMouseLogic){
			return;
		}

		//при изменении размера canvas, мы должны масштабировать координаты мыши
		let x = Mouse.x / (Draw.canvas.clientWidth / Draw.canvas.width);
		let y = Mouse.y / (Draw.canvas.clientHeight / Draw.canvas.height);

		Builder.mouseLogic(x, y, Mouse.isClick, Mouse.isRightClick);

		let isSetCursor = false;
		if(Waves.isStarted && Waves.delayStartTimeLeft <= 0){
			isSetCursor = Buildings.mouseLogic(x, y, Mouse.isClick);
		}

		if(!isSetCursor){
			isSetCursor = Coins.mouseLogic(x, y, Mouse.isClick);
		}

		if(!isSetCursor){
			isSetCursor = Monsters.mouseLogic(x, y, Mouse.isClick);
		}

		if(Cursor.cursorWait > 0){
			Cursor.cursorWait -= millisecondsDifferent;
		}

		if(!isSetCursor){
			Cursor.setCursor(Cursor.default);
		}

		Mouse.isClick = false;
	}

	private static drawAll(millisecondsFromStart: number) : void{
		Draw.clear(); //очищаем холст
		Draw.drawBlackout(); //затемняем фон
	
		Buildings.draw(millisecondsFromStart, Game.isGameOver);
		Buildings.drawHealth();

		Builder.draw(millisecondsFromStart, Game.isGameOver);
	
		Coins.draw();
	
		Monsters.draw(Game.isGameOver);
	
		Draw.drawGrass(Game.grassImage); 
	
		Labels.draw();
	
		Draw.drawCoinsInterface(Coin.image, Gamer.coins);

		Waves.draw();
	
		if(Game.isGameOver && Buildings.flyEarth.y <= -FlyEarth.height){
			Draw.drawGameOver();
		}
	
		Game.lastDrawTime = millisecondsFromStart;
	}

	/** основной цикл игры */
	private static go(millisecondsFromStart: number) : void{
		if(!Game.isGameRun){
			return;
		}

		//проверка что все изображения загружены - иначе будет краш хрома
		if(Game.primaryImages.some(x => !x.complete)){
			Game.animationId = window.requestAnimationFrame(Game.go);
			return;
		}

		if(!Game.lastDrawTime){
			Game.lastDrawTime = millisecondsFromStart - 100;
		}

		let millisecondsDifferent = millisecondsFromStart - Game.lastDrawTime; //сколько времени прошло с прошлой прорисовки
		if(millisecondsDifferent > 100) { //защита от долгого отсутствия
			millisecondsDifferent = 100;
		}

		///** logics **//
		if(Game.isGameOver){
			Game.gameOverLogic(millisecondsDifferent);

			if(Buildings.flyEarth.y <= -FlyEarth.height){
				Game.isEndAfterGameOver = true;
			}
		}
		else{
			if(Buildings.flyEarthRope.health <= 0){
				Game.isGameOver = true;
				Game.gameOverTime = Date.now();
			}

			Builder.logic();
			
			Game.mouseLogic(millisecondsDifferent); //логика обработки мыши

			Waves.logic(millisecondsDifferent, Game.bottomShiftBorder);
		}

		Buildings.logic(millisecondsDifferent, Game.isGameOver, Monsters.all, Game.bottomShiftBorder);
		
		Monsters.logic(millisecondsDifferent, Buildings.flyEarth, Buildings.all, Game.isGameOver, Draw.canvas.height - Game.bottomShiftBorder);
		
		Coins.logic(millisecondsDifferent, Game.bottomShiftBorder);
		
		Labels.logic(millisecondsDifferent);

		FPS.counting();

		Game.drawAll(millisecondsFromStart);

		if(!Game.isEndAfterGameOver){
			window.requestAnimationFrame(Game.go);
		}
	}

	private static onKey(event: KeyboardEvent) : void{
		if(event.key == ' '){
			if(Game.isGameRun){
				Game.pause();
			}
			else{
				Game.continue();
				Menu.hide();
				Shop.hide();
			}
		}
	}

	/** Поставить игру на паузу */
	static pause() : void{
		if(!Game.isWasInit){
			return;
		}

		Game.isBlockMouseLogic = true;
		cancelAnimationFrame(Game.animationId);
		Game.animationId = 0;
		Game.isGameRun = false;
		Menu.show();
		Game.drawAll(0);
		Draw.drawBlackout();
	}

	/** Продолжить игру */
	static continue() : void{
		if(!Game.isWasInit){
			return;
		}

		Game.isGameRun = true;
		Game.lastDrawTime = 0;
		if(!Game.animationId)
			Game.animationId = window.requestAnimationFrame(Game.go);
		Mouse.isClick = false;
		Game.isBlockMouseLogic = false;
	}

	/** Начать новую волну */
	static startNewWave(): void{
		Builder.finish();
		Game.continue();
		Waves.startNewWave();
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