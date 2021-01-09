import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as MenuStore from './MenuStore';
import * as GameStore from '../GameDisplay/GameStore';
import {Game} from '../../../gameApp/gameSystems/Game';

import './Menu.scss';
import { App } from '../../App';

interface Prop {
  isOpen?: boolean
}

type Props =
  MenuStore.MenuState
  & MenuStore.MenuAction
  & Prop;

export class Menu extends React.Component<Props, {}> {

  static displayShop(): void{
    App.Store.dispatch(MenuStore.actionCreators.displayShop());
  }

  static hideShop(): void{
    App.Store.dispatch(MenuStore.actionCreators.hideShop());
  }

  static showStartMenu(): void{
    App.Store.dispatch(MenuStore.actionCreators.openStartMenu());
  }

  static show(): void{
    App.Store.dispatch(MenuStore.actionCreators.open());
  }

  static hide(): void{
    App.Store.dispatch(MenuStore.actionCreators.close());
  }

  onClickNewGame(){
    this.props.startGame();
    App.Store.dispatch(GameStore.actionCreators.start());
  }

  onClickShow(){
    Game.pause();
  }

  onClickContinue(){
    Game.continue();
  }

  render() {
    return (
      <div>
        {this.props.isDisplayOutsideButtonMenu
          ? <button className="menu__button-open noselect" id="menu-button-outside-open" onClick={() => this.onClickShow()}>Меню</button>
          : null
        }
        
        {this.props.isDisplayOutsideButtonShop
          ? <button className="menu__button-shop noselect" id="menu-button-outside-shop">Магазин</button>
          : null
        }

        {this.props.isOpen
          ? <div className="menu noselect">
              <div className="menu__body">
                  <div className="menu__title">Меню</div>

                  <button className="menu__button" onClick={() => this.onClickNewGame()}>Новая игра</button>

                  {this.props.isDisplayButtonContinueGame 
                    ? <button className="menu__button" onClick={() => this.onClickContinue()}>Продолжить</button>
                    : null
                  }
                  
                  {this.props.isDisplayButtonShop
                    ? <button className="menu__button">Магазин</button>
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
