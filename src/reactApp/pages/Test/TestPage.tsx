import * as React from 'react';

import { App } from '../../App';
import * as MenuStore from '../../components/Menu/MenuStore';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Buildings} from '../../../gameApp/buildings/Buildings';
import {Tower} from '../../../gameApp/buildings/Tower';
import {Waves} from '../../../gameApp/gameSystems/Waves';
import {WavesState} from '../../../gameApp/WavesState';
import {WaveData} from "../../../models/WaveData";
import {Helper} from '../../helpers/Helper';
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
import { Panels } from '../../components/Panels/Panels';
import { Meteor } from '../../../gameApp/magic/Meteor';
import { Minotaur } from '../../../gameApp/monsters/Minotaur';
import { FireCursorModifier } from '../../../gameApp/cursorModifiers/FireCursorModifier';
import { PileStones } from '../../../gameApp/buildings/PileStones';
import { Magics } from '../../../gameApp/magic/Magics';
import { Point } from '../../../models/Point';
import { Cursor } from '../../../gameApp/gamer/Cursor';

class TestPage extends React.Component {
    text: string = "";

    listOfTests = [
        {
            key: "Image Handler, loading images, waiting images",
            code: () => { 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

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

                WavesState.isWaveStarted = false;
            }
        },
        {
            key: "Анимация разрушения строения", 
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                
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
            key: "Анимация строительства",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Gamer.coins = 50;
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                setTimeout(() => {
                    var tower1 = new Tower(200);
                    tower1.loadedResourcesAfterBuild();
                    Builder.addBuilding(tower1, Draw.canvas.height - tower1.height + Draw.bottomShiftBorder);
                    Builder.mouseLogic(200, 0, true, false, Buildings.all, Game.loadResourcesAfterBuild.bind(Game));
                }, 300);
            }
        },

        {
            key: "Зомби - атака",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                /*Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Boar.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 1, 1, 0)
                    ]];*/

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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Boar.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                var boar = new Boar(800, 780, true, 1, true);
                Monsters.all.push(boar);
            }
        },

        {
            key: "Кабан - Спец способность + отмена при получении урона",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Boar.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                var boar = new Boar(50, 780, true, 1, true);
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Skelet.name, 1, 60, 10)
                    ],
                    [ //2-я волна
                        new WaveData(Skelet.name, 15, 10, 10)
                    ]];

                
                let newSkelet = new Skelet(500, 0, true, 1);
                newSkelet.isDisplayCreatingFromUndegroundAnimation = true;
                newSkelet.y = Draw.canvas.height - Draw.bottomShiftBorder - newSkelet.height;
                newSkelet.health -= 1;
                Monsters.all.push(newSkelet);
            }
        },

        {
            key: "Баррикада - возврат урона - зомби",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

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

                WavesState.isWaveStarted = false;
            }
        },

        {
            key: "Баррикада - возврат урона - спец способность кабанов",
            code: () => { 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

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

                WavesState.isWaveStarted = false;
            }
        },

        {
            key: "Баррикада - Железная версия",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

                var zombie1 = new Zombie(650, 780, true, 1);
                Monsters.all.push(zombie1);

                var barricade1 = new Barricade(700);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);


                var zombie2 = new Zombie(1300, 780, false, 1);
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

                var barricade1 = new Barricade(200);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var necromancer = new Necromancer(0, 780, true, 1);
                necromancer.countSimpleAttacksToActivateSpecialAbility = 110;
                Monsters.all.push(necromancer);

                WavesState.isWaveStarted = false;
            }
        },

        {
            key: "Башня - несколько лучников",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 3;
                Buildings.all.push(tower1);

                var barricade1 = new Barricade(600);
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

       /* {
            key: "Башня - несколько лучников - выбор цели",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

                var tower1 = new Tower(710);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 3;
                Buildings.all.push(tower1);

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);


                var barricade2 = new Barricade(1600);
                barricade2.health = 2000;
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                Monsters.all.push(new Bat(650, 380, true, 1));
                Monsters.all.push(new Bat(550, 380, true, 1));
                Monsters.all.push(new Bat(700, 380, true, 1));
                //Monsters.all.push(new Bat(710, 180, true, 1));

                
                Monsters.all.push(new Zombie(550, 780, true, 1));
                Monsters.all.push(new Zombie(580, 780, true, 1));
                Monsters.all.push(new Zombie(500, 780, true, 1));
                Monsters.all.push(new Zombie(480, 780, true, 1));
                Monsters.all.push(new Zombie(450, 780, true, 1));
                Monsters.all.push(new Zombie(420, 780, true, 1));
            }
        },*/

        {
            key: "Башня - скоростные стрелы",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 1;
                tower1.radiusAttack = 500;
                tower1.improveToFireArrows();
                Buildings.all.push(tower1);

                var barricade1 = new Barricade(400);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower2 = new Tower(1200);
                tower2.loadedResourcesAfterBuild();
                tower2.improveToFireArrows();
                Buildings.all.push(tower2);
                
                var barricade2 = new Barricade(1250);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                Monsters.all.push(new Minotaur(100, 380, true, 1));
                Monsters.all.push(new Minotaur(1350, 380, false, 1));
            }
        },

        {
            key: "Башня - взрывные стрелы",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

                var tower1 = new Tower(710);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 1;
                //tower1.arrowSpeed += 1500
                tower1.radiusAttack = 500;
                tower1.improveToDynamitArrows();
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                
                Waves.all = [ //монстры на волнах
                [ //1-я волна
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 1;
                tower1.radiusAttack = 500;
                tower1.improveToFireArrows();
                tower1.improveToDynamitArrows();
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                //WavesState.isWaveStarted = false;


                var tower1 = new Tower(600);
                tower1.loadedResourcesAfterBuild();
                tower1.bowmans = 1;
                tower1.radiusAttack = 500;
                tower1.improveToFireArrows();
                Buildings.all.push(tower1);
                tower1.attack(500 - 400, Draw.canvas.height + 100);

                var barricade1 = new Barricade(400);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower2 = new Tower(1200);
                tower2.loadedResourcesAfterBuild();
                tower2.improveToDynamitArrows();
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

                var tower1 = new Tower(Draw.canvas.width / 2 - 50);
                tower1.loadedResourcesAfterBuild();
                tower1.radiusAttack = 500;
                tower1.improveToDynamitArrows();
                tower1.dynamitDamage = 2;
                tower1.dynamitRadius = 150;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Башня - стрела после взрыва",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //Zombie.name, 7, 80, 0),
                        new WaveData(Zombie.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];
                
                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                tower1.health = 1;
                tower1.radiusAttack = 500;
                Buildings.all.push(tower1);

                var zombie = new Zombie(100, 780, true, 1);
                Monsters.all.push(zombie);

                setTimeout(() => {
                    tower1.health = 0;
                }, 700);
            }
        },

        {
            key: "Огонь - затухание",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 0;
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

                FireModifier.loadResources();
                
                var zombie = new Zombie(0, 780, true, 1);
                zombie.modifiers.push(new FireModifier());
                Monsters.all.push(zombie);

                var boar = new Boar(Draw.canvas.width - 100, 780, false, 1, true);
                boar.modifiers.push(new FireModifier());
                Monsters.all.push(boar);

                var bat = new Bat(0, 280, true, 1);
                bat.modifiers.push(new FireModifier());
                Monsters.all.push(bat);

                var necromancer = new Necromancer(400, 780, true, 1);
                Monsters.all.push(necromancer);

                var necromancer3 = new Necromancer(1400, 780, false, 1);
                Monsters.all.push(necromancer3);

                setTimeout(() => {
                    necromancer.modifiers.push(new FireModifier());
                    necromancer3.modifiers.push(new FireModifier());
                }, 1000);

                var necromancer2 = new Necromancer(200, 780, true, 0.7);
                Monsters.all.push(necromancer2);

                setTimeout(() => {
                    necromancer2.modifiers.push(new FireModifier());
                }, 5000);
            }
        },

        {
            key: "Огонь - передача",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

                FireCursorModifier.init();
                setTimeout(() => {
                    Game.buyThing(FireCursorModifier.shopItem);
                }, 1000);

                FireModifier.loadResources();
                var fireModifier = new FireModifier(0.3, 1, 15000);
                var zombie = new Zombie(0, 780, true, 1);
                zombie.modifiers.push();
                Monsters.all.push(zombie);

                var boar = new Boar(Draw.canvas.width - 100, 780, false, 1, true);
                boar.modifiers.push(fireModifier);
                Monsters.all.push(boar);

                var bat = new Bat(500, 480, true, 1);
                bat.modifiers.push(fireModifier);
                Monsters.all.push(bat);

                for(var y = 600; y > 200; y -= 30){
                    var bat = new Bat(700, y, true, 1);
                    Monsters.all.push(bat);
                }

                setTimeout(() => {

                    var bat = new Bat(Draw.canvas.width / 2 - FlyEarth.image.width, Buildings.flyEarth.centerY, true, 1);
                    bat.modifiers.push(fireModifier);
                    Monsters.all.push(bat);


                    var bat2 = new Bat(Draw.canvas.width / 2 + FlyEarth.image.width, Buildings.flyEarth.centerY, false, 1);
                    bat2.modifiers.push(fireModifier);
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
            key: "Некромант - обычная атака - гибель",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Necromancer.name, 3, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];

                var necromancer = new Necromancer(600, 780, true, 1);
                Monsters.all.push(necromancer);

                Game.buyThing(Meteor.shopItem);

                setTimeout(() => {
                    Magics.starCreatingPoint = new Point(necromancer.x, 0);
                    var meteor = new Meteor(necromancer.x, 0);
                    Magics.create(meteor, new Point(necromancer.x, necromancer.y));
                }, 1000);
            }
        },

        {
            key: "Некромант - обычная атака, смена цели",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        //Zombie.name, 7, 80, 0),
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
            key: "Некромант - спецспособность - вызов кислотного дождя - гибель",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Necromancer.name, 3, 60, 6)
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
                Monsters.all.push(necromancer);

                setTimeout(() => {
                    var necromancer = new Necromancer(0, 780, true, 0.7);
                    necromancer.countSimpleAttacksToActivateSpecialAbility = 0;
                    necromancer.isForceSpecialAbilityAcidRain = true;
                    Monsters.all.push(necromancer);
                }, 3000);
                
                Game.buyThing(Meteor.shopItem);

                setTimeout(() => {
                    Magics.starCreatingPoint = new Point(necromancer.x, 0);
                    var meteor = new Meteor(necromancer.x, 0);
                    Magics.create(meteor, new Point(necromancer.x, necromancer.y));
                }, 3000);
            }
        },

        {
            key: "Некромант - спецспособность - вызов кислотного дождя - сбиваем огнём",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
                    necromancer.modifiers.push(new FireModifier());
                }, 2000);
            }
        },

        {
            key: "Некромант - спецспособность - вызов кислотного дождя - смена цели",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
            key: "Некромант - спецспособность - вызов скелетов - гибель некроманта",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Necromancer.name, 1, 60, 16)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];

                var necromancer = new Necromancer(500, 780, true, 1);
                necromancer.countSimpleAttacksToActivateSpecialAbility = 0;
                necromancer.isForceSpecialAbilitySkeletons = true;
                Monsters.all.push(necromancer);

                Game.buyThing(Meteor.shopItem);

                setTimeout(() => {
                    Magics.starCreatingPoint = new Point(necromancer.x, 0);
                    var meteor = new Meteor(necromancer.x, 0);
                    meteor.improveToPileStones();
                    Magics.create(meteor, new Point(necromancer.x, necromancer.y));
                }, 5000);
            }
        },

        {
            key: "Некромант - спецспособность - рандом",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
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
                    necromancer.modifiers.push(new FireModifier());
                }, 2500);
            }
        },

        {
            key: "Минотавр",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Minotaur.name, 1, 1, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Minotaur.name, 15, 10, 0)
                    ]];
            }
        },

        {
            key: "Минотавр - атака",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Minotaur.name, 1, 1, 10)
                    ],
                    [ //2-я волна
                        new WaveData(Minotaur.name, 15, 10, 0)
                    ]];

                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var tower2 = new Tower(1200);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
                /*
                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);*/

                var barricade2 = new Barricade(1300);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                Monsters.all.push(new Minotaur(300, 380, true, 1));
                Monsters.all.push(new Minotaur(1350, 380, false, 1));
            }
        },


        {
            key: "Минотавр - огонь",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Minotaur.name, 1, 1, 10)
                    ],
                    [ //2-я волна
                        new WaveData(Minotaur.name, 15, 10, 0)
                    ]];

                var scale = 1;
                Monsters.all.push(new Minotaur(100, 380 / scale, true, scale));
                Monsters.all.push(new Minotaur(1520, 380 / scale, false, scale));

                Gamer.coins = 2000;
                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                tower1.improveToFireArrows();
                //tower1.improveToDynamitArrows();
                Buildings.all.push(tower1);

                var tower2 = new Tower(1200);
                tower2.loadedResourcesAfterBuild();
                tower2.improveToFireArrows();
                //tower2.improveToDynamitArrows();
                Buildings.all.push(tower2);
                
                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var barricade2 = new Barricade(1100);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
            }
        },

        {
            key: "Минотавр - груда камней сзади",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Necromancer.name, 1, 60, 16)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];

                var scale = 1;
                var minotaur = new Minotaur(100, 380 / scale, true, scale);
                Monsters.all.push(minotaur);

                Game.buyThing(Meteor.shopItem);

                setTimeout(() => {
                    Magics.starCreatingPoint = new Point(minotaur.centerX, 0);
                    var meteor = new Meteor(minotaur.centerX, 0);
                    meteor.improveToPileStones();
                    Magics.create(meteor, new Point(minotaur.centerX, minotaur.y));
                }, 200);
            }
        },

        {
            key: "Минотавр - груда камней посередине",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Necromancer.name, 1, 60, 16)
                    ],
                    [ //2-я волна
                        new WaveData(Necromancer.name, 15, 10, 0)
                    ]];

                var scale = 1;
                var minotaur = new Minotaur(100, 380 / scale, true, scale);
                Monsters.all.push(minotaur);

                var minotaur2 = new Minotaur(1400, 380 / scale, false, scale);
                Monsters.all.push(minotaur2);

                Game.buyThing(Meteor.shopItem);

                setTimeout(() => {
                    var x = minotaur.centerX + 80;
                    Magics.starCreatingPoint = new Point(x, 0);
                    var meteor = new Meteor(x, 0);
                    meteor.improveToPileStones();
                    Magics.create(meteor, new Point(x, minotaur.y));

                    
                    var x2 = minotaur2.centerX - 80;
                    Magics.starCreatingPoint = new Point(x2, 0);
                    var meteor2 = new Meteor(x2, 0);
                    meteor2.improveToPileStones();
                    Magics.create(meteor2, new Point(x2, minotaur2.y));
                }, 200);
            }
        },

        {
            key: "Груда камней - Минотавр",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Minotaur.name, 1, 1, 10)
                    ],
                    [ //2-я волна
                        new WaveData(Minotaur.name, 15, 10, 0)
                    ]];

                Meteor.init(true);
                Magics.starCreatingPoint = new Point(600, 0);
                var meteor1 = new Meteor(600, 0);
                meteor1.improveToPileStones();
                //meteor1.improveToHotPileStones();
                Magics.create(meteor1, new Point(600, 1000));  

                Magics.starCreatingPoint = new Point(700, 0);
                var meteor2 = new Meteor(700, 0);
                meteor2.improveToPileStones();
                meteor2.improveToHotPileStones();
                Magics.create(meteor2, new Point(700, 1000));  

                Monsters.all.push(new Minotaur(100, 380, true, 1));
            }
        },

        {
            key: "Груда камней - Зомби",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 1, 10)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                Meteor.init(true);
                Magics.starCreatingPoint = new Point(600, 0);
                var meteor1 = new Meteor(600, 0);
                meteor1.improveToPileStones();
                Magics.create(meteor1, new Point(600, 1000));  

                Magics.starCreatingPoint = new Point(700, 0);
                var meteor2 = new Meteor(700, 0);
                meteor2.improveToPileStones();
                meteor2.improveToHotPileStones();
                Magics.create(meteor2, new Point(700, 1000));  

                Monsters.all.push(new Zombie(300, 780, true, 1));
            }
        },

        {
            key: "Волна 1",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Game.startNew();
                Waves.waveCurrent = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 1, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 2, 10, 0)
                    ]];
                Gamer.coins = 70;
            }
        },

        {
            key: "Волна 2",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
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
            key: "Волна 5",
            code: () => { 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.waveCurrent = 5;

                var barricade1 = new Barricade(600);
                //barricade1.health = 1000;
                barricade1.loadedResourcesAfterBuild();
                barricade1.impoveToIron();
                Buildings.all.push(barricade1);
                
                var tower1 = new Tower(700);
                tower1.damage = 3;
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var barricade2 = new Barricade(1300);
                //barricade2.health = 1000;
                barricade2.loadedResourcesAfterBuild();
                barricade2.impoveToIron();
                Buildings.all.push(barricade2);

                var tower2 = new Tower(1200);
                tower2.damage = 3;
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);

                Game.buyThing(Meteor.shopItem);
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                
                Monsters.all.push(new Boar(800, 780, true, 1, true));
                Monsters.all.push(new Boar(8100, 780, true, 1, true));
                Monsters.all.push(new Boar(820, 780, true, 1, true));
                Monsters.all.push(new Boar(830, 780, true, 1, true));
                Monsters.all.push(new Boar(840, 780, true, 1, true));
                Monsters.all.push(new Boar(740, 780, true, 1, true));
                Monsters.all.push(new Boar(750, 780, true, 1, true));
                Game.buyThing(FireCursorModifier.shopItem);
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;




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
                
                Monsters.all.push(new Boar(800, 780, true, 1, true));
                Monsters.all.push(new Boar(8100, 780, true, 1, true));
                Monsters.all.push(new Boar(820, 780, true, 1, true));
                Monsters.all.push(new Boar(830, 780, true, 1, true));
                Monsters.all.push(new Boar(840, 780, true, 1, true));
                Monsters.all.push(new Boar(740, 780, true, 1, true));
                Monsters.all.push(new Boar(750, 780, true, 1, true));
                }, 300);
                
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;

                for(var i = 0; i < 35; i++){
                    Monsters.all.push(new Bat(500 + i * 5, 380, true, 1));
                }

                for(var i = 0; i < 35; i++){
                    Monsters.all.push(new Bat(1100 + i * 5, 380, false, 1));
                }
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
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

                    setTimeout(() => {
                        for(var i = 0; i < 35; i++){
                            Monsters.all.push(new Bat(500 + i * 5, 380, true, 1));
                        }

                        for(var i = 0; i < 1; i++){
                            Monsters.all.push(new Bat(1100 + i * 5, 380, false, 1));
                        }
                    }, 1000);
                }, 300);
            }
        },

        /*{
            key: "Золотодобытчик - Авто появление",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Золотодобытчик - Авто появление множественное + проверка на лимит покупки",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Золотодобытчик - нападение летучих мышей на множество добытчиков",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;
                Waves.all = [[],
                [ 
                    new WaveData(Bat.name, 87, 21, 0),
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Золотодобытчик - порядок отрисовки 1",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Золотодобытчик - порядок отрисовки 2",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Золотодобытчик - порядок отрисовки 3",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Золотодобытчик - за кристаллами",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Золотодобытчик - перед кристаллами",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Золотодобытчик - перед и за кристаллами",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Золотодобытчик - движение за мышкой",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Золотодобытчик - движение за мышкой - проверка выталкивания из кристаллов",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Золотодобытчик - добыча и конец волны",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Gamer.coins = 500;
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = true;
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
            key: "Золотодобытчик - гибель от летучей мыши",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = true;
                Waves.all[Waves.waveCurrent] = [new WaveData(Zombie.name, 1, 30, 0)];
                Waves.all[Waves.waveCurrent + 1] = [new WaveData(Zombie.name, 1, 30, 0)];
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
                    }, 3000);
                }, 300);
            }
        },

        {
            key: "Золотодобытчик - самооборона от летучей мыши",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = true;
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
                    }, 3000);
                }, 300);
            }
        },

        {
            key: "Золотодобытчик - самооборона от 2х летучих мышей",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = true;
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
            key: "Золотодобытчик - магазин + летучие мыши",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
            key: "Золотодобытчик - нападение летучей мыши - спасён",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = true;

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
            key: "Золотодобытчик - нападение летучей мыши - спасён + конец волны",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = true;
                Waves.all[0] = [new WaveData(Bat.name, 1, 1, 0)];

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 144, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    //miner3.improveToWoodArmor();
                    Units.all.push(miner3);


                    setTimeout(() => {
                        var bat = new Bat(650, 280, true, 1);
                        bat.isSelectMinerToTest = true;
                        Monsters.all.push(bat);


                        setTimeout(() => {
                            Monsters.all.forEach(m => m.applyDamage(1000));
                        }, 5000);
                    }, 100);
                }, 300);
            }
        },

        {
            key: "Золотодобытчик - гибель от летучей мыши - с другой стороны",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = true;

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
            key: "Золотодобытчик - гибель",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = true;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 64, y, y + Miner.imageHeight);
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Boar.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 10, 10, 0)
                    ]];

                this.waitLoadingImage(Boar.imageHandler, () => {
                    var boar = new Boar(50, 780, true, 1, true);
                    Monsters.all.push(boar);
                });

                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    //collector1.improveToWoodArmor();
                    //collector1.improveToVacuumCar();
                    Units.all.push(collector1);
                }, 300);
            }
        },

        
        {
            key: "Золотособиратель - кабан с ускорением + пылесос",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Gamer.coins = 1500;
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
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
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    //collector1.improveToWoodArmor();
                    collector1.improveToVacuum();
                    Units.all.push(collector1);
                }, 300);

                setTimeout(() => {
                    Coins.all.push(new Coin(Draw.canvas.width / 2 - 10, Draw.canvas.height / 2));
                }, 300);
            }
        },

        
        {
            key: "Золотособиратель - кабан",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Gamer.coins = 100;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Boar.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                this.waitLoadingImage(Boar.imageHandler, () => {
                    var boar = new Boar(50, 780, true, 0.9, false);
                    Monsters.all.push(boar);
                });

                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Gamer.coins = 100;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];
/*
                var barricade1 = new Barricade(850);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);*/

                this.waitLoadingImage(Zombie.imageHandler, () => {
                    var zombie = new Zombie(450, 780, true, 1);
                    Monsters.all.push(zombie);
                });

                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Gamer.coins = 100;
                Waves.all = [
                    [ //1-я волна
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
                   // Coins.all.push(new Coin(Draw.canvas.width / 2 + 100, Draw.canvas.height / 2));
                }, 1000);


                setTimeout(() => {
                    var zombie = new Zombie(1450, 780, false, 1);
                    Monsters.all.push(zombie);
                }, 6000);

                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    collector1.improveToVacuumCar();
                    collector1.improveSpeed();
                    collector1.improveToWoodArmor();
                    Units.all.push(collector1);
                }, 300);
            }
        },

        
        {
            key: "Золотособиратель - зомби + монетки",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Gamer.coins = 100;
                Waves.all = [
                    [ //1-я волна
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
                    zombie.health =+ 5;
                    Monsters.all.push(zombie);
                });

                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
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
                Gamer.coins = 1000;
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var collector1: Collector|null = null;
                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                    collector1 = new Collector(Draw.canvas.width / 2 - 100, y);
                    collector1.loadedResourcesAfterBuild();
                    collector1.improveToWoodArmor();
                    collector1.improveToVacuum();
                    //collector1.improveToVacuumCar();
                    //collector1.defense = 1;
                    Units.all.push(collector1);
                }, 300);

                setTimeout(() => {
                    //if(collector1)
                    //    collector1.improveToVacuum();
                    this.waitLoadingImage(Zombie.imageHandler, () => {
                        var zombie = new Zombie(Draw.canvas.width / 2 - 200, 780, true, 1);
                        Monsters.all.push(zombie);
    
                        var zombie = new Zombie(Draw.canvas.width / 2 + 120, 780, false, 1);
                        Monsters.all.push(zombie);
                    });
                }, 3000);
            }
        },

        
        {
            key: "Золотособиратель - переключение на другую монету после исчезновения первой",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                collector1.loadedResourcesAfterBuild();
                //collector1.improveToVacuum();
                Units.all.push(collector1);

                //first coin
                setTimeout(() => {
                    if(WavesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 + 22, Draw.canvas.height - 80));
                }, 500);

                setTimeout(() => {
                    if(WavesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 + 27, Draw.canvas.height - 80));
                }, 3000);
            }
        },

        
        {
            key: "Золотособиратель - переключение на более ближнюю монету",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                collector1.loadedResourcesAfterBuild();
                collector1.improveToVacuum();
                Units.all.push(collector1);

                //first coin
                setTimeout(() => {
                    if(WavesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 + 100, Draw.canvas.height / 2));
                }, 1000);

                setTimeout(() => {
                    if(WavesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 50, Draw.canvas.height / 2));
                }, 3000);
            }
        },

        
        {
            key: "Золотособиратель - окончание волны без монеты",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 1, 10, 0)
                    ]];

                var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                collector1.loadedResourcesAfterBuild();
                Units.all.push(collector1);

                //first coin
                setTimeout(() => {
                    //collector1.improveToVacuum();
                    Monsters.all.forEach(x => x.health = -1);
                }, 3000);
            }
        },

        
        {
            key: "Золотособиратель - окончание волны с монетой - Тест на глюк - бег на месте",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                collector1.loadedResourcesAfterBuild();
                collector1.goalX = Draw.canvas.width / 2 - 250;
                Units.all.push(collector1);

                //first coin
                setTimeout(() => {
                    //Coins.all.push(new Coin(Draw.canvas.width / 2 + 100, Draw.canvas.height / 2));
                    Coins.all.push(new Coin(Draw.canvas.width / 2 - 100, Draw.canvas.height / 2));
                }, 3500);

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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                collector1.loadedResourcesAfterBuild();
                Units.all.push(collector1);

                //first coin
                setTimeout(() => {
                    if(WavesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 + 100, Draw.canvas.height / 2));
                }, 1000);

                setTimeout(() => {
                    if(WavesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 50, Draw.canvas.height / 2));
                }, 3000);

                setTimeout(() => {
                    if(WavesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 200, Draw.canvas.height / 2));
                }, 4000);

                setTimeout(() => {
                    if(WavesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 80, Draw.canvas.height / 2));
                }, 7000);

                setTimeout(() => {
                    if(WavesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 90, Draw.canvas.height / 2));
                }, 10000);

                setTimeout(() => {
                    if(WavesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 95, Draw.canvas.height / 2));
                }, 12000);
                
                setTimeout(() => {
                    if(WavesState.isWaveStarted)
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 0;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    //collector1.improveToWoodArmor();
                    //collector1.improveToVacuum();
                    Units.all.push(collector1);

                    
                    setTimeout(() => {
                        collector1.applyDamage(20);
                    }, 3000);
                }, 300);
            }
        },

        
        {
            key: "Золотособиратель - воскрешение+ монеты",
            code: () => {
                
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 0;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;


                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    //collector1.improveToWoodArmor();
                    Units.all.push(collector1);

                    
                    setTimeout(() => {
                        collector1.applyDamage(20);
                    }, 3000);
                }, 300);

                setTimeout(() => {
                    Coins.all.push(new Coin(Draw.canvas.width / 2 + 100, Draw.canvas.height / 2));
                }, 5000);

                setTimeout(() => {
                    Coins.all.push(new Coin(Draw.canvas.width / 2 - 50, Draw.canvas.height / 2));
                }, 5000);
            }
        },

        
        {
            key: "Золотособиратель - распределение при сборе",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                collector1.loadedResourcesAfterBuild();
                Units.all.push(collector1);

                var collector2 = new Collector(Draw.canvas.width / 2 - 100, y);
                collector2.loadedResourcesAfterBuild();
                collector2.goalX = Draw.canvas.width / 2 + 150;
                Units.all.push(collector2);

                //first coin
                setTimeout(() => {
                    if(WavesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2, Draw.canvas.height / 2));
                }, 1000);
                setTimeout(() => {
                    if(WavesState.isWaveStarted)
                        Coins.all.push(new Coin(Draw.canvas.width / 2 + 10, Draw.canvas.height / 2));
                }, 2000);

                setTimeout(() => {
                    if(WavesState.isWaveStarted){
                        Coins.all.push(new Coin(Draw.canvas.width / 2 - 100, Draw.canvas.height / 2));
                        Coins.all.push(new Coin(Draw.canvas.width / 2 + 100, Draw.canvas.height / 2));
                    }
                }, 7000);
            }
        },

        {
            key: "Золотособиратель - Авто появление множественное + проверка на лимит покупки",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                var countMax = Collector.shopItem.maxCount - 1;
                var count = 0;
                var create = () => {
                    setTimeout(() => {
                        Game.buyThing(Collector.shopItem);
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
            key: "Золотособиратель - пылесос",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Gamer.coins = 1500;

                /*Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];*/
                    
                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 144, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    //Units.all.push(miner3);
                }, 300);

                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX, y);
                    collector1.loadedResourcesAfterBuild();
                    collector1.improveToVacuum();
                    collector1.improveToWoodArmor();
                    Units.all.push(collector1);
                }, 300);

                var barricade1 = new Barricade(200);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var barricade2 = new Barricade(1600);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
            }
        },

        
        {
            key: "Золотособиратель - пылесос-машина",
            code: () => {
                Gamer.coins = 1500;
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 0;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 10, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 1, 10, 0)
                    ]];
                FlyEarth.loadSeparateCrystals();

                setTimeout(() => {
                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 144, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    //miner3.improveToGoldPick();
                    //miner3.improveToDiamondPick();
                    Units.all.push(miner3);
                }, 300);

                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX, y);
                    collector1.loadedResourcesAfterBuild();
                    collector1.improveToVacuum();
                    collector1.improveToVacuumCar();
                    //collector1.improveToWoodArmor();
                    Units.all.push(collector1);
                }, 300);

                var barricade1 = new Barricade(200);
                barricade1.loadedResourcesAfterBuild();
                barricade1.impoveToIron();
                Buildings.all.push(barricade1);

                var barricade2 = new Barricade(1600);
                barricade2.loadedResourcesAfterBuild();
                barricade2.impoveToIron();
                Buildings.all.push(barricade2);
            }
        },

        
        {
            key: "Золотособиратель - пылесос-машина - окончание волны без монеты",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 1, 10, 0)
                    ]];

                var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                var collector1 = new Collector(Draw.canvas.width / 2 - 150, y);
                collector1.loadedResourcesAfterBuild();
                collector1.improveToVacuum();
                collector1.improveToVacuumCar();
                Units.all.push(collector1);


                //first coin
                setTimeout(() => {
                    //Coins.all.push(new Coin(Draw.canvas.width / 2 + 100, Draw.canvas.height / 2));
                    Coins.all.push(new Coin(Draw.canvas.width / 2 - 10, Draw.canvas.height / 2));
                }, 3500);

                //first coin
                setTimeout(() => {
                    Monsters.all.forEach(x => x.health = -1);
                }, 3000);
            }
        },

        
        {
            key: "Золотособиратель - пылесос-машина - воскрешение",
            code: () => {
                
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 0;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 1, 10, 0)
                    ]];


                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    collector1.improveToVacuum();
                    collector1.improveToVacuumCar();
                    collector1.improveToWoodArmor();
                    Units.all.push(collector1);

                    var collector2 = new Collector(Buildings.flyEarth.centerX - 50, y);
                    collector2.loadedResourcesAfterBuild();
                    collector2.improveToWoodArmor();
                    Units.all.push(collector2);
                    

                    var collector3 = new Collector(Buildings.flyEarth.centerX + 50, y);
                    collector3.loadedResourcesAfterBuild();
                    collector3.improveToVacuum();
                    collector3.improveToWoodArmor();
                    Units.all.push(collector3);

                    var y = Buildings.flyEarth.centerY - 80;
                    var miner3 = new Miner(Buildings.flyEarth.centerX - 115, y, y + Miner.imageHeight);
                    miner3.loadedResourcesAfterBuild();
                    miner3.improveToGoldPick();
                    Units.all.push(miner3);
                    
                    var y = Buildings.flyEarth.centerY - 90;
                    var miner1 = new Miner(Buildings.flyEarth.centerX + 20, y, y + Miner.imageHeight);
                    miner1.loadedResourcesAfterBuild();
                    miner1.improveToGoldPick();
                    miner1.improveToDiamondPick();
                    Units.all.push(miner1);

                    var y = Buildings.flyEarth.centerY - 70;
                    var miner2 = new Miner(Buildings.flyEarth.centerX - 35, y, y + Miner.imageHeight);
                    miner2.loadedResourcesAfterBuild();
                    Units.all.push(miner2);

                    setTimeout(() => {
                        collector1.x += 40;
                        collector2.x += 40;
                        collector3.x += 40;
                        miner1.x += 40;
                        miner2.x += 40;
                        miner3.x += 40;
                    }, 2800);

                    setTimeout(() => {
                        collector1.applyDamage(20);
                        collector2.applyDamage(20);
                        collector3.applyDamage(20);

                        miner1.applyDamage(20);
                        miner2.applyDamage(20);
                        miner3.applyDamage(20);
                    }, 3000);
                }, 300);
            }
        },
        
        /*{
            key: "Золотособиратель - гибель",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 15, 10, 0)
                    ]];

                setTimeout(() => {
                    var y = Draw.canvas.height - Draw.bottomShiftBorder - Collector.imageHeight - 75;
                    var collector1 = new Collector(Buildings.flyEarth.centerX - 250, y);
                    collector1.loadedResourcesAfterBuild();
                    Units.all.push(collector1);

                        setTimeout(() => {
                            collector1.applyDamage(4);
                        }, 3000);
                }, 300);
            }
        },*/

        
        /*{
            key: "Панель магии - добавление панелей",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 0;
                Gamer.coins = 775;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                Panels.addNewPanel();
                setTimeout(() => {
                    Panels.addNewPanel();
                    
                    setTimeout(() => {
                        Panels.addNewPanel();
                    }, 3000);
                }, 3000);
            }
        },*/

        {
            key: "Панель магии - с метеором",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                /*Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Boar.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 1, 1, 0)
                    ]];*/
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 0;
                Gamer.coins = 22775;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                Game.buyThing(Meteor.shopItem);
            }
        },

        {
            key: "Панель магии - 2 уровня",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 0;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;
                Gamer.coins = 22775;

                Game.buyThing(Meteor.shopItem);
                setTimeout(() => {
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                }, 3000)
            }
        },

        {
            key: "Панель магии - 3 уровня",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 0;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;
                Gamer.coins = 22775;

                Game.buyThing(Meteor.shopItem);
                setTimeout(() => {
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    setTimeout(() => {
                        Game.buyThing(Meteor.shopItem);
                        Game.buyThing(Meteor.shopItem);
                        Game.buyThing(Meteor.shopItem);
                        Game.buyThing(Meteor.shopItem);
                        Game.buyThing(Meteor.shopItem);
                        Game.buyThing(Meteor.shopItem);
                        Game.buyThing(Meteor.shopItem);
                        Game.buyThing(Meteor.shopItem);
                        Game.buyThing(Meteor.shopItem);
                        Game.buyThing(Meteor.shopItem);
                    }, 3000)
                }, 3000)
            }
        },
        {
            key: "Метеор - радиус урона",
            code: () => {
                Game.buyThing(Meteor.shopItem);

                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Boar.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 15, 10, 0)
                    ]];

                setTimeout(() => {
                    for(let x = 10; x < 1900; x += 100){
                        Monsters.all.push(new Zombie(x, 780, x < Buildings.flyEarth.centerX, 1));
                        Monsters.all.push(new Bat(x, 280, x < Buildings.flyEarth.centerX, 1));
                        Monsters.all.push(new Bat(x + 50, 380, x + 50 < Buildings.flyEarth.centerX, 1));
                    }
                    var minotaur = new Minotaur(400, 380, 400 < Buildings.flyEarth.centerX, 1);
                    minotaur.health = 1;
                    Monsters.all.push(minotaur);
                    var minotaur2 = new Minotaur(1400, 380, 1400 < Buildings.flyEarth.centerX, 1);
                    minotaur2.health = 1;
                    //Monsters.all.push(minotaur2);
                    Monsters.all.forEach(x => x.testNumber = 555);
                }, 200);

            }
        },

        {
            key: "Метеор",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.waveCurrent = 2;
                AudioSystem.isEnabled = true;


                var barricade1 = new Barricade(700);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower2 = new Tower(1100);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
                
                var barricade2 = new Barricade(1200);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                Game.buyThing(Meteor.shopItem);
            }
        },

        {
            key: "Метеор с камнями - конец волны",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Gamer.coins = 100;
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.waveCurrent = 1;
                Waves.all = [
                    [ //1-я волна
                        new WaveData(Zombie.name, 1, 60, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 1, 10, 0)
                    ],
                    [ //2-я волна
                        new WaveData(Zombie.name, 1, 10, 0)
                    ]];
                AudioSystem.isEnabled = true;


                var barricade1 = new Barricade(700);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower2 = new Tower(1100);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
                
                var barricade2 = new Barricade(1200);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                Game.buyThing(Meteor.shopItem);
                setTimeout(() => {
                    (Panels.all[0] as Meteor).improveToPileStones();
                }, 2000);
            }
        },

        {
            key: "Метеор - Big",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                Waves.waveCurrent = 1;
                Gamer.coins = 2000;
                AudioSystem.isEnabled = true;


                var barricade1 = new Barricade(700);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower2 = new Tower(1100);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
                
                var barricade2 = new Barricade(1200);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                Game.buyThing(Meteor.shopItem);
                setTimeout(() => {
                    var meteor = Panels.all[0] as Meteor
                    meteor.improveToPileStones();
                    var damageImprovming = meteor.infoItems.find(x => x.id == Meteor.DAMAGE_PARAMETER);
                    if (damageImprovming){
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                        damageImprovming.improve();
                    }
                }, 2000);
            }
        },

        {
            key: "огненная мышь - атака",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();

                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                /*Waves.all = [ //монстры на волнах
                    [ //1-я волна
                        new WaveData(Boar.name, 1, 1, 6)
                    ],
                    [ //2-я волна
                        new WaveData(Boar.name, 1, 1, 0)
                    ]];*/

                FireCursorModifier.init();
                setTimeout(() => {
                    Game.buyThing(FireCursorModifier.shopItem);
                }, 1000);

                var zombie = new Zombie(800, 780, true, 1);
                Monsters.all.push(zombie);
            }
        },

        {
            key: "Success End",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.all[Waves.all.length - 1] = [new WaveData(Boar.name, 1, 1, 0)];
                Waves.waveCurrent = Waves.all.length - 1;
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = true;

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var barricade2 = new Barricade(1200);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
                
                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var tower2 = new Tower(1100);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);

                setTimeout(() => {
                    Game.buyThing(Collector.shopItem);
                    Game.buyThing(Miner.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(FireCursorModifier.shopItem);
                }, 100);
            
                setTimeout(() => {
                    Monsters.all[0].applyDamage(1000);
                }, 1000);
            }
        },

        {
            key: "Ручной ремонт + disabled ремонт для второго строения + нет кнопок ремонта/апгрейда у земли и каната",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
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
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = true;
                Waves.all[0] = [new WaveData(Zombie.name, 1, 30, 0)];

                Game.buyThing(Meteor.shopItem);

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
            key: "Магазин (постройка и улучшение) после 1й волны",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 0;
                Gamer.coins = 80;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;
            }
        },

        {
            key: "Магазин (постройка и улучшение) после 2й волны",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 1;
                var coins = 150;
                Gamer.coins = coins;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var barricade2 = new Barricade(1200);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);

                setTimeout(() => {
                    Game.buyThing(Collector.shopItem);
                    Gamer.coins = coins;
                }, 100);
            }
        },

        {
            key: "Магазин (постройка и улучшение) после 3й волны",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 2;
                var coins = 250;
                Gamer.coins = coins; //pre закупка
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var barricade2 = new Barricade(1200);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
                
                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var tower2 = new Tower(1100);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
                Gamer.coins = coins;

                setTimeout(() => {
                    Game.buyThing(Collector.shopItem);
                    Game.buyThing(Miner.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(FireCursorModifier.shopItem);
                    Gamer.coins = coins;
                    
                    setTimeout(() =>{
                        var collector1 = Units.all.find(x => x.name == Collector.name);
                        if (collector1){
                            (collector1 as Collector).improveToVacuum();
                            Gamer.coins = coins;
                        }
                    }, 1500);
                }, 100);
            }
        },

        {
            key: "Магазин (постройка и улучшение) после 4й волны",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 3;
                var coins = 720;
                Gamer.coins = coins; //pre закупка
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var barricade2 = new Barricade(1200);
                barricade2.loadedResourcesAfterBuild();
                Buildings.all.push(barricade2);
                
                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var tower2 = new Tower(1100);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
                Gamer.coins = coins;

                setTimeout(() => {
                    Game.buyThing(Collector.shopItem);
                    Game.buyThing(Miner.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(FireCursorModifier.shopItem);
                    Gamer.coins = coins;

                    setTimeout(() =>{
                        var collector1 = Units.all.find(x => x.name == Collector.name);
                        if (collector1){
                            (collector1 as Collector).improveToVacuum();
                            (collector1 as Collector).improveToVacuumCar();
                            Gamer.coins = coins;
                        }

                        var miner1 = Units.all.find(x => x.name == Miner.name);
                        if (miner1){
                            (miner1 as Miner).improveToWoodArmor();
                            (miner1 as Miner).improveToSelfDefense();
                            (miner1 as Miner).improveToGoldPick();
                            Gamer.coins = coins;
                        }

                        
                        setTimeout(() =>{
                            var meteor = Panels.all[0] as Meteor;
                            if (meteor){
                                meteor.improveToPileStones();
                                Gamer.coins = coins;
                            }

                            var fireCursorModifier = Cursor.allModifiers[0] as FireCursorModifier;
                            if(fireCursorModifier){
                                var damageInfo = fireCursorModifier.infoItems.find(x => x.id == FireCursorModifier.FIRE_DAMAGE_MIN_PARAMETER);
                                if(damageInfo){
                                    damageInfo.improve();
                                    damageInfo.improve();
                                    damageInfo.improve();
                                    Gamer.coins = coins;
                                }
                            }
                        }, 1000);

                    }, 1000);

                }, 100);
            }
        },

        {
            key: "Магазин (постройка и улучшение) после 5й волны",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 4;
                var coins = 720;
                Gamer.coins = coins; //pre закупка
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                barricade1.impoveToIron();
                Buildings.all.push(barricade1);

                var barricade2 = new Barricade(1200);
                barricade2.loadedResourcesAfterBuild();
                barricade2.impoveToIron();
                Buildings.all.push(barricade2);
                
                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                var tower2 = new Tower(1100);
                tower2.loadedResourcesAfterBuild();
                Buildings.all.push(tower2);
                Gamer.coins = coins;

                setTimeout(() => {
                    Game.buyThing(Collector.shopItem);
                    Game.buyThing(Miner.shopItem);
                    Game.buyThing(Meteor.shopItem);
                    Game.buyThing(FireCursorModifier.shopItem);
                    Gamer.coins = coins;

                    setTimeout(() =>{
                        var collector1 = Units.all.find(x => x.name == Collector.name);
                        if (collector1){
                            (collector1 as Collector).improveToVacuum();
                            (collector1 as Collector).improveToVacuumCar();
                            Gamer.coins = coins;
                        }

                        var miner1 = Units.all.find(x => x.name == Miner.name);
                        if (miner1){
                            (miner1 as Miner).improveToWoodArmor();
                            (miner1 as Miner).improveToSelfDefense();
                            (miner1 as Miner).improveToGoldPick();
                            Gamer.coins = coins;
                        }

                        
                        setTimeout(() =>{
                            var meteor = Panels.all[0] as Meteor;
                            if (meteor){
                                meteor.improveToPileStones();
                                Gamer.coins = coins;
                            }

                            var fireCursorModifier = Cursor.allModifiers[0] as FireCursorModifier;
                            if (fireCursorModifier){
                                var damageInfo = fireCursorModifier.infoItems.find(x => x.id == FireCursorModifier.FIRE_DAMAGE_MIN_PARAMETER);
                                if(damageInfo){
                                    damageInfo.improve();
                                    damageInfo.improve();
                                    damageInfo.improve();
                                    Gamer.coins = coins;
                                }
                            }
                        }, 1000);

                    }, 1000);

                }, 100);
            }
        },

        {
            key: "Магазин (постройка и улучшение) ",
            code: () => {
                AudioSystem.isEnabled = false;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                WavesState.delayEndLeftTimeMs = WavesState.delayStartLeftTimeMs = 0;
                WavesState.isWaveStarted = false;
                Waves.waveCurrent = 0;
                Gamer.coins = 4080;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;
            }
        },
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
                <a className='test-page__button-prev noselect' href={'/test.html?v=' + (variant - 1)}>Prev test</a>
                <a className='test-page__button-all noselect' href={'/test.html'}>all</a>
                <a className='test-page__button-next noselect' href={'/test.html?v=' + (variant + 1)}>Next test</a>
            </div>;
        }

        return <div className='test-page'>
            <div className='test-page__list'>
                <div className='test-page__header-list-tests'>Список тестов:</div>
                {this.listOfTests.map((test, i) => {
                    return <div key={i}><a className='test-page__link-test' href={'/test.html?v=' + (i + 1)}>{test.key}</a></div>
                })}
            </div>
        </div>;
    }
}

export default TestPage;