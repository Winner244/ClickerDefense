import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as BuildingButtonsStore from './BuildingButtonsStore';

import { App } from '../../App';

import './BuildingButtons.scss';

import CoinImage from '../../../assets/img/coin.png';
import HummerImage from '../../../assets/img/buttons/hummer.png';
import UpgradeImage from '../../../assets/img/buttons/upgrade.png';

import SelectingSoundUrl from '../../../assets/sounds/menu/selecting.mp3'; 
import { AudioSystem } from '../../../gameApp/gameSystems/AudioSystem';

interface Prop {
  isOpen?: boolean
}

type Props =
  BuildingButtonsStore.BuildingButtonsState
  & BuildingButtonsStore.BuildingButtonsAction
  & Prop;

export class BuildingButtons extends React.Component<Props, {}> {

  static show(x: number, y: number, 
    width: number, height: number, 
    isDisplayRepairButton: boolean, 
    isDisplayUpgradeButton: boolean, 
    repairCost: number): void
  {
    App.Store.dispatch(BuildingButtonsStore.actionCreators.open(x, y, 
        width, height, 
        isDisplayRepairButton, isDisplayUpgradeButton, repairCost));
  }

  static hide(): void{
    App.Store.dispatch(BuildingButtonsStore.actionCreators.close());
  }

  private static playSoundSelect(){
		AudioSystem.play(SelectingSoundUrl, 0.2);
  }

  onClickClose(){
    BuildingButtons.playSoundSelect();
    BuildingButtons.hide();
  }

  render() {
    if(!this.props.isOpen){
      return null;
    }

    let mainStyles = {
      width: this.props.width, 
      height: this.props.height, 
      top: this.props.y, 
      left: this.props.x
    };

    let wrapperStyles = {
      top: this.props.height / 2 - 0.5 * 0.35 * this.props.width, 
      height: 0.35 * this.props.width
    }

    return (
      <div className="building-buttons noselect" style={mainStyles}>
        <div className='building-buttons__wrapper' style={wrapperStyles}>
          {this.props.isDisplayRepairButton 
            ? <div className='building-buttons__button'>
                <img className='building-buttons__button-image' src={HummerImage}/>
                <div className='building-buttons__button-repair-coin'>{this.props.repairCost}</div>
            </div>
            : null}

          {this.props.isDisplayUpgradeButton 
            ? <div className='building-buttons__button'>
              <img className='building-buttons__button-image' src={UpgradeImage}/>
              </div>
            : null}
        </div>
      </div>
    );
  }
}
	
// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState, ownProps: Prop) => {
      return { ...state.buildingButtons, ...ownProps };
  },
  BuildingButtonsStore.actionCreators
)(BuildingButtons);
