import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as GameStore from './GameStore';

interface Prop {
  isPause?: boolean
}

type Props =
GameStore.GameState
  & GameStore.GameAction
  & Prop;

class Game extends React.Component<Props, {}> {
  render() {
    return (
      <div>
        Game {this.props.isPause ? 'isPaused' : 'is not pause'}
      </div>);
  }
}
	
// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState, ownProps: Prop) => {
      return { ...state.game, ...ownProps };
  },
  GameStore.actionCreators
)(Game);
