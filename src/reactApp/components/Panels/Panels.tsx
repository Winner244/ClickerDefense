import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as PanelsStore from './PanelsStore';

import { App } from '../../App';

import Panel from '../../../models/Panel';

import './Panels.scss';

import {Mouse} from '../../../gameApp/gamer/Mouse';
import {AudioSystem} from '../../../gameApp/gameSystems/AudioSystem';

import SelectingSoundUrl from '../../../assets/sounds/menu/selecting.mp3'; 

interface Prop {
}

type Props =
  PanelsStore.PanelsState
  & PanelsStore.PanelAction
  & Prop;

export class Panels extends React.Component<Props, {}> {

  static add(): void{
    App.Store.dispatch(PanelsStore.actionCreators.add());
    //TODO: AudioSystem.load(AddSoundUrl);
  }

  static remove(index: number): void{
    App.Store.dispatch(PanelsStore.actionCreators.remove(index));
    //TODO: AudioSystem.load(RemoveSoundUrl);
  }

  onKey(event: KeyboardEvent){
    if(!this.props.panels?.length){
      return;
    }

    //TODO event.key
    //TODO this.onClickSelectItem(itemId);
  }

  componentDidMount() {
		document.addEventListener('keydown', this.onKey.bind(this));
  } 
  
  componentWillUnmount() {
		document.removeEventListener('keydown', this.onKey.bind(this));
  }

  onClickSelectItem(itemId: string){
    this.props.selectItem(itemId);
		//TODO: AudioSystem.play(Mouse.x, SelectingSoundUrl, value);
  }

  renderPanel(panel: Panel, index: number, isTop: boolean){
    return <div className={"panel " + (isTop ? "panel--top" : "")}>
        {panel.items.map((item, index) => (
          <div key={index} 
            onClick={() => this.onClickSelectItem(item?.id)}
            className={"panel__item " + ((this.props.selectedItemId != null && this.props.selectedItemId == item?.id) ? 'panel__item--selected ' : '')}>
              {item == null 
                ? null 
                : <div>
                    <div className={"panel__item-img nodrag "} style={{backgroundImage: `url(${item.image.src})`}} />
                    <div className="panel__item-number">{index}</div>
                  </div>}
          </div>
        ))}
    </div>
  }

  render() {
    if(!this.props.panels?.length){
      return null;
    }

    let countTopPanels = 1;

    return (
      <div className='panels'>
        <div className='panels--top'>
          {this.props.panels.slice(0, countTopPanels).map((panel, index) => this.renderPanel(panel, index, true))}
        </div>

        <div className='panels--bottom'>
          {this.props.panels.slice(countTopPanels).map((panel, index) => this.renderPanel(panel, index, false))}
        </div>
      </div>
    );
  }
}
	
// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState, ownProps: Prop) => {
      return { ...state.panels, ...ownProps };
  },
  PanelsStore.actionCreators
)(Panels);
