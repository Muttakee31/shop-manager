import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory, useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import * as dbpath from '../../constants/config';
import dayjs from 'dayjs';
import { authToken, isAuthenticated, logOutUser, userName } from '../../features/auth/authSlice';
import Alert from '@material-ui/lab/Alert';
import { useSelector } from 'react-redux';
import CssTextField from '../snippets/CssTextField';
import routes from '../../constants/routes.json';

const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');


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
  const [alert, setAlert] = useState<string | null>(null);

  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const authFlag= useSelector(isAuthenticated);
  const user= useSelector(userName);
  const token= useSelector(authToken);

  useEffect(() => {
    // @ts-ignore
    const state: any = location.state;
    if (state.product !== null) {
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
    setAlert(null);
    // insert one row into the langs table
    db.run(
      `INSERT INTO Product(title, price, unit, code, shop_stock_count, godown_stock_count) VALUES(?,?,?,?,?,?) `,
      [
        productName,
        price,
        unit,
        productCode,
        !shopStock || shopStock.length === 0 ? 0 : shopStock,
        !godownStock || godownStock.length === 0 ? 0 : godownStock,
      ],
      function (err: Error) {
        if (err) {
          console.log(err.message);
          setAlert('Product Code is not unique. Enter a unique code.');
        }
        else {
          // @ts-ignore
          const id = this.lastID;
          const today = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss[Z]');
          const temp = new Date();
          temp.setHours(0,0,0,0);
          const midnight = dayjs(temp).format('YYYY-MM-DDTHH:mm:ss[Z]');

          db.run(
            `INSERT INTO StockHistory(product, product_title, date_created, date_updated,
                      prev_shop_stock, current_shop_stock, prev_godown_stock, current_godown_stock)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              productName,
              midnight,
              today,
              !shopStock || shopStock.length === 0 ? 0 : shopStock,
              !shopStock || shopStock.length === 0 ? 0 : shopStock,
              !godownStock || godownStock.length === 0 ? 0 : godownStock,
              !godownStock || godownStock.length === 0 ? 0 : godownStock,
            ],
            function (err: Error) {
              if (err) {
                console.log(err.message);
              }
              // get the last insert id
              history.replace({
                pathname: routes.PRODUCTS,
                state: {  verticalScrollHeight: location && location.state && location.state.verticalScrollHeight },
              })
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
    const temp = new Date();
    temp.setHours(0, 0, 0, 0);
    const midnight = dayjs(temp).format('YYYY-MM-DDTHH:mm:ss[Z]');

    // insert one row into the langs table
    try {
      setAlert(null);
      const decoded = jwt.verify(token, dbpath.SECRET_KEY);
      const db = new sqlite3.Database(dbpath.dbPath);
      if (decoded.username === user) {
        db.run(
          `UPDATE Product SET title = ?, price = ?,
       code = ?, unit = ?, shop_stock_count = ?, godown_stock_count = ? WHERE id=?`,
          [
            productName,
            price,
            productCode,
            unit,
            shopStock,
            godownStock,
            productID,
          ],
          function(err: Error) {
            if (err) {
              console.log(err.message);
              setAlert("Product Code is not unique. Enter a unique code.");
            } else {
              const state: any = location.state;
              const today = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss[Z]');

              //console.log(state);
              if (shopStock !== state.product.shop_stock_count || godownStock !== state.product.godown_stock_count) {
                db.run(`UPDATE StockHistory SET current_shop_stock = ?, current_godown_stock = ?,
            date_updated = ? WHERE product = ? and date_created = ?`,
                  [shopStock, godownStock, today, state.product.id, midnight],
                  function(err: Error) {
                    if (err) {
                      console.log(err.message);
                    } else {
                      history.replace({
                        pathname: routes.PRODUCTS,
                        state: {  verticalScrollHeight: location && location.state && location.state.verticalScrollHeight },
                      })
                    }
                  });
              } else {
                history.replace({
                  pathname: routes.PRODUCTS,
                  state: {verticalScrollHeight: location && location.state && location.state.verticalScrollHeight },
                });
              }
            }
          });
      }
      else {
        logOutUser();
        setAlert("Your session has expired. Please sign in again!");
      }
      db.close();
    } catch (e) {
      console.log(e);
      logOutUser();
      setAlert("Your session has expired. Please sign in again!");
    }
  }

    // close the database connection
    // disabled={productID !== null}


  return (
    <>
      <div>
        <Grid className={classes.header}>
          <h3>{productID === null ? 'Add a product' : `Update ${location.state.product.title}`}</h3>
        </Grid>

        <form autoComplete='off' style={{ width: '320px', margin: 'auto' }}>
          <Grid>
            <CssTextField
              id='standard-required'
              label='Name'
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
              disabled={!authFlag}
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
              disabled={!authFlag}
            />
          </Grid>

          {alert !== null &&
          <Alert severity="error" style={{margin: '12px 0'}}>
            {alert}
          </Alert>
          }

          <Grid style={{ marginTop: '30px' }}>
            <Button
              variant="contained"
              className={classes.deleteButton}
              onClick={(e) => {
                e.preventDefault();
                history.replace({
                  pathname: routes.PRODUCTS,
                  state: {  verticalScrollHeight: location && location.state && location.state.verticalScrollHeight },
                })
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
      </div>
    </>
  );
}
