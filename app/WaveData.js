class WaveData{
	constructor(count, frequencyCreating){
		this.count = count; //количество за волну
		this.frequencyCreating = frequencyCreating; //начальное количество в минуту
		this.wasCreated = 0; //сколько уже было создано
		this.wasCreatedLastTime = 0; //время последнего создания монстра
	}
}