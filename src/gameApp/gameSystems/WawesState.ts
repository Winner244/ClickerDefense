/** Хранилище состояний волны для использования без цикличных ссылок */
export class WawesState {

	public static isWaveStarted: boolean = false; //Волна запущена?

	public static delayStartLeftTimeMs: number = 0; //isWaveStarted = true, но волна ещё не началась - сколько ещё осталось задержки до начала волны? (миллисекунды)

}