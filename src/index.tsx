import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import * as MenuStore from './reactApp/components/Menu/MenuStore';

const store = createStore(MenuStore.reducer);

import './index.css';
import './fonts.css';

import Menu from './reactApp/components/Menu/Menu';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <Menu/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('react')
);