import { Helper } from "../gameApp/helpers/Helper";

export default class PanelItem{
	public id: string;
	public image: HTMLImageElement;

	constructor(){
		this.id = Helper.generateUid();
		this.image = new Image();
		//this.image = image; //TODO: not image -> need magic model
	}
}