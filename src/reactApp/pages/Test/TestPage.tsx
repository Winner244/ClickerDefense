import * as React from 'react';

import { App } from '../../App';
import * as MenuStore from '../../components/Menu/MenuStore';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Buildings} from '../../../gameApp/buildings/Buildings';
import {Tower} from '../../../gameApp/buildings/Tower';
import {Waves} from '../../../gameApp/gameSystems/Waves';
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

import './TestPage.scss';
import { ImageHandler } from '../../../gameApp/ImageHandler';
import { AudioSystem } from '../../../gameApp/gameSystems/AudioSystem';
import { FireModifier } from '../../../gameApp/modifiers/FireModifier';
import { FlyEarth } from '../../../gameApp/buildings/FlyEarth';
import { Necromancer } from '../../../gameApp/monsters/Necromancer';

class TestPage extends React.Component {
    text: string = "";

    listOfTests = [
        {
            key: "Разрушение строений", 
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                
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
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
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
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.isStarted = false;
                Gamer.coins = 12;
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

            }
        },

        {
            key: "Кнопки управления зданиями появляются только после окончания волны",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Gamer.coins = 500;
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.isStarted = true;
                Waves.all[0][Zombie.name] = new WaveData(1, 30, 0);

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
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.isStarted = false;
                Gamer.coins = 1500;
                Menu.displayShopButton();
                Menu.displayNewWaveButton();
                AudioSystem.isEnabled = true;
            }
        },

        {
            key: "Кабан - Спец способность + отмена при получении урона",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Boar.name]: new WaveData(1, 60, 6)
                    },
                    { //2-я волна
                        [Boar.name]: new WaveData(15, 10, 0)
                    }];

                var boar = new Boar(50, 780, true, 1, true);
                boar.health--;
                Monsters.all.push(boar);

                var boar2 = new Boar(1850, 780, false, 1, true);
                boar2.health--;
            // Monsters.all.push(boar2);
        }
    },

    {
        key: "Кабан - передача импульса от спец способности кабана к башне (слева)",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Boar.name]: new WaveData(1, 60, 6)
                    },
                    { //2-я волна
                        [Boar.name]: new WaveData(15, 10, 0)
                    }];

                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                this.waitLoadingImage(Boar.imageHandler, () => {
                    var boar = new Boar(50, 780, true, 1, true);
                    boar.health--;
                    Monsters.all.push(boar);
                });
            }
        },

        {
            key: "Кабан - передача импульса от спец способности кабана к башне (справа)",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Boar.name]: new WaveData(1, 60, 6)
                    },
                    { //2-я волна
                        [Boar.name]: new WaveData(15, 10, 0)
                    }];

                var tower1 = new Tower(1100);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                this.waitLoadingImage(Boar.imageHandler, () => {
                    var boar2 = new Boar(1850, 780, false, 1, true);
                    boar2.health--;
                    Monsters.all.push(boar2);
                });
            }
        },

        {
            key: "Кабан - расстояние срабатывания Спец способности",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Boar.name]: new WaveData(1, 60, 6)
                    },
                    { //2-я волна
                        [Boar.name]: new WaveData(15, 10, 0)
                    }];

                for(var i = 0; i < 10; i++){
                    var boar = new Boar(0, 780, true, 1, true);
                    boar.health--;
                    Monsters.all.push(boar);
                }

                Buildings.all.forEach(x => x.healthMax = x.health = 400);
            }
        },

        {
            key: "Баррикада - возврат урона - зомби",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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

                Waves.isStarted = false;
            }
        },

        {
            key: "Баррикада - возврат урона - спец способность кабанов",
            code: () => { 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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

                Waves.isStarted = false;
            }
        },

        {
            key: "Баррикада - Железная версия",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

                var barricade1 = new Barricade(200);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var necromancer = new Necromancer(0, 780, true, 1);
                Monsters.all.push(necromancer);

                Waves.isStarted = false;
            }
        },

        {
            key: "Башня - несколько лучников",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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

        {
            key: "Башня - огненные + взрывные стрелы",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 1;
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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
                Waves.all[3] = { //3-я волна
                    [Bat.name]: new WaveData(75, 90, 0)
                };
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                //Waves.isStarted = false;


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
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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
            key: "огонь - затухание",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 0;
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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
            }
        },

        {
            key: "огонь - передача",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.waveCurrent = 2;
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

                FireModifier.loadResources();
                
                var zombie = new Zombie(0, 780, true, 1);
                zombie.modifiers.push(new FireModifier(0.5, 15000));
                Monsters.all.push(zombie);

                var boar = new Boar(Draw.canvas.width - 100, 780, false, 1, true);
                boar.modifiers.push(new FireModifier(0.5, 15000));
                Monsters.all.push(boar);

                var bat = new Bat(0, 280, true, 1);
                bat.modifiers.push(new FireModifier(0.5, 15000));
                Monsters.all.push(bat);

                setTimeout(() => {

                    var bat = new Bat(Draw.canvas.width / 2 - FlyEarth.width, Buildings.flyEarth.centerY, true, 1);
                    bat.modifiers.push(new FireModifier(0.5, 15000));
                    Monsters.all.push(bat);


                    var bat2 = new Bat(Draw.canvas.width / 2 + FlyEarth.width, Buildings.flyEarth.centerY, false, 1);
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
            key: "Атака зомби",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
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
            }
        },

        {
            key: "Атака кабана",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Boar.name]: new WaveData(1, 1, 6)
                    },
                    { //2-я волна
                        [Boar.name]: new WaveData(15, 10, 0)
                    }];

                var boar = new Boar(1000, 780, true, 1, true);
                Monsters.all.push(boar);
            }
        },

        {
            key: "Атака летучей мыши",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Boar.name]: new WaveData(1, 1, 6)
                    },
                    { //2-я волна
                        [Boar.name]: new WaveData(15, 10, 0)
                    }];

                var bat = new Bat(650, 380, true, 1);
                Monsters.all.push(bat);
            }
        },

        {
            key: "Атака некроманта - обычная",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Necromancer.name]: new WaveData(1, 1, 6)
                    },
                    { //2-я волна
                        [Necromancer.name]: new WaveData(15, 10, 0)
                    }];

                var necromancer = new Necromancer(600, 780, true, 1);
                Monsters.all.push(necromancer);
            }
        },

        {
            key: "Атака некроманта - спес способность - вызов кислотного дождя",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Necromancer.name]: new WaveData(1, 1, 6)
                    },
                    { //2-я волна
                        [Necromancer.name]: new WaveData(15, 10, 0)
                    }];

                var necromancer = new Necromancer(600, 780, true, 1);
                necromancer.isSpecialAbilityAcidRainCallStarted = true;
                Monsters.all.push(necromancer);
            }
        },

        {
            key: "Атака некроманта - обычная, смена цели",
            code: () => {
                Gamer.coins = 200;
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Necromancer.name]: new WaveData(1, 1, 6)
                    },
                    { //2-я волна
                        [Necromancer.name]: new WaveData(15, 10, 0)
                    }];
                
                var tower1 = new Tower(500);
                tower1.loadedResourcesAfterBuild();
                tower1.health = 1;
                Buildings.all.push(tower1);

                var necromancer = new Necromancer(100, 780, true, 1);
                Monsters.all.push(necromancer);
            }
        },


        {
            key: "Волна 2",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
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
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
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
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.waveCurrent = 3;

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
            key: "Некромант - ходьба",
            code: () => { 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                { 
                    [Necromancer.name]: new WaveData(30, 15, 0)
                }];
            }
        },

        {
            key: "Полёт летучих мышей",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                { 
                    [Bat.name]: new WaveData(30, 60, 0)
                }];

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
            key: "Некромант - расстояние срабатывания атаки",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;
                Waves.all = [ //монстры на волнах
                    { //1-я волна
                        //[Zombie.name]: new WaveData(7, 80, 0),
                        [Necromancer.name]: new WaveData(1, 60, 6)
                    },
                    { //2-я волна
                        [Necromancer.name]: new WaveData(15, 10, 0)
                    }];

                var barricade1 = new Barricade(600);
                barricade1.loadedResourcesAfterBuild();
                Buildings.all.push(barricade1);

                var tower1 = new Tower(700);
                tower1.loadedResourcesAfterBuild();
                Buildings.all.push(tower1);

                for(var i = 0; i < 10; i++){
                    var monster = new Necromancer(0, 780, true, 1);
                    monster.health--;
                    Monsters.all.push(monster);
                }

                for(var i = 0; i < 10; i++){
                    var monster = new Necromancer(1780, 780, false, 1);
                    monster.health--;
                    Monsters.all.push(monster);
                }
                Buildings.all.forEach(x => x.healthMax = x.health = 400);
            }
        },

        {
            key: "Image Handler, loading images, waiting images",
            code: () => { 
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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

                Waves.isStarted = false;
            }
        },

        {
            key: "Game Over - bottom",
            code: () => {
                App.Store.dispatch(MenuStore.actionCreators.startGame());
                Game.startNew();
                    Waves.waveCurrent = 0;
                    Waves.all =[{ 
                    [Zombie.name]: new WaveData(301, 70, 0),
                    [Boar.name]: new WaveData(351, 25, 1)
                }]
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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
                    Waves.all =[{ 
                    [Zombie.name]: new WaveData(301, 70, 0),
                    [Boar.name]: new WaveData(351, 25, 1)
                }]
                Waves.delayEndLeftTimeMs = Waves.delayStartLeftTimeMs = 0;

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

    componentDidMount(){
        //pre load sounds/images
        Buildings.loadResources();
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
        Builder.init(true);
        FlyEarth.loadExplosionResources();

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