import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as PanelsStore from './PanelsStore';

import { App } from '../../App';

import Panel from '../../../models/Panel';
import {BaseObject} from '../../../models/BaseObject';
import {Point} from '../../../models/Point';
import {Helper} from '../../../gameApp/helpers/Helper';

import Animation from '../../../models/Animation';

import {Magic} from '../../../gameApp/magic/Magic';
import {Magics} from '../../../gameApp/magic/Magics';

import {Mouse} from '../../../gameApp/gamer/Mouse';

import './Panels.scss';

import {AudioSystem} from '../../../gameApp/gameSystems/AudioSystem';

import SelectingSoundUrl from '../../../assets/sounds/panel/selecting.mp3';
import AddingPanelSoundUrl from '../../../assets/sounds/panel/adding.mp3'; 
import AddingItemSoundUrl from '../../../assets/sounds/magic/adding.mp3'; 

import AddingImage from '../../../assets/img/magics/adding.png'; 

interface Prop {
}

type Props =
  PanelsStore.PanelsState
  & PanelsStore.PanelAction
  & Prop;

export class Panels extends React.Component<Props, {}> {

	private static readonly imageAdding: HTMLImageElement = new Image(); //анимация добавления элемента

  static countAllItems(): number{
    let panels = App.Store.getState().panels?.panels;
    return panels?.reduce((partialSum, panel) => partialSum + panel.items.filter(item => item != null).length, 0) || 0;
  }

  private static addNewPanel(): Promise<boolean>{
    let countPanels = App.Store.getState().panels?.panels?.length || 0;
    if (countPanels && countPanels >= 3){
      console.error("Can't add new panel. Count of panels is maximum!");
      return new Promise((done, fail) => { done(false) });
    }

    if(countPanels == 0){
      this.initAddingItem();
    }

    App.Store.dispatch(PanelsStore.actionCreators.add());

    setTimeout(() => AudioSystem.play(-1, AddingPanelSoundUrl, -5), 200);

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

          setTimeout(() => done(true), 1200); //ожидаем полного появления панели
      }, 100);
     });
  }

  private static initAddingItem(){
    AudioSystem.load(AddingItemSoundUrl);
    AudioSystem.load(AddingPanelSoundUrl);
    AudioSystem.load(SelectingSoundUrl);
    this.imageAdding.src = AddingImage;
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

  static addItemToPanel(item: Magic): Promise<BaseObject|null>{
    let panelWithFreePlace = this.getFirstFreePanel();
    if (!panelWithFreePlace){
      return this.addNewPanel().then(isSuccess => {
        if(isSuccess){
          return this._addItemToPanel(item);
        }

        return null;
      });
    }

    return new Promise((done, fail) => { done(this._addItemToPanel(item)) });
  }

  private static _addItemToPanel(item: Magic): BaseObject|null{
    let panelWithFreePlace = this.getFirstFreePanel();
    if (!panelWithFreePlace){
      console.error('freePanels is empty in Panels._addItemToPanel');
      throw 'freePanels is empty in Panels._addItemToPanel';
    }
    
    let panels = App.Store.getState().panels?.panels;
    let panelWithFreePlaceIndex = panels?.findIndex(panel => panel?.items?.some(item => item == null)) || 0;

    let freePlaceIndex = panelWithFreePlace.items.findIndex(x => x == null);

    let classItem = `panel${panelWithFreePlaceIndex}__item${freePlaceIndex}`;
    let elements = document.getElementsByClassName(classItem);
    if (!elements.length){
      console.error('element not found in the panel!', classItem);
      return null;
    }

    let element = elements[0];
    if(element.classList.contains("panel__item--transition-color")){
      element.classList.replace("panel__item--transition-color", "panel__item--yellow");
    }
    else{
      element.classList.add("panel__item--yellow");
    }
    setTimeout(() => element.classList.add("panel__item--transition-color"), 200);
    setTimeout(() => element.classList.remove("panel__item--yellow"), 300);

    let elementPosition = element.getBoundingClientRect();
    let x = elementPosition.x;
    let y = elementPosition.y;
    let width = elementPosition.width;
    let height = elementPosition.height;

    App.Store.dispatch(PanelsStore.actionCreators.addItem(panelWithFreePlaceIndex, freePlaceIndex, item));

    AudioSystem.play(-1, AddingItemSoundUrl);

    this.startAddingItemAnimation(panelWithFreePlaceIndex, freePlaceIndex);

    return new BaseObject(x, y, width, height);
  }

  private static startAddingItemAnimation(panelIndex: number, itemIndex: number){
    let classItem = `panel${panelIndex}__item${itemIndex}-canvas`;
    let elements = document.getElementsByClassName(classItem);
    if (!elements.length){
      console.error('canvas not found in the panel!', classItem);
      return;
    }

    let canvas: HTMLCanvasElement = elements[0] as HTMLCanvasElement;
    canvas.style.display = 'block';
		let ctx = canvas.getContext('2d') || new CanvasRenderingContext2D();
    let animation = new Animation(31, 31 * 50, this.imageAdding, ctx);


    let lastDrawTime: number = 0;
    let animationCallback = (millisecondsFromStart: number) => {
      if(!lastDrawTime){
        lastDrawTime = millisecondsFromStart - 10;
      }

		  let drawsDiffMs = millisecondsFromStart - lastDrawTime; //сколько времени прошло с прошлой прорисовки
      lastDrawTime = millisecondsFromStart;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animation.draw(drawsDiffMs, false, 0, 0, 320, 320);

      if (animation.leftTimeMs > 0){
        window.requestAnimationFrame(animationCallback);
      }
      else{
        canvas.style.display = 'none';
      }
    };

    window.requestAnimationFrame(animationCallback);
  }

  static isDisabled: boolean = false;
  static disable(): void{
    Panels.isDisabled = true;
    Panels.clearSelection();

    let elements = document.getElementsByClassName('panel__item-container--hover');
    for (let element of elements) {
      element.classList.remove('panel__item-container--hover');
    }
  }

  static undisable(): void{
    Panels.isDisabled = false;
    let elements = document.getElementsByClassName('panel__item-container');
    for (let element of elements) {
      element.classList.add('panel__item-container--hover');
    }
  }

  static clearSelection(): void{
    Magics.clearCursor();
    App.Store.dispatch(PanelsStore.actionCreators.selectItem(''));
  }

  getSelectedItem(itemId: string|null = null): Magic|null{
    if(!this.props.selectedItemId && !itemId){
      return null;
    }
    
    let items = this.props.panels
      .map(x => x.items.find(item => item && item.id == (this.props.selectedItemId || itemId)))
      .filter(x => x);

    if(items.length && items[0]){
      return items[0];
    }

    return null;
  }

  wasMouseDown: boolean = false;
  onMouseDown(event: MouseEvent){
    if(this.isMouseIn || Panels.isDisabled)
      return;

    if(this.props.selectedItemId){
      switch(event.button){
        case 0: // left click
          let selectedItem = this.getSelectedItem();
          if (selectedItem){
            let mouseDown = Mouse.getCanvasMousePointByEvent(event);
            Magics.startCreatingCursorAnimation(selectedItem, mouseDown);
            this.wasMouseDown = true;
          }
          break;

        case 2: //right click
          this.props.selectItem(''); 
          Magics.clearCursor();
          this.wasMouseDown = false;
          break;  
      }
    }
  }

  onMouseUp(event: MouseEvent){
    if(this.isMouseIn || Panels.isDisabled)
      return;

    let isLeftClick = event.button == 0;

    if(this.props.selectedItemId && isLeftClick && this.wasMouseDown){
      let selectedItem = this.getSelectedItem();
      if (selectedItem){
        let mouseUp = Mouse.getCanvasMousePointByEvent(event);
        Magics.create(selectedItem, mouseUp);
      }
      this.props.selectItem('');
      this.wasMouseDown = false;
    }
  }

  onKey(event: KeyboardEvent){
    if(!this.props.panels?.length || Panels.isDisabled){
      return;
    }

    if(event.code.indexOf("Digit") == 0){
      let key = +event.code.replace("Digit", '');
      let panelIndex = event.altKey 
        ? 1 
        : event.shiftKey 
          ? 2 
          : 0;
      let itemIndex = key - 1;
      if (itemIndex == -1)
          itemIndex = 9;
      let items = document.getElementsByClassName(`panel${panelIndex}__item${itemIndex}`);
      if (items.length){
        let item = items[0] as HTMLElement;
        this.onClickSelectItem(item.dataset.id ?? '')
      }
    }
  }
 
  componentDidMount() {
		document.addEventListener('keydown', this.onKey.bind(this));
		document.addEventListener('mousedown', this.onMouseDown.bind(this));
		document.addEventListener('mouseup', this.onMouseUp.bind(this));
  } 
  
  componentWillUnmount() {
		document.removeEventListener('keydown', this.onKey.bind(this));
		document.removeEventListener('mousedown', this.onMouseDown.bind(this));
		document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onClickSelectItem(itemId: string){
    if(Panels.isDisabled)
      return;

    if(this.props.selectedItemId == itemId){
      this.props.selectItem('');
      Magics.clearCursor();
      return;
    }

    this.props.selectItem(itemId);
		AudioSystem.play(-1, SelectingSoundUrl);
    let selectedItem = this.getSelectedItem(itemId);
    if (selectedItem && !this.isMouseIn){
      Magics.displayOnCursor(selectedItem);
    }
  }

  isMouseIn: boolean = false;
  onMouseEnter(item: Magic){
    if(item == null)
      return;

    this.isMouseIn = true;
    Magics.clearCursor();
  }

  onMouseLeave(){
    this.isMouseIn = false;
    let selectedItem = this.getSelectedItem();
    if (selectedItem){
      Magics.displayOnCursor(selectedItem);
    }
  }

  renderPanel(panel: Panel, index: number, isTop: boolean){
    return <div className={"panel " + (isTop ? "panel--top" : "panel--bottom panels--shift-top panels--transition")} key={index}>
        {panel.items.map((item: Magic, index2) => {
          let className = `panel__item  panel${index}__item${index2} `;

          if(this.props.selectedItemId != null && this.props.selectedItemId == item?.id){
            className += ' panel__item--selected ';
          }

          return (
            <div key={index2} 
              onMouseDown={() => this.onClickSelectItem(item?.id)}
              onMouseEnter={() => this.onMouseEnter(item)}
              onMouseLeave={() => this.onMouseLeave()}
              className={className}
              data-id={item?.id}>
                <div className={"panel__item-container " + (Panels.isDisabled ? "" : " panel__item-container--hover ") + (item == null ? " panel__item-container--empty " : "")}>
                  {item == null 
                    ? null 
                    : <div className={"panel__item-img-gif nodrag "} style={{backgroundImage: `url(${item.imageGif.src})`}} />}
                  {item == null 
                    ? null 
                    : <div className={"panel__item-img nodrag "} style={{backgroundImage: `url(${item.image.src})`}} />}
                  {item == null 
                    ? null 
                    : <div className="panel__item-number noselect">{index == 1 ? "Alt + " : index == 2 ? "Shift + " : ""}{(index2 + 1) % 10}</div>}
                </div>
                <canvas width="320" height="320" className={`panel__item-canvas panel${index}__item${index2}-canvas`}></canvas>
            </div>
          );
        })}
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
          {this.props.panels.slice(countTopPanels).map((panel, index) => this.renderPanel(panel, index + 1, false))}
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
