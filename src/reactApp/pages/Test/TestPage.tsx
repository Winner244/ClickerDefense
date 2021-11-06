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
import {Gamer} from "../../../gameApp/gameObjects/Gamer";
import {Zombie} from "../../../gameApp/monsters/Zombie";
import {WaveData} from "../../../models/WaveData";
import {Boar} from "../../../gameApp/monsters/Boar";
import {Monsters} from "../../../gameApp/gameSystems/Monsters";
import {Builder} from "../../../gameApp/gameSystems/Builder";

class TestPage extends React.Component {
    componentDidMount(){
        let variant: any = Helper.getUrlQuery()['variant'];
        switch(+variant){
            case 1: //разрушение башни
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Buildings.all.push(new Tower(200));
                setTimeout(() => Buildings.all[Buildings.all.length - 1].health = 0, 300);

            break;

            case 2: //стрелы
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
                break;

            case 3: //строительство башни
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                setTimeout(() => {
                    Builder.selectedBuildingForBuild = new Tower(0);
                    Builder.mouseLogic(200, 0, true, false)
                }, 300);

                break;

            case 4: //спец способность кабана
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Boar.name]: new WaveData(1, 60, 6)
                    },
                    { //2-я волна
                        [Boar.name]: new WaveData(15, 10, 0)
                    }];
                var boar = new Boar(50, 780, true, 1);
                boar.isWillUseSpecialAbility = true;
                boar.health--;
                Monsters.all.push(boar);

                break;

            default: //кабаны
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Boar.name]: new WaveData(1, 60, 6)
                    },
                    { //2-я волна
                        [Zombie.name]: new WaveData(33, 10, 0),
                        [Boar.name]: new WaveData(15, 10, 0)
                    }];
                Monsters.all.push(new Boar(650, 780, true, 1));
                break;

        }
    }

    public render() {
        return <div></div>;
    }
}

export default TestPage;