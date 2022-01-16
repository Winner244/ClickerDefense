export class AudioSystem{
	static soundVolume: number = 1; //общий уровень звука эффектов (0 - is min value, 1 - is max value)
	static musicVolume: number = 1; //общий уровень звука фоновой музыки (0 - is min value, 1 - is max value)

	private static Buffers: any = {};

	static play(pathToAudioFile: string, volume: number = 1, isMusic: boolean = false): void{
		var context = new AudioContext();
		var gainNode = context.createGain()
		var volumeSettings = isMusic 
			? AudioSystem.musicVolume 
			: AudioSystem.soundVolume;
		gainNode.gain.value = volume * volumeSettings;
		gainNode.connect(context.destination)

		var buffer = AudioSystem.Buffers[pathToAudioFile];
		if(buffer){
			var source = context.createBufferSource();
			source.buffer = buffer;
			//source.connect(context.destination);
			source.connect(gainNode)

			source.start(0); 
			return;
		}
	
		//load audio file
		var request = new XMLHttpRequest();
		request.open('GET', pathToAudioFile, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			context.decodeAudioData(request.response, 
				function(buffer) {
					AudioSystem.Buffers[pathToAudioFile] = buffer;
					var source = context.createBufferSource();
					source.buffer = buffer;
					//source.connect(context.destination);
					source.connect(gainNode)
					source.start(0); 
				}, 
				function(err) { 
					console.log('error of decoding audio file: ' + pathToAudioFile, err); 
				});
		};
		request.send();
	}
}