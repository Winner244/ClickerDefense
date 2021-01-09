import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import configureStore from './reactApp/store/configureStore';

import * as RoutesModule from './routes';
import {App} from './reactApp/App';

// Create browser history to use in the Redux store
App.History = createBrowserHistory();

// Get the application-wide store instance, prepopulating with state from the server where available.
App.Store = configureStore(App.History);

import './common.css';
import './fonts.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={App.Store}>
      <ConnectedRouter history={App.History} children={RoutesModule.routes} />
    </Provider>
  </React.StrictMode>,
  document.getElementById('react')
);