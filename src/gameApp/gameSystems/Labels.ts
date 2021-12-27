import {Draw} from './Draw';
import {Label} from '../../models/Label';

export class Labels{
	static readonly labelLifetime: number = 1; //время жизни сообщения (в секундах)
	
	static labels: Label[] = []; // мини надписи, типо "+1" при сборе монеток

	static init(): void{
		this.labels = [];
	}

	static createYellow(x: number, y: number, text: string, lifeTime: number = Labels.labelLifetime): void{
		Labels.labels.push(new Label(x, y, text, 255, 255, 0, lifeTime));
	}

	static createGreen(x: number, y: number, text: string, lifeTime: number = Labels.labelLifetime): void{
		Labels.labels.push(new Label(x, y, text, 0, 255, 0, lifeTime));
	}

	static createRed(x: number, y: number, text: string, lifeTime: number = Labels.labelLifetime): void{
		Labels.labels.push(new Label(x, y, text, 255, 0, 0, lifeTime));
	}

	static createBlack(x: number, y: number, text: string, lifeTime: number = Labels.labelLifetime): void{
		Labels.labels.push(new Label(x, y, text, 0, 0, 0, lifeTime));
	}

	static logic(): void{
		//контроль за временем жизни
		for(let i = 0; i < Labels.labels.length; i++){
			let leftTime = Date.now() - (Labels.labels[i].timeCreated + Labels.labels[i].lifeTime * 1000);
			if(leftTime > 0){
				Labels.labels.splice(i, 1);
				i--;
				continue;
			}
		}
	}

	static draw(): void{
		Labels.labels.forEach(label => Draw.drawLabel(label, label.lifeTime));
	}
}