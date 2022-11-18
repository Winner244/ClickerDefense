import { Helper } from "../helpers/Helper";
import * as Tone from 'tone';

export class AudioSystem{
	static soundVolume: number = 1; //общий уровень звука эффектов (0 - is min value, 1 - is max value)
	static musicVolume: number = 1; //общий уровень звука фоновой музыки (0 - is min value, 1 - is max value)
	static context = new AudioContext();
	static context2 = new AudioContext();

	private static Buffers: any = {};
	private static waveForms: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
	private static lowPassCoefs = [
		{
			frequency: 500,
			feedforward: [0.0042681742, 0.0025363483, 0.0042681742],
			feedback: [1.0317185917, -1.9999273033, 0.9682814083]
		},
	]
	private static iirfilters = AudioSystem.lowPassCoefs.map(x => AudioSystem.context2.createIIRFilter(x.feedforward, x.feedback));

	static playRandom(arrayPathesToAudioFiles: string[], volumes: number[], isMusic: boolean = false, speed: number = 1): void {
		const i = Helper.getRandom(0, arrayPathesToAudioFiles.length - 1);
		AudioSystem.play(arrayPathesToAudioFiles[i], volumes[i], isMusic, speed);
	}

	static play(pathToAudioFile: string, volume: number = 1, isMusic: boolean = false, speed: number = 1, isRandomModify: boolean = false): void{

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
			AudioSystem._play(this.context, buffer, gainNode, speed, isRandomModify);
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
					AudioSystem._play(AudioSystem.context, buffer, gainNode, speed, isRandomModify);
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

	public static playRingingRandomTone(volume: number, minFrequency: number = 0, maxFrequency: number = 10000){
		const context = AudioSystem.context;
		const oscillator = context.createOscillator();
		const gainNode = context.createGain();
		gainNode.gain.value = volume * AudioSystem.soundVolume;
		gainNode.connect(context.destination)
		gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1); //new
		oscillator.connect(gainNode);
		
		oscillator.type = AudioSystem.waveForms[Helper.getRandom(0, AudioSystem.waveForms.length - 1)];   
		oscillator.frequency.value = minFrequency + Math.random() * maxFrequency;
		oscillator.start(0);  
	}

	public static playDeafRandomTone(volume: number, minFrequency: number = 0, maxFrequency: number = 10000){
		const oscillator = AudioSystem.context2.createOscillator();
		const gainNode = AudioSystem.context2.createGain();
		gainNode.gain.value = volume * AudioSystem.soundVolume;
		gainNode.connect(AudioSystem.context2.destination)
		gainNode.gain.exponentialRampToValueAtTime(0.00001, AudioSystem.context2.currentTime + 1); //new
		oscillator.connect(gainNode).connect(this.iirfilters[0]).connect(AudioSystem.context2.destination);
		
		oscillator.type = AudioSystem.waveForms[Helper.getRandom(0, AudioSystem.waveForms.length - 1)];   
		oscillator.frequency.value = minFrequency + Math.random() * maxFrequency;
		oscillator.start(0);  
		oscillator.onended = () => oscillator.disconnect(this.iirfilters[0])
	}

	private static _play(context: AudioContext, buffer: AudioBuffer, gainNode: GainNode, speed: number, isRandomModify: boolean = false){
		if(speed == 1){
			var source = context.createBufferSource();
			source.buffer = buffer;
			source.connect(gainNode)
			source.start(0); 
		}
		else{
			let source = new Tone.Player(buffer);
			source.playbackRate = speed;
			source.volume.value = (gainNode.gain.value - 1) * 20;
			source.toDestination();
			source.start(); 
		}
	}
}