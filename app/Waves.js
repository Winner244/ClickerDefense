class Waves{
	static iconCountKilledMonsters = new Image(); //иконка для интерфейса

	static isStarted = false; //Волна запущена?

	static delayStartTimeLeft = 0; //сколько ещё осталось задержки
	static delayStartTime = 3000; //задержка перед началом волны (в миллисекундах) - что бы показать надпись "Волна N"

	static delayEndTimeLeft = 0; //сколько ещё осталось задержки 
	static delayEndTime = 3000; //задержка после окончании волны (в миллисекундах) - что бы показать надпись "Волна пройдена"


	static waveCurrent = 0; //текущая волна нападения 
	static waveMonsters = [{ //монстры на волнах
		[Zombie.name]: new WaveData(2, 60) 
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
		this.delayStartTimeLeft = this.delayStartTime;
		this.isStarted = true;
	}

	static logic(millisecondsDifferent, bottomShiftBorder){
		if(this.delayEndTimeLeft > 0){
			this.delayEndTimeLeft -= millisecondsDifferent;
			return;
		}

		if(!this.isStarted){
			return;
		}

		if(this.delayStartTimeLeft > 0){
			this.delayStartTimeLeft -= millisecondsDifferent;
			return;
		}

		if(this.waveCountKilledMonsters == this.waveCountMonsters){
			this.isStarted = false;
			this.delayEndTimeLeft = this.delayEndTime;
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
		if(Waves.isStarted && Waves.delayStartTimeLeft > 0){
			Draw.drawStartNewWave(Waves.waveCurrent + 1,  Waves.delayStartTimeLeft, Waves.delayStartTime);
		}
		else if(Waves.waveCountKilledMonsters == Waves.waveCountMonsters){
			Draw.drawEndNewWave(Waves.delayEndTimeLeft, Waves.delayEndTime);
		}

		if(Waves.isStarted){
			Draw.drawWaveInterface(Waves.iconCountKilledMonsters, Waves.waveCountKilledMonsters, Waves.waveCountMonsters);
		}
	}
}