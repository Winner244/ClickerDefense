import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as MenuStore from '../Menu/MenuStore';
import * as UpgradeStore from './UpgradeStore';

import { App } from '../../App';

import './Upgrade.scss';

import CoinImage from '../../../assets/img/coin.png';
import { Game } from '../../../gameApp/gameSystems/Game';
import { Gamer } from '../../../gameApp/gameObjects/Gamer';
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

  static show(building: Building): void{
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

  private static playSoundSelect(){
		AudioSystem.play(SelectingSoundUrl, 0.2);
  }

  onClickClose(){
    Upgrade.playSoundSelect();
    Upgrade.hide();
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
                  <img className="upgrade__image" src={this.props.selectedBuilding.image.src} />
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
