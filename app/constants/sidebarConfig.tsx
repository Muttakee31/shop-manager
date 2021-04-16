import routes from '../constants/routes.json';
import TimelineIcon from '@material-ui/icons/Timeline';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreIcon from '@material-ui/icons/Store';
import EmojiFoodBeverageIcon from '@material-ui/icons/EmojiFoodBeverage';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import StorageIcon from '@material-ui/icons/Storage';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import ReceiptIcon from '@material-ui/icons/Receipt';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import React from 'react';

interface menuType {
  key: number;
  title: string;
  url: string;
  icon: JSX.Element;
}

const sidebarConfig: { title: string, menu: menuType[] }[] = [
  {
    title: 'Dashboard',
    menu: [
      {
        key: 0,
        title: 'Overview',
        url: routes.OVERVIEW,
        icon: <TimelineIcon />
      },
      {
        key: 1,
        title: 'Stock History',
        url: routes.STOCK_HISTORY,
        icon: <StorageIcon />
      }
    ]
  },
  {
    title: 'Operations',
    menu: [
      {
        key: 2,
        title: 'Order',
        url: routes.ORDERS,
        icon: <ShoppingCartIcon />
      },
      {
        key: 3,
        title: 'Supply',
        url: routes.SUPPLY,
        icon: <StoreIcon />
      }
    ]
  },
  {
    title: 'Transactions',
    menu: [
      {
        key: 4,
        title: 'History',
        url: routes.TRANSACTIONS,
        icon: <SwapVertIcon />
      },
      {
        key: 10,
        title: 'Due payment',
        url: routes.DUE_PAYMENT,
        icon: <KeyboardReturnIcon />
      },
      {
        key: 5,
        title: 'Other expenses',
        url: routes.OTHER_EXPENSE,
        icon: <AccountBalanceWalletIcon />
      },
      {
        key: 6,
        title: 'Bill payment',
        url: routes.BILL_PAYMENT,
        icon: <ReceiptIcon />
      }
    ]
  },
  {
    title: 'Database',
    menu: [
      {
        key: 7,
        title: 'Products',
        url: routes.PRODUCTS,
        icon: <EmojiFoodBeverageIcon />
      },
      {
        key: 8,
        title: 'Customers',
        url: routes.CUSTOMERS,
        icon: <AccountCircleIcon />
      },
      {
        key: 9,
        title: 'Suppliers',
        url: routes.SUPPLIERS,
        icon: <BusinessCenterIcon />
      }
    ]
  }
];

export default sidebarConfig;
