import PanelItem from "./PanelItem";

export default class Panel{
	public isTop: boolean; //else - bottom
	public items: PanelItem[];

	constructor(index: number){
		this.items = Array(10).fill(null);
		this.isTop = index == 0;
	}
}