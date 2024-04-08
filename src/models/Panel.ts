import { Magic } from "../gameApp/magic/Magic";

export default class Panel{
	public isTop: boolean; //else - bottom
	public items: Magic[];

	constructor(index: number){
		this.items = Array(10).fill(null);
		this.isTop = index == 0;
	}
}