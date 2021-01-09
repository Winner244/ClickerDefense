import * as React from 'react';

import {Menu} from '../Menu/Menu';
import {Game} from '../../../gameApp/gameSystems/Game';

import './GameDisplay.scss';


class GameDisplay extends React.Component {

  private canvas: React.RefObject<HTMLCanvasElement>;

  constructor(props: any){
    super(props);

    this.canvas = React.createRef();
  }

  componentDidMount(){
    Game.init(this.canvas.current || new HTMLCanvasElement());
    Menu.showStartMenu();
  }

  render() {
    return <canvas width="1920" height="882" className='game-canvas' ref={this.canvas}></canvas>
  }
}
	
export default GameDisplay;
