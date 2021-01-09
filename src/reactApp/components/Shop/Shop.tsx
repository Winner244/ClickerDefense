import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as MenuStore from '../Menu/MenuStore';
import * as ShopStore from './ShopStore';

import { App } from '../../App';

import './Shop.scss';

import CoinImage from '../../../assets/img/coin.png';
import TempImage from '../../../assets/img/builders/tent.png';
import CategoryMagicImage from '../../../assets/img/shop/shop-category-main/magic.png';
import CategoryBuldingImage from '../../../assets/img/shop/shop-category-main/tower.png';
import CategoryUnitImage from '../../../assets/img/shop/shop-category-main/unit.png';


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
  }

  onClickSelectCategory(categoryId: number){
    this.props.selectCategory(categoryId);
  }

  onClickSelectItem(itemId: number){
    this.props.selectItem(itemId);
  }

  render() {
    if(!this.props.isOpen){
      return null;
    }

    let categoryTitle = '';
    switch(this.props.selectedCategoryId){
      case 1: categoryTitle = 'Магия'; break;
      case 2: categoryTitle = 'Строения'; break;
      case 3: categoryTitle = 'Юниты'; break;
      default: categoryTitle = 'Всё'; break;
    }

    return (
      <div className="shop noselect" id="shop">
        <div className="shop__body">
            <div className="shop__title">Магазин</div>
            <div className="shop__close" onClick={() => this.onClickClose()}>
                <div className="shop__close-body">x</div>
            </div>
            <div className="shop__categories">
                <img className={"shop__category " + (this.props.selectedCategoryId == 1 ? 'shop__category-active' : '')} src={CategoryMagicImage} onClick={() => this.onClickSelectCategory(1)}/>
                <img className={"shop__category " + (this.props.selectedCategoryId == 2 ? 'shop__category-active' : '')} src={CategoryBuldingImage} onClick={() => this.onClickSelectCategory(2)}/>
                <img className={"shop__category " + (this.props.selectedCategoryId == 3 ? 'shop__category-active' : '')} src={CategoryUnitImage} onClick={() => this.onClickSelectCategory(3)}/>
            </div>
            <div className="shop__container">
                <div className={`shop__items-container shop__items-container--background${this.props.selectedCategoryId || 1}`}>
                    <div className="shop__items-container-body">
                        <div className="shop__category-title">{categoryTitle}</div>
                        <div className="shop__item">
                            <div className="shop__item-img-container"  onClick={() => this.onClickSelectItem(1)}>
                                <img className="shop__item-img" src={TempImage} />
                                <div className="shop__item-info">
                                    <p>Загораживает проход монстрам к базе. Часть урона, от ближней атаки, возвращает обратно монстрам.</p>
                                    <div>* Здоровье: 45</div>
                                    <div>* Защита: 0</div>
                                </div>
                            </div>
                            <div className="shop__item-title">Баррикада</div>
                            <button className="button">Купить 30<img src={CoinImage}/></button>
                        </div>
        
                        <div className="shop__item">
                            <div className="shop__item-img-container" onClick={() => this.onClickSelectItem(2)}>
                                <img className="shop__item-img" src={TempImage}/>
                                <div className="shop__item-info">
                                    <p>Атакует наземных и летающих монстров в радиусе действия.</p>
                                    <div>* Здоровье: 100</div>
                                    <div>* Защита: 1</div>
                                    <div>* Урон: 10</div>
                                    <div>* Дальность: 500</div>
                                </div>
                            </div>
                            <div className="shop__item-title">Сторожевая Башня</div>
                            <button className="button">Купить 45<img src={CoinImage}/></button>
                        </div>
        
                        <div className="shop__item">
                            <div className="shop__item-img-container" onClick={() => this.onClickSelectItem(3)}>
                                <img className="shop__item-img" src={TempImage}/>
                            </div>
                            <div className="shop__item-title">Балиста</div>
                            <button className="button">Купить 60<img src={CoinImage}/></button>
                        </div>
        
                        <div className="shop__item shop__item-active">
                            <div className="shop__item-img-container" onClick={() => this.onClickSelectItem(4)}>
                                <img className="shop__item-img" src={TempImage}/>
                            </div>
                            <div className="shop__item-title">Катапульта</div>
                            <button className="button">Купить 70<img src={CoinImage}/></button>
                        </div>
        
                        <div className="shop__item">
                            <div className="shop__item-img-container" onClick={() => this.onClickSelectItem(5)}>
                                <img className="shop__item-img" src={TempImage}/>
                            </div>
                            <div className="shop__item-title">Энергетический щит</div>
                            <button className="button">Купить 90<img src={CoinImage}/></button>
                        </div>
        
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
