import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreIcon from '@material-ui/icons/Store';
import EmojiFoodBeverageIcon from '@material-ui/icons/EmojiFoodBeverage';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import { useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import routes from '../constants/routes.json';

const useStyles = makeStyles({
  links: {
    textDecoration: 'none',
    padding: 14,
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
    cursor: 'pointer',
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
          router.pathname === routes.OVERVIEW
            ? classes.whiteWashedLinks
            : classes.links
        }
      >
        <div
          role="presentation"
          className={classes.sideBarChild}
          onClick={() => history.push(routes.OVERVIEW)}
          onKeyDown={() => history.push(routes.OVERVIEW)}
        >
          <AssessmentIcon className={classes.icons} />
          <span className={classes.sideText}>Overview</span>
        </div>
      </Grid>

      <Grid
        className={
          router.pathname === routes.PLACE_ORDERS
            ? classes.whiteWashedLinks
            : classes.links
        }
      >
        <div
          role="presentation"
          className={classes.sideBarChild}
          onClick={() => history.push(routes.PLACE_ORDERS)}
          onKeyDown={() => history.push(routes.PLACE_ORDERS)}
        >
          <ShoppingCartIcon className={classes.icons} />
          <span className={classes.sideText}>Orders</span>
        </div>
      </Grid>

      <Grid
        className={
          router.pathname === routes.SUPPLY
            ? classes.whiteWashedLinks
            : classes.links
        }
      >
        <div
          role="presentation"
          className={classes.sideBarChild}
          onClick={() => history.push(routes.SUPPLY)}
          onKeyDown={() => history.push(routes.SUPPLY)}
        >
          <StoreIcon className={classes.icons} />
          <span className={classes.sideText}>Supply</span>
        </div>
      </Grid>

      <Grid
        className={
          router.pathname === routes.CUSTOMERS
            ? classes.whiteWashedLinks
            : classes.links
        }
      >
        <div
          role="presentation"
          className={classes.sideBarChild}
          onClick={() => history.push(routes.CUSTOMERS)}
          onKeyDown={() => history.push(routes.CUSTOMERS)}
        >
          <AccountCircleIcon className={classes.icons} />
          <span className={classes.sideText}>Customers</span>
        </div>
      </Grid>

      <Grid
        className={
          router.pathname === routes.PRODUCTS ||
          router.pathname === routes.ADD_PRODUCTS
            ? classes.whiteWashedLinks
            : classes.links
        }
      >
        <div
          role="presentation"
          className={classes.sideBarChild}
          onClick={() => history.push(routes.PRODUCTS)}
          onKeyDown={() => history.push(routes.PRODUCTS)}
        >
          <EmojiFoodBeverageIcon className={classes.icons} />
          <span className={classes.sideText}>Products</span>
        </div>
      </Grid>
      <Grid
        className={
          router.pathname === routes.SUPPLIERS
            ? classes.whiteWashedLinks
            : classes.links
        }
      >
        <div
          role="presentation"
          className={classes.sideBarChild}
          onClick={() => history.push(routes.SUPPLIERS)}
          onKeyDown={() => history.push(routes.SUPPLIERS)}
        >
          <BusinessCenterIcon className={classes.icons} />
          <span className={classes.sideText}>Suppliers</span>
        </div>
      </Grid>
    </div>
  );
};
export default Sidebar;
