import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as PanelsStore from './PanelsStore';

import { App } from '../../App';

import Panel from '../../../models/Panel';

import {Magic} from '../../../gameApp/magic/Magic';

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

  private static addNewPanel(): Promise<boolean>{
    let countPanels = App.Store.getState().panels?.panels?.length || 0;
    if (countPanels && countPanels >= 3){
      console.error("Can't add new panel. Count of panels is maximum!");
      return new Promise((done, fail) => { done(false) });
    }

    App.Store.dispatch(PanelsStore.actionCreators.add());
    //TODO: AudioSystem.load(AddPanelSoundUrl);

    return new Promise((done, fail) => { 
      setTimeout(() => {
          if(countPanels == 0){
            document.getElementsByClassName("panels--top")[0].classList.remove("panels--shift-top");
          }
          else if(countPanels == 1){
            document.getElementsByClassName("panel--bottom")[0].classList.remove("panels--shift-top");
          }
          else if(countPanels == 2){
            document.getElementsByClassName("panel--bottom")[1].classList.remove("panels--shift-top");
            document.getElementsByClassName("panel--bottom")[0].classList.add("panel--clip-bottom");
          }
          done(true);
      }, 100);
     });
  }

  private static removePanel(index: number): void{
    App.Store.dispatch(PanelsStore.actionCreators.remove(index));
    //TODO: AudioSystem.load(RemovePanelSoundUrl);
  }
  
  static addItemToPanel(item: Magic): Promise<boolean>{
    let panels = App.Store.getState().panels?.panels;
    let panelsWithFreePlace = panels?.filter(panel => panel?.items?.length < 10);
    if (!panels?.length || !panelsWithFreePlace?.length){
      return this.addNewPanel().then(isSuccess => {
        if(isSuccess){
          return this._addItemToPanel(item);
        }

        return false;
      });
      ;
    }

    return new Promise((done, fail) => { done(this._addItemToPanel(item)) });
  }

  private static _addItemToPanel(item: Magic): boolean{
    let freePanels = App.Store.getState().panels?.panels.filter(panel => panel.items.length < 10);
    if (!freePanels?.length){
      console.error('freePanels is empty in Panels._addItemToPanel', freePanels);
      throw 'freePanels is empty in Panels._addItemToPanel';
    }

    freePanels[0].items.push(item);

    //TODO: AudioSystem.load(AddItemSoundUrl);
    return true;
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
    return <div className={"panel " + (isTop ? "panel--top" : "panel--bottom panels--shift-top panels--transition")} key={index}>
        {panel.items.map((item, index2) => (
          <div key={index2} 
            onClick={() => this.onClickSelectItem(item?.id)}
            className={"panel__item " + ((this.props.selectedItemId != null && this.props.selectedItemId == item?.id) ? 'panel__item--selected ' : '')}>
              {item == null 
                ? null 
                : <div>
                    <div className={"panel__item-img nodrag "} style={{backgroundImage: `url(${item.image.src})`}} />
                    <div className="panel__item-number">{index2}</div>
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
        <div className='panels--top panels--shift-top panels--transition'>
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
