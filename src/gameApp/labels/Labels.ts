import {Label} from './Label';

/** Система управления всеми Label экземплярами - единичный статичный класс */
export class Labels{
	static readonly labelLifetimeMs: number = 1000; //время жизни сообщения (миллисекунды)
	static readonly speedOfUppingToTop: number = 20; //скорость всплывания (пикселей в секунду)
	
	static labels: Label[] = []; // мини надписи, типо "+1" при сборе монеток

	static init(): void{
		this.labels = [];
	}

	//монетки
	static createCoinLabel(x: number, y: number, text: string, lifeTimeMs: number = Labels.labelLifetimeMs): void{
		Labels.labels.push(new Label(x, y, text, 255, 255, 0, lifeTimeMs, false, true, 0, 0, 0));
	}

	//урон
	static createDamageLabel(x: number, y: number, text: string, lifeTimeMs: number = Labels.labelLifetimeMs): void{
		Labels.labels.push(new Label(x, y, text, (text == '0' ? 0 : 255), 0, 0, lifeTimeMs, true));
	}
	static createGamerDamageLabel(x: number, y: number, text: string, lifeTimeMs: number = Labels.labelLifetimeMs): void{
		Labels.labels.push(new Label(x, y, text, 255, 0, 0, lifeTimeMs, true, true, 0, 0, 0));
	}


	static logic(drawsDiffMs: number): void{
		//контроль за временем жизни
		for(let i = 0; i < Labels.labels.length; i++){
			Labels.labels[i].logic(drawsDiffMs);

			if(Labels.labels[i].leftTimeMs <= 0){
				Labels.labels.splice(i, 1);
				i--;
				continue;
			}

			//всплывание надписей
			Labels.labels[i].y -= drawsDiffMs * this.speedOfUppingToTop / 1000;
		}
	}

	static draw(): void{
		Labels.labels.forEach(label => label.draw());
	}
}