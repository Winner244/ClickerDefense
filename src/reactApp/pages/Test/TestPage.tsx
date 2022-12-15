import * as React from 'react';

import { App } from '../../App';
import * as MenuStore from '../../components/Menu/MenuStore';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Buildings} from '../../../gameApp/gameSystems/Buildings';
import {Tower} from '../../../gameApp/buildings/Tower';
import {Waves} from '../../../gameApp/gameSystems/Waves';

import {Helper} from '../../helpers/Helper';
import {Draw} from '../../../gameApp/gameSystems/Draw';
import {Gamer} from "../../../gameApp/gameObjects/Gamer";
import {Zombie} from "../../../gameApp/monsters/Zombie";
import {WaveData} from "../../../models/WaveData";
import {Boar} from "../../../gameApp/monsters/Boar";
import {Monsters} from "../../../gameApp/gameSystems/Monsters";
import {Builder} from "../../../gameApp/gameSystems/Builder";
import {Menu} from '../../components/Menu/Menu';
import {Barricade} from '../../../gameApp/buildings/Barricade';
import {Bat} from '../../../gameApp/monsters/Bat';
import {Monster} from '../../../gameApp/gameObjects/Monster';
import {Building} from '../../../gameApp/gameObjects/Building';

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

        let variant: any = Helper.getUrlQuery()['variant'] || Helper.getUrlQuery()['v'];

        //pre load sounds/images
        Buildings.loadResources();
        Building.loadRepairResources();
        Building.loadUpgradeResources();
        Monster.loadHitSounds();
        Tower.loadRepairResources();
        Tower.loadResourcesAfterBuild();
        Tower.loadUpgradeResources();
        var tower1 = new Tower(200);
        tower1.loadedResourcesAfterBuild();
        var tower2 = new Tower(1200);
        tower2.loadedResourcesAfterBuild();
        var barricade1 = new Barricade(200);
        tower1.loadedResourcesAfterBuild();
        var barricade2 = new Barricade(1400);
        tower2.loadedResourcesAfterBuild();

        switch(+variant){
            case 1: //разрушение
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Buildings.all.push(tower1);
                barricade1.x = 500;
                Buildings.all.push(barricade1);
                setTimeout(() => Buildings.all[Buildings.all.length - 1].health = 0, 500);
                setTimeout(() => Buildings.all[Buildings.all.length - 1].health = 0, 700);
            break;

            case 2: //пауза после волны с постройками (тест ремонта)
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Waves.isStarted = false;
                Gamer.coins = 15;
                Menu.displayShopButton();
				Menu.displayNewWaveButton();
                Buildings.all.push(barricade1);
                tower1.x = 500;
                Buildings.all.push(tower1);
                Buildings.all.push(barricade2);
                Buildings.all.push(tower2);

                Buildings.all[Buildings.all.length - 1].health-=40;
                Buildings.all[Buildings.all.length - 2].health-=100;

                break;

            case 3: //магазин
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Waves.isStarted = false;
                Gamer.coins = 500;
                Menu.displayShopButton();
				Menu.displayNewWaveButton();
                break;

            case 4: //строительство башни - автоматом
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                setTimeout(() => {
                    Builder.addBuilding(tower1, Draw.canvas.height - tower1.height + Game.bottomShiftBorder);
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

                tower1.x = 700;
                Buildings.all.push(tower1);

                Boar.init();
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

                tower1.x = 1100;
                Buildings.all.push(tower1);

                Boar.init();
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

                tower1.x = 700;
                Buildings.all.push(tower1);
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
                Gamer.coins - 200;
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
                Waves.waveCurrent = 1;
                tower1.x = 700;
                Buildings.all.push(tower1);
                tower2.x = 1200;
                Buildings.all.push(tower2);
                break;

            case 13: //баррикада
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Buildings.all.push(barricade1);
                tower1.x = 500;
                Buildings.all.push(tower1);
            break;

            case 14: //баррикады (с двух сторон) и проверка на кабанов
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Buildings.all.push(barricade1);
                barricade2.x = 1600;
                Buildings.all.push(barricade2);

                var boar = new Boar(50, 780, true, 1);
                boar.isWillUseSpecialAbility = false;
                Monsters.all.push(boar);

                var boar = new Boar(1800, 780, false, 1);
                boar.isWillUseSpecialAbility = false;
                Monsters.all.push(boar);

                Waves.isStarted = false;
            break;

            case 15: //баррикады (с двух сторон) и проверка наспец способность кабанов
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                barricade1.x = 600;
                Buildings.all.push(barricade1);
                Buildings.all.push(barricade2);

                var boar = new Boar(0, 780, true, 1);
                boar.isWillUseSpecialAbility = true;
                Monsters.all.push(boar);

                var boar = new Boar(1900, 780, false, 1);
                boar.isWillUseSpecialAbility = true;
                Monsters.all.push(boar);

                Waves.isStarted = false;
            break;

            case 16: //Image Handler, loading images, waiting images
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                barricade1.x = 600;
                Buildings.all.push(barricade1);
                Buildings.all.push(tower2);
                setTimeout(() => Buildings.all.forEach(x => x.health--), 300);

                var boar = new Boar(0, 780, true, 1);
                boar.isWillUseSpecialAbility = true;
                boar.name = 'boar1';
                Monsters.all.push(boar);

                var z = new Zombie(1780, 780, false, 1);
                Monsters.all.push(z);
                setTimeout(() => Monsters.all.forEach(x => x.health--), 300);

                Waves.isStarted = false;
            break;

            case 17: //волна 3 с летучей мышкой 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Waves.waveCurrent = 2;

                barricade1.x = 600;
                Buildings.all.push(barricade1);
                tower1.x = 700;
                Buildings.all.push(tower1);

                barricade2.x = 1300;
                Buildings.all.push(barricade2);
                Buildings.all.push(tower2);
                break;

            case 18: //летучая мышка
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Waves.all = [ //монстры на волнах
                { 
                    [Bat.name]: new WaveData(30, 60, 2)
                }];

                barricade1.x = 600;
                Buildings.all.push(barricade1);
                tower1.x = 700;
                Buildings.all.push(tower1);

                barricade2.x = 1300;
                Buildings.all.push(barricade2);
                Buildings.all.push(tower2);

                var bat = new Bat(0, 100, true, 0.5);
                Monsters.all.push(bat);
                break;

            case 19: //кнопки для управления зданиями
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Gamer.coins = 500;
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Waves.isStarted = true;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        [Zombie.name]: new WaveData(1, 30, 0),
                    }];

                barricade1.x = 600;
                Buildings.all.push(barricade1);
                tower1.x = 700;
                Buildings.all.push(tower1);
                setTimeout(() => Buildings.all.forEach(x => x.health-= 10), 300);

                barricade2.x = 1300;
                Buildings.all.push(barricade2);
                Buildings.all.push(tower2);
                break;

            case 20: //ремонт и апгрейд
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Gamer.coins = 1500;
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;
                Waves.isStarted = false;

                barricade1.x = 600;
                Buildings.all.push(barricade1);
                tower1.x = 700;
                Buildings.all.push(tower1);
                Buildings.all.forEach(x => x.health-= 40);

                barricade2.x = 1300;
                Buildings.all.push(barricade2);
                Buildings.all.push(tower2);
                Menu.displayShopButton();
				Menu.displayNewWaveButton();
                break;

            case 21: //Tower bowmans count
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;

                tower1.x = 500;
                tower1.bowmans = 3;
                barricade1.x = 400;
                Buildings.all.push(barricade1);
                Buildings.all.push(tower1);

                tower2.x = 1500;
                tower2.bowmans = 2;
                barricade2.x = 1600;
                Buildings.all.push(barricade2);
                Buildings.all.push(tower2);
                break;

            case 22: //Tower arrows speed sound
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 0;
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;

                tower1.x = 500;
                tower1.arrowSpeed = 2000;
                barricade1.x = 400;
                Buildings.all.push(barricade1);
                Buildings.all.push(tower1);

                tower2.x = 1500;
                tower2.arrowSpeed = 2000;
                Buildings.all.push(tower2);
                barricade2.x = 1500;
                Buildings.all.push(barricade2);
                break;

            case 23: //test sound of sword
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                 Waves.waveCurrent = 0;
                 Waves.all =[{ 
                    [Zombie.name]: new WaveData(301, 70, 0),
                    [Boar.name]: new WaveData(351, 25, 1)
                }]
                Waves.delayEndTimeLeft = Waves.delayStartTimeLeft = 0;

                barricade1.x = 700;
                Buildings.all.push(barricade1);
                Buildings.all.push(barricade2);
                Buildings.all.forEach(x => x.healthMax = x.health = 2000);
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