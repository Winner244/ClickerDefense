import * as React from 'react';

import { App } from '../../App';
import {Menu} from '../../components/Menu/Menu';
import * as MenuStore from '../../components/Menu/MenuStore';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Draw} from '../../../gameApp/gameSystems/Draw';
import {Buildings} from '../../../gameApp/gameObjects/Buildings';
import {Tower} from '../../../gameApp/buildings/Tower';

class TestPage extends React.Component {
    componentDidMount(){
        App.Store.dispatch(MenuStore.actionCreators.startGame());
        Game.startNew();
		Buildings.all.push(new Tower(400, Draw.canvas.height - Tower.height + 10)); //TODO: temp
    }

    public render() {
        return <div></div>;
    }
}

export default TestPage;