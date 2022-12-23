import * as React from 'react';

import {App} from '../../App';
import {Shop} from '../../components/Shop/Shop';
import {Menu} from '../../components/Menu/Menu';
import * as MenuStore from '../../components/Menu/MenuStore';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Gamer} from '../../../gameApp/gamer/Gamer';
import {Waves} from '../../../gameApp/waves/Waves';

class TestShopPage extends React.Component {
    componentDidMount(){
        App.Store.dispatch(MenuStore.actionCreators.startGame());
        Game.startNew();
        Waves.isStarted = false;
        Menu.displayNewWaveButton();
        Menu.displayShopButton();
        Gamer.coins = 500;
        Shop.show();
    }

    public render() {
        return <div></div>;
    }
}

export default TestShopPage;