import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as BuildingButtonsStore from './BuildingButtonsStore';
import { Upgrade } from '../Upgrade/Upgrade';

import { App } from '../../App';

import './BuildingButtons.scss';

import CoinImage from '../../../assets/img/coin.png';
import HammerImage from '../../../assets/img/buttons/hammer.png';
import UpgradeImage from '../../../assets/img/buttons/upgrade.png';

import SelectingSoundUrl from '../../../assets/sounds/menu/selecting.mp3'; 
import { AudioSystem } from '../../../gameApp/gameSystems/AudioSystem';
import { Building } from '../../../gameApp/gameObjects/Building';

interface IState {
  isDisplayRepairButton: boolean;
}

interface Prop {
  isOpen?: boolean
}

type Props =
  BuildingButtonsStore.BuildingButtonsState
  & BuildingButtonsStore.BuildingButtonsAction
  & Prop;

export class BuildingButtons extends React.Component<Props, IState> {

  constructor(props: Props) {
    super(props);

    this.state = { 
      isDisplayRepairButton: props.isDisplayRepairButton
     };
  }
  
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isDisplayRepairButton !== this.state.isDisplayRepairButton) {
      this.setState({ isDisplayRepairButton: nextProps.isDisplayRepairButton });
    }
  }
  

  static show(x: number, y: number, 
    width: number, height: number, 
    isDisplayRepairButton: boolean, 
    isDisplayUpgradeButton: boolean, 
    repairCost: number,
    building: Building): void
  {
    App.Store.dispatch(BuildingButtonsStore.actionCreators.open(x, y, 
        width, height, 
        isDisplayRepairButton, isDisplayUpgradeButton, repairCost, building));
  }

  static hide(): void{
    App.Store.dispatch(BuildingButtonsStore.actionCreators.close());
  }

  private static playSoundSelect(){
		AudioSystem.play(SelectingSoundUrl, 0.2);
  }

  onClickRepair(){
    if(this.props.building){
      let isRepaired = this.props.building.repair();
      if(isRepaired){
        this.setState({ isDisplayRepairButton: false });
        BuildingButtons.hide();
      }
    }
  }

  onClickUpgrade(){
    BuildingButtons.playSoundSelect();
    BuildingButtons.hide();
    if(this.props.building){
      Upgrade.show(this.props.building);
    }
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

    let isCanBeRepaired = this.props.building && this.props.building.isCanBeRepaired();

    return (
      <div className="building-buttons noselect" style={mainStyles}>
        <div className='building-buttons__wrapper' style={wrapperStyles}>
          {this.state.isDisplayRepairButton 
            ? <div 
                  className={'building-buttons__button ' + (isCanBeRepaired ? "" : "building-buttons__button--disabled")}
                  onClick={() => this.onClickRepair()}
                >
                <img className='building-buttons__button-image' src={HammerImage}/>
                <span className='building-buttons__button-repair-coin'>
                  {this.props.repairCost}
                  <img className='building-buttons__button-image--coin' src={CoinImage}/>
                </span>
            </div>
            : null}

          {this.props.isDisplayUpgradeButton 
            ? <div className='building-buttons__button' onClick={() => this.onClickUpgrade()}>
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
