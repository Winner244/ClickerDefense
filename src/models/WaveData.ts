export class WaveData{
	count: number; //количество за волну
	frequencyCreating: number; //начальное количество в минуту
	wasCreatedCount: number; //сколько уже было создано
	timeFromLastCreated: number; //время прошедшее с последнего создания монстра
	timeWaitingNewMonster: number; //время сколько ждать до создания нового монстра
	startDelaySec: number; //(в секундах) время задержки первого появления монстра (что бы более тяжёлые монстры появлялись позже лёгких)

	constructor(count: number, frequencyCreating: number, startDelaySec: number){
		this.count = count;
		this.frequencyCreating = frequencyCreating;
		this.wasCreatedCount = 0;
		this.timeFromLastCreated = 0;
		this.startDelaySec = startDelaySec;
		this.timeWaitingNewMonster = 0;
	}
}