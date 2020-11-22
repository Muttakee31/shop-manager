/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import CustomerList from './components/users/CustomerList';
import OverviewPage from './containers/OverviewPage';
import ProductForm from './components/products/ProductForm';
import OrderPage from './components/orders/OrderPage';
import SupplyPage from './components/supply/SupplyPage';
import SupplierList from './components/users/SupplierList';
import TransactionList from './components/payment/TransactionList';
import SupplyList from './components/supply/SupplyList';
import OrderList from './components/orders/OrderList';
import OrderDetails from './components/orders/OrderDetails';
import SupplyDetails from './components/supply/SupplyDetails';
import UserDetails from './components/users/UserDetails';
import ProductList from './components/products/ProductList';
import OtherExpenseForm from './components/payment/OtherExpenseForm';
import DueTransaction from './components/payment/DueTransaction';
import StockHistoryList from './components/products/StockHistoryList';
import TransactionDetails from './components/payment/TransactionDetails';
import TransactionForm from './components/payment/TransactionForm';
import UpdateUser from './components/users/UpdateUser';
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
        <Route path={routes.PRODUCTS} component={ProductList} />
        <Route path={routes.ADD_PRODUCTS} component={ProductForm} />
        <Route path={routes.STOCK_HISTORY} component={StockHistoryList} />

        <Route path={routes.ORDERS} component={OrderList} />
        <Route path={routes.PLACE_ORDERS} component={OrderPage} />
        <Route path={routes.CUSTOMERS} component={CustomerList} />
        <Route path={routes.ORDER_DETAILS} component={OrderDetails} />

        <Route path={routes.SUPPLY} component={SupplyList} />
        <Route path={routes.ADD_SUPPLY} component={SupplyPage} />
        <Route path={routes.SUPPLIERS} component={SupplierList} />
        <Route path={routes.SUPPLY_DETAILS} component={SupplyDetails} />

        <Route path={routes.TRANSACTIONS} component={TransactionList} />
        <Route path={routes.TRANSACTION_DETAILS} component={TransactionDetails} />
        <Route path={routes.UPDATE_TRANSACTION} component={TransactionForm} />
        <Route path={routes.OTHER_EXPENSE} component={OtherExpenseForm} />
        <Route path={routes.USER_DETAILS} component={UserDetails} />
        <Route path={routes.UPDATE_USER} component={UpdateUser} />
        <Route path={routes.DUE_PAYMENT} component={DueTransaction} />

        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.OVERVIEW} component={OverviewPage} />
        <Route path={routes.HOME} component={OverviewPage} />

      </Switch>
    </App>
  );
}
