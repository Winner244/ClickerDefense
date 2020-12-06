import * as Tone from 'tone';

import {Draw} from "./Draw";

import {Helper} from "../helpers/Helper";

import AudioIIRFilter from "../../models/AudioIIRFilter";

/** Система управления звуком - единичный статичный класс */
export class AudioSystem{
	public static soundVolume: number = 1; //общий уровень звука эффектов (0 - is min value, 1 - is max value)
	public static musicVolume: number = 1; //общий уровень звука фоновой музыки (0 - is min value, 1 - is max value)

	private static _isEnabled: boolean = sessionStorage.getItem('AudioSystem.isEnabled') != 'false'; //включена/отключена система?
	public static set isEnabled(value: boolean){
		this._isEnabled = value;
		sessionStorage.setItem('AudioSystem.isEnabled', value + ''); 
	}
	public static get isEnabled(): boolean{
		return this._isEnabled && !document.hidden; 
	}

	public static iirFilters = {
		low: new AudioIIRFilter(
			[0.0042681742, 0.0025363483, 0.0042681742], 
			[1.0317185917, -1.9999273033, 0.9682814083])
	}

	private static readonly _context = new AudioContext();
	private static readonly _buffers: any = {};
	private static readonly _waveForms: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
	private static readonly _iirFiltersBuilded = Object.values(AudioSystem.iirFilters).map(x => AudioSystem._context.createIIRFilter(x.feedforward, x.feedback));

	private static _soundsForPause: Tone.Player[] = [];

	public static load(pathToAudioFile: string): Promise<AudioBuffer> {
		return this._load(pathToAudioFile);
	}

	private static _load(pathToAudioFile: string): Promise<AudioBuffer> {
		return new Promise((done, fail) => {
			var buffer = AudioSystem._buffers[pathToAudioFile];
			if(buffer){
				done(buffer);
				return;
			}
		
			//load audio file
			var request = new XMLHttpRequest();
			request.open('GET', pathToAudioFile, true); 
			request.responseType = 'arraybuffer';
			request.onload = function() {
				AudioSystem._context.decodeAudioData(request.response, 
					function(buffer) {
						AudioSystem._buffers[pathToAudioFile] = buffer;
						done(buffer);
					}, 
					function(err) { 
						console.error('error of decoding audio file: ' + pathToAudioFile, err); 
						fail(err);
					});
			};
			request.onerror = function(err){
				console.error('error of loading audio file: ' + pathToAudioFile, err); 
				fail(err);
			};
			request.send();
		});
	}


	public static playRandomV(x: number, arrayPathesToAudioFiles: string[], volume: number, isMusic: boolean = false, speed: number = 1, isUseBiquadFilterRandom = false): void {
		if (!AudioSystem.isEnabled){
			return;
		}

		const i = Helper.getRandom(0, arrayPathesToAudioFiles.length - 1);
		AudioSystem.play(x, arrayPathesToAudioFiles[i], volume, speed, isUseBiquadFilterRandom, isMusic ? true : false, 0, 0, isMusic);
	}
	public static playRandom(x: number, arrayPathesToAudioFiles: string[], volumes: number[], isMusic: boolean = false, speed: number = 1, isUseBiquadFilterRandom = false): void {
		if (!AudioSystem.isEnabled){
			return;
		}

		const i = Helper.getRandom(0, arrayPathesToAudioFiles.length - 1);
		AudioSystem.play(x, arrayPathesToAudioFiles[i], volumes[i], speed, isUseBiquadFilterRandom, isMusic ? true : false, 0, 0, isMusic);
	}

	public static playMusic(
		pathToAudioFile: string,
		volume: number = 1, 
		delayStartingSeconds: number = 0): Promise<Tone.Player|null>
	{
		return this.play(-1, pathToAudioFile, volume, 1, false, true, delayStartingSeconds, 0, true);
	}

	public static play(
		x: number, 
		pathToAudioFile: string, 
		volumeChange: number = 0,
		speed: number = 1, 
		isUseBiquadFilterRandom = false, 
		isUseAutoPauseAndResume: boolean = false, 
		delayStartingSeconds: number = 0, 
		offsetStartingSeconds: number = 0,
		isMusic: boolean = false,
		isCycling: boolean = false,
		stopCallback: (source: Tone.Player) => boolean = () => true): Promise<Tone.Player|null>
	{
		if (!AudioSystem.isEnabled){
			return new Promise(done => done(null));
		}

		//volume
		var volumeSettings = isMusic 
			? AudioSystem.musicVolume 
			: AudioSystem.soundVolume;

		return this._load(pathToAudioFile)
			.then(buffer => AudioSystem._play(x, buffer, volumeChange * (1 + 1 - volumeSettings), speed, isUseBiquadFilterRandom, delayStartingSeconds, offsetStartingSeconds))
			.then(source => {
				if(!source){
					return null;
				}

				if(isCycling){
					source.autostart = true;
					(<any>source).isCycling = true;
				}

				if(isUseAutoPauseAndResume){
					(<any>source).startedAt = this._context.currentTime + delayStartingSeconds;
					this._soundsForPause.push(source);
					source.onstop = () => {
						var isContinue = stopCallback(source);
						if(isCycling && source.autostart && isContinue){
							source.start(delayStartingSeconds, offsetStartingSeconds);
						}
						else{
							this._soundsForPause = this._soundsForPause.filter(x => x != source);
						}
					};
				}
				else if(isCycling){
					source.onstop = () => {
						var isContinue = stopCallback(source);
						if(source.autostart && isContinue){
							source.start(delayStartingSeconds, offsetStartingSeconds);
						}
					};
				}

				return source;
			});
	}

	private static _play(
		x: number, 
		buffer: AudioBuffer, 
		volumeChange: number, 
		speed: number, 
		isUseBiquadFilterRandom = false, 
		delayStartingSeconds: number = 0, 
		offsetSeconds: number = 0) : Tone.Player
	{
		const context = this._context;

		const pannerValue = x == -1 
			? 0 
			: Math.min(1, Math.max(-1, x / Draw.canvas.width * 2 - 1));

		
		const sourceTone = new Tone.Player(buffer);
		const panner = new Tone.Panner(pannerValue);
		
		if(isUseBiquadFilterRandom) {
			const biquadFilter = this._getRandomBiquadFilter(context);
			const option = {
				frequency: biquadFilter.frequency.value,
				Q: biquadFilter.Q.value,
				type:  biquadFilter.type,
				gain: biquadFilter.gain.value,
			};
			//const distortion = new Tone.Distortion(0.5);
			//sourceTone.chain(new Tone.BiquadFilter(option), distortion, Tone.Destination);
			sourceTone.chain(new Tone.BiquadFilter(option), panner, Tone.Destination);
		}
		else{
			sourceTone.chain(panner, Tone.Destination);
		}

		sourceTone.playbackRate = Math.max(0.1, speed);
		sourceTone.volume.value = volumeChange; //changing The volume of the output in decibels.
		sourceTone.toDestination();
		sourceTone.start("+" + delayStartingSeconds, offsetSeconds); 
		return sourceTone;
	}

	private static _getRandomBiquadFilter(context: AudioContext){
		const biquadFilter = context.createBiquadFilter();
		const types: BiquadFilterType[] = ["allpass", "highpass", "highshelf", "lowpass", "lowshelf", "notch", "peaking"];

		let frequency = 0;
		let gain = 0;
		let q = 0;

		//почти незаметная для уха рандомизация звука
		let type: BiquadFilterType = types[Helper.getRandom(0, types.length - 1)];
		switch(type){
			case 'lowpass':
				frequency = Helper.getRandom(12000, 24000);
				q = Helper.getRandom(0, 15);
				break;

			case 'highpass':
				frequency = Helper.getRandom(0, 125);
				q = Helper.getRandom(0, 15);
				break;

			case 'lowshelf':
				frequency = Helper.getRandom(1000, 24000);
				gain = Helper.getRandom(0, 4);
				break;

			case 'highshelf':
				frequency = Helper.getRandom(5000, 24000);
				gain = Helper.getRandom(0, 10);
				break;

			case 'peaking':
				frequency = Helper.getRandom(12000, 24000);
				q = Helper.getRandom(1000, 2500);
				gain = Helper.getRandom(0, 10);
				break;

			case 'notch':
				frequency = Helper.getRandom(1000, 24000);
				q = Helper.getRandom(1, 200);
				break;

			case 'allpass':
				frequency = Helper.getRandom(1000, 24000);
				q = Helper.getRandom(1, 2000);
				break;
		}

		biquadFilter.type = type;
		biquadFilter.frequency.setValueAtTime(frequency, context.currentTime);
		biquadFilter.gain.setValueAtTime(gain, context.currentTime);
		biquadFilter.Q.setValueAtTime(q, context.currentTime);

		return biquadFilter;
	}



	public static playRandomTone(x: number, volume: number, minFrequency: number = 0, maxFrequency: number = 10000, IIRFilter: AudioIIRFilter|null = null){
		if (!AudioSystem.isEnabled){
			return;
		}
		
		const iirFilterBuilded = this._getBuildedIIRFilter(IIRFilter);
		const context = this._context;
		const oscillator = context.createOscillator();

		const gainNode = context.createGain();
		gainNode.gain.value = volume * AudioSystem.soundVolume;
		gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1); 

		const pannerNode = context.createStereoPanner();
		pannerNode.pan.value = x == -1 
			? 0 
			: x / Draw.canvas.width * 2 - 1;

		if(iirFilterBuilded){
			oscillator.connect(gainNode).connect(pannerNode).connect(iirFilterBuilded).connect(context.destination);
		}
		else{
			oscillator.connect(gainNode).connect(pannerNode).connect(context.destination);
		}
		
		oscillator.type = this._waveForms[Helper.getRandom(0, this._waveForms.length - 1)];   
		oscillator.frequency.value = minFrequency + Math.random() * maxFrequency;
		oscillator.start(0); 
		if(iirFilterBuilded){
			oscillator.onended = () => oscillator.disconnect(iirFilterBuilded)
		} 
	}

	private static _getBuildedIIRFilter(IIRFilter: AudioIIRFilter|null = null){
		if(!IIRFilter){
			return null;
		}

		const index = Object.values(this.iirFilters).findIndex(x => x.id == IIRFilter.id);
		const iirFilterBuilded = this._iirFiltersBuilded[index];
		return iirFilterBuilded;
	}



	public static pauseSounds(){
		this._soundsForPause.forEach(x => {
			(<any>x).pausedAt = this._context.currentTime;
			(<any>x).delayLeftSec = Math.max(0, (<any>x).startedAt - this._context.currentTime);
			(<any>x).onstop2 = x.onstop;
			x.onstop = () => {};
			x.autostart = false;
			x.stop(0);
		});
	}

	
	public static resumeSounds(){
		if (!AudioSystem.isEnabled){
			this._soundsForPause = [];
			return;
		}

		this._soundsForPause.forEach(x => {
			var pausedAt = (<any>x).pausedAt || 0;
			var startedAt = (<any>x).startedAt || 0;
			var delayLeftSec = (<any>x).delayLeftSec || 0;

			var isCycling = (<any>x).isCycling || false;
			if(isCycling){
				x.autostart = true;
			}

			var offsetSec = delayLeftSec > 0 ? 0 : (pausedAt - startedAt);
			if(offsetSec < 0){ //develop hot reload code
				console.error('AudioSystem.resumeSounds: offsetSec < 0', pausedAt, startedAt);
				return;
			}

			x.start(delayLeftSec, offsetSec);
			x.onstop = (<any>x).onstop2;
		});
	}
}

