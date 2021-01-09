import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as GameStore from './GameStore';
import {Menu} from '../Menu/Menu';
import {Game} from '../../../gameApp/gameSystems/Game';

import './GameDisplay.scss';

interface Prop {
  isPause?: boolean
}

type Props =
GameStore.GameState
  & GameStore.GameAction
  & Prop;

class GameDisplay extends React.Component<Props, {}> {

  private canvas: React.RefObject<HTMLCanvasElement>;
  private displayCanvas: boolean;

  constructor(props: any){
    super(props);

    this.canvas = React.createRef();
    this.displayCanvas = false;
  }

  componentDidMount(){
    Game.init(this.canvas.current || new HTMLCanvasElement());
    Menu.showStartMenu();
    //Shop.element.hide();
  }

  render() {
    this.displayCanvas = this.displayCanvas || !this.props.isPause;
    Game.isGameRun = !this.props.isPause;
    return <canvas width="1920" height="882" className='game-canvas' ref={this.canvas} style={{display: this.displayCanvas ? 'block' : 'none'}} ></canvas>
  }
}
	
// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState, ownProps: Prop) => {
      return { ...state.game, ...ownProps };
  },
  GameStore.actionCreators
)(GameDisplay);
