import ParameterItem from './ParameterItem';
import AnimationInfinite from './AnimationInfinite';
import Improvement from './Improvement';

import {IUpgradableObject} from './IUpgradableObject';

import UpgradeAnimation from '../assets/img/buildings/upgrade.png';
import timerIcon from '../assets/img/icons/timer.png';  

/** Базовый класс для магии, которрое можно прокачать */
export class UpgradableMagicObject implements IUpgradableObject {
	static readonly upgradeAnimation: AnimationInfinite = new AnimationInfinite(90, 3000); //анимация апгрейда

	//поля свойства экземпляра
	name: string;
	image: HTMLImageElement; //для отображения на панели доступа и в магазине
	timeRecoveryMs: number; //время восстановления магии (миллисекунды) - растёт при прокачке, так же можно отдельно её уменьшить за монеты

	price: number;

	infoItems: ParameterItem[];  //информация отображаемая в окне 
	improvements: Improvement[]; //улучшения объекта

	//технические поля экземпляра
	protected _isDisplayedUpgradeWindow: boolean; //открыто ли в данный момент окно по апгрейду данного объекта? если да, то нужно подсвечивать данный объект

	constructor(
		name: string, 
		image: HTMLImageElement, 
		timeRecoveryMs: number,
		price: number)
	{
		this.name = name;
		this.image = image;
		this.timeRecoveryMs = timeRecoveryMs;
		this.price = price;

		this._isDisplayedUpgradeWindow = false;

		this.infoItems = [];
		this.improvements = [];
	}

	static loadUpgradeResources(): void{
		UpgradableMagicObject.upgradeAnimation.changeImage(UpgradeAnimation);
	}

	loadedResourcesAfterBuy(){
		this.infoItems = [
			new ParameterItem('Восстановление', 
				() => this.timeRecoveryMs, timerIcon, 13, 
				() => Math.max(1, 100 - (this.timeRecoveryMs / 100)), 
				() => this.timeRecoveryMs = Math.max(0, this.timeRecoveryMs - 100),
				() => this.timeRecoveryMs > 0)
		];
	}

	set isDisplayedUpgradeWindow(value: boolean){
		this._isDisplayedUpgradeWindow = value;
	}
	get isDisplayedUpgradeWindow(): boolean{
		return this._isDisplayedUpgradeWindow;
	}
}