export default class InfoItem{
	label: string; //название информации
	icon: HTMLImageElement|null; //иконка характеристики 
	getValue: () => string|number; //функция получения значения

	constructor(label: string, getValue: () => string|number, iconSrc: string = ''){
		this.label = label;
		this.getValue = getValue;

		if(iconSrc){
			this.icon = new Image();
			this.icon.src = iconSrc;
		}
		else{
			this.icon = null;
		}
	}
}