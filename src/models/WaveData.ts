export class WaveData{
	monsterName: string; //name of class of monster
	count: number; //количество за волну
	durationCreatingMs: number; //за сколько времени указанное количество монстров должно появиться
	wasCreatedCount: number; //сколько уже было создано
	wasKilledCount: number; //сколько уже было уничтожено
	timeFromLastCreatedMs: number; //время прошедшее с последнего создания монстра (миллисекунды)
	timeWaitingNewMonsterMs: number; //время сколько ждать до создания нового монстра  (миллисекунды)
	startDelayMs: number; //время задержки первого появления монстра (что бы более тяжёлые монстры появлялись позже лёгких)  (миллисекунды)

	constructor(monsterName: string, count: number, durationCreatingSec: number, startDelaySeconds: number){
		this.monsterName = monsterName;
		this.count = count;
		this.durationCreatingMs = durationCreatingSec * 1000;
		this.wasCreatedCount = 0;
		this.wasKilledCount = 0;
		this.timeFromLastCreatedMs = 0;
		this.startDelayMs = startDelaySeconds * 1000;
		this.timeWaitingNewMonsterMs = 0;
	}
}