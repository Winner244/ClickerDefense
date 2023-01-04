import { Gamer } from "../gameApp/gamer/Gamer";
import ImprovementInfoItem from "./ImprovementInfoItem";

// Улучшение для зданий/юнитов
export default class Improvement{
	label: string; //название улучшения/апгрейда
	priceToImprove: number; //цена
	image: HTMLImageElement|null; //картинка 
	infoItems: ImprovementInfoItem[]; //отображает улучшаемые характеристики и значение улучшения (+50%, +1, ...)

	private _improve: () => void; //функция улучшения

	constructor(
		label: string, 
		priceToImprove: number, 
		imageSrc: string = '', 
		improve: () => void = () => {},
		infoItems: ImprovementInfoItem[] = [])
	{
		this.label = label;
		this.priceToImprove = priceToImprove;

		if(imageSrc){
			this.image = new Image();
			this.image.src = imageSrc;
		}
		else{
			this.image = null;
		}

		this.infoItems = infoItems;
		this._improve = improve;

	}

	improve(): boolean {
		if(this.priceToImprove){
			if(Gamer.coins >= this.priceToImprove){
				Gamer.coins -= this.priceToImprove
				this._improve();
				return true;
			}

			return false;
		}

		return false;
	}
}