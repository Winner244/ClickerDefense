export default class InfoItem{
	label: string; //название информации
	getValue: () => string|number; //функция получения значения

	constructor(label: string, getValue: () => string|number){
		this.label = label;
		this.getValue = getValue;
	}
}