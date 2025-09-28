import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as SuccessfulFinalPanelStore from './SuccessfulFinalPanelStore';

import { App } from '../../App';

import './SuccessfulFinalPanel.scss';

import { AudioSystem } from '../../../gameApp/gameSystems/AudioSystem';

import startImage from '../../../assets/img/star.png'; 
import startEmptyImage from '../../../assets/img/starEmpty.png'; 


interface IState {
  hoverStar: number;
}

interface Prop {
  isOpen?: boolean
}

type Props =
  SuccessfulFinalPanelStore.SuccessfulFinalPanelState
  & SuccessfulFinalPanelStore.SuccessfulFinalPanelAction
  & Prop;

export class SuccessfulFinalPanel extends React.Component<Props, IState> {

  static show(): void
  {
    App.Store.dispatch(SuccessfulFinalPanelStore.actionCreators.open());
  }

  constructor(props: Props) {
    super(props);

    this.state = { 
      hoverStar: -1
    };
  }

  onMouseEnter(index: number){
    this.setState({ hoverStar: index });
  }
  onMouseLeave(index: number){
    this.setState({ hoverStar: -1 });
  }

  renderEmptyStart(){
    return 
  }

  render() {
    if(!this.props.isOpen){
      return null;
    }

    return (
      <div className="successful-final-panel noselect">
          <div className="successful-final-panel__body">
              <div className="successful-final-panel__title">Конец</div>
              <div className='successful-final-panel__text'>
                Понравилось?
                <div className='successful-final-panel__stars-container'>
                  <div className='successful-final-panel__stars'>
                      <div className='nodrag successful-final-panel__star'><img className='nodrag' src={startImage} /></div>
                      <div className='nodrag successful-final-panel__star'><img className='nodrag' src={startImage} /></div>
                      <div className='nodrag successful-final-panel__star'><img className='nodrag' src={startImage} /></div>
                      <div className='nodrag successful-final-panel__star'><img className='nodrag' src={startImage} /></div>
                      <div className='nodrag successful-final-panel__star'><img className='nodrag' src={startImage} /></div>
                  </div>
                  <div className='successful-final-panel__stars-empty'>
                      {[1,2,3,4,5].map(i => {
                        return <div 
                            key={i}
                            className={'nodrag successful-final-panel__star-empty ' + (i <= this.state.hoverStar ? 'successful-final-panel__star-empty--hover' : '')} 
                            onMouseEnter={() => this.onMouseEnter(i)} 
                            onMouseLeave={() => this.onMouseLeave(i)} 
                          >
                          <img className='nodrag' src={startEmptyImage} />
                        </div>;
                      })}
                  </div>
                </div>
                Если да - то я добавлю ещё волн, монстров, строений, магии, юнитов, усилений курсора и новые карты с другими особенностями. 
              </div>
          </div>
      </div>
    );
  }
}
	
// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState, ownProps: Prop) => {
      return { ...state.successfulFinalPanel, ...ownProps };
  },
  SuccessfulFinalPanelStore.actionCreators
)(SuccessfulFinalPanel);
