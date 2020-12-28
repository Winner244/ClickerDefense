class Canvas{
	static canvas = document.getElementById('canvas');
	static ctx = Canvas.canvas.getContext('2d');

	static drawHealth(x, y, width, healthMax, healthCurrent){
		let height = 2;
		let border = 0;
		Canvas.ctx.fillStyle = "orange";
		Canvas.ctx.fillRect(x, y, width + border * 2, height + border * 2);

		Canvas.ctx.fillStyle = "black";
		Canvas.ctx.fillRect(x + border, y + border, width, height);

		Canvas.ctx.fillStyle = "red";
		Canvas.ctx.fillRect(x + border, y + border, width * (healthCurrent/ healthMax), height);
	}
}