import * as Tone from 'tone';

import shuffle from 'lodash/shuffle';

import {AudioSystem} from './AudioSystem';


import PeaceTime1Music from '../../assets/music/peacetime/67700_newgrounds_therit.mp3'; 
import PeaceTime2Music from '../../assets/music/peacetime/306540_gluttony.mp3'; 




/** Система управления музыкой - единичный статичный класс */
export class MusicSystem {
	private static _startedMusic: Tone.Player|null; //нужно для отмены звука при гибели монстра или при отмене спец способности
	private static _isStopperd: boolean; 

	private static peaceTimeList: string[] = shuffle([
		PeaceTime1Music,
		PeaceTime2Music
	]); 

	/** Воспроизвести музыку между волн */
	static playPeaceTime(delayStartingSeconds: number = 0){
		this._isStopperd = false;

		const nextMusic = this.peaceTimeList[0];

		AudioSystem.playMusic(nextMusic, 0.1, delayStartingSeconds)
			.then(sourse => {
				if(!this._isStopperd && sourse){
					this._startedMusic = sourse;

					this.peaceTimeList = this.peaceTimeList.slice(1);
					this.peaceTimeList.push(nextMusic);

					var oldOnStop: Function = sourse.onstop;
					sourse.onstop = () => {
						if(oldOnStop && typeof oldOnStop == 'function'){
							oldOnStop();
						}

						this._startedMusic = null;
						if(!this._isStopperd){
							this.playPeaceTime();
						}
					}
				}
				else{
					sourse?.stop();
				}
			});
	}

	static stop(){
		this._isStopperd = true;
		this._startedMusic?.stop();
		this._startedMusic = null;
	}
}

