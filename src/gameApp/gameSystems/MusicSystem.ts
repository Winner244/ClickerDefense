import * as Tone from 'tone';

import {AudioSystem} from './AudioSystem';


import PeaceTime1Music from '../../assets/music/peacetime/67700_newgrounds_therit.mp3'; 
import PeaceTime2Music from '../../assets/music/peacetime/306540_gluttony.mp3'; 




/** Система управления музыкой - единичный статичный класс */
export class MusicSystem {
	private static _startedMusic: AudioBufferSourceNode|Tone.Player|null; //нужно для отмены звука при гибели монстра или при отмене спец способности
	private static _isStopperd: boolean; 

	/** Воспроизводить музыку между волн */
	static playPeaceTime(delayStartingSeconds: number = 0){
		this._isStopperd = false;
		AudioSystem.playMusic(PeaceTime1Music, 0.1, delayStartingSeconds)
			.then(sourse => {
				if(!this._isStopperd){
					this._startedMusic = sourse
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

