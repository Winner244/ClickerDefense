export default class ShopItem{
	public name: string;
	public price: number;
	public description: string;
	public image: HTMLImageElement;
	public category: string

	constructor(name: string, image: HTMLImageElement, price: number, description: string, category: string){
		this.name = name;
		this.price = price;
		this.description = description;
		this.image = image;
		this.category = category;
	}
}