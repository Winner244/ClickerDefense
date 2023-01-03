import ImprovementInfoItem from "./ImprovementInfoItem";

// Улучшение для зданий/юнитов
export default class Improvement{
	label: string; //название улучшения/апгрейда
	description: string; //описание улучшения/апгрейда
	price: number; //цена
	image: HTMLImageElement = new Image(); //картинка 
	infoItems: ImprovementInfoItem[]; //отображает улучшаемые характеристики и значение улучшения (+50%, +1, ...)


	constructor(label: string, price: number, description: string){
		this.label = label;
		this.price = price;
		this.description = description;
		this.infoItems = [];
	}
}