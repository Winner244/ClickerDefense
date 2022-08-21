import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as MenuStore from './MenuStore';

import { App } from '../../App';
import { Shop } from '../Shop/Shop';
import { Upgrade } from '../Upgrade/Upgrade';

import {Game} from '../../../gameApp/gameSystems/Game';
import {Waves} from '../../../gameApp/gameSystems/Waves';
import { AudioSystem } from '../../../gameApp/gameSystems/AudioSystem';

import './Menu.scss';

import SelectingSoundUrl from '../../../assets/sounds/menu/selecting.mp3'; 

interface IState {
  hoverItem: number;
}

interface Prop {
  isOpen?: boolean
}

type Props =
  MenuStore.MenuState
  & MenuStore.MenuAction
  & Prop;

export class Menu extends React.Component<Props, IState> {

  constructor(props: Props) {
    super(props);

    this.state = { 
      hoverItem: -1
    };
  }

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
    Upgrade.hide();
    Menu.playSoundSelect();
    App.Store.dispatch(MenuStore.actionCreators.open());
  }
  static hide(): void{
    Menu.playSoundSelect();
    Game.isBlockMouseLogic = false;
    App.Store.dispatch(MenuStore.actionCreators.close());
  }

  private static playSoundSelect(){
    AudioSystem.play(SelectingSoundUrl, 0.2);
  }

  onKey(event: KeyboardEvent){
    if(!this.props.isOpen){
      return;
    }

    switch (event.key){
      case 'Enter':
        if(!this.props.isDisplayButtonContinueGame){
          this.onClickNewGame();
        }
        else{
          if(this.state.hoverItem >= 0 && this.state.hoverItem < this.countButtons){
            let menu = this.getItemsMenu();
            let hoverItemMenu = menu[this.state.hoverItem];
            hoverItemMenu.props.onClick();
            this.setState({ hoverItem: -1 });
          }
        }
        break;

      case 'ArrowUp':
        let newValue1 =  this.state.hoverItem <= 0 
          ? this.countButtons - 1 
          : this.state.hoverItem - 1;

        this.setState({ hoverItem: newValue1 });
        break;

      case 'ArrowDown':
        let newValue2 =  this.state.hoverItem >= this.countButtons - 1
          ? 0  
          : this.state.hoverItem + 1;
        this.setState({ hoverItem: newValue2 });
        break;
    }
  }

  get countButtons(): number{
    let countButtons = 1 + +this.props.isDisplayButtonContinueGame + +this.props.isDisplayNewWaveButton + +this.props.isDisplayButtonShop;
    return countButtons;
  }

  componentDidMount() {
		document.addEventListener('keydown', this.onKey.bind(this));
  } 
  
  componentWillUnmount() {
		document.removeEventListener('keydown', this.onKey.bind(this));
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

  onMouseEnterInInsideButtons(event: React.MouseEvent<HTMLButtonElement, MouseEvent>){
    let element: HTMLButtonElement = event.target as HTMLButtonElement;
    let index: number = parseInt(element.getAttribute('data-key') || '');
    this.setState({ hoverItem: index });
  }

  getItemsMenu(){
    let i = 0;
    let itemsMenu = [
      <button key={i} data-key={i} className={"menu__button " + (this.state.hoverItem == i++ ? 'menu__button--hover' : '')} onClick={() => this.onClickNewGame()} onMouseEnter={(e) => this.onMouseEnterInInsideButtons(e)}>Новая игра</button>
    ];
    if(this.props.isDisplayButtonContinueGame){
      itemsMenu.push(<button key={i} data-key={i} className={"menu__button " + (this.state.hoverItem == i++ ? 'menu__button--hover' : '')} onClick={() => this.onClickContinue()} onMouseEnter={(e) => this.onMouseEnterInInsideButtons(e)}>Продолжить</button>);
    }
    if(this.props.isDisplayNewWaveButton){
      itemsMenu.push(<button key={i} data-key={i} className={"menu__button menu__button-new-wave " + (this.state.hoverItem == i++ ? 'menu__button--hover menu__button-new-wave--hover' : '')} onClick={() => this.onClickStartNewWave()} onMouseEnter={(e) => this.onMouseEnterInInsideButtons(e)}>Новая волна</button>);
    }
    if(this.props.isDisplayButtonShop){
      itemsMenu.push(<button key={i} data-key={i} className={"menu__button " + (this.state.hoverItem == i++ ? 'menu__button--hover' : '')} onClick={() => this.onClickShopOpen()} onMouseEnter={(e) => this.onMouseEnterInInsideButtons(e)}>Магазин</button>);
    }

    return itemsMenu;
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

                  {this.getItemsMenu()}
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
