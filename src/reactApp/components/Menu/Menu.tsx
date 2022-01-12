import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as MenuStore from './MenuStore';
import * as ShopStore from '../Shop/ShopStore';

import { App } from '../../App';
import { Shop } from '../Shop/Shop';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Waves} from '../../../gameApp/gameSystems/Waves';
import {Builder} from "../../../gameApp/gameSystems/Builder";

import './Menu.scss';

import SelectingSoundUrl from '../../../assets/sounds/menu/selecting.mp3'; 

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
    App.Store.dispatch(MenuStore.actionCreators.open());
  }
  static hide(): void{
    Game.isBlockMouseLogic = false;
    App.Store.dispatch(MenuStore.actionCreators.close());
  }

  private selectSoundPlay(){
    const selectingSound: HTMLAudioElement = new Audio(SelectingSoundUrl);
    selectingSound.volume = 0.2;
    selectingSound.play();
  }

  onClickNewGame(){
    this.selectSoundPlay();
    this.props.startGame();
    Game.startNew();
  }

  onClickShow(){
    this.selectSoundPlay();
    Game.pause();
  }

  onClickContinue(){
    this.selectSoundPlay();
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
    this.selectSoundPlay();
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
