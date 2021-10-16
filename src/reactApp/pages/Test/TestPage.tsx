import * as React from 'react';

import { App } from '../../App';
import * as MenuStore from '../../components/Menu/MenuStore';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Buildings} from '../../../gameApp/gameObjects/Buildings';
import {Tower} from '../../../gameApp/buildings/Tower';
import { Waves } from '../../../gameApp/gameSystems/Waves';

import { Helper } from '../../helpers/Helper';
import { Draw } from '../../../gameApp/gameSystems/Draw';
import { MovingObject } from '../../../models/MovingObject';

class TestPage extends React.Component {
    componentDidMount(){
        let variant: any = Helper.getUrlQuery()['variant'];
        switch(+variant){
            case 1:
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Buildings.all.push(new Tower(200)); 
                Buildings.all[Buildings.all.length - 1].health = 1;
            break;

            default: 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                var tower = new Tower(800);
                var z = Game.grassImage.height;
                var z2 = 90;
                tower.arrows.push(new MovingObject(200, Draw.canvas.height - Game.bottomShiftBorder - Tower.imageArrow.height - z, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 60, 0, 0, z2));
                tower.arrows.push(new MovingObject(300, Draw.canvas.height - Game.bottomShiftBorder - Tower.imageArrow.height - z, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 60, 0, 0, z2));
                tower.arrows.push(new MovingObject(400, Draw.canvas.height - Game.bottomShiftBorder - Tower.imageArrow.height - z, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 60, 0, 0, z2));
                tower.arrows.push(new MovingObject(500, Draw.canvas.height - Game.bottomShiftBorder - Tower.imageArrow.height - z, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 60, 0, 0, z2));
                tower.arrows.push(new MovingObject(600, Draw.canvas.height - Game.bottomShiftBorder - Tower.imageArrow.height - z, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 60, 0, 0, z2));
                tower.arrows.push(new MovingObject(700, Draw.canvas.height - Game.bottomShiftBorder - Tower.imageArrow.height - z, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 60, 0, 0, z2));

                
                tower.arrows.push(new MovingObject(200, Draw.canvas.height - Game.bottomShiftBorder - Tower.imageArrow.height - z, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 60, 0, 0, 400));
                tower.arrows.push(new MovingObject(300, Draw.canvas.height - Game.bottomShiftBorder - Tower.imageArrow.height - z, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 60, 0, 0, 400));
                tower.arrows.push(new MovingObject(400, Draw.canvas.height - Game.bottomShiftBorder - Tower.imageArrow.height - z, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 60, 0, 0, 400));
                tower.arrows.push(new MovingObject(500, Draw.canvas.height - Game.bottomShiftBorder - Tower.imageArrow.height - z, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 60, 0, 0, 400));
                tower.arrows.push(new MovingObject(600, Draw.canvas.height - Game.bottomShiftBorder - Tower.imageArrow.height - z, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 60, 0, 0, 400));
                tower.arrows.push(new MovingObject(700, Draw.canvas.height - Game.bottomShiftBorder - Tower.imageArrow.height - z, Tower.imageArrow.width, Tower.imageArrow.height, 1000 * 60, 0, 0, 400));
                Buildings.all.push(tower); 
                Waves.isStarted = false;

        }
    }

    public render() {
        return <div></div>;
    }
}

export default TestPage;