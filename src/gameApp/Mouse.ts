export class Mouse{
	static x: number;
	static y: number;
	static isClick: boolean;

	static init(): void{
		window.addEventListener('mousemove', Mouse.onMove);
		window.addEventListener('mousedown', Mouse.onClick);
		this.isClick = false;
	}

	static onClick(): void{
		Mouse.isClick = true;
	}

	static onMove(event: MouseEvent): void{
		Mouse.x = event.pageX;
		Mouse.y = event.pageY;
	}
}