import { Helper } from "../helpers/Helper";
import * as Tone from 'tone';
import AudioIIRFilter from "../../models/AudioIIRFilter";
import { BiquadFilter, BiquadFilterOptions, ToneOscillatorNode } from "tone";
import { Draw } from "./Draw";

export class AudioSystem{
	static soundVolume: number = 1; //общий уровень звука эффектов (0 - is min value, 1 - is max value)
	static musicVolume: number = 1; //общий уровень звука фоновой музыки (0 - is min value, 1 - is max value)

	public static iirFilters = {
		low: new AudioIIRFilter(
			[0.0042681742, 0.0025363483, 0.0042681742], 
			[1.0317185917, -1.9999273033, 0.9682814083])
	}

	private static context = new AudioContext();
	private static Buffers: any = {};
	private static waveForms: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
	private static iirFiltersBuilded = Object.values(AudioSystem.iirFilters).map(x => AudioSystem.context.createIIRFilter(x.feedforward, x.feedback));

	public static load(pathToAudioFile: string){
		return this._load(pathToAudioFile, (buffer) => {});
	}
	
	public static _load(pathToAudioFile: string, callback: (buffer: AudioBuffer) => void){
		var buffer = AudioSystem.Buffers[pathToAudioFile];
		if(buffer){
			if(callback){
				callback(buffer);
			}
			return;
		}
	
		//load audio file
		var request = new XMLHttpRequest();
		request.open('GET', pathToAudioFile, true); 
		request.responseType = 'arraybuffer';
		request.onload = function() {
			AudioSystem.context.decodeAudioData(request.response, 
				function(buffer) {
					AudioSystem.Buffers[pathToAudioFile] = buffer;
					if(callback){
						callback(buffer);
					}
				}, 
				function(err) { 
					console.error('error of decoding audio file: ' + pathToAudioFile, err); 
				});
		};
		request.onerror = function(err){
			console.error('error of loading audio file: ' + pathToAudioFile, err); 
		};
		request.send();
	}


	public static playRandom(x: number, arrayPathesToAudioFiles: string[], volumes: number[], isMusic: boolean = false, speed: number = 1, isUseBiquadFilterRandom = false): void {
		const i = Helper.getRandom(0, arrayPathesToAudioFiles.length - 1);
		AudioSystem.play(x, arrayPathesToAudioFiles[i], volumes[i], isMusic, speed, isUseBiquadFilterRandom);
	}

	public static play(x: number, pathToAudioFile: string, volume: number = 1, isMusic: boolean = false, speed: number = 1, isUseBiquadFilterRandom = false, IIRFilter: AudioIIRFilter|null = null): void{

		//volume
		var gainNode = this.context.createGain()
		var volumeSettings = isMusic 
			? AudioSystem.musicVolume 
			: AudioSystem.soundVolume;
		gainNode.gain.value = volume * volumeSettings;
		gainNode.connect(this.context.destination)

		this._load(pathToAudioFile, (buffer) => AudioSystem._play(x, AudioSystem.context, buffer, gainNode, speed, isUseBiquadFilterRandom, IIRFilter));
	}

	private static _play(x: number, context: AudioContext, buffer: AudioBuffer, gainNode: GainNode, speed: number, isUseBiquadFilterRandom = false, IIRFilter: AudioIIRFilter|null = null){
		const iirFilterBuilded = this._getBuildedIIRFilter(IIRFilter);

		const pannerValue = x == -1 
			? 0 
			: x / Draw.canvas.width * 2 - 1;

		if(speed == 1){
			let source = context.createBufferSource();
			source.buffer = buffer;

			const pannerNode = context.createStereoPanner();
			pannerNode.pan.value = pannerValue;

			if(iirFilterBuilded){
				source.connect(gainNode).connect(pannerNode).connect(iirFilterBuilded).connect(context.destination);
			}
			else if(isUseBiquadFilterRandom) {
				const biquadFilter = this._getRandomBiquadFilter(context);
				var chain = source.connect(biquadFilter);

				if(Math.random() > 0.5){
					var random = 2 + Math.random() * 5;
					const distortion = context.createWaveShaper();
					distortion.curve = this._getDistortionCurve(random);
					distortion.oversample = "4x";
					chain = chain.connect(distortion);
				}
				chain = chain.connect(gainNode).connect(pannerNode).connect(context.destination);
			}
			else{
				source.connect(gainNode).connect(pannerNode).connect(context.destination);
			}

			source.start(0); 
		}
		else{
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
				//sourceTone.chain(new BiquadFilter(option), distortion, Tone.Destination);
				sourceTone.chain(new BiquadFilter(option), panner, Tone.Destination);
			}
			else{
				sourceTone.chain(panner, Tone.Destination);
			}

			sourceTone.playbackRate = speed;
			sourceTone.volume.value = (gainNode.gain.value - 1) * 20;
			sourceTone.toDestination();
			sourceTone.start(); 
		}
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
		const iirFilterBuilded = this._getBuildedIIRFilter(IIRFilter);
		const context = AudioSystem.context;
		const oscillator = context.createOscillator();

		const gainNode = context.createGain();
		gainNode.gain.value = volume * AudioSystem.soundVolume;
		gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1); 

		const pannerNode = context.createStereoPanner();
		pannerNode.pan.value = x == -1 
			? 0 
			: x / Draw.canvas.width * 2 - 1;

		if(iirFilterBuilded){
			oscillator.connect(gainNode).connect(pannerNode).connect(iirFilterBuilded).connect(AudioSystem.context.destination);
		}
		else{
			oscillator.connect(gainNode).connect(pannerNode).connect(context.destination);
		}
		
		oscillator.type = AudioSystem.waveForms[Helper.getRandom(0, AudioSystem.waveForms.length - 1)];   
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
		const iirFilterBuilded = this.iirFiltersBuilded[index];
		return iirFilterBuilded;
	}


	private static _getDistortionCurve(amount: number) {
		const n_samples = 44100;
		const curve = new Float32Array(n_samples);
		const deg = Math.PI / 180;
	  
		for (let i = 0; i < n_samples; i++) {
		  const x = (i * 2) / n_samples - 1;
		  curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
		}
		return curve;
	}
}