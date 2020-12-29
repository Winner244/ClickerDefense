class Waves{
	static waveCurrent = 0; //текущая волна нападения 
	static waveMonsters = [{ //монстры на волнах
		[Zombie.name]: new WaveData(500, 60) 
	}];  

	static logic(bottomShiftBorder){
		//логика создания монстров
		var waveData = Waves.waveMonsters[Waves.waveCurrent][Zombie.name];
		var periodTime = 1000 * 60 / waveData.frequencyCreating;
		if(waveData.count > waveData.wasCreated && Date.now() > waveData.wasCreatedLastTime + periodTime + Helper.getRandom(-periodTime / 2, periodTime / 2)) 
		{ 
			let isLeftSide = Math.random() < 0.5;
			let x = isLeftSide ? -50 : Draw.canvas.width;
			let y = Draw.canvas.height - bottomShiftBorder - Zombie.image.height;
	
			Monsters.all.push(new Zombie(x, y, isLeftSide));
			waveData.wasCreated++;
			waveData.wasCreatedLastTime = Date.now();
		}
	}
}