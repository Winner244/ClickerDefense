import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as MenuStore from '../Menu/MenuStore';
import * as ShopStore from './ShopStore';

import { App } from '../../App';

import './Shop.scss';

import {ShopCategoryEnum, ShopCategory} from '../../../enum/ShopCategoryEnum';

import CoinImage from '../../../assets/img/coin.png';
import CategoryMagicImage from '../../../assets/img/shop/shop-category-main/magic.png';
import CategoryBuldingImage from '../../../assets/img/shop/shop-category-main/tower.png';
import CategoryUnitImage from '../../../assets/img/shop/shop-category-main/unit.png';
import { Game } from '../../../gameApp/gameSystems/Game';
import ShopItem from '../../../models/ShopItem';
import { Gamer } from '../../../gameApp/gameObjects/Gamer';


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
  }

  static hide(): void{
    App.Store.dispatch(ShopStore.actionCreators.close());
    App.Store.dispatch(MenuStore.actionCreators.displayShop());
  }

  onClickClose(){
    this.props.close();
    App.Store.dispatch(MenuStore.actionCreators.displayShop());
    Game.continue();
  }

  onClickSelectCategory(category: string){
    this.props.selectCategory(category);
  }

  onClickSelectItem(itemName: string){
    this.props.selectItem(itemName);
  }

  onClickBuyItem(item: ShopItem){
    this.props.close();
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
                  className={"shop__category " + (this.props.selectedCategory == ShopCategoryEnum.MAGIC ? 'shop__category-active' : '')} 
                  src={CategoryMagicImage} 
                  onClick={() => this.onClickSelectCategory(ShopCategoryEnum.MAGIC)}/>
                <img 
                  className={"shop__category " + (this.props.selectedCategory == ShopCategoryEnum.BUILDINGS ? 'shop__category-active' : '')} 
                  src={CategoryBuldingImage} 
                  onClick={() => this.onClickSelectCategory(ShopCategoryEnum.BUILDINGS)}/>
                <img 
                  className={"shop__category " + (this.props.selectedCategory == ShopCategoryEnum.UNITS ? 'shop__category-active' : '')} 
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
                                  <img className="shop__item-img" src={item.image.src} />
                                  <div className="shop__item-info">
                                      <p>{item.description}</p>
                                  </div>
                              </div>
                              <div className="shop__item-title">{item.name}</div>
                              <button 
                                className={"shop__item-button " + (item.price > Gamer.coins ? 'shop__item-button--disabled' : '')} 
                                onClick={() => this.onClickBuyItem(item)}
                              >
                                Купить {item.price}
                                <img src={CoinImage}/>
                              </button>
                          </div>
                        ))}

                        <div className="clear"></div>
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
