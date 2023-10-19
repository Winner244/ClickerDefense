import * as Tone from 'tone';

import shuffle from 'lodash/shuffle';

import {AudioSystem} from './AudioSystem';


import PeaceTime1Music from '../../assets/music/peacetime/67700_newgrounds_therit.mp3'; 
import PeaceTime2Music from '../../assets/music/peacetime/306540_gluttony.mp3'; 
import PeaceTime3Music from '../../assets/music/peacetime/351970_reyholliday_rh-getrightwestcoastloopstartbpm89.mp3'; 
import PeaceTime4Music from '../../assets/music/peacetime/Vista-Sounds---Lassi.mp3'; 
import PeaceTime5Music from '../../assets/music/peacetime/204334_Sunscape.mp3'; 
import PeaceTime6Music from '../../assets/music/peacetime/De4dl0ck Resistan.mp3'; 
import PeaceTime7Music from '../../assets/music/peacetime/Song Of Storms Dubs2.mp3'; 
import PeaceTime8Music from '../../assets/music/peacetime/Electroscape.mp3'; 
import PeaceTime9Music from '../../assets/music/peacetime/SxV Jolly Roger-J.mp3'; 
import PeaceTime10Music from '../../assets/music/peacetime/Vomitoxin.mp3'; 



/** Система управления музыкой - единичный статичный класс */
export class MusicSystem {
	private static _startedMusic: Tone.Player|null; //нужно для отмены звука при гибели монстра или при отмене спец способности
	private static _isStopperd: boolean; 

	private static peaceTimeList: string[] = shuffle([
		PeaceTime1Music,
		PeaceTime2Music,
		PeaceTime3Music,
		PeaceTime4Music,
		PeaceTime5Music,
		PeaceTime6Music,
		PeaceTime7Music,
		PeaceTime8Music,
		PeaceTime9Music,
		PeaceTime10Music
	]); 

	/** Воспроизвести музыку между волн */
	static playPeaceTime(delayStartingSeconds: number = 0){
		this._isStopperd = false;

		const nextMusic = this.peaceTimeList[0];

		AudioSystem.playMusic(nextMusic, -18, delayStartingSeconds)
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

