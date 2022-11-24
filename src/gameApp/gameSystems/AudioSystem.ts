import { Helper } from "../helpers/Helper";
import * as Tone from 'tone';
import AudioIIRFilter from "../../models/AudioIIRFilter";
import { BiquadFilter, BiquadFilterOptions } from "tone";

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

	static playRandom(arrayPathesToAudioFiles: string[], volumes: number[], isMusic: boolean = false, speed: number = 1): void {
		const i = Helper.getRandom(0, arrayPathesToAudioFiles.length - 1);
		AudioSystem.play(arrayPathesToAudioFiles[i], volumes[i], isMusic, speed);
	}

	static play(pathToAudioFile: string, volume: number = 1, isMusic: boolean = false, speed: number = 1, isUseBiquadFilterRandom = false, IIRFilter: AudioIIRFilter|null = null): void{

		//volume
		var gainNode = this.context.createGain()
		var volumeSettings = isMusic 
			? AudioSystem.musicVolume 
			: AudioSystem.soundVolume;
		gainNode.gain.value = volume * volumeSettings;
		gainNode.connect(this.context.destination)

		//is saved ?
		var buffer = AudioSystem.Buffers[pathToAudioFile];
		if(buffer){
			AudioSystem._play(this.context, buffer, gainNode, speed, isUseBiquadFilterRandom, IIRFilter);
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
					AudioSystem._play(AudioSystem.context, buffer, gainNode, speed, isUseBiquadFilterRandom, IIRFilter);
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

	private static _play(context: AudioContext, buffer: AudioBuffer, gainNode: GainNode, speed: number, isUseBiquadFilterRandom = false, IIRFilter: AudioIIRFilter|null = null){
		const iirFilterBuilded = this.getBuildedIIRFilter(IIRFilter);

		if(speed == 1){
			var source = context.createBufferSource();
			source.buffer = buffer;

			if(iirFilterBuilded){
				source.connect(gainNode).connect(iirFilterBuilded).connect(context.destination);
			}
			else if(isUseBiquadFilterRandom) {
				const distortion = context.createWaveShaper();
				const convolver = context.createConvolver();
				const biquadFilter = this.getRandomBiquadFilter(context);
				source.connect(gainNode).connect(biquadFilter).connect(context.destination);
			}
			else{
				source.connect(gainNode)
			}

			source.start(0); 
		}
		else{
			let source = new Tone.Player(buffer);
			if(isUseBiquadFilterRandom) {
				const biquadFilter = this.getRandomBiquadFilter(context);
				const option = {
					frequency: biquadFilter.frequency.value,
					Q: biquadFilter.Q.value,
					type:  biquadFilter.type,
					gain: biquadFilter.gain.value,
				};
				source.connect(new BiquadFilter(option));
			}
			source.playbackRate = speed;
			source.volume.value = (gainNode.gain.value - 1) * 20;
			source.toDestination();
			source.start(); 
		}
	}

	private static getRandomBiquadFilter(context: AudioContext){
		const biquadFilter = context.createBiquadFilter();
		const types: BiquadFilterType[] = ["allpass", "highpass", "highshelf", "lowpass", "lowshelf", "notch", "peaking"];

		let frequency = 0;
		let gain = 0;
		let q = 0;

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



	public static playRandomTone(volume: number, minFrequency: number = 0, maxFrequency: number = 10000, IIRFilter: AudioIIRFilter|null = null){
		const iirFilterBuilded = this.getBuildedIIRFilter(IIRFilter);
		const context = AudioSystem.context;
		const oscillator = context.createOscillator();
		const gainNode = context.createGain();
		gainNode.gain.value = volume * AudioSystem.soundVolume;
		gainNode.connect(context.destination)
		gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1); //new
		if(iirFilterBuilded){
			oscillator.connect(gainNode).connect(iirFilterBuilded).connect(AudioSystem.context.destination);
		}
		else{
			oscillator.connect(gainNode);
		}
		
		oscillator.type = AudioSystem.waveForms[Helper.getRandom(0, AudioSystem.waveForms.length - 1)];   
		oscillator.frequency.value = minFrequency + Math.random() * maxFrequency;
		oscillator.start(0); 
		if(iirFilterBuilded){
			oscillator.onended = () => oscillator.disconnect(iirFilterBuilded)
		} 
	}

	private static getBuildedIIRFilter(IIRFilter: AudioIIRFilter|null = null){
		if(!IIRFilter){
			return null;
		}

		const index = Object.values(this.iirFilters).findIndex(x => x.id == IIRFilter.id);
		const iirFilterBuilded = this.iirFiltersBuilded[index];
		return iirFilterBuilded;
	}
}