/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import CustomerPage from './containers/CustomerPage';
import ProductPage from './containers/ProductPage';

// Lazily load routes and code split with webpacck
const LazyCounterPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
);

const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.HOME} component={ProductPage} />
        {/*
        <Route path={routes.OVERVIEW} component={HomePage} />
        */}
        <Route path={routes.CUSTOMERS} component={CustomerPage} />
        {/*
        <Route path={routes.ORDERS} component={HomePage} />
        <Route path={routes.SUPPLY} component={CounterPage} />
        <Route path={routes.SUPPLIERS} component={CounterPage} />
        */}
        <Route path={routes.PRODUCTS} component={ProductPage} />
      </Switch>
    </App>
  );
}
