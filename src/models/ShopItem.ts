export default class ShopItem{
	public name: string;
	public price: number;
	public description: string;
	public image: HTMLImageElement;
	public category: string
	public maxCount: number;

	constructor(name: string, image: HTMLImageElement, price: number, description: string, category: string, maxCount: number){
		this.name = name;
		this.price = price;
		this.description = description;
		this.image = image;
		this.category = category;
		this.maxCount = maxCount;
	}
}