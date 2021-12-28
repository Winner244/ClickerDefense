import {Draw} from './Draw';
import {Label} from '../../models/Label';

export class Labels{
	static readonly labelLifetime: number = 1000; //время жизни сообщения (в миллисекундах)
	static readonly isUpToTop: boolean = true; //всплывать надписям вверх?
	static readonly speedOfUppingToTop: number = 10; //скорость всплывания (пикселей в секунду)
	
	static labels: Label[] = []; // мини надписи, типо "+1" при сборе монеток

	static init(): void{
		this.labels = [];
	}

	static createYellow(x: number, y: number, text: string, lifeTimeMilliseconds: number = Labels.labelLifetime): void{
		Labels.labels.push(new Label(x, y, text, 255, 255, 0, lifeTimeMilliseconds));
	}

	static createGreen(x: number, y: number, text: string, lifeTimeMilliseconds: number = Labels.labelLifetime): void{
		Labels.labels.push(new Label(x, y, text, 0, 255, 0, lifeTimeMilliseconds));
	}

	static createPurple(x: number, y: number, text: string, lifeTimeMilliseconds: number = Labels.labelLifetime): void{
		Labels.labels.push(new Label(x, y, text, 200, 0, 255, lifeTimeMilliseconds));
	}

	static createRed(x: number, y: number, text: string, lifeTimeMilliseconds: number = Labels.labelLifetime): void{
		Labels.labels.push(new Label(x, y, text, 255, 0, 0, lifeTimeMilliseconds));
	}

	static createBlack(x: number, y: number, text: string, lifeTimeMilliseconds: number = Labels.labelLifetime): void{
		Labels.labels.push(new Label(x, y, text, 0, 0, 0, lifeTimeMilliseconds));
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

			if(this.isUpToTop){
				Labels.labels[i].y -= millisecondsDifferent * this.speedOfUppingToTop / 1000;
			}
		}
	}

	static draw(): void{
		Labels.labels.forEach(label => Draw.drawLabel(label, label.lifeTimeMilliseconds));
	}
}