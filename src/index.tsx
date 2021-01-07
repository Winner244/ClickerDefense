import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css';
import './fonts.css';

import App from './App';
import Menu from './reactApp/components/Menu/Menu';

let z = <App />;
(window as any).z = z;

ReactDOM.render(
  <React.StrictMode>
    <Menu/>
    {z}
  </React.StrictMode>,
  document.getElementById('react')
);