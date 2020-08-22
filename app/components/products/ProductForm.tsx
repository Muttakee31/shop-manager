import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory, useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Sidebar from '../../containers/Sidebar';
import * as dbpath from '../../constants/config';
import dayjs from 'dayjs';

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
    '& .MuiFormLabel-root.Mui-disabled': {
      color: '#c1bbae',
    }
  },
})(TextField);

const useStyles = makeStyles({
  texts: {
    color: 'whitesmoke',
  },
  header: {
    textAlign: 'center',
    color: 'white',
    textDecoration: 'underline',
    textUnderlinePosition: 'under'
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
    '&:hover' : {
      background: '#d7495d',
      color: 'floralwhite',
    },
    '&:focus' : {
      background: '#d94056',
      color: 'floralwhite',
    },
  },
});

export default function ProductForm(): JSX.Element {
  const [productName, setProductName] = useState('');
  const [productID, setProductID] = useState(null);
  const [productCode, setProductCode] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [shopStock, setShopStock] = useState('');
  const [godownStock, setGodownStock] = useState('');

  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    // @ts-ignore
    const state: any = location.state;
    if (state.product !== null) {
      console.log(state.product);
      setProductID(state.product.id);
      setProductCode(state.product.code);
      setProductName(state.product.title);
      setPrice(state.product.price);
      setUnit(state.product.unit);
      setGodownStock(String(state.product.godown_stock_count));
      setShopStock(String(state.product.shop_stock_count));
    }
    /* if (location.state.instant !== undefined) {
      console.log(location.state.instant);
    } */
  }, []);

  const createProduct = () => {
    const db = new sqlite3.Database(dbpath.dbPath);

    // insert one row into the langs table
    db.run(
      `INSERT INTO Product(title, price, unit, code, shop_stock_count, godown_stock_count) VALUES(?,?,?,?,?,?) `,
      [
        productName,
        price,
        unit,
        productCode,
        Number(shopStock),
        Number(godownStock),
      ],
      function (err: Error) {
        if (err) {
          console.log(err.message);
        }
        else {
          // @ts-ignore
          const id = this.lastID;
          const today = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss[Z]');

          db.run(
            `INSERT INTO StockHistory(product, product_title, date_created, date_updated,
                      prev_shop_stock, current_shop_stock, prev_godown_stock, current_godown_stock)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              productName,
              today,
              today,
              shopStock,
              shopStock,
              godownStock,
              godownStock,
            ],
            function (err: Error) {
              if (err) {
                console.log(productID);
                console.log(err.message);
              }
              // get the last insert id
              history.goBack();
              // console.log(`A row has been inserted`);
            }
          );
        }
        // get the last insert id
        // console.log(`A row has been inserted`);
      }
    );

    // close the database connection
    db.close();
  };

  const updateProduct = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    const temp = new Date();
    temp.setHours(0,0,0,0);
    const midnight = dayjs(temp).format('YYYY-MM-DDThh:mm:ss[Z]');

    // insert one row into the langs table
    db.run(
      `UPDATE Product SET title = ?, price = ?, code = ?, unit = ?, shop_stock_count = ?, godown_stock_count = ? WHERE id=?`,
      [
        productName,
        price,
        productCode,
        unit,
        shopStock,
        godownStock,
        productID,
      ],
      function (err: Error) {
        if (err) {
          console.log(err.message);
        }
        else {
          const state: any = location.state;
          const today = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss[Z]');

          console.log(state);
          if (shopStock !== state.product.shop_stock_count || godownStock !== state.product.godown_stock_count) {
            db.run(`UPDATE StockHistory SET current_shop_stock = ?, current_godown_stock = ?,
            date_updated = ? WHERE product = ? and date_created = ?`,
              [shopStock, godownStock, today, state.product.id, midnight],
              function(err:Error) {
              if (err) {
                console.log(err.message);
              }
              else {
                history.goBack();
              }
            });
          }
          else {
            history.goBack();
          }
        }
        // get the last insert id

        // console.log(`A row has been inserted`);
      }
    );

    // close the database connection
    // disabled={productID !== null}
    db.close();
  };

  return (
    <Grid container direction="row">
      <Grid item sm={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid
        item
        sm={8}
        lg={9}
        direction="column"
        justify="center"
        className={classes.grid}
      >
        <Grid className={classes.header}>
          <h3>Add a product</h3>
        </Grid>

        <form autoComplete="off" style={{ width: '320px', margin: 'auto' }}>
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
              id="standard-required"
              label="Product code"
              value={productCode}
              className={classes.textField}
              fullWidth
              onChange={(e) => setProductCode(e.target.value)}
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
              onChange={(e) => setShopStock(e.target.value)}

            />
          </Grid>
          <Grid>
            <CssTextField
              id="standard-basic"
              label="Stock in godown"
              value={godownStock}
              fullWidth
              className={classes.textField}
              onChange={(e) => setGodownStock(e.target.value)}
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
            {productID === null ? (
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
            ) : (
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
            )}
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
