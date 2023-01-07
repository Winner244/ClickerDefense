/** Улучшаяемый параметр/характеристика предмета */
export default class ImprovementParameterItem{
	value: string; //значение улучшения
	icon: HTMLImageElement|null; //иконка улучшаемой характеристики 

	constructor(value: string, iconSrc: string){
		this.value = value;

		if(iconSrc){
			this.icon = new Image();
			this.icon.src = iconSrc;
		}
		else{
			this.icon = null;
		}
	}
}