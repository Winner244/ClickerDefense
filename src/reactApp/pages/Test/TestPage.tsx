﻿import * as React from 'react';

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
import Menu from '../../components/Menu/Menu';

class TestPage extends React.Component {
    componentDidMount(){
        var waitLoadingImage = function(image: HTMLImageElement, callback: Function){
            setTimeout(() => {
                if(image.complete){
                    callback();
                }
                else{
                    waitLoadingImage(image, callback);
                }
            }, 100);
        }

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

            case 3: //магазин
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Waves.isStarted = false;
                Gamer.coins = 200;
                Menu.displayShopButton();
				Menu.displayNewWaveButton();
                break;

            case 4: //строительство башни - автоматом
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                setTimeout(() => {
                    Builder.selectedBuildingForBuild = new Tower(0);
                    Builder.mouseLogic(200, 0, true, false)
                }, 300);
                break;

            case 5: //спец способность кабана
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

                var boar2 = new Boar(1850, 780, false, 1);
                boar2.isWillUseSpecialAbility = true;
                boar2.health--;
                Monsters.all.push(boar2);
                break;

            case 6: //передача импульса от спец способность кабана к башне (слева)
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

                Buildings.all.push(new Tower(700));

                waitLoadingImage(Boar.images[0], () => {
                    var boar = new Boar(50, 780, true, 1);
                    boar.isWillUseSpecialAbility = true;
                    boar.health--;
                    Monsters.all.push(boar);
                });
                break;

            case 7: //передача импульса от спец способность кабана к башне (справа)
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

                Buildings.all.push(new Tower(1100));

                waitLoadingImage(Boar.images[0], () => {
                    var boar2 = new Boar(1850, 780, false, 1);
                    boar2.isWillUseSpecialAbility = true;
                    boar2.health--;
                    Monsters.all.push(boar2);
                });
                break;

            case 8: // башня получила импульс
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

                Buildings.all.push(new Tower(700));
                Buildings.all[Buildings.all.length - 1].impulse = 10;
                //Buildings.all[Buildings.all.length - 1].impulse = 5;
                //Buildings.all[Buildings.all.length - 1].impulse = 1.5;
                break;

            case 9: //спец способность кабана. тест на расстояние срабатывания
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

                for(var i = 0; i < 10; i++){
                    var boar = new Boar(0, 780, true, 1);
                    boar.isWillUseSpecialAbility = true;
                    boar.health--;
                    Monsters.all.push(boar);
                }
                break;

            case 10: //атака зомби
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Boar.name]: new WaveData(1, 1, 6)
                    },
                    { //2-я волна
                        [Boar.name]: new WaveData(15, 10, 0)
                    }];

                var zombie = new Zombie(800, 780, true, 1);
                Monsters.all.push(zombie);
                break;

            case 11: //атака кабана
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Boar.name]: new WaveData(1, 1, 6)
                    },
                    { //2-я волна
                        [Boar.name]: new WaveData(15, 10, 0)
                    }];

                var boar = new Boar(1000, 780, true, 1);
                boar.isWillUseSpecialAbility = false;
                Monsters.all.push(boar);
                break;

            case 12: //вторая волна
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Waves.waveCurrent = 2;
                Buildings.all.push(new Tower(700));
                Buildings.all.push(new Tower(1200));
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