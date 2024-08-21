import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as PanelsStore from './PanelsStore';

import { App } from '../../App';

import Panel from '../../../models/Panel';
import {BaseObject} from '../../../models/BaseObject';
import {Point} from '../../../models/Point';
import {Helper} from '../../../gameApp/helpers/Helper';
import {RequestAnimationFrameHelper} from '../../../gameApp/helpers/RequestAnimationFrameHelper';

import Animation from '../../../models/Animation';

import {Magic} from '../../../gameApp/magic/Magic';
import {Magics} from '../../../gameApp/magic/Magics';

import {Mouse} from '../../../gameApp/gamer/Mouse';

import './Panels.scss';

import {AudioSystem} from '../../../gameApp/gameSystems/AudioSystem';

import SelectingSoundUrl from '../../../assets/sounds/panel/selecting.mp3'; //TODO: change sound
import RecoveryEndSoundUrl from '../../../assets/sounds/panel/selecting.mp3';
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
	private static readonly durationOfEndRecoveryAdnimationMs: number = 3000; //время анимации завершения восстановления магии в ячейке
	private static readonly countSnakesOfEndRecoveryAdnimation: number = 6; //количество бегающих змеек
	private static readonly lengthOfSnakeOfEndRecoveryAdnimation: number = 5; //длина бегающей змейки
	private static readonly speedOfSnakeOfEndRecoveryAdnimationPx: number = 50; //скорость змейки (пиксели в секунду)

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

    setTimeout(() => AudioSystem.play(-1, AddingPanelSoundUrl, -7), 200);

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
    AudioSystem.load(RecoveryEndSoundUrl);
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

    AudioSystem.play(-1, AddingItemSoundUrl, -3);

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


    let callback = (drawsDiffMs: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animation.draw(drawsDiffMs, false, 0, 0, 320, 320);

      let isConunie = animation.leftTimeMs > 0;
      if (!isConunie){
        canvas.style.display = 'none';
      }

      return isConunie;
    } 
    RequestAnimationFrameHelper.start(callback);
  }

  static disable(): void{
    Panels.clearSelection();
    App.Store.dispatch(PanelsStore.actionCreators.disable());
  }

  static undisable(): void{
    App.Store.dispatch(PanelsStore.actionCreators.undisable());
  }

  static clearSelection(): void{
    Magics.clearCursor();
    App.Store.dispatch(PanelsStore.actionCreators.selectItem(''));
  }

  private animateRecovery(selectedItem: Magic, selectedItemId: string){
    if(!selectedItem){
      console.error('selectedItem in animateRecovery is empty!');
      return false;
    }

    this.animateTime(selectedItemId, selectedItem.timeRecoveryMs);

    let callback = (drawsDiffMs: number) => {
      selectedItem.timeRecoveryLeftMs -= drawsDiffMs;
      
      let isContinue = selectedItem.timeRecoveryLeftMs > 0;
      if (!isContinue){
        this.forceUpdate();
        this.animateEndRecovery(selectedItemId);
        AudioSystem.play(-1, RecoveryEndSoundUrl);
      }

      return isContinue;
    } 
    RequestAnimationFrameHelper.start(callback);
  }

  private animateEndRecovery(selectedItemId: string){
    this.animateSnakes(selectedItemId);


    let element = document.querySelector(`.panel__item[data-id='${selectedItemId}']`);
    if (!element){
      console.error('element not found in the panel!', selectedItemId);
      return false;
    }
    
    element.classList.add("panel__item--yellow");
    
    let imgs = element.getElementsByClassName('panel__item-img');
    let img = imgs.length > 0 ? imgs[0] : null;
    if (img){
      img.classList.add("panel__item--red-shadow");
    }

    setTimeout(() => {
      if(element){
        element.classList.add("panel__item--transition-color");
      }
      if (img){
        img.classList.add("panel__item--transition-color");
      }
    }, 200);

    setTimeout(() => {
      if(element){
        element.classList.remove("panel__item--yellow");
        if (img){
          img.classList.remove("panel__item--red-shadow");
        }
      }
    }, 300);
  }

  private animateTime(selectedItemId: string, timeRecoveryMs: number){
    let element = document.querySelector(`.panel__item[data-id='${selectedItemId}']`);
    if (!element){
      console.error('element not found in the panel!', selectedItemId);
      return false;
    }

    let canvas = element.querySelector('.panel__item-canvas-ahead') as HTMLCanvasElement|null;
    if (!canvas){
      console.error('canvas-ahead not found in the item!', selectedItemId);
      return;
    }

    canvas.style.display = 'block';
		let ctx = canvas.getContext('2d') || new CanvasRenderingContext2D();
    let leftTimeMs = timeRecoveryMs;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let callback = (drawsDiffMs: number) => {
      if (!canvas){
        console.error('canvas-ahead lost!', selectedItemId);
        return false;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let angle = leftTimeMs / timeRecoveryMs * 360 + 90;
      let endPoint = Helper.getPointByRotateAngle(centerX, centerY, angle, canvas.width / 2);

      //display red line as End time arrow
      ctx.beginPath();
      ctx.strokeStyle = "red";
			ctx.lineWidth = 1;
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(canvas.width / 2, 0);
			ctx.stroke(); 

      //display red line as time arrow
      ctx.beginPath();
      ctx.strokeStyle = "red";
			ctx.lineWidth = 1;
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(endPoint.x, endPoint.y);
			ctx.stroke(); 

      leftTimeMs -= drawsDiffMs;
      let isConunie = leftTimeMs > 0;
      if (!isConunie){
        canvas.style.display = 'none';
      }
      return isConunie;
    } 
    RequestAnimationFrameHelper.start(callback);
  }

  
  private animateSnakes(selectedItemId: string){
    let element = document.querySelector(`.panel__item[data-id='${selectedItemId}']`);
    if (!element){
      console.error('element not found in the panel!', selectedItemId);
      return false;
    }
    
    let canvas = element.querySelector('.panel__item-canvas-behind') as HTMLCanvasElement|null;
    if (!canvas){
      console.error('canvas-behind not found in the item!', selectedItemId);
      return;
    }
    
    canvas.style.display = 'block';
		let ctx = canvas.getContext('2d') || new CanvasRenderingContext2D();

    let leftTimeMs = Panels.durationOfEndRecoveryAdnimationMs;
    let shiftStart = 0;
    let callback = (drawsDiffMs: number) => {
      if (canvas == null){
        console.error('canvas-behind lost!', selectedItemId);
        return false;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let borderShift = 2;
      let lengthOfRoad = canvas.width * 2 - borderShift * 2 + canvas.height * 2 - borderShift * 2;
      let distanceBetweeSnakes = lengthOfRoad / Panels.countSnakesOfEndRecoveryAdnimation;
      
      shiftStart += Panels.speedOfSnakeOfEndRecoveryAdnimationPx / drawsDiffMs;
      if(shiftStart > distanceBetweeSnakes){
        shiftStart -= distanceBetweeSnakes;
      }

      for(var i = 0; i < Panels.countSnakesOfEndRecoveryAdnimation; i++){
        for(var l = 0; l < Panels.lengthOfSnakeOfEndRecoveryAdnimation; l++){
          let positionOnTheRoad = shiftStart + i * distanceBetweeSnakes + l;
          let x = 0;
          let y = 0;

          if(positionOnTheRoad < lengthOfRoad / 4){
            x = borderShift;
            y = positionOnTheRoad;
          }
          else if(positionOnTheRoad < lengthOfRoad / 4 * 2){
            x = positionOnTheRoad - lengthOfRoad / 4;
            y = canvas.height - borderShift;
          }
          else if(positionOnTheRoad < lengthOfRoad / 4 * 3){
            x = canvas.width - borderShift;
            y = lengthOfRoad / 4 * 3 - positionOnTheRoad;
          }
          else{
            x = lengthOfRoad - positionOnTheRoad;
            y = borderShift;
          }

          //ctx.globalAlpha = Panels.lengthOfSnakeOfEndRecoveryAdnimation / (l + 1);
          ctx.globalAlpha = 1 / Panels.lengthOfSnakeOfEndRecoveryAdnimation * (Panels.lengthOfSnakeOfEndRecoveryAdnimation - l);
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
			    ctx.globalAlpha = 1;
        }
      }

      leftTimeMs -= drawsDiffMs;
      let isConunie = leftTimeMs > 0;
      if (!isConunie){
        canvas.style.display = 'none';
      }

      return isConunie;
    } 
    RequestAnimationFrameHelper.start(callback);
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
    if(this.isMouseIn || this.props.isDisabled)
      return;

    if(this.props.selectedItemId){
      switch(event.button){
        case 0: // left click
          let selectedItem = this.getSelectedItem();
          if (selectedItem){
            let mouseDown = Mouse.getCanvasMousePoint();
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
    if(this.isMouseIn || this.props.isDisabled)
      return;

    let isLeftClick = event.button == 0;

    if(this.props.selectedItemId && isLeftClick && this.wasMouseDown){
      let selectedItem = this.getSelectedItem();
      if (selectedItem){
        let mouseUp = Mouse.getCanvasMousePoint();
        let isCreated = Magics.create(selectedItem, mouseUp);
        if (isCreated){
          this.animateRecovery(selectedItem, this.props.selectedItemId);
        }
      }

      this.props.selectItem('');
      this.wasMouseDown = false;
    }
  }

  onKey(event: KeyboardEvent){
    if(!this.props.panels?.length || this.props.isDisabled){
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
    if(this.props.isDisabled)
      return;

    if(!itemId || this.props.selectedItemId == itemId){
      this.props.selectItem('');
      Magics.clearCursor();
      return;
    }

    let selectedItem = this.getSelectedItem(itemId);
    if (selectedItem){
      if(selectedItem.timeRecoveryLeftMs > 0){
        this.props.selectItem('');
        Magics.clearCursor();
        return;
      }

      if(!this.isMouseIn){
        Magics.displayOnCursor(selectedItem);
        AudioSystem.play(-1, SelectingSoundUrl);
      }
    }

    this.props.selectItem(itemId);
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
                <canvas width="90" height="90" className={`panel__item-canvas-behind`}></canvas>
                <div className={"panel__item-container " + (this.props.isDisabled || item?.timeRecoveryLeftMs > 0 ? "" : " panel__item-container--hover ") + (item == null ? " panel__item-container--empty " : "")}>
                  {item == null 
                    ? null 
                    : <div className={"panel__item-img-gif nodrag "} style={{backgroundImage: `url(${item.imageGif.src})`}} />}
                  {item == null 
                    ? null 
                    : <div className={"panel__item-img nodrag " + (this.props.isDisabled || item?.timeRecoveryLeftMs > 0  ? 'panel__item-img--disable' : '')} style={{backgroundImage: `url(${item.image.src})`}} />}
                  {item == null 
                    ? null 
                    : <div className="panel__item-number noselect">{index == 1 ? "Alt + " : index == 2 ? "Shift + " : ""}{(index2 + 1) % 10}</div>}
                </div>
                <canvas width="320" height="320" className={`panel__item-canvas panel${index}__item${index2}-canvas`}></canvas>
                <canvas width="90" height="90" className={`panel__item-canvas-ahead`}></canvas>
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
