import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';

import configureStore from './reactApp/store/configureStore';

import * as RoutesModule from './routes';

// Create browser history to use in the Redux store
const history: History = createBrowserHistory();

let routes = RoutesModule.routes;

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore(history);

import './common.css';
import './fonts.css';

import Menu from './reactApp/components/Menu/Menu';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <ConnectedRouter history={history} children={routes} />
    </Provider>
  </React.StrictMode>,
  document.getElementById('react')
);