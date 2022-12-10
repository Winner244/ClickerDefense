import {Gamer} from "../gameApp/gameObjects/Gamer";

import {Helper} from "../gameApp/helpers/Helper";


export default class InfoItem{
	id: string; //guid
	label: string; //название характеристики
	icon: HTMLImageElement|null; //иконка характеристики 
	getValue: () => string|number; //функция получения значения

	mouseIn: () => void; //наведении мышкой на параметр в UI
	mouseOut: () => void; //увод мышкой от параметра в UI

	priceToImprove: number|null; //цена повышения характеристики (если null, то улучшение не предпологается)
	private _improve: () => void; //функция повышения характеристики

	constructor(
		label: string, 
		getValue: () => string|number, 
		iconSrc: string = '', 
		priceToImprove: number|null = null, 
		improve: () => void = () => {},
		mouseIn: () => void = () => {},
		mouseOut: () => void = () => {})
	{
		this.id = Helper.generateUid();
		this.label = label;
		this.getValue = getValue;

		if(iconSrc){
			this.icon = new Image();
			this.icon.src = iconSrc;
		}
		else{
			this.icon = null;
		}
		
		this.priceToImprove = priceToImprove;
		this._improve = improve;

		this.mouseIn = mouseIn;
		this.mouseOut = mouseOut;
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