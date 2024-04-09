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

import SelectingSoundUrl from '../../../assets/sounds/menu/panel-open.mp3'; 
import AddingPanelSoundUrl from '../../../assets/sounds/panel/adding.mp3'; 
import AddingItemSoundUrl from '../../../assets/sounds/magic/adding.mp3'; 

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

    AudioSystem.load(AddingItemSoundUrl);
    AudioSystem.load(AddingPanelSoundUrl);
    App.Store.dispatch(PanelsStore.actionCreators.add());

    setTimeout(() => AudioSystem.play(-1, AddingPanelSoundUrl, -1), 200);

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

          setTimeout(() => done(true), 1000); //ожидаем полного появления панели
      }, 100);
     });
  }



  private static removePanel(index: number): void{
    App.Store.dispatch(PanelsStore.actionCreators.remove(index));
    //TODO: AudioSystem.load(RemovePanelSoundUrl);
  }



  private static getFirstFreePanel(): Panel|undefined {
    let panels = App.Store.getState().panels?.panels;
    let panelWithFreePlace = panels?.find(panel => panel?.items?.some(item => item == null));
    return panelWithFreePlace;
  }
  


  static addItemToPanel(item: Magic): Promise<boolean>{
    let panelWithFreePlace = this.getFirstFreePanel();
    if (!panelWithFreePlace){
      return this.addNewPanel().then(isSuccess => {
        if(isSuccess){
          return this._addItemToPanel(item);
        }

        return false;
      });
    }

    return new Promise((done, fail) => { done(this._addItemToPanel(item)) });
  }



  private static _addItemToPanel(item: Magic): boolean{
    let panelWithFreePlace = this.getFirstFreePanel();
    if (!panelWithFreePlace){
      console.error('freePanels is empty in Panels._addItemToPanel');
      throw 'freePanels is empty in Panels._addItemToPanel';
    }
    
    let panels = App.Store.getState().panels?.panels;
    let panelWithFreePlaceIndex = panels?.findIndex(panel => panel?.items?.some(item => item == null)) || 0;

    let freePlaceIndex = panelWithFreePlace.items.findIndex(x => x == null);
    App.Store.dispatch(PanelsStore.actionCreators.addItem(panelWithFreePlaceIndex, freePlaceIndex, item));

    AudioSystem.play(-1, AddingItemSoundUrl);
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
        {panel.items.map((item: Magic, index2) => (
          <div key={index2} 
            onClick={() => this.onClickSelectItem(item?.id)}
            className={"panel__item " + ((this.props.selectedItemId != null && this.props.selectedItemId == item?.id) ? 'panel__item--selected ' : '')}>
              {item == null 
                ? null 
                : <div className={"panel__item-img nodrag "} style={{backgroundImage: `url(${item.image.src})`}} />}
              {item == null 
                ? null 
                : <div className="panel__item-number noselect">{(index2 + 1) % 10}</div>}
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
