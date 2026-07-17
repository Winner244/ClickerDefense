/** Данные Игрока - единичный статичный класс */
export class Gamer{
	private static readonly difficultyStorageKey = 'clickerDefense.difficultyLevel';

	static coins: number = 0; //монеток собрано
	static cursorDamage: number = 1; //урон кликом
	static difficultyLevel: number = 1; //1 - супер сложно, 4 - легко

	static get difficultyCoinMultiplier(): number {
		return Gamer.difficultyLevel;
	}

	static get difficultyWaveMultiplier(): number {
		return Gamer.difficultyLevel;
	}

	static setDifficultyLevel(level: number): void {
		const normalizedLevel = Math.floor(level);
		Gamer.difficultyLevel = Math.max(1, Math.min(4, normalizedLevel));
		Gamer.saveDifficultyLevel();
	}

	static init(): void{
		this.coins = 0;
		this.cursorDamage = 1;
		Gamer.loadDifficultyLevel();
	}

	private static loadDifficultyLevel(): void {
		try {
			const rawValue = localStorage.getItem(Gamer.difficultyStorageKey);
			if(rawValue == null){
				return;
			}

			const parsedLevel = parseInt(rawValue, 10);
			if(!Number.isNaN(parsedLevel)){
				Gamer.setDifficultyLevel(parsedLevel);
			}
		}
		catch{
			// ignore storage access errors
		}
	}

	private static saveDifficultyLevel(): void {
		try {
			localStorage.setItem(Gamer.difficultyStorageKey, Gamer.difficultyLevel.toString());
		}
		catch{
			// ignore storage access errors
		}
	}
}