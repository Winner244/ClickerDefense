import ImprovementInfoItem from "./ImprovementInfoItem";

// Улучшение для зданий/юнитов
export default class Improvement{
	label: string; //название улучшения/апгрейда
	image: HTMLImageElement = new Image(); //картинка 
	infoItems: ImprovementInfoItem[]; //отображает улучшаемые характеристики и значение улучшения (+50%, +1, ...)


	constructor(label: string){
		this.label = label;
		this.infoItems = [];
	}
}