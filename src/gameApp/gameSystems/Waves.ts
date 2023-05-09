import sum from 'lodash/sum';

import {Draw} from './Draw';
import {Game} from './Game';
import {AudioSystem} from './AudioSystem';
import {MusicSystem} from './MusicSystem';

import {WaveData} from '../../models/WaveData';

import {Helper} from '../helpers/Helper';

import {Bat} from '../monsters/Bat';
import {Boar} from '../monsters/Boar';
import {Zombie} from '../monsters/Zombie';
import {Monsters} from '../monsters/Monsters';
import {Necromancer} from '../monsters/Necromancer';

import {Menu} from '../../reactApp/components/Menu/Menu';

import StartNewWaveSound from '../../assets/sounds/startWave.mp3'; 

import MonsterImage from '../../assets/img/monster.png'; 


/** Система управления волнами монстров - единичный статичный экземпляр */
export class Waves{
	static readonly iconCountKilledMonsters = new Image(); //иконка для интерфейса
	static readonly monsterSizeDifferentScalePercentage = 20; //(в процентах) разница в размерах создаваемых монстров одного типа.

	static isStarted: boolean = false; //Волна запущена?

	static delayStartLeftTimeMs: number = 0; //сколько ещё осталось задержки (миллисекунды)
	static readonly delayStartTimeMs: number = 3000; //задержка перед началом волны (миллисекунды) - что бы показать надпись "Волна N"

	static delayEndLeftTimeMs: number = 0; //сколько ещё осталось задержки 
	static readonly delayEndTimeMs: number = 3000; //задержка после окончании волны (миллисекунды) - что бы показать надпись "Волна пройдена"

	static waveTimeMs: number = 0; //(миллисекунды) сколько по времени волна уже идёт

	static waveCurrent: number = 0; //текущая волна нападения 
	static all: { [id: string] : WaveData; }[] = [];

	static get waveCountKilledMonsters(): number{
		return sum(Object.values(Waves.all[Waves.waveCurrent]).map(x => x.wasKilledCount));
	};
	static get waveCountMonsters(): number {
		return sum(Object.values(Waves.all[Waves.waveCurrent]).map(x => x.count));
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			this.iconCountKilledMonsters.src = MonsterImage;
		}
		
		Waves.all = [ //монстры на волнах
			{ //1-я волна
				[Zombie.name]: new WaveData(15, 30, 0),
			},
			{ //2-я волна
				[Zombie.name]: new WaveData(22, 80, 0),
				[Boar.name]: new WaveData(13, 30, 5)
			},
			{ //3-я волна
				[Zombie.name]: new WaveData(30, 75, 0),
				[Boar.name]: new WaveData(18, 28, 1),
				[Bat.name]: new WaveData(35, 63, 2)
			},
			{ //4-ая волна
				[Zombie.name]: new WaveData(30, 15, 15),
				[Boar.name]: new WaveData(70, 70, 0),
				[Bat.name]: new WaveData(250, 250, 0),
				[Necromancer.name]: new WaveData(15, 10, 15),
			},
			{ //5-ая волна (демо - без нового монстра)
				[Zombie.name]: new WaveData(30, 75, 0),
				[Boar.name]: new WaveData(18, 28, 1),
				[Bat.name]: new WaveData(90, 93, 2),
				[Necromancer.name]: new WaveData(15, 10, 0),
			}];
	}

	static startFirstWave(){
		this.waveCurrent = -1;
		this.startNewWave();
	}

	static startNewWave(){
		this.waveCurrent++;
		this.delayStartLeftTimeMs = this.delayStartTimeMs;
		this.isStarted = true;
		this.waveTimeMs = 0;
		this.delayEndLeftTimeMs = 0;

		//call "init" in are used classes in new wave to preload lazy images
		let currentWave = Waves.all[Waves.waveCurrent];
		let monstersName = Object.keys(currentWave);
		monstersName.forEach(monsterName => Monsters.initMonster(monsterName));

		Game.loadResourcesAfterStartOfWave(this.waveCurrent);

		MusicSystem.stop();

		if(this.waveCurrent > 0){
			AudioSystem.play(-1, StartNewWaveSound, 0.2);
		}
	}

	static logic(drawsDiffMs: number, bottomShiftBorder: number): void{
		if(this.delayEndLeftTimeMs > 0){
			this.delayEndLeftTimeMs -= drawsDiffMs;
			return;
		}

		if(!this.isStarted){
			return;
		}

		if(this.delayStartLeftTimeMs > 0){
			this.delayStartLeftTimeMs -= drawsDiffMs;
			return;
		}

		this.waveTimeMs += drawsDiffMs;

		//end of wave
		if(this.waveCountKilledMonsters >= this.waveCountMonsters && Monsters.all.length == 0){
			Menu.displayShopButton();
			this.isStarted = false;
			this.delayEndLeftTimeMs = this.delayEndTimeMs;
			if(Waves.all.length > this.waveCurrent + 1){
				Menu.displayNewWaveButton();
			}
			Game.loadResourcesAfterEndOfWave(Waves.waveCurrent);
			Game.endOfWave();
			MusicSystem.playPeaceTime(this.delayEndTimeMs / 1000);
			return;
		}

		//логика создания монстров
		let currentWave = Waves.all[Waves.waveCurrent];
		let wavesData = Object.keys(currentWave);
		for(let i = 0; i < wavesData.length; i++){
			let key = wavesData[i];
			let waveData = currentWave[key];

			if(this.waveTimeMs < waveData.startDelayMs){
				continue;
			}

			waveData.timeFromLastCreatedMs += drawsDiffMs;
			if(waveData.count > waveData.wasCreatedCount && waveData.timeFromLastCreatedMs > waveData.timeWaitingNewMonsterMs)
			{
				let isLeftSide = Math.random() < 0.5;
				let scaleMonsterSize = 1 - Waves.monsterSizeDifferentScalePercentage / 100 * Math.random();
				let monster = Monsters.create(key, isLeftSide, scaleMonsterSize);
				let bottomPosition = Draw.canvas.height - bottomShiftBorder - monster.height * scaleMonsterSize;
				monster.x = isLeftSide ? -monster.width * scaleMonsterSize : Draw.canvas.width;
				monster.y = monster.isLand 
					? bottomPosition
					: Helper.getRandom(0, bottomPosition - bottomPosition * 0.1);

				Monsters.add(monster);

				let periodTimeMs = 1000 * 60 / waveData.frequencyCreating;
				waveData.timeWaitingNewMonsterMs = periodTimeMs + Helper.getRandom(-periodTimeMs / 2, periodTimeMs / 2)
				waveData.timeFromLastCreatedMs = 0;
				waveData.wasCreatedCount++;
			}
		}
	}

	static draw(): void{
		if(Waves.isStarted && Waves.delayStartLeftTimeMs > 0){
			Draw.drawStartNewWave(Waves.waveCurrent + 1,  Waves.delayStartLeftTimeMs, Waves.delayStartTimeMs);
		}
		else if(Waves.waveCountKilledMonsters >= Waves.waveCountMonsters && Waves.delayEndLeftTimeMs > 0 && Monsters.all.length == 0){
			Draw.drawEndNewWave(Waves.delayEndLeftTimeMs, Waves.delayEndTimeMs);
		}

		if(Waves.isStarted){
			Draw.drawWaveInterface(Waves.iconCountKilledMonsters, Waves.waveCountKilledMonsters, Waves.waveCountMonsters);
		}
	}
}