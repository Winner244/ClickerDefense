export default class ShoCategoryEnum{
	public static readonly ALL = 'all';
	public static readonly MAGIC = 'magic';
	public static readonly BUILDINGS = 'buildings';
	public static readonly UNITS = 'units';

	public static GetLabel(shopCategory: string){
		switch(shopCategory){
			case ShoCategoryEnum.MAGIC: return 'Магия';
			case ShoCategoryEnum.BUILDINGS: return 'Строения';
			case ShoCategoryEnum.UNITS: return 'Юниты';
			default: return 'Всё'; 
		  }
	}
}