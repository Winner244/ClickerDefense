/** Данные по вводу клавиш через мышку - единичный статичный класс */
export class Mouse{
	static x: number;
	static y: number;
	static isClick: boolean;
	static isRightClick: boolean;

	static init(): void{
		window.removeEventListener('mousemove', Mouse.onMove);
		window.removeEventListener('mousedown', Mouse.onClick);
		window.addEventListener('mousemove', Mouse.onMove);
		window.addEventListener('mousedown', Mouse.onClick);
		this.isClick = false;
	}

	static onClick(event: MouseEvent): void{
		Mouse.isClick = event.button == 0;
		Mouse.isRightClick = event.button == 2;
	}

	static onMove(event: MouseEvent): void{
		let reactDiv = document.getElementById('react');
		let scrollTopMain = reactDiv?.scrollTop ?? 0;

		Mouse.x = event.pageX;
		Mouse.y = event.pageY + scrollTopMain;
	}
}