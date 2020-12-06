export enum ShopCategoryEnum {
	ALL = 'all',
	MAGIC = 'magic',
	BUILDINGS = 'buildings',
	UNITS = 'units',
	CURSOR = 'cursor'
  }

export class ShopCategory{
    public static GetLabel(shopCategory: string){
        switch(shopCategory){
            case ShopCategoryEnum.MAGIC: return 'Магия';
            case ShopCategoryEnum.BUILDINGS: return 'Строения';
            case ShopCategoryEnum.UNITS: return 'Юниты';
            case ShopCategoryEnum.CURSOR: return 'Курсор';
            default: return 'Всё';
        }
    }
}
