import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as PanelStore from './PanelStore';

import { App } from '../../App';

import './Panel.scss';

import {Mouse} from '../../../gameApp/gamer/Mouse';
import {AudioSystem} from '../../../gameApp/gameSystems/AudioSystem';

import SelectingSoundUrl from '../../../assets/sounds/menu/selecting.mp3'; 

interface Prop {
}

type Props =
  PanelStore.PanelState
  & PanelStore.PanelAction
  & Prop;

export class Panel extends React.Component<Props, {}> {

  static add(): void{
    App.Store.dispatch(PanelStore.actionCreators.add());
    //TODO: AudioSystem.load(AddSoundUrl);
  }

  static remove(index: number): void{
    App.Store.dispatch(PanelStore.actionCreators.remove(index));
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

  render() {
    if(!this.props.panels?.length){
      return null;
    }

    return (
      <div className='panels'>
        {this.props.panels.map((panel, index) => (
          <div className="panel">
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
          ))}
      </div>
    );
  }
}
	
// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState, ownProps: Prop) => {
      return { ...state.panel, ...ownProps };
  },
  PanelStore.actionCreators
)(Panel);
