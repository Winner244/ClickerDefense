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
import {Minotaur} from '../monsters/Minotaur';
import {EyeJupiter} from '../monsters/EyeJupiter';

import {Menu} from '../../reactApp/components/Menu/Menu';

import {WavesState} from '../WavesState';

import StartNewWaveSound from '../../assets/sounds/startWave.mp3'; 

import MonsterImage from '../../assets/img/monster.png'; 

/** Система управления волнами монстров - единичный статичный экземпляр */
export class Waves{
	static readonly iconCountKilledMonsters = new Image(); //иконка для интерфейса
	static readonly monsterSizeDifferentScalePercentage = 20; //(в процентах) разница в размерах создаваемых монстров одного типа.

	static waveTimeMs: number = 0; //(миллисекунды) сколько по времени волна уже идёт

	static waveCurrent: number = 0; //текущая волна нападения 
	static all: WaveData[][] = [];

	static get waveCountKilledMonsters(): number{
		return sum(Waves.all[Waves.waveCurrent].map(x => x.wasKilledCount));
	};
	static get waveCountMonsters(): number {
		return sum(Waves.all[Waves.waveCurrent].map(x => x.count));
	}

	static init(isLoadResources: boolean = true): void{
		if(isLoadResources){
			this.iconCountKilledMonsters.src = MonsterImage;
		}
		
		Waves.all = [ //монстры на волнах
			[ //1-я волна
				new WaveData(Zombie.name, 15, 15, 0),
			],
			[ //2-я волна
				new WaveData(Zombie.name, 22, 16.5 * 3, 0),
				new WaveData(Boar.name, 13, 21 * 3, 5)
			],
			[ //3-я волна
				new WaveData(Zombie.name, 30, 24 * 3, 0),
				new WaveData(Boar.name, 18, 37.5 * 3, 1),
				new WaveData(Bat.name, 35, 31 * 3, 2)
			],
			[ //4-ая волна
				new WaveData(Boar.name, 23, 20 * 3, 0),
				new WaveData(Bat.name, 50, 21 * 3, 0),

				new WaveData(Zombie.name, 100, 45 * 3, 15),
				new WaveData(Necromancer.name, 10, 45 * 3, 15),

				new WaveData(Boar.name, 9, 40 * 3, 20),
				new WaveData(Bat.name, 15, 40 * 3, 20),
			],
			[ //5-ая волна
				new WaveData(Zombie.name, 30, 50 * 3, 0),
				new WaveData(Boar.name, 18, 37.5 * 3, 1),
				new WaveData(Bat.name, 50, 50 * 3, 2),
				new WaveData(Necromancer.name, 15, 45 * 3, 0),
				new WaveData(Minotaur.name, 2, 50 * 3, 0),
			],
			[ //6-ая волна
				new WaveData(Zombie.name, 70, 50 * 3, 0),
				new WaveData(Boar.name, 80, 37.5 * 3, 1),
				new WaveData(Bat.name, 60, 50 * 3, 2),
				new WaveData(Necromancer.name, 25, 70 * 3, 0),
				new WaveData(Minotaur.name, 10, 70 * 3, 0),
				new WaveData(EyeJupiter.name, 10, 50, 5),
			]];
	}

	static startFirstWave(){
		this.waveCurrent = -1;
		this.startNewWave();
	}

	static startNewWave(){
		this.waveCurrent++;
		WavesState.delayStartLeftTimeMs = WavesState.delayStartTimeMs;
		WavesState.isWaveStarted = true;
		this.waveTimeMs = 0;
		WavesState.delayEndLeftTimeMs = 0;

		//call "init" in are used classes in new wave to preload lazy images
		let currentWave = Waves.all[Waves.waveCurrent];
		let monstersName = Helper.distinct(currentWave.map(x => x.monsterName));
		monstersName.forEach(monsterName => Monsters.initMonster(monsterName));

		Game.loadResourcesAfterStartOfWave(this.waveCurrent);

		MusicSystem.stop();

		if(this.waveCurrent > 0){
			AudioSystem.play(-1, StartNewWaveSound, -5);
		}
	}

	static logic(drawsDiffMs: number, bottomShiftBorder: number): void{
		if(WavesState.delayEndLeftTimeMs > 0){
			WavesState.delayEndLeftTimeMs -= drawsDiffMs;
			if(WavesState.delayEndLeftTimeMs <= 0){
				var isWasLastWave = this.waveCurrent + 1 >= Waves.all.length;
				Game.endOfWaveComplete(isWasLastWave);
			}
			return;
		}

		if(!WavesState.isWaveStarted){
			return;
		}

		if(WavesState.delayStartLeftTimeMs > 0){
			WavesState.delayStartLeftTimeMs -= drawsDiffMs;
			if(WavesState.delayStartLeftTimeMs <= 0){
				Game.startOfWaveComplete();
			}
			return;
		}

		this.waveTimeMs += drawsDiffMs;

		//end of wave
		if(this.waveCountKilledMonsters >= this.waveCountMonsters && Monsters.all.length == 0){
			WavesState.isWaveStarted = false;
			WavesState.delayEndLeftTimeMs = WavesState.delayEndTimeMs;
			if(Waves.all.length > this.waveCurrent + 1){
				Menu.displayNewWaveButton();
				Menu.displayShopButton();
			}
			Game.loadResourcesAfterEndOfWave(Waves.waveCurrent);
			Game.endOfWave();
			MusicSystem.playPeaceTime(WavesState.delayEndTimeMs / 1000);
			document.dispatchEvent(new CustomEvent(WavesState.END_WAVE_EVENT));
			return;
		}

		//логика создания монстров
		let currentWave = Waves.all[Waves.waveCurrent];
		for(let i = 0; i < currentWave.length; i++){
			let waveData = currentWave[i];

			if(this.waveTimeMs < waveData.startDelayMs){
				continue;
			}

			waveData.timeFromLastCreatedMs += drawsDiffMs;
			if(waveData.count > waveData.wasCreatedCount && waveData.timeFromLastCreatedMs > waveData.timeWaitingNewMonsterMs)
			{
				let isLeftSide = Math.random() < 0.5;
				let scaleMonsterSize = 1 - Waves.monsterSizeDifferentScalePercentage / 100 * Math.random();
				let monster = Monsters.create(waveData.monsterName, isLeftSide, scaleMonsterSize);
				let bottomPosition = Draw.canvas.height - bottomShiftBorder - monster.height * scaleMonsterSize;
				monster.x = isLeftSide ? -monster.width * scaleMonsterSize : Draw.canvas.width;
				monster.y = monster.isLand 
					? bottomPosition
					: Helper.getRandom(0, bottomPosition - bottomPosition * 0.1);

				if(waveData.monsterName == EyeJupiter.name){
					monster.y -= EyeJupiter.hoverShiftBase;
				}

				Monsters.add(monster);

				let periodWaitingTimeMs = waveData.durationCreatingMs / waveData.count;
				waveData.timeWaitingNewMonsterMs = periodWaitingTimeMs + Helper.getRandom(-periodWaitingTimeMs / 2, periodWaitingTimeMs / 2)
				waveData.timeFromLastCreatedMs = 0;
				waveData.wasCreatedCount++;
			}
		}
	}

	static draw(): void{
		if(WavesState.isWaveStarted && WavesState.delayStartLeftTimeMs > 0){
			Draw.drawStartNewWave(Waves.waveCurrent + 1,  WavesState.delayStartLeftTimeMs, WavesState.delayStartTimeMs);
		}
		else if(Waves.waveCountKilledMonsters >= Waves.waveCountMonsters && WavesState.delayEndLeftTimeMs > 0 && Monsters.all.length == 0){
			Draw.drawEndNewWave(WavesState.delayEndLeftTimeMs, WavesState.delayEndTimeMs);
		}

		if(WavesState.isWaveStarted){
			Draw.drawWaveInterface(Waves.iconCountKilledMonsters, Waves.waveCountKilledMonsters, Waves.waveCountMonsters);
		}
	}
}