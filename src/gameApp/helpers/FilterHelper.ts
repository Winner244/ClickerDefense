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
			if(value != 1){
				throw 'value != 1 is not implemented yet for grayscale filter!';
			}

			const imgData = canvasContext.getImageData(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
			for(let x = 0; x < imgData.width; x++){
				for(let y = 0; y < imgData.height; y++){
					let i = x * 4 + y * imgData.width * 4;
					var brightness = 0.34 * imgData.data[i] + 0.5 * imgData.data[i + 1] + 0.16 * imgData.data[i + 2];
					imgData.data[i] = brightness;//r 
					imgData.data[i + 1] = brightness; //g 
					imgData.data[i + 2] = brightness; //b 
					//var grayScale = (int)((oc.R * 0.3) + (oc.G * 0.59) + (oc.B * 0.11));
				}
			}
			canvasContext.putImageData(imgData, 100, 300);
	}

}