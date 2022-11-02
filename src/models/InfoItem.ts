import { Helper } from "../gameApp/helpers/Helper";

export default class InfoItem{
	id: string; //guid
	label: string; //название характеристики
	icon: HTMLImageElement|null; //иконка характеристики 
	getValue: () => string|number; //функция получения значения

	improvePoints: number|null; //кол-во пунктов улучшения характеристики
	priceToImprove: number|null; //цена повышения характеристики (если null, то улучшение не предпологается)
	private _improve: (improvePoints: number, priceToImprove: number) => boolean; //функция повышения характеристики

	constructor(
		label: string, 
		getValue: () => string|number, 
		iconSrc: string = '', 
		improvePoints: number|null, 
		priceToImprove: number|null, 
		improve: (improvePoints: number, priceToImprove: number) => boolean)
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
		
		this.improvePoints = improvePoints;
		this.priceToImprove = priceToImprove;
		this._improve = improve;
	}

	improve(): boolean {
		if(this.improvePoints && this.priceToImprove){
			return this._improve(this.improvePoints, this.priceToImprove);
		}

		return false;
	}
}