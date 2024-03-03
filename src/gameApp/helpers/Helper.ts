/** Класс помошник с набором функций - единичный статичный класс */
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

	/**
	 * находится ли точка внутри элипса?
	 * (формула круга (x^2 * y^2 < r^2) с коэффициентом растяжения по высоте)
	 */
	static isInsideEllipse(xEllipse: number, yEllipse: number, widthEllipse: number, heightEllipse: number, x: number, y: number) : boolean
	{
		return Math.pow(x - xEllipse, 2) + Math.pow((y - yEllipse) * widthEllipse / heightEllipse, 2) < Math.pow(widthEllipse / 2, 2);   
	}

	/**
	 * Сумма массива по выбраннмоу полю в getValue функции
	 * @param array массив
	 * @param getValue функция для выбора суммируемых полей
	 */
	static sum(array: any[], getValue: (a: any) => number) : number
	{
		if(!array || !array.length){
			return 0;
		}

		return array.reduce((accumulator, currentEl) => accumulator + getValue(currentEl), 0);
	}

	/**
	 * Возвращает только уникальные значения
	 * @param array массив
	 * @returns 
	 */
	static distinct(array: any[]): any[] {
		return array.filter((value, index, self) => self.indexOf(value) === index);
	}

	/**
	 * Пересекаются ли прямоугольники?
	 * @returns 
	 */
	static isIntersectByCenter(x1: number, y1: number, width1: number, height1: number, x2: number, y2: number, width2: number, height2: number): boolean {
		let centerX1 = x1 + width1 / 2;
		let centerY1 = y1 + height1 / 2;
		return centerX1 > x2 && centerX1 < x2 + width2 && 
			   centerY1 > y2 && centerY1 < y2 + height2;
	}

    /** создаёт уникальный идентификатор */
    static generateUid(): string{
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            let r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

	static IsTriangleContainsPoint(xPoint: number, yPoint: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): boolean{
		let a = (x1 - xPoint) * (y2 - y1) - (x2 - x1) * (y1 - yPoint);
		let b = (x2 - xPoint) * (y3 - y2) - (x3 - x2) * (y2 - yPoint);
		let c = (x3 - xPoint) * (y1 - y3) - (x1 - x3) * (y3 - yPoint);

		let isContains = (a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0);
		return isContains;
	}

	static vect(x1: number, y1: number, x2: number, y2: number): number
	{
		return x1 * y2 - y1 * x2;
	}
}