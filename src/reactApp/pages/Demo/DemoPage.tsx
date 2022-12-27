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
            { //1-я волна
                [Zombie.name]: new WaveData(7, 80, 0),
            },
            { //2-я волна
                [Zombie.name]: new WaveData(13, 80, 0),
                [Boar.name]: new WaveData(5, 60, 5)
            },
			{ //3-я волна
				[Zombie.name]: new WaveData(30, 70, 0),
				[Boar.name]: new WaveData(35, 25, 1),
				[Bat.name]: new WaveData(30, 60, 2)
			}];
    }

    public render() {
        return <div></div>;
    }
}

export default DemoPage;