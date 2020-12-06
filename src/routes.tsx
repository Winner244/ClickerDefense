import * as React from 'react';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router'

import Layout from './reactApp/components/Layout/Layout';
import MainPage from './reactApp/pages/Main/MainPage';
import TestPage from './reactApp/pages/Test/TestPage';
import DemoPage from './reactApp/pages/Demo/DemoPage';

export const routes = <div>
    <Layout>
        <Switch>
            <Route exact path='/' component={MainPage} />
            <Route exact path='/test' component={TestPage} />
            <Route exact path='/test.html' component={TestPage} />
            <Route exact path='/demo' component={DemoPage} />
        </Switch>
    </Layout>
</div>;
