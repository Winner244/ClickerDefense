export class WaveData{
	count: number; //количество за волну
	frequencyCreating: number; //начальное количество в минуту
	wasCreatedCount: number; //сколько уже было создано
	timeFromLastCreatedMs: number; //время прошедшее с последнего создания монстра (миллисекунды)
	timeWaitingNewMonsterMs: number; //время сколько ждать до создания нового монстра  (миллисекунды)
	startDelayMs: number; //время задержки первого появления монстра (что бы более тяжёлые монстры появлялись позже лёгких)  (миллисекунды)

	constructor(count: number, frequencyCreating: number, startDelayMs: number){
		this.count = count;
		this.frequencyCreating = frequencyCreating;
		this.wasCreatedCount = 0;
		this.timeFromLastCreatedMs = 0;
		this.startDelayMs = startDelayMs;
		this.timeWaitingNewMonsterMs = 0;
	}
}