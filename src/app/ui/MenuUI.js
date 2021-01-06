'use strict';

class MenuUI extends React.Component {

  constructor(props) {
    super(props);
	this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'Menu1';
    }

    return React.createElement(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Нравится'
    );
  }
}
	
ReactDOM.render(React.createElement(MenuUI), document.querySelector('#menu'));