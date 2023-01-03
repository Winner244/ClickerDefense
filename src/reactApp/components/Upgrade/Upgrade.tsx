import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as UpgradeStore from './UpgradeStore';

import { App } from '../../App';

import './Upgrade.scss';

import {CoinLabels} from '../CoinLabels/CoinLabels';


import InfoItem from '../../../models/InfoItem';

import {AudioSystem} from '../../../gameApp/gameSystems/AudioSystem';

import {Gamer} from '../../../gameApp/gamer/Gamer';
import {Mouse} from '../../../gameApp/gamer/Mouse';

import {Building} from '../../../gameApp/buildings/Building';

import CoinImage from '../../../assets/img/coin.png';

import {BuildingButtons} from '../BuildingButtons/BuildingButtons';

import SelectingSoundUrl from '../../../assets/sounds/menu/selecting.mp3'; 
import ImproveSoundUrl from '../../../assets/sounds/buildings/placing.mp3'; 


interface Prop {
  isOpen?: boolean
}

type Props =
  UpgradeStore.UpgradeState
  & UpgradeStore.UpgradeAction
  & Prop;

export class Upgrade extends React.Component<Props, {}> {

  static isMouseDown : boolean = false;
  static mouseDownOffsetX : number = 0;
  static mouseDownOffsetY : number = 0;
  static offsetX : number = 0;
  static offsetY : number = 0;
  private _timeoutTransition : NodeJS.Timeout|null = null;

  coinLabel: React.RefObject<HTMLDivElement> = React.createRef();
  popup: React.RefObject<HTMLDivElement> = React.createRef();

  static show(building: Building): void{
    const oldBuilding = App.Store.getState().upgrade?.selectedBuilding;
    if(oldBuilding){
      oldBuilding.isDisplayedUpgradeWindow = false;
    }

    building.isDisplayedUpgradeWindow = true;
    App.Store.dispatch(UpgradeStore.actionCreators.open(building));
  }

  static hide(): void{
    const building = App.Store.getState().upgrade?.selectedBuilding;
    if(building){
      building.isDisplayedUpgradeWindow = false;
    }
    App.Store.dispatch(UpgradeStore.actionCreators.close());
  }

  static isOpened(): boolean{
    return App.Store.getState().upgrade?.isOpen || false;
  }

  private static playSoundSelect(){
		AudioSystem.play(Mouse.x, SelectingSoundUrl, 0.1);
  }

  static loadResources(){
    AudioSystem.load(SelectingSoundUrl);
    AudioSystem.load(ImproveSoundUrl);
  }

  onClickClose(){
    Upgrade.playSoundSelect();
    Upgrade.hide();
  }

  componentDidMount(){
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseMove(e: MouseEvent){
    if(Upgrade.isMouseDown){
      //without change state, because we should clear changes after closing this popup
      const popup = document.getElementById('upgrade');
      if(popup){
        popup.style.left = Upgrade.offsetX + (e.pageX - Upgrade.mouseDownOffsetX) + 'px';
        popup.style.top = Upgrade.offsetY + (e.pageY - Upgrade.mouseDownOffsetY) + 'px';
      }
    }
  }

  onMouseDown(e: MouseEvent){
    if(e.target instanceof Element){
      const element: Element = e.target;
      if(element.classList.contains('upgrade__title') || element.classList.contains('upgrade__body')){
        Upgrade.isMouseDown = true;
        Upgrade.mouseDownOffsetX = e.pageX;
        Upgrade.mouseDownOffsetY = e.pageY;

        const popup = document.getElementById('upgrade');
        if(popup){
          const style = getComputedStyle(popup);
          Upgrade.offsetX = parseInt(style.left);
          Upgrade.offsetY = parseInt(style.top);
        }
      }
    }
  }

  onMouseUp(e: MouseEvent){
    if(e.target instanceof Element){
      const element: Element = e.target;
      if(element.classList.contains('upgrade__title') || element.classList.contains('upgrade__body')){
        Upgrade.isMouseDown = false;
        Upgrade.mouseDownOffsetX = 0
        Upgrade.mouseDownOffsetY = 0;
        Upgrade.offsetX = 0;
        Upgrade.offsetY = 0;
      }
    }
  }

  componentWillUnmount(){
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mousedown', this.onMouseDown.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  improve(infoItem : InfoItem, e : React.MouseEvent<HTMLButtonElement, MouseEvent>){
    const result = infoItem.improve();
    if(result){
      this.forceUpdate();
      CoinLabels.add(e.clientX, e.clientY, infoItem.priceToImprove || 0, 2000);
      AudioSystem.play(e.clientX, ImproveSoundUrl, 0.15);
      this.setGreenTransition(infoItem.id);
    }
  }

  repair(infoItem : InfoItem, e : React.MouseEvent<HTMLButtonElement, MouseEvent>){
    if(this.props.selectedBuilding) {
      const repairPrice = this.props.selectedBuilding.getRepairPrice();
      const result = this.props.selectedBuilding.repair();
      if(result){
        CoinLabels.add(e.clientX, e.clientY, repairPrice || 0, 2000);
        this.setGreenTransition(infoItem.id);
      }
      this.forceUpdate();
      BuildingButtons.hideRepairButton();
    }
  }

  setGreenTransition(id: string){
    const elements = document.getElementsByClassName('upgrade__parameter--' + id);
    if(elements && elements.length){
      const element: HTMLElement = elements[0] as HTMLElement;
      element.className = element.className.replace('upgrade__parameter--transition', '');
      element.className = element.className.replace('upgrade__parameter--hover-active', '');
      element.className += ' upgrade__parameter--no-transition';
      element.className += ' upgrade__parameter--green';
      setTimeout(() => {
        element.className = element.className.replace('upgrade__parameter--no-transition', '');
        element.className += ' upgrade__parameter--transition';
        element.className = element.className.replace('upgrade__parameter--green', '');
        
        if(this._timeoutTransition)
          clearTimeout(this._timeoutTransition);
          
        this._timeoutTransition = setTimeout(() => {
          element.className = element.className.replace('upgrade__parameter--transition', '');
          element.className += ' upgrade__parameter--hover-active';
        }, 1000);
      }, 100);
    }
  }

  render() {
    if(!this.props.isOpen || !this.props.selectedBuilding){
      return null;
    }

    return (
      <div className="upgrade noselect" id="upgrade" ref={this.popup}>
        <div className="upgrade__body">
            <div className="upgrade__title">{this.props.selectedBuilding.name}</div>
            <div className="upgrade__close" onClick={() => this.onClickClose()}>
                <div className="upgrade__close-body">x</div>
            </div>
            <div className="upgrade__container">
              <div className="upgrade__main-box">
                <div className="upgrade__info">
                  <img className="upgrade__image nodrag" src={this.props.selectedBuilding.image.src} />
                  <ul className="upgrade__parameters-box">
                    {this.props.selectedBuilding.infoItems.map((infoItem, i) => {
                      let isDisplayRepairButton = infoItem.label == Building.improveHealthLabel && this.props.selectedBuilding?.health != this.props.selectedBuilding?.healthMax;

                      return (<li className={"upgrade__parameter upgrade__parameter--hover-active upgrade__parameter--" + infoItem.id} key={i} onMouseOver={infoItem.mouseIn} onMouseOut={infoItem.mouseOut}>
                        <div className="upgrade__parameter-name">
                          {infoItem.icon 
                            ? <img className="upgrade__parameter-icon" src={infoItem.icon.src}/> 
                            : null}
                            {infoItem.label}
                        </div>: 
                        <div className="upgrade__parameter-value-box">
                          <div className='upgrade__parameter-value' dangerouslySetInnerHTML={{__html: infoItem.getValue() + ''}}></div>
                          <div className='upgrade__parameter-buttons-box'>

                            {isDisplayRepairButton
                              ? <div className='upgrade__parameter-buttons-box-group'>
                                  <span className={'upgrade__parameter-price ' + (this.props.selectedBuilding?.isCanBeRepaired() != true ? 'upgrade__parameter-price--red' : '')}>
                                    {this.props.selectedBuilding?.getRepairPrice()}
                                    <img className='nodrag upgrade__parameter-price-image' src={CoinImage}/>
                                  </span>

                                  <button className='upgrade__parameter-button upgrade__parameter-button--repair' disabled={this.props.selectedBuilding?.isCanBeRepaired() != true} onClick={(e) => this.repair(infoItem, e)}>
                                    <svg viewBox="0 0 1000 1000" className='upgrade__parameter-button--repair-image'>
                                      <g><g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"><path d="M8016.5,4802.2c-474-73.5-825.4-290.1-1017.4-625.1c-81.7-145.1-132.8-355.5-157.3-643.5c-24.5-314.6-73.5-617-120.5-749.8c-34.7-102.1-267.6-384.1-937.7-1135.9c-183.9-206.3-331-382-326.9-390.2c6.1-20.4,794.7-858,880.5-937.7l51.1-47l551.6,629.2c586.3,672.1,727.3,813.1,868.3,882.6c83.8,40.9,112.4,42.9,343.2,30.6c574.1-30.6,886.7,100.1,1307.5,537.3c241.1,255.4,369.8,486.2,429,776.3c28.6,143,6.1,230.8-59.2,230.8c-20.4,0-134.9-61.3-251.3-134.8c-355.5-226.8-676.2-420.8-784.5-469.9c-228.8-108.3-398.4-40.9-590.4,230.9c-61.3,87.8-134.8,206.3-163.4,265.6c-67.4,134.8-104.2,351.4-85.8,498.5l14.3,112.4l167.5,100.1c91.9,53.1,351.4,202.3,576.1,331c224.7,128.7,429,255.4,455.6,284c91.9,104.2,34.7,183.9-165.5,226.8C8839.8,4836.9,8239.1,4834.9,8016.5,4802.2z"/><path d="M4206.3,4685.7c-157.3-26.6-363.6-91.9-525-163.4c-224.7-100.1-447.4-263.5-751.8-547.5l-286-267.6l-136.9,143c-75.6,79.7-151.2,143-169.6,143c-53.1,0-929.5-833.5-929.5-884.6c0-24.5,45-89.9,106.2-153.2l108.3-108.3l-163.4-151.2l-163.4-151.2l-116.5,12.3c-145,14.3-273.8-20.4-394.3-104.2c-153.2-110.3-684.4-625.1-684.4-666c0-45,1037.8-1150.2,1088.9-1160.4c22.5-4.1,157.3,110.3,377.9,318.7c410.6,390.2,463.8,469.9,463.8,692.6c0,163.4,2,167.5,196.1,335l116.4,100.1l896.9-954.1c494.4-527.1,941.8-1007.2,997-1068.5c53.1-61.3,424.9-457.6,827.4-878.5c911.1-958.1,1726.3-1824.4,2686.5-2854c453.5-486.2,764.1-802.9,786.5-802.9c40.9,0,898.9,792.7,927.5,858c16.3,34.7,4.1,57.2-63.3,128.7c-45,47-782.4,835.6-1640.5,1750.8C6903-832.3,6112.4,9.4,6004.1,121.8c-108.3,112.4-482.1,508.7-829.4,878.5c-347.3,371.8-901,964.3-1234,1317.7c-331,355.5-619,664-641.5,688.5l-38.8,44.9l373.9,390.2c386.1,400.4,551.6,541.4,772.2,651.7c220.6,112.4,341.2,132.8,688.5,118.5c169.6-8.2,357.5-22.5,418.8-34.7c104.2-20.4,114.4-18.4,149.1,22.5c44.9,57.2,44.9,79.7-12.3,163.4c-87.8,132.8-343.2,247.2-696.7,314.6C4780.4,4710.2,4386.1,4714.3,4206.3,4685.7z"/><path d="M3908.1-466.6c-77.6-91.9-281.9-335-453.5-539.3c-302.4-361.6-420.8-480.1-545.5-543.4c-47-22.5-159.3-32.7-459.7-38.8c-337.1-8.2-418.8-16.3-535.3-55.1c-247.2-79.7-619-369.8-825.4-641.5c-216.6-286-357.5-725.2-261.5-819.2c40.9-40.9,110.3-14.3,318.7,126.7c300.3,202.3,739.5,455.6,845.8,486.2c206.3,59.2,355.5-32.7,561.8-349.4c157.3-237,224.7-494.4,187.9-702.8l-16.3-89.9l-377.9-222.7c-208.4-122.6-461.7-267.6-563.9-324.8c-212.5-114.4-294.2-185.9-294.2-255.4c0-106.2,228.8-169.6,614.9-171.6c639.4-2,1074.6,118.5,1362.6,380c249.2,224.7,339.1,437.2,384.1,907.1c32.7,347.3,53.1,490.3,102.1,698.7c32.7,132.8,44.9,151.2,375.9,541.4c188,222.7,414.7,486.2,504.6,588.4l165.5,183.9l-63.3,71.5c-69.5,79.7-876.4,939.8-880.5,939.8C4055.2-299.1,3987.7-374.7,3908.1-466.6z"/></g></g>
                                    </svg>
                                  </button>
                                </div>
                              : null}

                              {infoItem.priceToImprove && !isDisplayRepairButton
                                ? <div className='upgrade__parameter-buttons-box-group'>
                                    <span className={'upgrade__parameter-price ' + (infoItem.priceToImprove > Gamer.coins ? 'upgrade__parameter-price--red' : '')}
                                    >
                                      {infoItem.priceToImprove}
                                      <img className='nodrag upgrade__parameter-price-image' src={CoinImage}/>
                                    </span>

                                    <button className='upgrade__parameter-button' disabled={infoItem.priceToImprove > Gamer.coins} onClick={(e) => this.improve(infoItem, e)}>+</button>
                                  </div>
                                : null}
                            
                          </div>
                        </div>
                      </li>);
                    })}

                  </ul>
                </div>
                <div className="upgrade__upgrade-items">
                  {this.props.selectedBuilding?.improvements.map((improvement, i) => {
                    return (<div className='upgrade__upgrade-item' key={i}>
                      <img className='upgrade__upgrade-item-image' src={improvement.image.src} />
                      <div className='upgrade__upgrade-item-body'>
                        <div className='upgrade__upgrade-item-description'>{improvement.description}</div>
                        <div className='upgrade__upgrade-item-label'>{improvement.label}</div>
                        <div className='upgrade__upgrade-item-info-items'>{improvement.infoItems.map((infoItem, i) => {
                          return (<span className='upgrade__upgrade-item-info-item'>
                            {infoItem.value}
                            <img className='upgrade__upgrade-item-info-item-image' src={infoItem.icon?.src}/>
                          </span>);
                        })}</div>
                      </div>
                      <div className='upgrade__upgrade-item-button-buy'>
                        <div className='upgrade__upgrade-item-button-buy-price'>
                          {improvement.price}
                          <img className='upgrade__upgrade-item-button-buy-image nodrag' src={CoinImage}/>
                        </div>
                        <div className='upgrade__upgrade-item-button-buy-text'>Купить</div>
                      </div>
                    </div>);
                  })}
                </div>
              </div>
              <div className="upgrade__upgraded-box"></div>
            </div>
        </div>
    </div>
    );
  }
}
	
// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState, ownProps: Prop) => {
      return { ...state.upgrade, ...ownProps };
  },
  UpgradeStore.actionCreators
)(Upgrade);
