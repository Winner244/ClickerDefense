export class FPS{
	static fps: number = 0; //все ФПС насчитанные за предыдущую секунду
	static countNewFPS: number = 0; //техническая переменная (считает текущие fps за секунду)
	static oldFPStime: string = ''; //предыдущая метка времени подсчёта FPS

	static counting() : void {
		let newDate = new Date();
		let newKey = newDate.getMinutes() + '_' + newDate.getSeconds();
		if(FPS.oldFPStime != newKey){
			FPS.fps = FPS.countNewFPS;
			console.log('fps: ' + FPS.fps); //все насчитанные FPS за предыдущую секунду
			FPS.countNewFPS = 0;
			FPS.oldFPStime = newKey;
		}

		FPS.countNewFPS++;
	}
}