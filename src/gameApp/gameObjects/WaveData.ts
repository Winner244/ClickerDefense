export class WaveData{
	count: number; //количество за волну
	frequencyCreating: number; //начальное количество в минуту
	wasCreated: number; //сколько уже было создано
	wasCreatedLastTime: number; //время последнего создания монстра

	constructor(count: number, frequencyCreating: number){
		this.count = count; //количество за волну
		this.frequencyCreating = frequencyCreating; //начальное количество в минуту
		this.wasCreated = 0; //сколько уже было создано
		this.wasCreatedLastTime = 0; //время последнего создания монстра
	}
}