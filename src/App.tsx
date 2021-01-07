import React from 'react';
import { connect } from 'react-redux'

import { addTodo } from './AppAction'
import './App.scss';

class App extends React.Component {
  constructor(props:any) {
    super(props);
    this.state = { input: 0 };
  }

  handleAddTodo = () => {
    // sets state back to empty string
    this.setState({ input: '' })
  }

  render() {
    return (
      <div>
        <button className="add-todo" onClick={this.handleAddTodo}>
          Add Todo
        </button>
      </div>
    )
  }
}

export default connect(
  null,
  { addTodo }
)(App)