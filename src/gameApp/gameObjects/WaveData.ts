export class WaveData{
	count: number; //количество за волну
	frequencyCreating: number; //начальное количество в минуту
	wasCreated: number; //сколько уже было создано
	wasCreatedLastTime: number; //время последнего создания монстра
	startDelaySec: number; //(в секундах) время задержки первого появления монстра (что бы более тяжёлые монстры появлялись позже лёгких)
	monsterHeight: number; //высота монстра

	constructor(monsterHeight: number, count: number, frequencyCreating: number, startDelaySec: number){
		this.monsterHeight = monsterHeight;
		this.count = count;
		this.frequencyCreating = frequencyCreating;
		this.wasCreated = 0;
		this.wasCreatedLastTime = 0;
		this.startDelaySec = startDelaySec;
	}
}