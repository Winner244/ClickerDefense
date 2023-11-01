import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as UnitButtonsStore from './UnitButtonsStore';
import { Upgrade } from '../Upgrade/Upgrade';

import { App } from '../../App';

import './UnitButtons.scss';

import { Mouse } from '../../../gameApp/gamer/Mouse';

import { Unit } from '../../../gameApp/units/Unit';

import { AudioSystem } from '../../../gameApp/gameSystems/AudioSystem';

import CoinImage from '../../../assets/img/coin.png';
import HealingImage from '../../../assets/img/buttons/healingIcon.png';
import UpgradeImage from '../../../assets/img/buttons/upgrade.png';

import SelectingSoundUrl from '../../../assets/sounds/menu/selecting.mp3'; 


interface IState {
  isDisplayHealingingButton: boolean;
}

interface Prop {
  isOpen?: boolean
}

type Props =
  UnitButtonsStore.UnitButtonsState
  & UnitButtonsStore.UnitButtonsAction
  & Prop;

export class UnitButtons extends React.Component<Props, IState> {

  constructor(props: Props) {
    super(props);

    this.state = { 
      isDisplayHealingingButton: props.isDisplayHealingingButton
    };
  }
  
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isDisplayHealingingButton !== this.state.isDisplayHealingingButton) {
      this.setState({ isDisplayHealingingButton: nextProps.isDisplayHealingingButton });
    }
  }

  static hideHealingButton(){
    App.Store.dispatch(UnitButtonsStore.actionCreators.hideHealingButton());
  }
  

  static show(x: number, y: number, 
    width: number, height: number, 
    isDisplayHealingingButton: boolean, 
    isDisplayUpgradeButton: boolean, 
    healingingCost: number,
    unit: Unit): void
  {
    const store = App.Store.getState().unitButtons;
    if(store && (store.x != x || store.y != y || store.isDisplayUpgradeButton != isDisplayUpgradeButton)){
      App.Store.dispatch(UnitButtonsStore.actionCreators.open(x, y, 
          width, height, 
          isDisplayHealingingButton, isDisplayUpgradeButton, healingingCost, unit));
    }
  }

  static hide(): void{
    App.Store.dispatch(UnitButtonsStore.actionCreators.close());
  }

  private static playSoundSelect(){
		AudioSystem.play(Mouse.x, SelectingSoundUrl, 0.1);
  }

  static isEnterMouse = false;

  componentDidUpdate(){
    const wrapper = document.getElementById('unit-buttons__wrapper');
    if(wrapper){
      wrapper.removeEventListener('mouseenter', this.onMouseEnter);
      wrapper.removeEventListener('mouseleave', this.onMouseOut);

      wrapper.addEventListener('mouseenter', this.onMouseEnter);
      wrapper.addEventListener('mouseleave', this.onMouseOut);
    }
  }

  onMouseEnter(e: MouseEvent){
    UnitButtons.isEnterMouse = true;
  }

  onMouseOut(e: MouseEvent){
    UnitButtons.isEnterMouse = false;
  }

  onClickHealing(){
    if(this.props.unit){
      let isHealed = this.props.unit.recovery();
      if(isHealed){
        this.setState({ isDisplayHealingingButton: false });
        UnitButtons.hide();
        //update unit info in Upgrade window
        if(Upgrade.isOpened()){
          Upgrade.hide();
          Upgrade.show(this.props.unit);
        }
      }
    }
  }

  onClickUpgrade(){
    UnitButtons.playSoundSelect();
    if(this.props.unit){
      Upgrade.show(this.props.unit);
      App.Store.dispatch(UnitButtonsStore.actionCreators.hideUpgradeButton());
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

    let isCanBeHealing = this.props.unit && this.props.unit.isCanBeRecovered();

    return (
      <div className="unit-buttons noselect" style={mainStyles}>
        <div className='unit-buttons__wrapper' style={wrapperStyles} id='unit-buttons__wrapper'>
          {this.state.isDisplayHealingingButton 
            ? <div 
                  className={'unit-buttons__button unit-buttons__button--healing ' + (isCanBeHealing ? "" : "unit-buttons__button--disabled")}
                  onClick={() => this.onClickHealing()}
                >
                <img className='unit-buttons__button-image nodrag' src={HealingImage}/>
                <span className='unit-buttons__button-healing-coin'>
                  {this.props.healingingCost}
                  <img className='unit-buttons__button-image--coin nodrag' src={CoinImage}/>
                </span>
            </div>
            : null}

          {this.props.isDisplayUpgradeButton 
            ? <div className='unit-buttons__button' onClick={() => this.onClickUpgrade()}>
                <img className='unit-buttons__button-image nodrag' src={UpgradeImage}/>
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
      return { ...state.unitButtons, ...ownProps };
  },
  UnitButtonsStore.actionCreators
)(UnitButtons);
