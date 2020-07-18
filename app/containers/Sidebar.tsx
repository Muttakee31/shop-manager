import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreIcon from '@material-ui/icons/Store';
import EmojiFoodBeverageIcon from '@material-ui/icons/EmojiFoodBeverage';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import { useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  links: {
    textDecoration: 'none',
    color: 'white'
  }
});

const Sidebar : React.FC = () => {
  const router = useLocation();
  console.log(router.pathname);
  const classes = useStyles();
  return(
    <div style={{height:'100vh'}}>
      <Grid>
        <Link to={routes.OVERVIEW}>
          <AssessmentIcon />
          Overview
        </Link>
      </Grid>
      <Grid className={classes.links}>
        <Link to={routes.ORDERS}>
          <ShoppingCartIcon />
          Orders
        </Link>
      </Grid>
      <Grid>
        <Link to={routes.SUPPLY}>
          <StoreIcon />
          Supply
        </Link>
      </Grid>
      <Grid>
        <Link to={routes.HOME}>
          <AccountCircleIcon />
          Customers
        </Link>
      </Grid>
      <Grid>
        <Link to={routes.PRODUCTS}>
          <EmojiFoodBeverageIcon />
          Products
        </Link>
      </Grid>
      <Grid>
        <Link to={routes.SUPPLIERS}>
          <BusinessCenterIcon />
          Suppliers
        </Link>
      </Grid>
    </div>
  )
}
export default Sidebar;
