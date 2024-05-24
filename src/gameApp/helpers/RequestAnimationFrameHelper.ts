/** Класс помошник с window.requestAnimationFrame - единичный статичный класс */
export class RequestAnimationFrameHelper{
	static start(logicCallback: (drawsDiffMs: number) => boolean) : void
	{
        let lastDrawTime: number = 0;
        let callback = (millisecondsFromStart: number) => {
            if(!lastDrawTime){
                lastDrawTime = millisecondsFromStart - 10;
            }

            let drawsDiffMs = millisecondsFromStart - lastDrawTime; //сколько времени прошло с прошлой прорисовки
            lastDrawTime = millisecondsFromStart;

            let isContinue = logicCallback(drawsDiffMs);
            if (isContinue){
                window.requestAnimationFrame(callback);
            }
        };
    
        window.requestAnimationFrame(callback);
	}
}