import {Gamer} from "../gameApp/gamer/Gamer";

import {Helper} from "../gameApp/helpers/Helper";


/** Параметр/Характеристика предмета (сила, броня, скорость, ...) */
export default class ParameterItem{
	readonly id: string; //guid
	readonly label: string; //название характеристики
	readonly icon: HTMLImageElement|null; //иконка характеристики 
	readonly iconWidth: number; //ширина иконки
	getValue: () => string|number; //функция получения значения
	private readonly _initialValue: number; 

	mouseIn: () => void; //наведении мышкой на параметр в UI
	mouseOut: () => void; //увод мышкой от параметра в UI

	isActive: () => boolean; //активно ли улучшение?

	private _priceToImprove: () => number|null; //цена повышения характеристики (если null, то улучшение не предпологается)
	private _improve: () => void; //функция повышения характеристики

	constructor(
		label: string, 
		getValue: () => string|number, 
		iconSrc: string = '', 
		iconWidth: number = 13,
		priceToImprove: () => number|null = () => null, 
		improve: () => void = () => {},
		mouseIn: () => void = () => {},
		mouseOut: () => void = () => {},
		isActive: () => boolean = () => true)
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
		
		this.iconWidth = iconWidth;
		this._priceToImprove = priceToImprove;
		this._improve = improve;

		this.mouseIn = mouseIn;
		this.mouseOut = mouseOut;
		this.isActive = isActive;

		this._initialValue = this.getNumberValue();
	}

	protected getNumberValue(){
		let valueStr = this.getValue();
		let valueNumber = 0;
		if(typeof valueStr == 'string'){
			valueNumber = parseFloat(valueStr.replace(/\D/g, ""));
			if(isNaN(valueNumber)){
				valueNumber = 0;
			}
		}
		else{
			valueNumber = valueStr;
		}

		return valueNumber;
	}
	
	priceToImprove(): number|null{
		let priceToImprove = this._priceToImprove();
		if (priceToImprove){
			var kof = 1;
			if(this._initialValue != 0){
				kof = this.getNumberValue() / this._initialValue;
				kof = Math.max(kof, 1);
			}

			priceToImprove = Math.round(kof * priceToImprove);
		}
		return priceToImprove;
	}

	improve(): number {
		let priceToImprove = this.priceToImprove();
		if (priceToImprove && this.isActive()){
			if(Gamer.coins >= priceToImprove){
				Gamer.coins -= priceToImprove
				this._improve();
				return priceToImprove;
			}

			return 0;
		}

		return 0;
	}
}