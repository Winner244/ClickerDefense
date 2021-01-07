import * as React from 'react';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router'

import Layout from './reactApp/components/Layout/Layout';
import MainPage from './reactApp/pages/Main/MainPage';
import TestPage from './reactApp/pages/Test/TestPage';

export const routes = <div>
    <Layout>
        <Switch>
            <Route exact path='/' component={MainPage} />
            <Route exact path='/test' component={TestPage} />
        </Switch>
    </Layout>
</div>;
