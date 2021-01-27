import * as React from 'react';

import { App } from '../../App';
import {Shop} from '../../components/Shop/Shop';
import * as MenuStore from '../../components/Menu/MenuStore';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Waves} from '../../../gameApp/gameSystems/Waves';
import { Gamer } from '../../../gameApp/gameObjects/Gamer';

class TestShopPage extends React.Component {
    componentDidMount(){
        App.Store.dispatch(MenuStore.actionCreators.startGame());
        Game.startNew();
        Gamer.coins = 500;
        Object.values(Waves.waveMonsters[0]).map(x => x.wasCreated = x.count); //end of wawes
        Shop.show();
    }

    public render() {
        return <div></div>;
    }
}

export default TestShopPage;