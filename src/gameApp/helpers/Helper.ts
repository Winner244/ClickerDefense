export class Helper{
	static getRandom(min: number, max: number) : number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * Возвращает угол между прямым углом и боковым углом внутри прямоугольного треугольника 
	 * (точка 1 и точка 2 - не прямые углы прямоугольного треугольника, нижняя грань треугольника считается паралельной оси x)
	 * @param x1 x верхнего угла
	 * @param y1 y верхнего угла
	 * @param x2 x бокового угла
	 * @param y2 y бокового угла
	 */
	static getRotateAngle(x1: number, y1: number, x2: number, y2: number) : number
	{
		let dX: number = x1 - x2;
		let dY: number = y1 - y2;

		if (dX == 0 && dY == 0) {
			return 0;
		}

		let angle : number = (Math.atan(dY / dX) + (dX >= 0 ? Math.PI : 0)) * 180 / Math.PI;

		return angle >= 0 ? angle : 360 + angle;
	}

	/**
	 * Расстояние между точками
	 * @param x1 
	 * @param y1 
	 * @param x2 
	 * @param y2 
	 */
	static getDistance(x1: number, y1: number, x2: number, y2: number) : number
	{
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	}
}