import * as React from 'react';

import { App } from '../../App';
import * as MenuStore from '../../components/Menu/MenuStore';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Buildings} from '../../../gameApp/gameSystems/Buildings';
import {Tower} from '../../../gameApp/buildings/Tower';
import { Waves } from '../../../gameApp/gameSystems/Waves';

import { Helper } from '../../helpers/Helper';
import { Draw } from '../../../gameApp/gameSystems/Draw';
import { MovingObject } from '../../../models/MovingObject';
import {Zombie} from "../../../gameApp/monsters/Zombie";
import {WaveData} from "../../../models/WaveData";
import {Boar} from "../../../gameApp/monsters/Boar";
import {Gamer} from "../../../gameApp/gameObjects/Gamer";

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
            }];
    }

    public render() {
        return <div></div>;
    }
}

export default DemoPage;