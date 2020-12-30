class Labels{
	
	static labels = []; // мини надписи, типо "+1" при сборе монеток
	static labelLifetime = 1; //время жизни сообщения (в секундах)

	static init(){
		this.labels = [];
	}

	static createGreen(x, y, text){
		Labels.labels.push(new Label(x, y, text, 0, 255, 0));
	}

	static createRed(x, y, text){
		Labels.labels.push(new Label(x, y, text, 255, 0, 0));
	}

	static logic(){
		for(let i = 0; i < Labels.labels.length; i++){
			let leftTime = Date.now() - (Labels.labels[i].timeCreated + Labels.labelLifetime * 1000);
			if(leftTime > 0){
				Labels.labels.splice(i, 1);
				i--;
				continue;
			}
		}
	}

	static draw(){
		Labels.labels.forEach(label => Draw.drawLabel(label, Labels.labelLifetime));
	}
}