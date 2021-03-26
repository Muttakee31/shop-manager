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
import BillPayment from './components/payment/BillPayment';
import ParentRoute from './containers/ParentRoute';
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
        <ParentRoute path={routes.PRODUCTS} component={ProductList} />
        <ParentRoute path={routes.ADD_PRODUCTS} component={ProductForm} />
        <ParentRoute path={routes.STOCK_HISTORY} component={StockHistoryList} />

        <ParentRoute path={routes.ORDERS} component={OrderList} />
        <ParentRoute path={routes.PLACE_ORDERS} component={OrderPage} />
        <ParentRoute path={routes.CUSTOMERS} component={CustomerList} />
        <ParentRoute path={routes.ORDER_DETAILS} component={OrderDetails} />

        <ParentRoute path={routes.SUPPLY} component={SupplyList} />
        <ParentRoute path={routes.ADD_SUPPLY} component={SupplyPage} />
        <ParentRoute path={routes.SUPPLIERS} component={SupplierList} />
        <ParentRoute path={routes.SUPPLY_DETAILS} component={SupplyDetails} />

        <ParentRoute path={routes.TRANSACTIONS} component={TransactionList} />
        <ParentRoute path={routes.TRANSACTION_DETAILS} component={TransactionDetails} />
        <ParentRoute path={routes.UPDATE_TRANSACTION} component={TransactionForm} />
        <ParentRoute path={routes.OTHER_EXPENSE} component={OtherExpenseForm} />
        <ParentRoute path={routes.USER_DETAILS} component={UserDetails} />
        <ParentRoute path={routes.UPDATE_USER} component={UpdateUser} />
        <ParentRoute path={routes.DUE_PAYMENT} component={DueTransaction} />
        <ParentRoute path={routes.BILL_PAYMENT} component={BillPayment} />

        <Route path={routes.COUNTER} component={CounterPage} />
        <ParentRoute path={routes.OVERVIEW} component={OverviewPage} />
        <ParentRoute path={routes.HOME} component={OverviewPage} />

      </Switch>
    </App>
  );
}
