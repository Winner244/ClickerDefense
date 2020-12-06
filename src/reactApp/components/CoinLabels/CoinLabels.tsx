import * as React from 'react';
import {connect} from 'react-redux';

import {ApplicationState} from '../../store';
import * as CoinLabelsStore from './CoinLabelsStore';

import {App} from '../../App';

import './CoinLabels.scss';

import {Label} from '../../../gameApp/labels/Label';
import {Labels} from '../../../gameApp/labels/Labels';

interface Prop {
}

type Props =
CoinLabelsStore.CoinLabelsState
  & CoinLabelsStore.CoinLabelsAction
  & Prop;

export class CoinLabels extends React.Component<Props, {}> {

  static add(x: number, y: number, number: number, lifeTimeMs: number): void{
    y -= 10;
    x += 10;
    const item = new Label(x, y, '-' + number, 255, 255, 0, lifeTimeMs);
    App.Store.dispatch(CoinLabelsStore.actionCreators.add(item));

    
    let updatedTime = Date.now();
    const interval = setInterval(() => {
      if(lifeTimeMs > 0){
        const difTimeMs = Date.now() - updatedTime;
        updatedTime = Date.now();
        lifeTimeMs -= difTimeMs;

        item.y -= difTimeMs * Labels.speedOfUppingToTop / 1000; 
        App.Store.dispatch(CoinLabelsStore.actionCreators.update(item.id, item.x, item.y));
      }
      else{
        clearInterval(interval);
        App.Store.dispatch(CoinLabelsStore.actionCreators.delete(item.id));
      }
    }, 10);
  }

  render() {
    if(!this.props.items || this.props.items.length == 0){
      return null;
    }

    return (
      <div className="coin-labels noselect">
        {this.props.items.map(item => 
          <div key={item.id} className="coin-labels__label" style={{left: item.x + 'px', top: item.y + 'px'}}>{item.text}</div>
        )}
      </div>
    );
  }
}
	
// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState, ownProps: Prop) => {
      return { ...state.coinLabels, ...ownProps };
  },
  CoinLabelsStore.actionCreators
)(CoinLabels);
