import { Helper } from "../helpers/Helper";
import * as Tone from 'tone';

export class AudioSystem{
	static soundVolume: number = 1; //общий уровень звука эффектов (0 - is min value, 1 - is max value)
	static musicVolume: number = 1; //общий уровень звука фоновой музыки (0 - is min value, 1 - is max value)
	static context = new AudioContext();

	private static Buffers: any = {};

	static playRandom(arrayPathesToAudioFiles: string[], volumes: number[], isMusic: boolean = false, speed: number = 1): void {
		const i = Helper.getRandom(0, arrayPathesToAudioFiles.length - 1);
		AudioSystem.play(arrayPathesToAudioFiles[i], volumes[i], isMusic, speed);
	}

	static play(pathToAudioFile: string, volume: number = 1, isMusic: boolean = false, speed: number = 1): void{

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
			AudioSystem._play(this.context, buffer, gainNode, speed);
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
					AudioSystem._play(AudioSystem.context, buffer, gainNode, speed);
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

	private static _play(context: AudioContext, buffer: AudioBuffer, gainNode: GainNode, speed: number){
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