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
  componentDidMount(){
    Game.init();
    Menu.showStartMenu();
    //Shop.element.hide();
  }

  render() {
    return (
      <div>
        Game {this.props.isPause ? 'isPaused' : 'is not pause'}
        <canvas width="1920" height="882" id='canvas'></canvas>
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
