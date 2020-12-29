class Coins{
	static all = [];

	static create(x, y){
		Coins.all.push(new Coin(x, y));
	}

	static delete(i){
		Coins.all.splice(i, 1);
	}

	static logic(millisecondsDifferent, bottomShiftBorder){
		for(let i = 0; i < Coins.all.length; i++){
			let coin = Coins.all[i];
	
			if(coin.timeCreated + Coin.lifetime * 1000 < Date.now()){
				Coins.all.splice(i, 1);
				i--;
				continue;
			}
			
			coin.logic(millisecondsDifferent, bottomShiftBorder);
		}
	}

	static draw(){
		Coins.all.forEach(coin => coin.draw());
	}
}