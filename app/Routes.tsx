/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import CustomerList from './components/users/CustomerList';
import ProductPage from './containers/ProductPage';
import OverviewPage from './containers/OverviewPage';
import ProductForm from './components/products/ProductForm';
import OrderPage from './components/orders/OrderPage';
import SupplyPage from './components/supply/SupplyPage';
import SupplierList from './components/users/SupplierList';
import TransactionList from './components/payment/TransactionList';
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
        <Route path={routes.OVERVIEW} component={OverviewPage} />
        <Route path={routes.CUSTOMERS} component={CustomerList} />
        {/*
        <Route path={routes.ORDERS} component={OrderList} />
        <Route path={routes.ORDERS} component={HomePage} />
        */}
        <Route path={routes.SUPPLIERS} component={SupplierList} />
        <Route path={routes.TRANSACTIONS} component={TransactionList} />
        <Route path={routes.SUPPLY} component={SupplyPage} />
        <Route path={routes.PRODUCTS} component={ProductPage} />
        <Route path={routes.ADD_PRODUCTS} component={ProductForm} />
        <Route path={routes.PLACE_ORDERS} component={OrderPage} />
        <Route path={routes.HOME} component={OverviewPage} />
        {/* <Route path={routes.ADD_PRODUCTS} component={ProductForm} /> */}
      </Switch>
    </App>
  );
}
