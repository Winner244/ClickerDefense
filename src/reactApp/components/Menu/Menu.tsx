import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as MenuStore from './MenuStore';

import './Menu.scss';

interface Prop {
  isOpen?: boolean
}

type Props =
  MenuStore.MenuState
  & MenuStore.MenuAction
  & Prop;

class Menu extends React.Component<Props, {}> {
  render() {
    if (!this.props.isOpen) {
      return null;
    }

    return (
      <div className="menu noselect" id="menu">
        <div className="menu__body">
            <div className="menu__title">Меню</div>
            <button className="menu__button">Новая игра</button>
            <button className="menu__button">Продолжить</button>
            <button className="menu__button">Магазин</button>
        </div>
      </div>);
  }
}
	
// Wire up the React component to the Redux store
export default connect(
  (state: ApplicationState, ownProps: Prop) => {
      return { ...state.menu, ...ownProps };
  },
  MenuStore.actionCreators
)(Menu) as typeof Menu;
