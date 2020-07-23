import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory, useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Sidebar from '../../containers/Sidebar';

const sqlite3 = require('sqlite3').verbose();

const CssTextField = withStyles({
  root: {
    '& label': {
      color: 'floralwhite',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: 'floralwhite',
    },
    '& label.Mui-focused': {
      color: 'lightblue',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'lightblue',
    },
    '& input': {
      color: 'floralwhite',
    },
  },
})(TextField);

const useStyles = makeStyles({
  texts: {
    color: 'whitesmoke',
  },
  header: {
    textAlign: 'center',
    color: 'white',
  },
  grid: {
    marginTop: 40,
  },
  textField: {
    color: 'white',
    borderColor: 'white',
    margin: 10,
  },
  input: {
    color: 'white',
  },
  deleteButton: {
    background: '#ca263d',
    marginRight: 15,
    color: 'floralwhite',
  }
});

export default function ProductForm(): JSX.Element {
  const [productName, setProductName] = useState('');
  const [productID, setProductID] = useState(null);
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [shopStock, setShopStock] = useState(0);
  const [godownStock, setGodownStock] = useState(0);

  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    const state: any = location.state;
    if (state.product !== null) {
      console.log(state.product)
      setProductID(state.product.ID);
      setProductName(state.product.title);
      setPrice(state.product.price);
      setUnit(state.product.unit);
      setGodownStock(state.product.godown_stock_count);
      setShopStock(state.product.shop_stock_count);
    }
    /*if (location.state.instant !== undefined) {
      console.log(location.state.instant);
    }*/
  }, []);

  const createProduct = () => {
    const db = new sqlite3.Database('shopdb.sqlite3');

    // insert one row into the langs table
    db.run(
      `INSERT INTO Product(title, price, unit, shop_stock_count, godown_stock_count) VALUES(?,?,?,?,?) `,
      [productName, price, unit, shopStock, godownStock],
      function (err: Error) {
        if (err) {
          // console.log(err.message);
        }
        // get the last insert id
        history.goBack();
        // console.log(`A row has been inserted`);
      }
    );

    // close the database connection
    db.close();
  };

  const updateProduct = () => {
    const db = new sqlite3.Database('shopdb.sqlite3');

    // insert one row into the langs table
    db.run(
      `UPDATE Product SET title = ?, price = ?, unit = ?, shop_stock_count = ?, godown_stock_count = ? WHERE rowId=?`,
      [productName, price, unit, shopStock, godownStock, productID],
      function (err: Error) {
        if (err) {
          console.log(err.message);
        }
        // get the last insert id
        history.goBack();
        // console.log(`A row has been inserted`);
      }
    );

    // close the database connection
    db.close();
  };


  return (
    <Grid container direction='row'>
      <Grid item sm={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item sm={8} lg={9}
            direction="column"
            justify="center"
            className={classes.grid}>
        <Grid className={classes.header}>
          <h3>Add a product</h3>
        </Grid>

        <form autoComplete="off" style={{width: '320px', margin: 'auto'}}>
          <Grid>
            <CssTextField
              id="standard-required"
              label="Name"
              value={productName}
              className={classes.textField}
              fullWidth
              onChange={(e) => setProductName(e.target.value)}
            />
          </Grid>

          <Grid>
            <CssTextField
              id="standard-basic"
              label="Price"
              value={price}
              fullWidth
              className={classes.textField}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid>
            <CssTextField
              id="standard-basic"
              label="Unit"
              value={unit}
              className={classes.textField}
              fullWidth
              onChange={(e) => setUnit(e.target.value)}
            />
          </Grid>
          <Grid>
            <CssTextField
              id="standard-basic"
              label="Stock in shop"
              value={shopStock}
              fullWidth
              className={classes.textField}
              onChange={(e) => setShopStock(Number(e.target.value))}
            />
          </Grid>
          <Grid>
            <CssTextField
              id="standard-basic"
              label="Stock in godown"
              value={godownStock}
              fullWidth
              className={classes.textField}
              onChange={(e) => setGodownStock(Number(e.target.value))}
            />
          </Grid>
          <Grid style={{ marginTop: '30px' }}>
            <Button
              variant="contained"
              className={classes.deleteButton}
              onClick={(e) => {
                e.preventDefault();
                history.goBack();
              }}
            >
              Cancel
            </Button>
            {productID === null ?
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  createProduct();
                }}
              >
                Submit
              </Button>
              :
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  updateProduct();
                }}
              >
                Update
              </Button>
            }
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
