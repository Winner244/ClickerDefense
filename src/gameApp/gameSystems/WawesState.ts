/** Хранилище состояний волны для использования без цикличных ссылок/зависимостей */
export class WawesState {

	public static isWaveStarted: boolean = false; //Волна запущена?
	public static get isWaveEnded(): boolean { //Волна завершена?
		return !WawesState.isWaveStarted;
	} 

	public static delayStartLeftTimeMs: number = 0; //isWaveStarted = true, но волна ещё не началась - сколько ещё осталось задержки до начала волны? (миллисекунды)
	public static delayEndLeftTimeMs: number = 0; //isWaveStarted = false, но задержка после окончания волны ещё не закончилась - сколько ещё осталось задержки? (миллисекунды)

}