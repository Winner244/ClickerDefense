import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as UpgradeStore from './UpgradeStore';

import { App } from '../../App';

import './Upgrade.scss';

import { Building } from '../../../gameApp/gameObjects/Building';

import SelectingSoundUrl from '../../../assets/sounds/menu/selecting.mp3'; 
import { AudioSystem } from '../../../gameApp/gameSystems/AudioSystem';

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

  render() {
    if(!this.props.isOpen || !this.props.selectedBuilding){
      return null;
    }

    return (
      <div className="upgrade noselect" id="upgrade">
        <div className="upgrade__body">
            <div className="upgrade__title">{this.props.selectedBuilding.name}</div>
            <div className="upgrade__close" onClick={() => this.onClickClose()}>
                <div className="upgrade__close-body">x</div>
            </div>
            <div className="upgrade__container">
              <div className="upgrade__main-box">
                <div className="upgrade__info">
                  <img className="upgrade__image nodrag" src={this.props.selectedBuilding.image.src} />
                  <ul>
                    {this.props.selectedBuilding.infoItems.map((infoItem, i) => (
                        <li className="upgrade__parameter" key={i}>
                          <div className="upgrade__parameter-name">{infoItem.label}</div>: 
                          <div className="upgrade__parameter-value">{infoItem.getValue()}</div>
                        </li>
                    ))}

                  </ul>
                </div>
                <div className="upgrade__upgrade-items"></div>
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
