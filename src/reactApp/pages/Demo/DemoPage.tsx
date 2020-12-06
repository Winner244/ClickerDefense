import * as React from 'react';

import { App } from '../../App';
import * as MenuStore from '../../components/Menu/MenuStore';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Waves} from '../../../gameApp/gameSystems/Waves';
import {WaveData} from "../../../models/WaveData";
import {Zombie} from "../../../gameApp/monsters/Zombie";
import {Boar} from "../../../gameApp/monsters/Boar";
import {Bat} from "../../../gameApp/monsters/Bat";
import {Gamer} from "../../../gameApp/gamer/Gamer";

class DemoPage extends React.Component {
    componentDidMount(){
        App.Store.dispatch(MenuStore.actionCreators.startGame());
        Game.startNew();
        Gamer.coins = 500;
        Waves.all = [ //монстры на волнах
            [ //1-я волна
                new WaveData(Zombie.name, 7, 5, 0),
            ],
            [ //2-я волна
                new WaveData(Zombie.name, 5, 7, 0),
                new WaveData(Boar.name, 5, 5, 0)
            ],
			[ //3-я волна
				new WaveData(Zombie.name, 5, 10, 0),
				new WaveData(Boar.name, 5, 10, 0),
				new WaveData(Bat.name, 7, 5, 0)
			]];
    }

    public render() {
        return <div></div>;
    }
}

export default DemoPage;