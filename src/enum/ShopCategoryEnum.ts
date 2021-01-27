export class ShopCategory{
	public static GetLabel(shopCategory: string){
		switch(shopCategory){
			case ShopCategoryEnum.MAGIC: return 'Магия';
			case ShopCategoryEnum.BUILDINGS: return 'Строения';
			case ShopCategoryEnum.UNITS: return 'Юниты';
			default: return 'Всё'; 
		  }
	}
}

export enum ShopCategoryEnum {
	ALL = 'all',
	MAGIC = 'magic',
	BUILDINGS = 'buildings',
	UNITS = 'units'
  }