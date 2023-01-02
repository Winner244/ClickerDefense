import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as MenuStore from '../Menu/MenuStore';
import * as ShopStore from './ShopStore';

import { App } from '../../App';

import './Shop.scss';

import {Mouse} from '../../../gameApp/gamer/Mouse';
import {Gamer} from '../../../gameApp/gamer/Gamer';

import {Game} from '../../../gameApp/gameSystems/Game';
import {AudioSystem} from '../../../gameApp/gameSystems/AudioSystem';

import ShopItem from '../../../models/ShopItem';

import {ShopCategoryEnum, ShopCategory} from '../../../enum/ShopCategoryEnum';

import CoinImage from '../../../assets/img/coin.png';
import CategoryMagicImage from '../../../assets/img/shop/shop-category-main/magic.png';
import CategoryBuldingImage from '../../../assets/img/shop/shop-category-main/tower.png';
import CategoryUnitImage from '../../../assets/img/shop/shop-category-main/unit.png';

import SelectingSoundUrl from '../../../assets/sounds/menu/selecting.mp3'; 

interface Prop {
  isOpen?: boolean
}

type Props =
  ShopStore.ShopState
  & ShopStore.ShopAction
  & Prop;

export class Shop extends React.Component<Props, {}> {

  static show(): void{
    App.Store.dispatch(ShopStore.actionCreators.open());
    App.Store.dispatch(MenuStore.actionCreators.hideOutsideButtons());
    AudioSystem.load(SelectingSoundUrl);
  }

  static hide(): void{
    Game.isBlockMouseLogic = false;
    App.Store.dispatch(ShopStore.actionCreators.close());
    App.Store.dispatch(MenuStore.actionCreators.displayOutsideButtons());
  }

  private static playSoundSelect(){
		AudioSystem.play(Mouse.x, SelectingSoundUrl, 0.1);
  }

  onKey(event: KeyboardEvent){
    if(!this.props.isOpen){
      return;
    }


    switch (event.key){
      case 'Enter':
        break;

      case 'ArrowUp':
        break;

      case 'ArrowDown':
        break;
    }
  }

  componentDidMount() {
		document.addEventListener('keydown', this.onKey.bind(this));
  } 
  
  componentWillUnmount() {
		document.removeEventListener('keydown', this.onKey.bind(this));
  }

  onClickClose(){
    Shop.playSoundSelect();
    Shop.hide();
    Game.continue();
  }

  onClickSelectCategory(category: string){
    Shop.playSoundSelect();
    this.props.selectCategory(category);
  }

  onClickSelectItem(itemName: string){
    Shop.playSoundSelect();
    this.props.selectItem(itemName);
  }

  onClickBuyItem(item: ShopItem){
    Shop.playSoundSelect();
    Shop.hide();
    Game.buyThing(item);
  }

  render() {
    if(!this.props.isOpen){
      return null;
    }

    let items: ShopItem[] = this.props.selectedCategory == ShopCategoryEnum.ALL 
      ? Object.values(this.props.items).flat()
      : this.props.items[this.props.selectedCategory]

    return (
      <div className="shop noselect" id="shop">
        <div className="shop__body">
            <div className="shop__title">Магазин</div>
            <div className="shop__close" onClick={() => this.onClickClose()}>
                <div className="shop__close-body">x</div>
            </div>
            <div className="shop__categories">
                <img 
                  className={"shop__category nodrag " + (this.props.selectedCategory == ShopCategoryEnum.MAGIC ? 'shop__category-active' : '')} 
                  src={CategoryMagicImage} 
                  onClick={() => this.onClickSelectCategory(ShopCategoryEnum.MAGIC)}/>
                <img 
                  className={"shop__category nodrag " + (this.props.selectedCategory == ShopCategoryEnum.BUILDINGS ? 'shop__category-active' : '')} 
                  src={CategoryBuldingImage} 
                  onClick={() => this.onClickSelectCategory(ShopCategoryEnum.BUILDINGS)}/>
                <img 
                  className={"shop__category nodrag " + (this.props.selectedCategory == ShopCategoryEnum.UNITS ? 'shop__category-active' : '')} 
                  src={CategoryUnitImage} 
                  onClick={() => this.onClickSelectCategory(ShopCategoryEnum.UNITS)}/>
            </div>
            <div className="shop__container">
                <div className={`shop__items-container shop__items-container--background-${this.props.selectedCategory || 'common'}`}>
                    <div className="shop__items-container-body">
                        <div className="shop__category-title">{ShopCategory.GetLabel(this.props.selectedCategory)}</div>

                        {items.map(item => (
                          <div className={"shop__item " + (this.props.selectedItemNames.includes(item.name) ? 'shop__item--info ' : '')} key={item.name}>
                              <div className="shop__item-img-container" onClick={() => this.onClickSelectItem(item.name)}>
                                  <div className="shop__item-img nodrag" style={{backgroundImage: `url(${item.image.src})`}} />
                                  <div className="shop__item-info">
                                      <p>{item.description}</p>
                                  </div>
                              </div>
                              <div className="shop__item-title">{item.name}</div>
                              <button 
                                className={"shop__item-button " + (item.price > Gamer.coins ? 'shop__item-button--disabled' : '')} 
                                onClick={() => item.price > Gamer.coins
                                  ? () => {} 
                                  : this.onClickBuyItem(item)}
                              >
                                Купить {item.price}
                                <img className='nodrag' src={CoinImage}/>
                              </button>
                          </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
  }
}
	
// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState, ownProps: Prop) => {
      return { ...state.shop, ...ownProps };
  },
  ShopStore.actionCreators
)(Shop);
