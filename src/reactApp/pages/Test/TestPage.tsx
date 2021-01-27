import * as React from 'react';

import { App } from '../../App';
import * as MenuStore from '../../components/Menu/MenuStore';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Buildings} from '../../../gameApp/gameObjects/Buildings';
import {Tower} from '../../../gameApp/buildings/Tower';

class TestPage extends React.Component {
    componentDidMount(){
        App.Store.dispatch(MenuStore.actionCreators.startGame());
        Game.startNew();
		Buildings.all.push(new Tower(400)); //TODO: temp
    }

    public render() {
        return <div></div>;
    }
}

export default TestPage;