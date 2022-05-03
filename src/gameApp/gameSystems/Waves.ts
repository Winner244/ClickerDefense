import {WaveData} from '../../models/WaveData';
import {Size} from '../../models/Size';

import {Helper} from '../helpers/Helper';

import {Draw} from './Draw';
import {Monsters} from './Monsters';

import {Zombie} from '../monsters/Zombie';
import {Boar} from '../monsters/Boar';
import {Bat} from '../monsters/Bat';

import {Menu} from '../../reactApp/components/Menu/Menu';

import sum from 'lodash/sum';

import MonsterImage from '../../assets/img/monster.png'; 

export class Waves{
	static readonly iconCountKilledMonsters = new Image(); //иконка для интерфейса
	static readonly monsterSizeDifferentScalePercentage = 20; //(в процентах) разница в размерах создаваемых монстров одного типа.

	static isStarted: boolean = false; //Волна запущена?

	static delayStartTimeLeft: number = 0; //сколько ещё осталось задержки
	static delayStartTime: number = 3000; //задержка перед началом волны (в миллисекундах) - что бы показать надпись "Волна N"

	static delayEndTimeLeft: number = 0; //сколько ещё осталось задержки 
	static delayEndTime: number = 3000; //задержка после окончании волны (в миллисекундах) - что бы показать надпись "Волна пройдена"

	static waveTimeMs: number = 0; //(в миллисекундах) сколько по времени волна уже идёт

	static waveCurrent: number = 0; //текущая волна нападения 
	static all: { [id: string] : WaveData; }[] = [];

	static get waveCountKilledMonsters(): number{
		return sum(Object.values(Waves.all[Waves.waveCurrent]).map(x => x.wasCreated)) - Monsters.all.length;
	};
	static get waveCountMonsters(): number {
		return sum(Object.values(Waves.all[Waves.waveCurrent]).map(x => x.count))
	}

	static init(isLoadImage: boolean = true): void{
		if(isLoadImage){
			this.iconCountKilledMonsters.src = MonsterImage;
		}
		
		Waves.all = [ //монстры на волнах
			{ //1-я волна
				[Zombie.name]: new WaveData(15, 30, 0),
			},
			{ //2-я волна
				[Zombie.name]: new WaveData(15, 80, 0),
				[Boar.name]: new WaveData(15, 30, 5)
			},
			{ //3-я волна
				[Zombie.name]: new WaveData(30, 70, 0),
				[Boar.name]: new WaveData(35, 25, 1),
				[Bat.name]: new WaveData(30, 60, 2)
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
		this.waveTimeMs = 0;
		this.delayEndTimeLeft = 0;

		//call "init" in are used classes in new wave to preload lazy images
		let currentWave = Waves.all[Waves.waveCurrent];
		let monstersName = Object.keys(currentWave);
		monstersName.forEach(monsterName => Monsters.initMonster(monsterName));
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

		this.waveTimeMs += millisecondsDifferent;

		if(this.waveCountKilledMonsters == this.waveCountMonsters){
			Menu.displayShopButton();
			this.isStarted = false;
			this.delayEndTimeLeft = this.delayEndTime;
			if(Waves.all.length > this.waveCurrent + 1){
				Menu.displayNewWaveButton();
			}
			return;
		}

		//логика создания монстров
		let currentWave = Waves.all[Waves.waveCurrent];
		let wavesData = Object.keys(currentWave);
		for(let i = 0; i < wavesData.length; i++){
			let key = wavesData[i];
			let waveData = currentWave[key];

			if(this.waveTimeMs < waveData.startDelaySec * 1000){
				continue;
			}

			let periodTime = 1000 * 60 / waveData.frequencyCreating;
			if(waveData.count > waveData.wasCreated && Date.now() > waveData.wasCreatedLastTime + periodTime + Helper.getRandom(-periodTime / 2, periodTime / 2))
			{
				let isLeftSide = Math.random() < 0.5;
				let scaleMonsterSize = 1 - Waves.monsterSizeDifferentScalePercentage / 100 * Math.random();
				let monster = Monsters.create(key, isLeftSide, scaleMonsterSize);
				let monsterSize = new Size((monster.image.width || 0) / monster.frames, monster.image.height);
				let bottomPosition = Draw.canvas.height - bottomShiftBorder - monsterSize.height * scaleMonsterSize;
				monster.x = isLeftSide ? -monsterSize.width * scaleMonsterSize : Draw.canvas.width;
				monster.y = monster.isLand 
					? bottomPosition
					: Helper.getRandom(0, bottomPosition - bottomPosition * 0.1);

				Monsters.add(monster);

				waveData.wasCreated++;
				waveData.wasCreatedLastTime = Date.now();
			}
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