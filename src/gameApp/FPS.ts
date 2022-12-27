/** Мониторинг ФПС - единичный статичный класс */
export class FPS{
	static fps: number = 0; //все ФПС насчитанные за предыдущую секунду

	//технические переменные
	private static countNewFPS: number = 0; //считает текущие fps за секунду
	private static oldFPStime: string = ''; //предыдущая метка времени подсчёта фпс

	static counting() : void {
		let newDate = new Date();
		let newKey = newDate.getMinutes() + '_' + newDate.getSeconds();
		if(this.oldFPStime != newKey){
			this.fps = this.countNewFPS;
			console.log('fps: ' + this.fps); //все насчитанные фпс за предыдущую секунду
			this.countNewFPS = 0;
			this.oldFPStime = newKey;
		}

		this.countNewFPS++;
	}
}