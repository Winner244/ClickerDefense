/** Данные Игрока - единичный статичный класс */
export class Gamer{
	static coins: number = 0; //монеток собрано
	static cursorDamage: number = 1; //урон кликом

	static init(): void{
		this.coins = 0;
		this.cursorDamage = 1;
	}
}