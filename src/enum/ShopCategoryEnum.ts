export default class ShopCategoryEnum{
	public static readonly ALL = 'all';
	public static readonly MAGIC = 'magic';
	public static readonly BUILDINGS = 'buildings';
	public static readonly UNITS = 'units';

	public static GetLabel(shopCategory: string){
		switch(shopCategory){
			case ShopCategoryEnum.MAGIC: return 'Магия';
			case ShopCategoryEnum.BUILDINGS: return 'Строения';
			case ShopCategoryEnum.UNITS: return 'Юниты';
			default: return 'Всё'; 
		  }
	}
}