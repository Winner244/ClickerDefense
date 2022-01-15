import {Building} from '../gameObjects/Building';
import { Cursor } from '../Cursor';
import { Coins } from '../gameSystems/Coins';
import { Settings } from '../Settings';

import flyEarthImage from '../../assets/img/buildings/flyEarth.png';  
import PickSoundUrl1 from '../../assets/sounds/buildings/flyEarth/pick1.mp3'; 
import PickSoundUrl2 from '../../assets/sounds/buildings/flyEarth/pick2.mp3'; 
import PickSoundUrl3 from '../../assets/sounds/buildings/flyEarth/pick3.mp3'; 
import PickSoundUrl4 from '../../assets/sounds/buildings/flyEarth/pick4.mp3'; 
import { Helper } from '../helpers/Helper';

export class FlyEarth extends Building{
	static readonly image: HTMLImageElement = new Image();
	static readonly width: number = 375;
	static readonly height: number = 279;

	constructor(x: number, y: number) {
		super(x, y, false, false, FlyEarth.name, FlyEarth.image, 4, FlyEarth.width, FlyEarth.height, 15, 100, 0, '');
	}

	private static playSoundPick(){
		var listOfSounds = [
			PickSoundUrl1,
			PickSoundUrl2,
			PickSoundUrl3,
			PickSoundUrl4
		];
		const sound: HTMLAudioElement = new Audio(listOfSounds[Helper.getRandom(0, listOfSounds.length - 1)]);
		sound.volume = 0.2 * Settings.soundVolume;
		sound.play();
	}

	mouseLogic(mouseX: number, mouseY: number, isClick: boolean): boolean{
		if(mouseX > this.x + this.reduceHover && 
			mouseX < this.x + FlyEarth.width - this.reduceHover &&
			mouseY > this.y + this.reduceHover && 
			mouseY < this.y + FlyEarth.height - this.reduceHover)
		{
			Cursor.setCursor(Cursor.pick);
	
			if(isClick){
				let coinX = this.x + this.reduceHover + Math.random() * (FlyEarth.width - this.reduceHover * 2);
				let coinY = this.y + FlyEarth.height / 2;
				Coins.create(coinX, coinY);
				Cursor.setCursor(Cursor.pickYellow);
				FlyEarth.playSoundPick();
			}
			
			return true;
		}

		return false;
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage){
			this.image.src = flyEarthImage; 
		}
	}
}