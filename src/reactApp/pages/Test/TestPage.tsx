import * as React from 'react';

import { App } from '../../App';
import * as MenuStore from '../../components/Menu/MenuStore';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Buildings} from '../../../gameApp/buildings/Buildings';
import {Tower} from '../../../gameApp/buildings/Tower';
import {Waves} from '../../../gameApp/gameSystems/Waves';
import {WawesState} from '../../../gameApp/gameSystems/WawesState';
import {WaveData} from "../../../models/WaveData";
import {Helper} from '../../helpers/Helper';
import {Helper as GameHelper}  from '../../../gameApp/helpers/Helper';
import {Draw} from '../../../gameApp/gameSystems/Draw';
import {Gamer} from "../../../gameApp/gamer/Gamer";
import {Zombie} from "../../../gameApp/monsters/Zombie";
import {Boar} from "../../../gameApp/monsters/Boar";
import {Monsters} from "../../../gameApp/monsters/Monsters";
import {Builder} from "../../../gameApp/buildings/Builder";
import {Menu} from '../../components/Menu/Menu';
import {Barricade} from '../../../gameApp/buildings/Barricade';
import {Bat} from '../../../gameApp/monsters/Bat';
import {Monster} from '../../../gameApp/monsters/Monster';
import {Building} from '../../../gameApp/buildings/Building';
import { ImageHandler } from '../../../gameApp/ImageHandler';
import { AudioSystem } from '../../../gameApp/gameSystems/AudioSystem';
import { FireModifier } from '../../../gameApp/modifiers/FireModifier';
import { FlyEarth } from '../../../gameApp/buildings/FlyEarth';
import { Necromancer } from '../../../gameApp/monsters/Necromancer';
import { Skelet } from '../../../gameApp/monsters/Skelet';
import { Units } from '../../../gameApp/units/Units';
import { Unit } from '../../../gameApp/units/Unit';
import { Miner } from '../../../gameApp/units/Miner';
import { Collector } from '../../../gameApp/units/Collector';

import './TestPage.scss';
import { Coins } from '../../../gameApp/coins/Coins';
import { Coin } from '../../../gameApp/coins/Coin';

class TestPage extends React.Component {
    text: string = "";

    listOfTests = [
        {
            key: "Image Handler, loading images, waiting images",
            code: () => { 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower2 = new Tower(1200);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
                setTimeout(() => Buildings.all.forEach(x => x.health--), 300);

                var boar = new Boar(0, 780, true, 1, true);
                boar.name = 'boar1';
                Monsters.all.push(boar);

                var z = new Zombie(1780, 780, false, 1);
                Monsters.all.push(z);
                setTimeout(() => Monsters.all.forEach(x => x.health--), 300);

                WawesState.isWaveStarted = false;
            }
        },
        {
            key: "Разрушение строений", 
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                
                var tower1 = new Tower(200);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var barricade1 = new Barricade(500);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                setTimeout(() => Buildings.all[Buildings.all.length - 1].health = 0, 500);
                setTimeout(() => Buildings.all[Buildings.all.length - 1].health = 0, 700);
            }
        },

        {
            key: "Авто строительство башни",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Gamer.coins = 50;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                setTimeout(() => {
                    var tower1 = new Tower(200);
                    tower1.loadedResourcesAfterBuild();
                    Builder.addBuilding(tower1, Draw.canvas.height - tower1.height + Game.bottomShiftBorder);
                    Builder.mouseLogic(200, 0, true, false, Buildings.all, Game.loadResourcesAfterBuild.bind(Game));
                }, 300);
            }
        },

        {
            key: "Ручной ремонт + disabled ремонт для второго строения + нет кнопок ремонта/апгрейда у земли и каната",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Gamer.coins = 12+13;
                //Gamer.coins = 5555;
                Buildings.all.forEach(x => x.health-= 40);
                Menu.displayShopButton();
                Menu.displayNewWaveButton();

                var barricade1 = new Barricade(200);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var barricade2 = new Barricade(1400);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                var tower2 = new Tower(1200);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);

                Buildings.all[Buildings.all.length - 1].health-=40;
                Buildings.all[Buildings.all.length - 2].health-=100;

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX + 25, y, y + Miner.imageHeight, 2);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);

                    var y = Buildings.flyEarth.centerY - 50;
                    var miner2 = new Miner(Buildings.flyEarth.centerX - 55, y, y + Miner.imageHeight, 1);
                    miner2.loadedResourcesAfterBuild();
                    Units.all.push(miner2);
                }, 300);
            }
        },

        {
            key: "Кнопки управления зданиями появляются только после окончания волны",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Gamer.coins = 500;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = true;
                Waves.all[0] = [new WaveData(Zombie.name, 1, 30, 0)];

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);
                
                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                setTimeout(() => Buildings.all.forEach(x => x.health-= 10), 300);

                var barricade2 = new Barricade(1300);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                var tower2 = new Tower(1200);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
            }
        },

        {
            key: "Магазин (постройка и улучшение)",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Waves.waveCurrent = 0;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;
            }
        },

        {
            key: "Зомби - атака",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Boar.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                var zombie = new Zombie(800, 780, true, 1);
                Monsters.all.push(zombie);
            }
        },

        {
            key: "Кабан - Атака",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Boar.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                var boar = new Boar(1000, 780, true, 1, true);
                Monsters.all.push(boar);
            }
        },

        {
            key: "Кабан - Спец способность + отмена при получении урона",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Boar.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                var boar = new Boar(50, 780, true, 1, true);
                Monsters.all.push(boar);

                var boar2 = new Boar(1750, 780, false, 1, true);
                Monsters.all.push(boar2);

                setTimeout(() => {
                    boar.health--;
                    boar2.health--;
                }, 4500);
            }
        },

        {
            key: "Кабан - Спец способность +преждевременное уничтожение цели - кабан бежит дальше",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Boar.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                var boar = new Boar(50, 780, true, 1, true);
                boar.health--;
                Monsters.all.push(boar);

                var barricade1 = new Barricade(700);
                barricade1.loadedResourcesAfterBuild();
                barricade1.health = 1;
                setTimeout(() => barricade1.health = 0, 3000);
                Buildings.all.push(barricade1);
            // Monsters.all.push(boar2);
            }
        },

        {
            key: "Кабан - передача импульса от спец способности кабана к башне (слева)",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Boar.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                this.waitLoadingImage(Boar.imageHandler, () => {
                    var boar = new Boar(50, 780, true, 1, true);
                    //boar.health--;
                    Monsters.all.push(boar);
                });
            }
        },

        {
            key: "Кабан - передача импульса от спец способности кабана к башне (справа)",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Boar.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                var tower1 = new Tower(1100);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                this.waitLoadingImage(Boar.imageHandler, () => {
                    var boar2 = new Boar(1850, 780, false, 1, true);
                    //boar2.health--;
                    Monsters.all.push(boar2);
                });
            }
        },

        {
            key: "Кабан - расстояние срабатывания Спец способности",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Boar.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                for(var i = 0; i < 10; i++){
                    var boar = new Boar(0, 780, true, 1, true);
                    //boar.health--;
                    Monsters.all.push(boar);
                }

                Buildings.all.forEach(x => x.healthMax = x.health = 400);
            }
        },

        {
            key: "Скелет - бег",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Skelet.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Skelet.name, 15, 10, 0)
                    ]];
            }
        },

        {
            key: "Скелет - появление",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Skelet.name, 1, 60, 10)
                    ],
                    [ //2-я волна
                        new WaveData(Skelet.name, 15, 10, 10)
                    ]];

                
                let newSkelet = new Skelet(500, 0, true, 1);
                newSkelet.isDisplayCreatingFromUndegroundAnimation = true;
                newSkelet.y = Draw.canvas.height - Game.bottomShiftBorder - newSkelet.height;
                newSkelet.health -= 1;
                Monsters.all.push(newSkelet);
            }
        },

        {
            key: "Баррикада - возврат урона - зомби",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                var barricade1 = new Barricade(200);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);
            }
        },

        {
            key: "Баррикада - возврат урона - кабаны",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                var barricade1 = new Barricade(200);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var barricade2 = new Barricade(1600);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                var boar = new Boar(50, 780, true, 1, true);
                Monsters.all.push(boar);

                var boar = new Boar(1800, 780, false, 1, true);
                Monsters.all.push(boar);

                WawesState.isWaveStarted = false;
            }
        },

        {
            key: "Баррикада - возврат урона - спец способность кабанов",
            code: () => { 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var barricade2 = new Barricade(1400);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                var boar = new Boar(0, 780, true, 1, true);
                Monsters.all.push(boar);

                var boar = new Boar(1900, 780, false, 1, true);
                Monsters.all.push(boar);

                WawesState.isWaveStarted = false;
            }
        },

        {
            key: "Баррикада - Железная версия",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                var zombie1 = new Zombie(650, 780, true, 1);
                Monsters.all.push(zombie1);

                var barricade1 = new Barricade(700);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);


                var zombie2 = new Zombie(1200, 780, false, 1);
                Monsters.all.push(zombie2);

                var barricade2 = new Barricade(1100);
                barricade2.loadedResourcesAfterBuild();
                barricade2.impoveToIron();
                Buildings.all.push(barricade2);
            }
        },

        {
            key: "Баррикада - НЕ возвращает урон Некроманту с дальней атакой",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                var barricade1 = new Barricade(200);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var necromancer = new Necromancer(0, 780, true, 1);
                necromancer.countSimpleAttacksToActivateSpecialAbility = 110;
                Monsters.all.push(necromancer);

                WawesState.isWaveStarted = false;
            }
        },

        {
            key: "Башня - несколько лучников",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 3;
                Buildings.all.push(tower1);

                var barricade1 = new Barricade(400);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);
                

                var tower2 = new Tower(1500);
                tower2.loadedResourcesAfterBuild();
                tower2.bowmans = 2;
                Buildings.all.push(tower2);


                var barricade2 = new Barricade(1600);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
            }
        },

        {
            key: "Башня - скоростные стрелы",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 2;
                tower1.arrowSpeed = 2000;
                tower1.radiusAttack = 500;
                Buildings.all.push(tower1);

                var barricade1 = new Barricade(400);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower2 = new Tower(1500);
                tower2.loadedResourcesAfterBuild();
                tower2.arrowSpeed = 2000;
                Buildings.all.push(tower2);
                
                var barricade2 = new Barricade(1500);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
            }
        },

        {
            key: "Башня - огненные стрелы",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 1;
                tower1.radiusAttack = 500;
                tower1.improveToFireArrows();
                tower1.improvements.filter(x => x.label == 'Огненные стрелы').forEach(x => x.isImproved = true);
                Buildings.all.push(tower1);

                var barricade1 = new Barricade(400);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower2 = new Tower(1500);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
                
                var barricade2 = new Barricade(1500);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
            }
        },

        {
            key: "Башня - взрывные стрелы",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 1;
                tower1.radiusAttack = 500;
                tower1.improveToDynamitArrows();
                tower1.improvements.filter(x => x.label == 'Взрывные стрелы').forEach(x => x.isImproved = true);
                Buildings.all.push(tower1);

                var barricade1 = new Barricade(400);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower2 = new Tower(1500);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
                
                var barricade2 = new Barricade(1500);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
            }
        },

        /*{ //need to закоментировать базовую логику у летучей мыши
            key: "Башня - взрывные стрелы - угол наклона",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 0;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                
                Waves.all = [ //монстры на волнах
                [ //1-я волна
                    //new WaveData(Zombie.name, 7, 80, 0),
                    new WaveData(Boar.name, 111, 1, 61)
                ],
                [ //2-я волна
                    new WaveData(Boar.name, 15, 10, 0)
                ]];

                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 1;
                tower1.radiusAttack = 1500;
                tower1.improveToDynamitArrows();
                tower1.improvements.filter(x => x.label == 'Взрывные стрелы').forEach(x => x.isImproved = true);
                Buildings.all.push(tower1); 

                let x = 0;

                this.interval = setInterval(() => {
                    var bat = new Bat(x, 380, true, 1);
                    Monsters.all.push(bat);
                    x+=30;
                }, 1000);

            }
        },*/

        {
            key: "Башня - огненные + взрывные стрелы",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 1;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 1;
                tower1.radiusAttack = 500;
                tower1.improveToFireArrows();
                tower1.improvements.filter(x => x.label == 'Огненные стрелы').forEach(x => x.isImproved = true);
                tower1.improveToDynamitArrows();
                tower1.improvements.filter(x => x.label == 'Взрывные стрелы').forEach(x => x.isImproved = true);
                Buildings.all.push(tower1);

                var barricade1 = new Barricade(400);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower2 = new Tower(1500);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
                
                var barricade2 = new Barricade(1500);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
            }
        },

        {
            key: "Башня - огненные + взрывные стрелы в землю",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 1;
                Waves.all[3] = [ //3-я волна
                    new WaveData(Bat.name, 75, 90, 0)
                ];
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                //WawesState.isWaveStarted = false;


                var tower1 = new Tower(600);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 1;
                tower1.radiusAttack = 500;
                tower1.improveToFireArrows();
                tower1.improvements.filter(x => x.label == 'Огненные стрелы').forEach(x => x.isImproved = true);
                Buildings.all.push(tower1);
                tower1.attack(500 - 400, Draw.canvas.height + 100);

                var barricade1 = new Barricade(400);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower2 = new Tower(1200);
                tower2.loadedResourcesAfterBuild();
                tower2.improveToDynamitArrows();
                tower2.improvements.filter(x => x.label == 'Взрывные стрелы').forEach(x => x.isImproved = true);
                Buildings.all.push(tower2);
                tower2.attack(1200 + 400, Draw.canvas.height + 100);
                
                var barricade2 = new Barricade(1250);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
            }
        },

        {
            key: "Башня - взрывные стрелы - большой радиус",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                var tower1 = new Tower(Draw.canvas.width / 2 - 50);
                tower1.loadedResourcesAfterBuild();
                tower1.radiusAttack = 500;
                tower1.improveToDynamitArrows();
                tower1.dynamitDamage = 2;
                tower1.dynamitRadius = 150;
                tower1.improvements.filter(x => x.label == 'Взрывные стрелы').forEach(x => x.isImproved = true);
                Buildings.all.push(tower1);

                var barricade1 = new Barricade(tower1.x - 100);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);
                
                var barricade2 = new Barricade(tower1.x + 50);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
            }
        },

        {
            key: "Башня - лимит покупки",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                for(var i = 0; i < Tower.shopItem.maxCount - 1; i++){
                    var tower1 = new Tower(i * 80);
                    tower1.loadedResourcesAfterBuild();
                    Buildings.all.push(tower1);
                }
            }
        },

        {
            key: "Огонь - затухание",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 0;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                FireModifier.loadResources();
                
                var zombie = new Zombie(0, 780, true, 1);
                zombie.modifiers.push(new FireModifier(0.5));
                Monsters.all.push(zombie);

                var boar = new Boar(Draw.canvas.width - 100, 780, false, 1, true);
                boar.modifiers.push(new FireModifier(0.5));
                Monsters.all.push(boar);

                var bat = new Bat(0, 280, true, 1);
                bat.modifiers.push(new FireModifier(0.5));
                Monsters.all.push(bat);

                var necromancer = new Necromancer(400, 780, true, 1);
                Monsters.all.push(necromancer);

                var necromancer3 = new Necromancer(1400, 780, false, 1);
                Monsters.all.push(necromancer3);

                setTimeout(() => {
                    necromancer.modifiers.push(new FireModifier(0.5));
                    necromancer3.modifiers.push(new FireModifier(0.5));
                }, 1000);

                var necromancer2 = new Necromancer(200, 780, true, 0.7);
                Monsters.all.push(necromancer2);

                setTimeout(() => {
                    necromancer2.modifiers.push(new FireModifier(0.5));
                }, 5000);
            }
        },

        {
            key: "Огонь - передача",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                FireModifier.loadResources();
                
                var zombie = new Zombie(0, 780, true, 1);
                zombie.modifiers.push(new FireModifier(0.5, 15000));
                Monsters.all.push(zombie);

                var boar = new Boar(Draw.canvas.width - 100, 780, false, 1, true);
                boar.modifiers.push(new FireModifier(0.5, 15000));
                Monsters.all.push(boar);

                var bat = new Bat(500, 480, true, 1);
                bat.modifiers.push(new FireModifier(0.5, 15000));
                Monsters.all.push(bat);

                for(var y = 600; y > 200; y -= 30){
                    var bat = new Bat(700, y, true, 1);
                    Monsters.all.push(bat);
                }

                setTimeout(() => {

                    var bat = new Bat(Draw.canvas.width / 2 - FlyEarth.image.width, Buildings.flyEarth.centerY, true, 1);
                    bat.modifiers.push(new FireModifier(0.5, 15000));
                    Monsters.all.push(bat);


                    var bat2 = new Bat(Draw.canvas.width / 2 + FlyEarth.image.width, Buildings.flyEarth.centerY, false, 1);
                    bat2.modifiers.push(new FireModifier(0.5, 15000));
                    Monsters.all.push(bat2);
                }, 15000);

                var barricade1 = new Barricade(300);
                barricade1.loadedResourcesAfterBuild();
                barricade1.damageMirrorPercentage = 0;
                Buildings.all.push(barricade1);
                
                var barricade2 = new Barricade(Draw.canvas.width - 300);
                barricade2.loadedResourcesAfterBuild();
                barricade2.damageMirrorPercentage = 0;
                Buildings.all.push(barricade2);
            }
        },

        {
            key: "Летучая мышь - полёт",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                [ 
                    new WaveData(Bat.name, 30, 60, 0)
                ]];

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var barricade2 = new Barricade(1300);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                var tower2 = new Tower(1200);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
            }
        },

        {
            key: "Летучая мышь - атака",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Boar.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                var bat = new Bat(650, 380, true, 1);
                Monsters.all.push(bat);
            }
        },

        {
            key: "Некромант - ходьба",
            code: () => { 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                [ 
                    new WaveData(Necromancer.name, 30, 15, 0)
                ]];
            }
        },

        {
            key: "Некромант - расстояние срабатывания атаки",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Necromancer.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                for(var i = 0; i < 10; i++){
                    var monster = new Necromancer(0, 780, true, 1);
                    //monster.health--;
                    Monsters.all.push(monster);
                }

                for(var i = 0; i < 10; i++){
                    var monster = new Necromancer(1780, 780, false, 1);
                    //monster.health--;
                    Monsters.all.push(monster);
                }
                Buildings.all.forEach(x => x.healthMax = x.health = 400);
            }
        },

        {
            key: "Некромант - обычная атака",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Necromancer.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];

                var necromancer = new Necromancer(600, 780, true, 1);
                Monsters.all.push(necromancer);
            }
        },

        {
            key: "Некромант - обычная атака, смена цели",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Necromancer.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];
                
                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                tower1.health = 1;
                Buildings.all.push(tower1);

                var necromancer = new Necromancer(100, 780, true, 1);
                Monsters.all.push(necromancer);
            }
        },

        {
            key: "Некромант - спецспособность - вызов кислотного дождя",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Necromancer.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var barricade2 = new Barricade(1300);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                var necromancer = new Necromancer(200, 780, true, 1);
                necromancer.countSimpleAttacksToActivateSpecialAbility = 0;
                necromancer.isForceSpecialAbilityAcidRain = true;
                necromancer.health = necromancer.healthMax = 10;
                Monsters.all.push(necromancer);


                var necromancer = new Necromancer(1800, 780, false, 1);
                necromancer.countSimpleAttacksToActivateSpecialAbility = 0;
                necromancer.isForceSpecialAbilityAcidRain = true;
                Monsters.all.push(necromancer);

                setTimeout(() => {
                    var necromancer = new Necromancer(0, 780, true, 0.7);
                    necromancer.countSimpleAttacksToActivateSpecialAbility = 0;
                    necromancer.isForceSpecialAbilityAcidRain = true;
                    necromancer.health = necromancer.healthMax = 10;
                    Monsters.all.push(necromancer);
                }, 3000);
            }
        },

        {
            key: "Некромант - спецспособность - вызов кислотного дождя - сбиваем огнём",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Necromancer.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var necromancer = new Necromancer(200, 780, true, 1);
                necromancer.countSimpleAttacksToActivateSpecialAbility = 0;
                necromancer.isForceSpecialAbilityAcidRain = true;
                necromancer.health = necromancer.healthMax = 10;
                Monsters.all.push(necromancer);


                FireModifier.loadResources();
                setTimeout(() => {
                    necromancer.modifiers.push(new FireModifier(0.5));
                }, 2000);
            }
        },

        {
            key: "Некромант - спецспособность - вызов кислотного дождя - смена цели",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Necromancer.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];

                var barricade1 = new Barricade(600);
                barricade1.health = 1;
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);
                setTimeout(() => barricade1.health-=20, 3000);

                var tower1 = new Tower(650);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var necromancer = new Necromancer(200, 780, true, 1);
                necromancer.countSimpleAttacksToActivateSpecialAbility = 0;
                necromancer.isForceSpecialAbilityAcidRain = true;
                necromancer.health = necromancer.healthMax = 10;
                Monsters.all.push(necromancer);
            }
        },

        {
            key: "Некромант - спецспособность - вызов скелетов",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Necromancer.name, 1, 60, 16)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];

                var necromancer = new Necromancer(500, 780, true, 1);
                necromancer.countSimpleAttacksToActivateSpecialAbility = 0;
                necromancer.isForceSpecialAbilitySkeletons = true;
                Monsters.all.push(necromancer);


                var necromancer = new Necromancer(1800, 780, false, 1);
                necromancer.countSimpleAttacksToActivateSpecialAbility = 0;
                necromancer.isForceSpecialAbilitySkeletons = true;
                Monsters.all.push(necromancer);
            }
        },

        {
            key: "Некромант - спецспособность - рандом",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Necromancer.name, 1, 60, 16)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];

                var necromancer = new Necromancer(200, 780, true, 1);
                necromancer.countSimpleAttacksToActivateSpecialAbility = 0;
                necromancer.health = necromancer.healthMax = 10;
                Monsters.all.push(necromancer);

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);
            }
        },

        {
            key: "Некромант - щит",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Necromancer.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];
                
                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                setTimeout(() => {
                    tower1.health = 0;
                }, 15000);

                var necromancer = new Necromancer(350, 780, true, 1);
                Monsters.all.push(necromancer);
            }
        },

        {
            key: "Некромант - щит - сбиваем огнём",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Necromancer.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];
                
                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                setTimeout(() => {
                    tower1.health = 0;
                }, 1000);

                var necromancer = new Necromancer(350, 780, true, 1);
                Monsters.all.push(necromancer);

                FireModifier.loadResources();
                setTimeout(() => {
                    necromancer.modifiers.push(new FireModifier(0.5));
                }, 2500);
            }
        },

        {
            key: "Волна 2",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.waveCurrent = 1;
                
                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var tower2 = new Tower(1200);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var barricade2 = new Barricade(1300);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
            }
        },

        {
            key: "Волна 3",
            code: () => { 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.waveCurrent = 2;

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);
                
                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var barricade2 = new Barricade(1300);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                var tower2 = new Tower(1200);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
            }
        },


        {
            key: "Волна 4",
            code: () => { 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.waveCurrent = 3;

                var barricade1 = new Barricade(600);
                //barricade1.health = 1000;
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);
                
                var tower1 = new Tower(700);
                tower1.damage = 3;
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var barricade2 = new Barricade(1300);
                //barricade2.health = 1000;
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                var tower2 = new Tower(1200);
                tower2.damage = 3;
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
            }
        },



        {
            key: "Волна 4 - упрощённая - для тестирования всех вместе",
            code: () => { 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.waveCurrent = 4;
                Waves.all.push([ //4-ая волна
                    new WaveData(Zombie.name, 30, 75, 0),
                    new WaveData(Boar.name, 18, 28, 1),
                    new WaveData(Bat.name, 90, 93, 2),
                    new WaveData(Necromancer.name, 15, 10, 0),
                ]);

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);
                
                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var barricade2 = new Barricade(1300);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                var tower2 = new Tower(1200);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
            }
        },

        {
            key: "Game Over - bottom",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                    Waves.waveCurrent = 0;
                    Waves.all =[[ 
                    new WaveData(Zombie.name, 301, 70, 0),
                    new WaveData(Boar.name, 351, 25, 1)
                ]]
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                
                setTimeout(() => Buildings.flyEarthRope.health-=20, 300);
                setTimeout(() => Buildings.flyEarthRope.health-=20, 500);
                setTimeout(() => Buildings.flyEarthRope.health-=20, 700);
                setTimeout(() => Buildings.flyEarthRope.health-=10, 900);
                setTimeout(() => Buildings.flyEarthRope.health-=10, 1200);
                setTimeout(() => Buildings.flyEarthRope.health-=10, 1400);
                setTimeout(() => Buildings.flyEarthRope.health-=10, 1500);
                setTimeout(() => Buildings.flyEarthRope.health-=100, 1800);
            }
        },

        {
            key: "Game Over - bottom + miners",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                    Waves.waveCurrent = 0;
                    Waves.all =[[ 
                    new WaveData(Zombie.name, 301, 70, 0),
                    new WaveData(Boar.name, 351, 25, 1)
                ]]
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;




                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 90;
                    var miner1 = new Miner(Buildings.flyEarth.centerX - 20, y, y + Miner.imageHeight);
                    miner1.loadedResourcesAfterBuild();
                    Units.all.push(miner1);


                    var y = Buildings.flyEarth.centerY - 70;
                    var miner2 = new Miner(Buildings.flyEarth.centerX - 100, y, y + Miner.imageHeight);
                    miner2.loadedResourcesAfterBuild();
                    Units.all.push(miner2);


                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 180, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);


                    var y = Buildings.flyEarth.centerY - 85;
                    var miner4 = new Miner(Buildings.flyEarth.centerX + 75, y, y + Miner.imageHeight);
                    miner4.loadedResourcesAfterBuild();
                    Units.all.push(miner4);

                    
                    var y = Buildings.flyEarth.centerY - 90 + 25;
                    var miner5 = new Miner(Buildings.flyEarth.centerX - 20 + 10, y, y + Miner.imageHeight);
                    miner5.loadedResourcesAfterBuild();
                    Units.all.push(miner5);


                    var y = Buildings.flyEarth.centerY - 70 + 25;
                    var miner6 = new Miner(Buildings.flyEarth.centerX - 100 + 10, y, y + Miner.imageHeight);
                    miner6.loadedResourcesAfterBuild();
                    Units.all.push(miner6);


                    var y = Buildings.flyEarth.centerY - 80 + 25;
                    var miner7 = new Miner(Buildings.flyEarth.centerX - 180 + 10, y, y + Miner.imageHeight);
                    miner7.loadedResourcesAfterBuild();
                    Units.all.push(miner7);


                    var y = Buildings.flyEarth.centerY - 85 + 25;
                    var miner8 = new Miner(Buildings.flyEarth.centerX + 75 + 10, y, y + Miner.imageHeight);
                    miner8.loadedResourcesAfterBuild();
                    Units.all.push(miner8);
                }, 300);
                
                setTimeout(() => Buildings.flyEarthRope.health-=20, 300);
                setTimeout(() => Buildings.flyEarthRope.health-=20, 500);
                setTimeout(() => Buildings.flyEarthRope.health-=20, 700);
                setTimeout(() => Buildings.flyEarthRope.health-=10, 900);
                setTimeout(() => Buildings.flyEarthRope.health-=10, 1200);
                setTimeout(() => Buildings.flyEarthRope.health-=10, 1400);
                setTimeout(() => Buildings.flyEarthRope.health-=10, 1500);
                setTimeout(() => Buildings.flyEarthRope.health-=100, 1800);
            }
        },

        {
            key: "Game Over - top",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                    Waves.waveCurrent = 0;
                    Waves.all =[[ 
                    new WaveData(Zombie.name, 301, 70, 0),
                    new WaveData(Boar.name, 351, 25, 1)
                ]]
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;

                setTimeout(() => Buildings.flyEarth.health-=20, 300);
                setTimeout(() => Buildings.flyEarth.health-=20, 500);
                setTimeout(() => Buildings.flyEarth.health-=20, 700);
                setTimeout(() => Buildings.flyEarth.health-=10, 900);
                setTimeout(() => Buildings.flyEarth.health-=10, 1200);
                setTimeout(() => Buildings.flyEarth.health-=10, 1400);
                setTimeout(() => Buildings.flyEarth.health-=10, 1500);
                setTimeout(() => Buildings.flyEarth.health-=100, 1800);
            }
        },

        {
            key: "Game Over - top + miners",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                    Waves.waveCurrent = 0;
                    Waves.all =[[ 
                    new WaveData(Zombie.name, 301, 70, 0),
                    new WaveData(Boar.name, 351, 25, 1)
                ]]
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 90;
                    var miner1 = new Miner(Buildings.flyEarth.centerX - 20, y, y + Miner.imageHeight);
                    miner1.loadedResourcesAfterBuild();
                    Units.all.push(miner1);


                    var y = Buildings.flyEarth.centerY - 70;
                    var miner2 = new Miner(Buildings.flyEarth.centerX - 100, y, y + Miner.imageHeight);
                    miner2.loadedResourcesAfterBuild();
                    Units.all.push(miner2);


                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 180, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);


                    var y = Buildings.flyEarth.centerY - 85;
                    var miner4 = new Miner(Buildings.flyEarth.centerX + 75, y, y + Miner.imageHeight);
                    miner4.loadedResourcesAfterBuild();
                    Units.all.push(miner4);

                    
                    var y = Buildings.flyEarth.centerY - 90 + 25;
                    var miner5 = new Miner(Buildings.flyEarth.centerX - 20 + 10, y, y + Miner.imageHeight);
                    miner5.loadedResourcesAfterBuild();
                    Units.all.push(miner5);


                    var y = Buildings.flyEarth.centerY - 70 + 25;
                    var miner6 = new Miner(Buildings.flyEarth.centerX - 100 + 10, y, y + Miner.imageHeight);
                    miner6.loadedResourcesAfterBuild();
                    Units.all.push(miner6);


                    var y = Buildings.flyEarth.centerY - 80 + 25;
                    var miner7 = new Miner(Buildings.flyEarth.centerX - 180 + 10, y, y + Miner.imageHeight);
                    miner7.loadedResourcesAfterBuild();
                    Units.all.push(miner7);


                    var y = Buildings.flyEarth.centerY - 85 + 25;
                    var miner8 = new Miner(Buildings.flyEarth.centerX + 75 + 10, y, y + Miner.imageHeight);
                    miner8.loadedResourcesAfterBuild();
                    Units.all.push(miner8);
                }, 300);

                setTimeout(() => Buildings.flyEarth.health-=20, 300);
                setTimeout(() => Buildings.flyEarth.health-=20, 500);
                setTimeout(() => Buildings.flyEarth.health-=20, 700);
                setTimeout(() => Buildings.flyEarth.health-=10, 900);
                setTimeout(() => Buildings.flyEarth.health-=10, 1200);
                setTimeout(() => Buildings.flyEarth.health-=10, 1400);
                setTimeout(() => Buildings.flyEarth.health-=10, 1500);
                setTimeout(() => Buildings.flyEarth.health-=100, 1800);
            }
        },

        /*{
            key: "Золотодобытчик - Авто появление",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                setTimeout(() => {
                    Game.buyThing(Miner.shopItem);
                }, 300);
            }
        },*/

        {
            key: "Золотодобытчики - Авто появление множественное + проверка на лимит покупки",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                var countMax = Miner.shopItem.maxCount - 1;
                var count = 0;
                var create = () => {
                    setTimeout(() => {
                        Game.buyThing(Miner.shopItem);
                        count++;

                        if(count < countMax){
                            create();
                        }
                    }, 300);
                }
                create();
            }
        },


        {
            key: "Золотодобытчики - нападение летучих мышей на множество добытчиков",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;
                Waves.all = [[],
                [ 
                    new WaveData(Bat.name, 87, 250, 0),
                ]];

                var tower1 = new Tower(1100);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var tower2 = new Tower(700);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);

                var countMax = Miner.shopItem.maxCount - 1;
                var count = 0;
                var create = () => {
                    setTimeout(() => {
                        Game.buyThing(Miner.shopItem);
                        var s = (x: any) => x.improveToWoodArmor();
                        s(Units.all[Units.all.length - 1]);
                        count++;

                        if(count < countMax){
                            create();
                        }
                    }, 300);
                }
                create();
            }
        },

        {
            key: "Золотодобытчик - Авто появление - на кристалле",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    const miner1 = new Miner(Buildings.flyEarth.centerX - 22, Buildings.flyEarth.y, Buildings.flyEarth.y + 143); 
                    miner1.loadedResourcesAfterBuild();
                    miner1.pushUpFromCrystals(true);
                    Units.all.push(miner1);

                    const miner11 = new Miner(Buildings.flyEarth.centerX - 22, Buildings.flyEarth.y, Buildings.flyEarth.y + 144); 
                    miner11.loadedResourcesAfterBuild();
                    miner11.pushUpFromCrystals(true);
                    Units.all.push(miner11);

                    const miner2 = new Miner(Buildings.flyEarth.centerX - 105, Buildings.flyEarth.y, Buildings.flyEarth.y + 160); 
                    miner2.loadedResourcesAfterBuild();
                    miner2.pushUpFromCrystals(true);
                    Units.all.push(miner2);

                    const miner22 = new Miner(Buildings.flyEarth.centerX - 105, Buildings.flyEarth.y, Buildings.flyEarth.y + 161); 
                    miner22.loadedResourcesAfterBuild();
                    miner22.pushUpFromCrystals(true);
                    Units.all.push(miner22);
                }, 300);
            }
        },

        {
            key: "Золотодобытчики - порядок отрисовки 1",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 90;
                    var miner1 = new Miner(Buildings.flyEarth.centerX - 20, y, y + Miner.imageHeight);
                    miner1.loadedResourcesAfterBuild();
                    Units.all.push(miner1);


                    var y = Buildings.flyEarth.centerY - 70;
                    var miner2 = new Miner(Buildings.flyEarth.centerX - 35, y, y + Miner.imageHeight);
                    miner2.loadedResourcesAfterBuild();
                    Units.all.push(miner2);


                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 5, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);
                }, 300);
            }
        },

        {
            key: "Золотодобытчики - порядок отрисовки 2",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 70;
                    var miner2 = new Miner(Buildings.flyEarth.centerX - 35, y, y + Miner.imageHeight);
                    miner2.loadedResourcesAfterBuild();
                    Units.all.push(miner2);


                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 5, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);

                    var y = Buildings.flyEarth.centerY - 90;
                    var miner1 = new Miner(Buildings.flyEarth.centerX - 20, y, y + Miner.imageHeight);
                    miner1.loadedResourcesAfterBuild();
                    Units.all.push(miner1);


                }, 300);
            }
        },

        {
            key: "Золотодобытчики - порядок отрисовки 3",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 5, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);
                    
                    var y = Buildings.flyEarth.centerY - 90;
                    var miner1 = new Miner(Buildings.flyEarth.centerX - 20, y, y + Miner.imageHeight);
                    miner1.loadedResourcesAfterBuild();
                    Units.all.push(miner1);

                    var y = Buildings.flyEarth.centerY - 70;
                    var miner2 = new Miner(Buildings.flyEarth.centerX - 35, y, y + Miner.imageHeight);
                    miner2.loadedResourcesAfterBuild();
                    Units.all.push(miner2);


                }, 300);
            }
        },

        /*{
            key: "Золотодобытчики - за кристаллами",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 90;
                    var miner1 = new Miner(Buildings.flyEarth.centerX - 20, y, y + Miner.imageHeight);
                    miner1.loadedResourcesAfterBuild();
                    Units.all.push(miner1);


                    var y = Buildings.flyEarth.centerY - 70;
                    var miner2 = new Miner(Buildings.flyEarth.centerX - 100, y, y + Miner.imageHeight);
                    miner2.loadedResourcesAfterBuild();
                    Units.all.push(miner2);


                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 180, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);


                    var y = Buildings.flyEarth.centerY - 85;
                    var miner4 = new Miner(Buildings.flyEarth.centerX + 75, y, y + Miner.imageHeight);
                    miner4.loadedResourcesAfterBuild();
                    Units.all.push(miner4);
                }, 300);
            }
        },

        {
            key: "Золотодобытчики - перед кристаллами",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 90 + 25;
                    var miner1 = new Miner(Buildings.flyEarth.centerX - 20, y, y + Miner.imageHeight);
                    miner1.loadedResourcesAfterBuild();
                    Units.all.push(miner1);


                    var y = Buildings.flyEarth.centerY - 70 + 25;
                    var miner2 = new Miner(Buildings.flyEarth.centerX - 100, y, y + Miner.imageHeight);
                    miner2.loadedResourcesAfterBuild();
                    Units.all.push(miner2);


                    var y = Buildings.flyEarth.centerY - 80 + 25;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 180, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);


                    var y = Buildings.flyEarth.centerY - 85 + 25;
                    var miner4 = new Miner(Buildings.flyEarth.centerX + 75, y, y + Miner.imageHeight);
                    miner4.loadedResourcesAfterBuild();
                    Units.all.push(miner4);
                }, 300);
            }
        },*/

        {
            key: "Золотодобытчики - перед и за кристаллами",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 90;
                    var miner1 = new Miner(Buildings.flyEarth.centerX - 20, y, y + Miner.imageHeight);
                    miner1.loadedResourcesAfterBuild();
                    Units.all.push(miner1);


                    var y = Buildings.flyEarth.centerY - 70;
                    var miner2 = new Miner(Buildings.flyEarth.centerX - 100, y, y + Miner.imageHeight);
                    miner2.loadedResourcesAfterBuild();
                    Units.all.push(miner2);


                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 180, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);


                    var y = Buildings.flyEarth.centerY - 85;
                    var miner4 = new Miner(Buildings.flyEarth.centerX + 75, y, y + Miner.imageHeight);
                    miner4.loadedResourcesAfterBuild();
                    Units.all.push(miner4);

                    
                    var y = Buildings.flyEarth.centerY - 90 + 25;
                    var miner5 = new Miner(Buildings.flyEarth.centerX - 20 + 10, y, y + Miner.imageHeight);
                    miner5.loadedResourcesAfterBuild();
                    Units.all.push(miner5);


                    var y = Buildings.flyEarth.centerY - 70 + 25;
                    var miner6 = new Miner(Buildings.flyEarth.centerX - 100 + 10, y, y + Miner.imageHeight);
                    miner6.loadedResourcesAfterBuild();
                    Units.all.push(miner6);


                    var y = Buildings.flyEarth.centerY - 80 + 25;
                    var miner7 = new Miner(Buildings.flyEarth.centerX - 180 + 10, y, y + Miner.imageHeight);
                    miner7.loadedResourcesAfterBuild();
                    Units.all.push(miner7);


                    var y = Buildings.flyEarth.centerY - 85 + 25;
                    var miner8 = new Miner(Buildings.flyEarth.centerX + 75 + 10, y, y + Miner.imageHeight);
                    miner8.loadedResourcesAfterBuild();
                    Units.all.push(miner8);
                }, 300);
            }
        },

        /*{
            key: "Золотодобытчики - движение за мышкой",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 90 + 25;
                    var miner1 = new Miner(Buildings.flyEarth.centerX - 15, y, y + Miner.imageHeight);
                    miner1.loadedResourcesAfterBuild();
                    Units.all.push(miner1);


                    var y = Buildings.flyEarth.centerY - 70 + 25;
                    var miner2 = new Miner(Buildings.flyEarth.centerX - 100, y, y + Miner.imageHeight);
                    miner2.loadedResourcesAfterBuild();
                    Units.all.push(miner2);


                    var y = Buildings.flyEarth.centerY - 80 + 25;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 174, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);


                    var y = Buildings.flyEarth.centerY - 85 + 25;
                    var miner4 = new Miner(Buildings.flyEarth.centerX + 75, y, y + Miner.imageHeight);
                    miner4.loadedResourcesAfterBuild();
                    Units.all.push(miner4);

                    this.interval = setInterval(() => {
                        let mouseX = Mouse.x / (Draw.canvas.clientWidth / Draw.canvas.width);
                        let mouseY = Mouse.y / (Draw.canvas.clientHeight / Draw.canvas.height);
                        
                        miner1.y =  miner2.y = miner3.y = miner4.y = mouseY - Miner.imageHeight; 
                        miner1.goalY = miner2.goalY = miner3.goalY = miner4.goalY = mouseY; 
                        
                        miner1.x = mouseX - 15; 
                        miner2.x = mouseX - 100
                        miner3.x = mouseX - 174
                        miner4.x = mouseX + 75; 

                        miner1.isTurnOnPushUpFromCrystals = true;
                        miner2.isTurnOnPushUpFromCrystals = true;
                        miner3.isTurnOnPushUpFromCrystals = true;
                        miner4.isTurnOnPushUpFromCrystals = true;
                    }, 10);
                }, 300);
            }
        },

        {
            key: "Золотодобытчики - движение за мышкой - проверка выталкивания из кристаллов",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 90 + 25;
                    var miner1 = new Miner(Buildings.flyEarth.centerX - 15, y, y + Miner.imageHeight);
                    miner1.loadedResourcesAfterBuild();
                    Units.all.push(miner1);

                    this.interval = setInterval(() => {
                        let mouseX = Mouse.x / (Draw.canvas.clientWidth / Draw.canvas.width);
                        let mouseY = Mouse.y / (Draw.canvas.clientHeight / Draw.canvas.height);

                        miner1.y = mouseY - Miner.imageHeight + 2; 
                        miner1.goalY = mouseY + 2; 
                        
                        miner1.x = mouseX - miner1.width / 2;

                        miner1.isTurnOnPushUpFromCrystals = true;
                    }, 300);
                }, 300);
            }
        },*/

        {
            key: "Золотодобытчики - добыча и конец волны",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Gamer.coins = 500;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = true;
                Waves.all[0] = [new WaveData(Zombie.name, 1, 30, 0)];

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    Units.addMiner();
                    var miner2 = Units.addMiner();
                    miner2.improveToGoldPick();
                }, 300);
            }
        },

        {
            key: "Золотодобытчики - гибель от летучей мыши",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = true;
                Waves.all[Waves.waveCurrent] = [new WaveData(Zombie.name, 1, 30, 0)];
                Gamer.coins = 100;
                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 144, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    miner3.improveToGoldPick();
                    miner3.improveToDiamondPick();
                    Units.all.push(miner3);
                    miner3.health -= 1;


                    setTimeout(() => {
                        var bat = new Bat(650, 280, true, 1);
                        bat.isSelectMinerToTest = true;
                        Monsters.all.push(bat);
                        //miner3.improvements.find(x => x.label == 'Урон')?.improve();
                    }, 3000);
                }, 300);
            }
        },

        {
            key: "Золотодобытчики - самооборона от летучей мыши",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = true;
                Waves.all[Waves.waveCurrent] = [new WaveData(Zombie.name, 1, 30, 0)];

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 144, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    miner3.improveToGoldPick();
                    miner3.improveToDiamondPick();
                    miner3.improveToSelfDefense();
                    Units.all.push(miner3);


                    setTimeout(() => {
                        var bat = new Bat(650, 280, true, 1);
                        bat.isSelectMinerToTest = true;
                        Monsters.all.push(bat);
                        //miner3.improvements.find(x => x.label == 'Урон')?.improve();
                    }, 3000);
                }, 300);
            }
        },

        {
            key: "Золотодобытчики - самооборона от 2х летучих мышей",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = true;
                Waves.all[Waves.waveCurrent] = [new WaveData(Zombie.name, 1, 30, 0)];

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 144, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    miner3.improveToGoldPick();
                    miner3.improveToDiamondPick();
                    miner3.improveToSelfDefense();
                    miner3.defense = 0.08;
                    Units.all.push(miner3);


                    setTimeout(() => {
                        var bat = new Bat(650, 280, true, 1);
                        bat.isSelectMinerToTest = true;
                        Monsters.all.push(bat);

                        
                        var bat2 = new Bat(1450, 280, false, 1);
                        bat2.isSelectMinerToTest = true;
                        Monsters.all.push(bat2);
                    }, 3000);
                }, 300);
            }
        },

        {
            key: "Золотодобытчики - магазин + летучие мыши",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Waves.waveCurrent = 1;
                Waves.all[Waves.waveCurrent + 1] = [new WaveData(Bat.name, 35, 63, 2)];
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 144, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);
                }, 300);
            }
        },

        {
            key: "Золотодобытчики - нападение летучей мыши - спасён",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = true;

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 144, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);


                    setTimeout(() => {
                        var bat = new Bat(650, 280, true, 1);
                        bat.isSelectMinerToTest = true;
                        Monsters.all.push(bat);


                        setTimeout(() => {
                            bat.applyDamage(1000);
                        }, 3000);
                    }, 3000);
                }, 300);
            }
        },

        {
            key: "Золотодобытчики - гибель от летучей мыши - с другой стороны",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = true;

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 90 + 25;
                    var miner1 = new Miner(Buildings.flyEarth.centerX + 15, y, y + Miner.imageHeight);
                    miner1.loadedResourcesAfterBuild();
                    /*miner1.improveSpeed();
                    miner1.improveSpeed();
                    miner1.improveSpeed();
                    miner1.improveSpeed();
                    miner1.improveSpeed();
                    miner1.improveSpeed();
                    miner1.improveSpeed();
                    miner1.improveSpeed();
                    miner1.improveSpeed();
                    miner1.improveSpeed();
                    miner1.improveSpeed();
                    miner1.improveSpeed();*/
                    //miner1.speed *= 2;
                    Units.all.push(miner1);


                    var y = Buildings.flyEarth.centerY - 110 + 25;
                    var miner2 = new Miner(Buildings.flyEarth.centerX + 25, y, y + Miner.imageHeight);
                    miner2.loadedResourcesAfterBuild();
                    Units.all.push(miner2);


                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX + 75, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);

                    //var tower1 = new Tower(1100);
                    //tower1.loadedResourcesAfterBuild();
                    //Buildings.all.push(tower1);


                    setTimeout(() => {
                        var bat = new Bat(650, 280, true, 1);
                        bat.isSelectMinerToTest = true;
                        Monsters.all.push(bat);
                    }, 3000);
                }, 300);
            }
        },

        {
            key: "Золотодобытчики - гибель",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = true;
                Units.loadResources();
                Waves.all[0] = [new WaveData(Zombie.name, 1, 30, 0)];
                Gamer.coins = 100;

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX + 25, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);


                    var miner2 = Units.addMiner();
                    miner2.improveToGoldPick();

                    var miner1 = Units.addMiner();
                    miner1.improveToDiamondPick();

                    setTimeout(() => {
                        miner3.health = 0;
                        miner2.health = 0;
                        miner1.health = 0;
                    }, 1000);
                }, 300);
            }
        },

        
        {
            key: "Золотособиратель - магазин + зомби",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 144, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    Units.all.push(miner3);
                }, 300);

                setTimeout(() => {
                    Game.buyThing(Collector.shopItem);
                }, 1000);
            }
        },

        
        {
            key: "Золотособиратель - кабан с ускорением",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Gamer.coins = 1500;
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Gamer.coins = 100;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Boar.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                this.waitLoadingImage(Boar.imageHandler, () => {
                    var boar = new Boar(50, 780, true, 1, true);
                    Monsters.all.push(boar);
                });

                setTimeout(() => {
                    var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    collector1.improveToWoodArmor();
                    Units.all.push(collector1);
                }, 300);
            }
        },

        
        {
            key: "Золотособиратель - кабан",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Gamer.coins = 100;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Boar.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                this.waitLoadingImage(Boar.imageHandler, () => {
                    var boar = new Boar(50, 780, true, 1, false);
                    Monsters.all.push(boar);
                });

                setTimeout(() => {
                    var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    Units.all.push(collector1);
                }, 300);
            }
        },

        
        {
            key: "Золотособиратель - зомби",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Gamer.coins = 100;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Zombie.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                this.waitLoadingImage(Zombie.imageHandler, () => {
                    var zombie = new Zombie(450, 780, true, 1);
                    Monsters.all.push(zombie);
                });

                setTimeout(() => {
                    var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    Units.all.push(collector1);
                }, 300);
            }
        },
        
        {
            key: "Золотособиратель - зомби + speed",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Gamer.coins = 100;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Zombie.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                this.waitLoadingImage(Zombie.imageHandler, () => {
                    var zombie = new Zombie(450, 780, true, 1);
                    Monsters.all.push(zombie);
                });

                setTimeout(() => {
                    var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    collector1.improveSpeed();
                    Units.all.push(collector1);
                }, 300);
            }
        },

        
        {
            key: "Золотособиратель - зомби + монетки",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Gamer.coins = 100;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Zombie.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var barricade1 = new Barricade(Draw.canvas.width / 2 - 100);
                barricade1.loadedResourcesAfterBuild();
                barricade1.health = 30;
                Buildings.all.push(barricade1);

                this.waitLoadingImage(Zombie.imageHandler, () => {

                    var zombie = new Zombie(Draw.canvas.width / 2 - 150, 780, true, 1);
                    zombie.health =+ 50;
                    Monsters.all.push(zombie);
                });

                setTimeout(() => {
                    var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Draw.canvas.width / 2, y);
                    collector1.loadedResourcesAfterBuild();
                    Units.all.push(collector1);
                }, 300);

                //first coin
                setTimeout(() => {
                    Coins.all.push(new Coin(Draw.canvas.width / 2 + 100, Draw.canvas.height / 2));
                }, 1000);

                setTimeout(() => {
                    Coins.all.push(new Coin(Draw.canvas.width / 2 - 50, Draw.canvas.height / 2));
                }, 3000);

                setTimeout(() => {
                    Coins.all.push(new Coin(Draw.canvas.width / 2 - 200, Draw.canvas.height / 2));
                }, 7000);

                setTimeout(() => {
                    Coins.all.push(new Coin(Draw.canvas.width / 2 - 80, Draw.canvas.height / 2));
                }, 7000);

                setTimeout(() => {
                    Coins.all.push(new Coin(Draw.canvas.width / 2 - 90, Draw.canvas.height / 2));
                }, 10000);

                setTimeout(() => {
                    Coins.all.push(new Coin(Draw.canvas.width / 2 - 95, Draw.canvas.height / 2));
                }, 12000);
                
                setTimeout(() => {
                    Coins.all.push(new Coin(Draw.canvas.width / 2 + 150, Draw.canvas.height / 2));
                }, 16000);

                setTimeout(() => {
                    var zombie = new Zombie(Draw.canvas.width / 2 + 280, 780, false, 1);
                    Monsters.all.push(zombie);
                }, 17500);
                
                setTimeout(() => {
                    //Coins.all.push(new Coin(Draw.canvas.width / 2 - 50, Draw.canvas.height / 2));
                }, 18000);
            }
        },

        
        {
            key: "Золотособиратель - защита",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Zombie.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                setTimeout(() => {
                    var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                    collector1.loadedResourcesAfterBuild();
                    collector1.defense = 1;
                    Units.all.push(collector1);
                }, 300);

                setTimeout(() => {
                    this.waitLoadingImage(Zombie.imageHandler, () => {
                        var zombie = new Zombie(Draw.canvas.width / 2 - 250, 780, true, 1);
                        Monsters.all.push(zombie);
    
                        var zombie = new Zombie(Draw.canvas.width / 2 + 220, 780, false, 1);
                        Monsters.all.push(zombie);
                    });
                }, 1500);
            }
        },

        
        {
            key: "Золотособиратель - переключение на более ближнюю монету",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                collector1.loadedResourcesAfterBuild();
                Units.all.push(collector1);

                //first coin
                setTimeout(() => {
                    if(WawesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 + 100, Draw.canvas.height / 2));
                }, 1000);

                setTimeout(() => {
                    if(WawesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 50, Draw.canvas.height / 2));
                }, 3000);
            }
        },

        
        {
            key: "Золотособиратель - окончание волны без монеты",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                collector1.loadedResourcesAfterBuild();
                Units.all.push(collector1);

                //first coin
                setTimeout(() => {
                    Monsters.all.forEach(x => x.health = -1);
                }, 2000);
            }
        },

        
        {
            key: "Золотособиратель - окончание волны с монетой",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                collector1.loadedResourcesAfterBuild();
                Units.all.push(collector1);

                //first coin
                setTimeout(() => {
                    //Coins.all.push(new Coin(Draw.canvas.width / 2 + 100, Draw.canvas.height / 2));
                    Coins.all.push(new Coin(Draw.canvas.width / 2 - 20, Draw.canvas.height / 2));
                }, 500);

                //first coin
                setTimeout(() => {
                    Monsters.all.forEach(x => x.health = -1);
                }, 2000);
            }
        },

        
        {
            key: "Золотособиратель - конец волны - с монетками",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                collector1.loadedResourcesAfterBuild();
                Units.all.push(collector1);

                //first coin
                setTimeout(() => {
                    if(WawesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 + 100, Draw.canvas.height / 2));
                }, 1000);

                setTimeout(() => {
                    if(WawesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 50, Draw.canvas.height / 2));
                }, 3000);

                setTimeout(() => {
                    if(WawesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 200, Draw.canvas.height / 2));
                }, 4000);

                setTimeout(() => {
                    if(WawesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 80, Draw.canvas.height / 2));
                }, 7000);

                setTimeout(() => {
                    if(WawesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 90, Draw.canvas.height / 2));
                }, 10000);

                setTimeout(() => {
                    if(WawesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 95, Draw.canvas.height / 2));
                }, 12000);
                
                setTimeout(() => {
                    if(WawesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 + 150, Draw.canvas.height / 2));
                }, 16000);
            }
        },

        
        {
            key: "Золотособиратель - воскрешение",
            code: () => {
                
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                WawesState.isWaveStarted = false;
                Waves.waveCurrent = 0;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;


                setTimeout(() => {
                    var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    collector1.improveToWoodArmor();
                    Units.all.push(collector1);

                    
                    setTimeout(() => {
                        collector1.applyDamage(20);
                    }, 3000);
                }, 300);
            }
        },

        
        {
            key: "Золотособиратель - распределение при сборе",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                collector1.loadedResourcesAfterBuild();
                Units.all.push(collector1);

                var collector2 = new Collector(Draw.canvas.width / 2 - 100, y);
                collector2.loadedResourcesAfterBuild();
                collector2.goalX = Draw.canvas.width / 2 + 150;
                Units.all.push(collector2);

                //first coin
                setTimeout(() => {
                    if(WawesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2, Draw.canvas.height / 2));
                }, 1000);
                setTimeout(() => {
                    if(WawesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 + 10, Draw.canvas.height / 2));
                }, 2000);

                setTimeout(() => {
                    if(WawesState.isWaveStarted){
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 100, Draw.canvas.height / 2));
                        Coins.all.push(new Coin(Draw.canvas.width / 2 + 100, Draw.canvas.height / 2));
                    }
                }, 7000);
            }
        },
        
        /*{
            key: "Золотособиратель - гибель",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Zombie.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                setTimeout(() => {
                    var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    Units.all.push(collector1);

                        setTimeout(() => {
                            collector1.applyDamage(2);
                            collector1.applyDamage(1);
                        }, 1500);
                }, 300);
            }
        },*/
        /*
        {
            key: "Золотособиратель - гибель2",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WawesState.delayEndLeftTimeMs = WawesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        //new WaveData(Zombie.name, 7, 80, 0),
                        new WaveData(Zombie.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                setTimeout(() => {
                    var y = Draw.canvas.height - Game.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    Units.all.push(collector1);

                        setTimeout(() => {
                            collector1.applyDamage(4);
                        }, 3000);
                }, 300);
            }
        },*/
    ];

    waitLoadingImage(imageHandler: ImageHandler, callback: Function){
        setTimeout(() => {
            if(imageHandler.isImagesCompleted){
                callback();
            }
            else{
                this.waitLoadingImage(imageHandler, callback);
            }
        }, 100);
    }

    getSelectedTestNumber(): number {
        return +(Helper.getUrlQuery()['variant'] || Helper.getUrlQuery()['v']);
    }

    interval:NodeJS.Timeout|null = null;
    componentWillUnmount(){
        if(this.interval){
            clearInterval(this.interval);
        }
    }

    componentDidMount(){
        //pre load sounds/images
        Units.loadResources();
        Buildings.loadResources();
        Unit.loadHealingResources();
        Unit.loadUpgradeResources();
        Building.loadRepairResources();
        Building.loadUpgradeResources();
        Monster.loadHitSounds();
        Tower.loadRepairResources();
        Tower.loadResourcesAfterBuild();
        Barricade.loadResourcesAfterBuild();
        Tower.loadUpgradeResources();
        Boar.init(true);
        Zombie.init(true);
        Bat.init(true);
        Necromancer.init(true);
        Builder.init(true);
        //Skelet.init(true);
        FlyEarth.loadExplosionResources();
        Game.loadResourcesAfterEndOfWave(0);
        Game.loadResourcesAfterBuild(new Tower(0));
        Game.loadResourcesAfterBuild(new Barricade(0));

        const variant = this.getSelectedTestNumber();
        if(variant > 0){
            var test = this.listOfTests[variant - 1];
            if(test){
                this.text = test.key;
                test.code();
            }
        }

        if(!this.text){
            App.Store.dispatch(MenuStore.actionCreators.close());
            App.Store.dispatch(MenuStore.actionCreators.hideOutsideButtons());
        }

        this.forceUpdate();
    }

    public render() {
        const variant = this.getSelectedTestNumber();

        if(this.text){
            return <div className='test-page'>
                <div className='test-page__name-test noselect'>{this.text}</div>
                <a className='test-page__button-prev' href={'/test?v=' + (variant - 1)}>Prev test</a>
                <a className='test-page__button-all' href={'/test'}>all</a>
                <a className='test-page__button-next' href={'/test?v=' + (variant + 1)}>Next test</a>
            </div>;
        }

        return <div className='test-page'>
            <div className='test-page__list'>
                <div className='test-page__header-list-tests'>Список тестов:</div>
                {this.listOfTests.map((test, i) => {
                    return <div key={i}><a className='test-page__link-test' href={'/test?v=' + (i + 1)}>{test.key}</a></div>
                })}
            </div>
        </div>;
    }
}

export default TestPage;