import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as MenuStore from './MenuStore';

import { App } from '../../App';
import { Shop } from '../Shop/Shop';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Waves} from '../../../gameApp/gameSystems/Waves';

import './Menu.scss';

import SelectingSoundUrl from '../../../assets/sounds/menu/selecting.mp3'; 
import { Settings } from '../../../gameApp/Settings';

interface Prop {
  isOpen?: boolean
}

type Props =
  MenuStore.MenuState
  & MenuStore.MenuAction
  & Prop;

export class Menu extends React.Component<Props, {}> {

  static displayNewWaveButton():void{
    App.Store.dispatch(MenuStore.actionCreators.displayNewWaveButton());
  }

  static displayShopButton(): void{
    App.Store.dispatch(MenuStore.actionCreators.displayShopButton());
  }

  static showStartMenu(): void{
    App.Store.dispatch(MenuStore.actionCreators.openStartMenu());
  }

  static show(): void{
    Menu.playSoundSelect();
    App.Store.dispatch(MenuStore.actionCreators.open());
  }
  static hide(): void{
    Menu.playSoundSelect();
    Game.isBlockMouseLogic = false;
    App.Store.dispatch(MenuStore.actionCreators.close());
  }

  static soundSelectBuffer: AudioBuffer;

  private static playSoundSelect(){
    if(Menu.soundSelectBuffer){
      console.log('repeat');
        var context = new AudioContext();
        var source = context.createBufferSource();
        source.buffer = Menu.soundSelectBuffer;
        source.connect(context.destination);
        source.start(0); 
        console.log('start 2');
        return;
    }

    console.log('load new audio');
    var context = new AudioContext();
    var request = new XMLHttpRequest();
    request.open('GET', SelectingSoundUrl, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        console.log('uploaded audio data', request);
        context.decodeAudioData(request.response, function(buffer) {
          console.log('decoded audio data', request);
            Menu.soundSelectBuffer = buffer;
            var source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0); 
            console.log('start 1');
        }, function(err) { console.log('error of decoding', err); });
    };
    request.send();
  }

  private static playSoundSelect2(){
    var id = "selectingSound1";
    var selectingSound: HTMLAudioElement = document.getElementById(id) as HTMLAudioElement;
    if(!selectingSound){
      selectingSound = new Audio(SelectingSoundUrl);
      selectingSound.volume = 0.2 * Settings.soundVolume;
      selectingSound.id = id;
      selectingSound.play();
      document.getElementsByTagName('body')[0].appendChild(selectingSound);
    }
    else{
      selectingSound.play();
    }
  }

  onClickNewGame(){
    Menu.playSoundSelect();
    this.props.startGame();
    Game.startNew();
  }

  onClickShow(){
    Game.pause();
  }

  onClickContinue(){
    Menu.playSoundSelect();
    this.props.close();
    Game.continue();
  }

  onClickStartNewWave(){
    Game.startNewWave();
    this.props.hideShopButton();
    this.props.hideNewWaveButton();
    this.props.close();
  }

  onClickShopOpen(){
    Game.pause();
    Waves.delayEndTimeLeft = 0;
    this.props.close();
    Shop.show();
  }

  onMouseEnterInOutsideButtons(){
    Game.isBlockMouseLogic = true;
  }
  onMouseOutFromOutsideButtons(){
    Game.isBlockMouseLogic = false;
  }

  render() {
    return (
      <div>
        {this.props.isDisplayOutsideButtonMenu
          ? <button className="menu__button-outside-open noselect"
                    id="menu-button-outside-open"
                    onClick={() => this.onClickShow()}
                    onMouseEnter={() => this.onMouseEnterInOutsideButtons()}
                    onMouseOut={() => this.onMouseOutFromOutsideButtons()}
            >
              Меню
            </button>
          : null
        }
        
        {this.props.isDisplayOutsideButtonShop
          ? <button className="menu__button-outside-shop noselect"
                    id="menu-button-outside-shop"
                    onClick={() => this.onClickShopOpen()}
                    onMouseEnter={() => this.onMouseEnterInOutsideButtons()}
                    onMouseOut={() => this.onMouseOutFromOutsideButtons()}
            >
              Магазин
            </button>
          : null
        }

        {this.props.isDisplayNewWaveOutsideButton
          ? <button className="menu__button-outside-new-wave noselect"
                    id="menu-button-outside-new-wave"
                    onClick={() => this.onClickStartNewWave()}
                    onMouseEnter={() => this.onMouseEnterInOutsideButtons()}
                    onMouseOut={() => this.onMouseOutFromOutsideButtons()}
            >
              Новая волна
            </button>
          : null
        }

        {this.props.isOpen
          ? <div className="menu noselect">
              <div className="menu__body">
                  <div className="menu__title">Меню</div>
                  <div className="menu__close" onClick={() => this.onClickContinue()}>
                      <div className="menu__close-body">x</div>
                  </div>

                  <button className="menu__button" onClick={() => this.onClickNewGame()}>Новая игра</button>

                  {this.props.isDisplayButtonContinueGame 
                    ? <button className="menu__button" onClick={() => this.onClickContinue()}>Продолжить</button>
                    : null
                  }

                  {this.props.isDisplayNewWaveButton
                    ? <button className="menu__button menu__button-new-wave" onClick={() => this.onClickStartNewWave()}>Новая волна</button>
                    : null
                  }
                  
                  {this.props.isDisplayButtonShop
                    ? <button className="menu__button" onClick={() => this.onClickShopOpen()}>Магазин</button>
                    : null
                  }
              </div>
            </div>
          : null
        }
      </div>);
  }
}
	
// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState, ownProps: Prop) => {
      return { ...state.menu, ...ownProps };
  },
  MenuStore.actionCreators
)(Menu);
