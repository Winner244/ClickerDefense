import {Cursor} from '../Cursor';

import {Building} from '../gameObjects/Building';
import {Coins} from '../gameSystems/Coins';
import {AudioSystem} from '../gameSystems/AudioSystem';

import {Helper} from '../helpers/Helper';

import flyEarthImage from '../../assets/img/buildings/flyEarth.png';  

import PickSoundUrl1 from '../../assets/sounds/buildings/flyEarth/pick1.mp3'; 
import PickSoundUrl2 from '../../assets/sounds/buildings/flyEarth/pick2.mp3'; 
import PickSoundUrl3 from '../../assets/sounds/buildings/flyEarth/pick3.mp3'; 
import PickSoundUrl4 from '../../assets/sounds/buildings/flyEarth/pick4.mp3'; 

export class FlyEarth extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 375;
	static readonly height: number = 279;

	constructor(x: number, y: number) {
		super(x, y, false, false, FlyEarth.name, FlyEarth.image, 4, 700, FlyEarth.width, FlyEarth.height, 15, 100, 0, '', false, false);

		FlyEarth.init(true);
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			this.image.src = flyEarthImage;  //load image only once
			AudioSystem.load(PickSoundUrl1);
			AudioSystem.load(PickSoundUrl2);
			AudioSystem.load(PickSoundUrl3);
			AudioSystem.load(PickSoundUrl4);
		}
	}

	private static playSoundPick(x: number){
		var listOfSounds = [
			PickSoundUrl1,
			PickSoundUrl2,
			PickSoundUrl3,
			PickSoundUrl4
		];
		var audioUrl = listOfSounds[Helper.getRandom(0, listOfSounds.length - 1)];
		AudioSystem.play(x, audioUrl, 0.05);
		AudioSystem.playRandomTone(x, 0.01, 5000, 10000);
	}

	mouseLogic(mouseX: number, mouseY: number, isClick: boolean, isWaveStarted: boolean, isWaveEnded: boolean, isMouseIn: boolean): boolean{
		if(isWaveStarted && isMouseIn)
		{
			Cursor.setCursor(Cursor.pick);
	
			if(isClick){
				let coinX = this.x + this.reduceHover + Math.random() * (FlyEarth.width - this.reduceHover * 2);
				let coinY = this.y + FlyEarth.height / 2;
				Coins.create(coinX, coinY);
				Cursor.setCursor(Cursor.pickYellow);
				FlyEarth.playSoundPick(mouseX);
			}
			
			return true;
		}

		return super.mouseLogic(mouseX, mouseY, isClick, isWaveStarted, isWaveEnded, isMouseIn);
	}
}