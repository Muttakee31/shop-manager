import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
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
});

const Sidebar: React.FC = () => {
  const router = useLocation();
  console.log(router.pathname);
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
        <Link to={routes.OVERVIEW}>
          <AssessmentIcon className={classes.icons} />
          <span>Overview</span>
        </Link>
      </Grid>
      <Grid
        className={
          router.pathname === routes.ORDERS
            ? classes.whiteWashedLinks
            : classes.links
        }
      >
        <Link to={routes.ORDERS}>
          <ShoppingCartIcon className={classes.icons} />
          Orders
        </Link>
      </Grid>
      <Grid
        className={
          router.pathname === routes.SUPPLY
            ? classes.whiteWashedLinks
            : classes.links
        }
      >
        <Link to={routes.SUPPLY}>
          <StoreIcon className={classes.icons} />
          Supply
        </Link>
      </Grid>
      <Grid
        className={
          router.pathname === routes.CUSTOMERS
            ? classes.whiteWashedLinks
            : classes.links
        }
      >
        <Link to={routes.HOME}>
          <AccountCircleIcon className={classes.icons} />
          Customers
        </Link>
      </Grid>
      <Grid
        className={
          router.pathname === routes.PRODUCTS
            ? classes.whiteWashedLinks
            : classes.links
        }
      >
        <Link to={routes.PRODUCTS}>
          <EmojiFoodBeverageIcon className={classes.icons} />
          Products
        </Link>
      </Grid>
      <Grid
        className={
          router.pathname === routes.SUPPLIERS
            ? classes.whiteWashedLinks
            : classes.links
        }
      >
        <Link to={routes.SUPPLIERS}>
          <BusinessCenterIcon className={classes.icons} />
          Suppliers
        </Link>
      </Grid>
    </div>
  );
};
export default Sidebar;
