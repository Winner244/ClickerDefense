/** Класс помошник для фильтрации изображений - единичный статичный класс */
export class FilterHelper{


	static applyFilter(filter: string, canvasContext: OffscreenCanvasRenderingContext2D) : void {
		if(filter.indexOf('grayscale') == 0){
			return this.grayscale(this.getValue(filter), canvasContext);
		}

		throw `current filter: '${filter}' is not implemented yet!`;
	}

	static getValue(filter: string): number{
		let valueStr = filter.substring(filter.indexOf('(') + 1).replace(')', '');

		let value = 0;
		if (valueStr.indexOf('%') > -1){
			value = parseInt(valueStr.replace('%', '')) / 100;
		}
		else{
			value = parseFloat(valueStr);
		}

		return value;
	}

	/**
	 * grayscale
	 */
	static grayscale(value: number, canvasContext: OffscreenCanvasRenderingContext2D) : void
	{
		console.log('grayscale filter', 
			value, 
			canvasContext.canvas.width,
			canvasContext.canvas.height);
	}

}