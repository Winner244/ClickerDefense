import {Draw} from './Draw';
import {Zombie} from '../monsters/Zombie';
import {Helper} from '../helpers/Helper';
import {Monsters} from '../gameObjects/Monsters';
import {WaveData} from '../gameObjects/WaveData';

import sum from 'lodash/sum';

import MonsterImage from '../../assets/img/monster.png'; 

import {Menu} from '../../reactApp/components/Menu/Menu';

export class Waves{
	static readonly iconCountKilledMonsters = new Image(); //иконка для интерфейса

	static isStarted: boolean = false; //Волна запущена?

	static delayStartTimeLeft: number = 0; //сколько ещё осталось задержки
	static delayStartTime: number = 3000; //задержка перед началом волны (в миллисекундах) - что бы показать надпись "Волна N"

	static delayEndTimeLeft: number = 0; //сколько ещё осталось задержки 
	static delayEndTime: number = 3000; //задержка после окончании волны (в миллисекундах) - что бы показать надпись "Волна пройдена"


	static waveCurrent: number = 0; //текущая волна нападения 
	static waveMonsters: { [id: string] : WaveData; }[] = [];  

	static get waveCountKilledMonsters(): number{
		return sum(Object.values(Waves.waveMonsters[Waves.waveCurrent]).map(x => x.wasCreated)) - Monsters.all.length;
	};
	static get waveCountMonsters(): number {
		return sum(Object.values(Waves.waveMonsters[Waves.waveCurrent]).map(x => x.count))
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage){
			this.iconCountKilledMonsters.src = MonsterImage;
		}
		
		this.waveMonsters = [ //монстры на волнах
			{ //1-я волна
				[Zombie.name]: new WaveData(2, 60) 
			},
			{ //2-я волна
				[Zombie.name]: new WaveData(13, 100) 
			}];  
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

	static logic(millisecondsDifferent: number, bottomShiftBorder: number): void{
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
			Menu.displayShopButton();
			this.isStarted = false;
			this.delayEndTimeLeft = this.delayEndTime;
			if(this.waveMonsters.length > this.waveCurrent + 1){
				Menu.displayNewWaveButton();
			}
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

	static draw(): void{
		if(Waves.isStarted && Waves.delayStartTimeLeft > 0){
			Draw.drawStartNewWave(Waves.waveCurrent + 1,  Waves.delayStartTimeLeft, Waves.delayStartTime);
		}
		else if(Waves.waveCountKilledMonsters == Waves.waveCountMonsters && Waves.delayEndTimeLeft > 0){
			Draw.drawEndNewWave(Waves.delayEndTimeLeft, Waves.delayEndTime);
		}

		if(Waves.isStarted){
			Draw.drawWaveInterface(Waves.iconCountKilledMonsters, Waves.waveCountKilledMonsters, Waves.waveCountMonsters);
		}
	}
}