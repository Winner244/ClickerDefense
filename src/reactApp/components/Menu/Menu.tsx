import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as MenuStore from './MenuStore';

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

  static show(isShowButtonContinueGame: boolean = false): void{
    App.Store.dispatch(MenuStore.actionCreators.open(isShowButtonContinueGame));
  }

  static hide(): void{
    App.Store.dispatch(MenuStore.actionCreators.close());
  }

  onClickNewGame(){
    this.props.startGame();
  }

  render() {
    return (
      <div>
        {this.props.isDisplayOutsideButtonMenu
          ? <button className="menu__button-open noselect" id="menu-button-outside-open" onClick={() => Game.pause()}>Меню</button>
          : null
        }
        
        {this.props.isDisplayOutsideButtonShop
          ? <button className="menu__button-shop noselect" id="menu-button-outside-shop" onClick={() => Shop.show()}>Магазин</button>
          : null
        }

        {this.props.isOpen
          ? <div className="menu noselect">
              <div className="menu__body">
                  <div className="menu__title">Меню</div>

                  <button className="menu__button" onClick={() => this.onClickNewGame()}>Новая игра</button>

                  {this.props.isDisplayButtonContinueGame 
                    ? <button className="menu__button">Продолжить</button>
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
