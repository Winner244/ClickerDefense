import {Gamer} from "../gameApp/gamer/Gamer";

import {Helper} from "../gameApp/helpers/Helper";

import ImprovementParameterItem from "./ImprovementParameterItem";


// Улучшение для зданий/юнитов
export default class Improvement{
	readonly id: string; //guid
	readonly label: string; //название улучшения/апгрейда
	readonly image: HTMLImageElement|null; //картинка 
	readonly infoItems: ImprovementParameterItem[]; //отображает улучшаемые характеристики и значение улучшения (+50%, +1, ...)

	priceToImprove: number; //цена

	private _improve: () => void; //функция улучшения
	isImproved: boolean; //улучшение сделано?

	constructor(
		label: string, 
		priceToImprove: number, 
		imageSrc: string = '', 
		improve: () => void = () => {},
		infoItems: ImprovementParameterItem[] = [])
	{
		this.id = Helper.generateUid();
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
		this.isImproved = false;

	}

	improve(): boolean {
		if(this.priceToImprove && !this.isImproved){
			if(Gamer.coins >= this.priceToImprove){
				Gamer.coins -= this.priceToImprove
				this._improve();
				this.isImproved = true;
				return true;
			}

			return false;
		}

		return false;
	}
}