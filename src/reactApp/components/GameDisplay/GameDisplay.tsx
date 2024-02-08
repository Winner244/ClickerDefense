import * as React from 'react';

import {Menu} from '../Menu/Menu';

import {Game} from '../../../gameApp/gameSystems/Game';
import {WavesState} from '../../../gameApp/gameSystems/WavesState';

import './GameDisplay.scss';


class GameDisplay extends React.Component {

  private canvas: React.RefObject<HTMLCanvasElement>;

  constructor(props: any){
    super(props);

    this.canvas = React.createRef();
  }

  componentDidMount(){
    if(this.canvas.current != null){
      this.canvas.current.oncontextmenu = () => false;
    }
    Game.init(this.canvas.current || new HTMLCanvasElement());
    Menu.showStartMenu();

    document.addEventListener('visibilitychange', () => {
      if(document.hidden){
        if(WavesState.isWaveStarted){
          Game.pause();
        }
      }
    });
  }

  render() {
    return <canvas width="1920" height="882" className='game-canvas hide' ref={this.canvas}></canvas>
  }
}
	
export default GameDisplay;
