import * as React from 'react';

import { App } from '../../App';
import * as MenuStore from '../../components/Menu/MenuStore';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Buildings} from '../../../gameApp/gameObjects/Buildings';
import {Tower} from '../../../gameApp/buildings/Tower';
import { Waves } from '../../../gameApp/gameSystems/Waves';

class TestPage extends React.Component {
    componentDidMount(){
        App.Store.dispatch(MenuStore.actionCreators.startGame());
        Game.startNew();
        Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
		Buildings.all.push(new Tower(200)); 
        Buildings.all[Buildings.all.length - 1].health = 1;
    }

    public render() {
        return <div></div>;
    }
}

export default TestPage;