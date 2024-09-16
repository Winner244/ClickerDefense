import ParameterItem from './ParameterItem';
import Improvement from './Improvement';

/** Интерфейс для объектов, которые можно прокачать (Строения, Юниты, Магия) */
export interface IUpgradableObject {

	//поля свойства экземпляра
	price: number;

	name: string;

	image: HTMLImageElement;

	infoItems: ParameterItem[];  //информация отображаемая в окне 
	improvements: Improvement[]; //улучшения объекта

	//технические поля экземпляра
	isDisplayedUpgradeWindow: boolean; //открыто ли в данный момент окно по апгрейду данного объекта? если да, то нужно подсвечивать данный объект
}