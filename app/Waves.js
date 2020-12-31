class Waves{
	static iconCountKilledMonsters = new Image(); //иконка для интерфейса

	static isStarted = false; //Волна запущена?
	static strtedWaveTime = 0; //Время начала волны
	static delayStartTime = 3500; //задержка перед началом волны (в миллисекундах) - что бы показать надпись "Wave N"
	static waveCurrent = 0; //текущая волна нападения 
	static waveMonsters = [{ //монстры на волнах
		[Zombie.name]: new WaveData(500, 60) 
	}];  
	static get waveCountKilledMonsters(){
		return Object.values(Waves.waveMonsters[Waves.waveCurrent]).sum(x => x.wasCreated) - Monsters.all.length;
	};
	static get waveCountMonsters() {
		return Object.values(Waves.waveMonsters[Waves.waveCurrent]).sum(x => x.count)
	}

	static init(){
		this.iconCountKilledMonsters.src = './media/img/monster.png';
	}

	static startFirstWave(){
		this.waveCurrent = -1;
		this.startNewWave();
	}

	static startNewWave(){
		this.waveCurrent++;
		this.strtedWaveTime = Date.now();
		this.isStarted = true;
	}

	static logic(bottomShiftBorder){
		if(!this.isStarted || this.strtedWaveTime + this.delayStartTime > Date.now()){
			return;
		}

		//логика создания монстров
		var waveData = Waves.waveMonsters[Waves.waveCurrent][Zombie.name];
		var periodTime = 1000 * 60 / waveData.frequencyCreating;
		if(waveData.count > waveData.wasCreated && Date.now() > waveData.wasCreatedLastTime + periodTime + Helper.getRandom(-periodTime / 2, periodTime / 2)) 
		{ 
			let isLeftSide = Math.random() < 0.5;
			let x = isLeftSide ? -50 : Draw.canvas.width;
			let y = Draw.canvas.height - bottomShiftBorder - Zombie.images[0].height;
	
			Monsters.all.push(new Zombie(x, y, isLeftSide));
			waveData.wasCreated++;
			waveData.wasCreatedLastTime = Date.now();
		}
	}

	static draw(){
		if(Waves.isStarted && Waves.strtedWaveTime + Waves.delayStartTime > Date.now()){
			Draw.drawStartNewWave(Waves.waveCurrent + 1,  Waves.strtedWaveTime, Waves.delayStartTime);
		}
	}
}