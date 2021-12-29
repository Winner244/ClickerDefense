import {Draw} from './Draw';
import {Label} from '../../models/Label';

export class Labels{
	static readonly labelLifetime: number = 1000; //время жизни сообщения (в миллисекундах)
	static readonly speedOfUppingToTop: number = 20; //скорость всплывания (пикселей в секунду)
	
	static labels: Label[] = []; // мини надписи, типо "+1" при сборе монеток

	static init(): void{
		this.labels = [];
	}

	//монетки
	static createCoinLabel(x: number, y: number, text: string, lifeTimeMilliseconds: number = Labels.labelLifetime): void{
		Labels.labels.push(new Label(x, y, text, 255, 255, 0, lifeTimeMilliseconds, false, true, 0, 0, 0));
	}

	//урон
	static createMonsterDamageLabel(x: number, y: number, text: string, lifeTimeMilliseconds: number = Labels.labelLifetime): void{
		Labels.labels.push(new Label(x, y, text, 255, 0, 0, lifeTimeMilliseconds, true));
	}
	static createGamerDamageLabel(x: number, y: number, text: string, lifeTimeMilliseconds: number = Labels.labelLifetime): void{
		Labels.labels.push(new Label(x, y, text, 255, 0, 0, lifeTimeMilliseconds, true, true, 0, 0, 0));
	}


	static logic(millisecondsDifferent: number): void{
		//контроль за временем жизни
		for(let i = 0; i < Labels.labels.length; i++){
			let leftTime = Date.now() - (Labels.labels[i].timeCreated + Labels.labels[i].lifeTimeMilliseconds);
			if(leftTime > 0){
				Labels.labels.splice(i, 1);
				i--;
				continue;
			}

			//всплывание надписей
			Labels.labels[i].y -= millisecondsDifferent * this.speedOfUppingToTop / 1000;
		}
	}

	static draw(): void{
		Labels.labels.forEach(label => label.draw());
	}
}