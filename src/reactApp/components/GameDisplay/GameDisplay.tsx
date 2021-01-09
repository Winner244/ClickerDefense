import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as GameStore from './GameStore';
import {Menu} from '../Menu/Menu';
import {Game} from '../../../gameApp/gameSystems/Game';

interface Prop {
  isPause?: boolean
}

type Props =
GameStore.GameState
  & GameStore.GameAction
  & Prop;

class GameDisplay extends React.Component<Props, {}> {

  private canvas: React.RefObject<HTMLCanvasElement>;

  constructor(props: any){
    super(props);

    this.canvas = React.createRef();
  }

  componentDidMount(){
    Game.init(this.canvas.current || new HTMLCanvasElement());
    Menu.showStartMenu();
    //Shop.element.hide();
  }

  render() {
    console.log('GameDisplay render');
    Game.isGameRun = !this.props.isPause;
    return (
      <div>
        Game {this.props.isPause ? 'isPaused' : 'is not pause'}
        <canvas width="1920" height="882" id='canvas' ref={this.canvas} ></canvas>
      </div>);
  }
}
	
// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState, ownProps: Prop) => {
      return { ...state.game, ...ownProps };
  },
  GameStore.actionCreators
)(GameDisplay);
