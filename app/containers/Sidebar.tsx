import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import TimelineIcon from '@material-ui/icons/Timeline';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreIcon from '@material-ui/icons/Store';
import EmojiFoodBeverageIcon from '@material-ui/icons/EmojiFoodBeverage';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import { useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import routes from '../constants/routes.json';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import StorageIcon from '@material-ui/icons/Storage';
import SwapVertIcon from '@material-ui/icons/SwapVert';


const useStyles = makeStyles({
  links: {
    textDecoration: 'none',
    padding: 14,
    cursor: 'pointer',
  },
  whiteWashedLinks: {
    textDecoration: 'none',
    backgroundColor: '#277ea7',
    padding: 14,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    // color: 'black',
  },
  icons: {
    fontSize: 42,
  },
  sideBarChild: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sideText: {
    margin: 10,
  },
});

const Sidebar: React.FC = () => {
  const router = useLocation();
  const history = useHistory();
  const classes = useStyles();
  return (
    <div style={{ height: '100vh' }}>
      <Grid
        className={
          router.pathname === routes.OVERVIEW || router.pathname === routes.HOME
            ? classes.whiteWashedLinks
            : classes.links
        }
        onClick={() => history.push(routes.OVERVIEW)}
        onKeyDown={() => history.push(routes.OVERVIEW)}
        role="presentation"
      >
        <div className={classes.sideBarChild}>
          <TimelineIcon className={classes.icons} />
          <span className={classes.sideText}>Overview</span>
        </div>
      </Grid>

      <Grid
        className={
          router.pathname === routes.ORDERS ||
          router.pathname === routes.PLACE_ORDERS
            ? classes.whiteWashedLinks
            : classes.links
        }
        onClick={() => history.push(routes.ORDERS)}
        onKeyDown={() => history.push(routes.ORDERS)}
        role="presentation"
      >
        <div className={classes.sideBarChild}>
          <ShoppingCartIcon className={classes.icons} />
          <span className={classes.sideText}>Orders</span>
        </div>
      </Grid>

      <Grid
        className={
          router.pathname === routes.SUPPLY ||
          router.pathname === routes.ADD_SUPPLY
            ? classes.whiteWashedLinks
            : classes.links
        }
        onClick={() => history.push(routes.SUPPLY)}
        onKeyDown={() => history.push(routes.SUPPLY)}
        role="presentation"
      >
        <div className={classes.sideBarChild}>
          <StoreIcon className={classes.icons} />
          <span className={classes.sideText}>Supply</span>
        </div>
      </Grid>

      <Grid
        className={
          router.pathname === routes.TRANSACTIONS
            ? classes.whiteWashedLinks
            : classes.links
        }
        onClick={() => history.push(routes.TRANSACTIONS)}
        onKeyDown={() => history.push(routes.TRANSACTIONS)}
        role="presentation"
      >
        <div className={classes.sideBarChild}>
          <SwapVertIcon className={classes.icons} />
          <span className={classes.sideText}>Transactions</span>
        </div>
      </Grid>

      <Grid
        className={
          router.pathname === routes.OTHER_EXPENSE
            ? classes.whiteWashedLinks
            : classes.links
        }
        onClick={() => history.push(routes.OTHER_EXPENSE)}
        onKeyDown={() => history.push(routes.OTHER_EXPENSE)}
        role="presentation"
      >
        <div className={classes.sideBarChild}>
          <AccountBalanceWalletIcon className={classes.icons} />
          <span className={classes.sideText}>Other expense</span>
        </div>
      </Grid>

      <Grid
        className={
          router.pathname === routes.PRODUCTS ||
          router.pathname === routes.ADD_PRODUCTS
            ? classes.whiteWashedLinks
            : classes.links
        }
        onClick={() => history.push(routes.PRODUCTS)}
        onKeyDown={() => history.push(routes.PRODUCTS)}
        role="presentation"
      >
        <div className={classes.sideBarChild}>
          <EmojiFoodBeverageIcon className={classes.icons} />
          <span className={classes.sideText}>Products</span>
        </div>
      </Grid>

      <Grid
        className={
          router.pathname === routes.STOCK_HISTORY
            ? classes.whiteWashedLinks
            : classes.links
        }
        onClick={() => history.push(routes.STOCK_HISTORY)}
        onKeyDown={() => history.push(routes.STOCK_HISTORY)}
        role="presentation"
      >
        <div className={classes.sideBarChild}>
          <StorageIcon className={classes.icons} />
          <span className={classes.sideText}>Stock History</span>
        </div>
      </Grid>

      <Grid
        className={
          router.pathname === routes.CUSTOMERS
            ? classes.whiteWashedLinks
            : classes.links
        }
        onClick={() => history.push(routes.CUSTOMERS)}
        onKeyDown={() => history.push(routes.CUSTOMERS)}
        role="presentation"
      >
        <div className={classes.sideBarChild}>
          <AccountCircleIcon className={classes.icons} />
          <span className={classes.sideText}>Customers</span>
        </div>
      </Grid>


      <Grid
        className={
          router.pathname === routes.SUPPLIERS
            ? classes.whiteWashedLinks
            : classes.links
        }
        onClick={() => history.push(routes.SUPPLIERS)}
        onKeyDown={() => history.push(routes.SUPPLIERS)}
        role="presentation"
      >
        <div className={classes.sideBarChild}>
          <BusinessCenterIcon className={classes.icons} />
          <span className={classes.sideText}>Suppliers</span>
        </div>
      </Grid>
    </div>
  );
};
export default Sidebar;
