import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as UpgradeStore from './UpgradeStore';

import { App } from '../../App';

import './Upgrade.scss';

import { Building } from '../../../gameApp/gameObjects/Building';

import SelectingSoundUrl from '../../../assets/sounds/menu/selecting.mp3'; 
import ImproveSoundUrl from '../../../assets/sounds/buildings/placing.mp3'; 
import { AudioSystem } from '../../../gameApp/gameSystems/AudioSystem';
import InfoItem from '../../../models/InfoItem';
import { Labels } from '../../../gameApp/gameSystems/Labels';

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
		AudioSystem.play(SelectingSoundUrl, 0.2);
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
			Labels.createCoinLabel(e.clientX, e.clientY, '-' + infoItem.priceToImprove, 2000);
      this.createCoinLabel(e.clientX, e.clientY, '-' + infoItem.priceToImprove, 2000);
      AudioSystem.play(ImproveSoundUrl, 0.2);
      //set яркий style with transition затуханием цвета
      //эмуляция поднимающегося Label на основе div с прозрачным фоном
    }
  }

  createCoinLabel(x: number, y: number, text: string, lifeTimeMilliseconds: number){
    if(this.coinLabel.current && this.popup.current){
      y -= 10;
      x += 10;
      this.coinLabel.current.style.display = 'block';
      this.coinLabel.current.style.left = x - this.popup.current.offsetLeft + 'px';
      this.coinLabel.current.style.top = y - this.popup.current.offsetTop + 'px';
      this.coinLabel.current.innerHTML = text;

      let timeUpdate = Date.now();
      const interval = setInterval(() => {
        if(this.coinLabel.current && lifeTimeMilliseconds > 0){
          const difTime = Date.now() - timeUpdate;
          timeUpdate = Date.now();
          lifeTimeMilliseconds -= difTime;

          this.coinLabel.current.style.top = (parseFloat(this.coinLabel.current.style.top.replace('px', '')) - difTime * Labels.speedOfUppingToTop / 1000) + 'px'; 
        }
        else{
          clearInterval(interval);
          if(this.coinLabel.current){
            this.coinLabel.current.style.display = 'none';
          }
        }
      }, 10);
    }
  }

  repair(){
    if(this.props.selectedBuilding) {
      this.props.selectedBuilding?.repair();
      this.forceUpdate();
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
                    {this.props.selectedBuilding.infoItems.map((infoItem, i) => (
                        <li className="upgrade__parameter" key={i}>
                          <div className="upgrade__parameter-name">
                            {infoItem.icon 
                              ? <img className="upgrade__parameter-icon" src={infoItem.icon.src}/> 
                              : null}
                              {infoItem.label}
                          </div>: 
                          <div className="upgrade__parameter-value">
                            <div>
                              {infoItem.getValue()}
                            </div>
                            <div className='upgrade__parameter-buttons-box'>
                              {infoItem.label == Building.improveHealthLabel && this.props.selectedBuilding?.health != this.props.selectedBuilding?.healthMax
                                ? <button className='upgrade__parameter-button upgrade__parameter-button-repair' onClick={() => this.repair()}>r</button>
                                : null}
                              {infoItem.improvePoints && infoItem.priceToImprove 
                                ? <button className='upgrade__parameter-button upgrade__parameter-button-improve' onClick={(e) => this.improve(infoItem, e)}>+</button>
                                : null}
                            </div>
                          </div>
                        </li>
                    ))}

                  </ul>
                </div>
                <div className="upgrade__upgrade-items"></div>
              </div>
              <div className="upgrade__upgraded-box"></div>
            </div>
        </div>

        <div className='upgrade__label' style={{display:'none'}} ref={this.coinLabel}></div>
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
