import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
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
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
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
});

export default function ProductForm(): JSX.Element {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [shopStock, setShopStock] = useState(0);
  const [godownStock, setGodownStock] = useState(0);

  const history = useHistory();
  const classes = useStyles();

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
  return (
    <Grid container>
      <Grid item xs={4}>
        <Sidebar />
      </Grid>
      <Grid item className={classes.grid}>
        <Grid className={classes.header}>
          <h3>Add a product</h3>
        </Grid>

        <form autoComplete="off">
          <Grid>
            <CssTextField
              id="standard-required"
              label="Name"
              value={productName}
              className={classes.textField}
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
              onChange={(e) => setUnit(e.target.value)}
            />
          </Grid>
          <Grid>
            <CssTextField
              id="standard-basic"
              label="Stock in shop"
              value={shopStock}
              className={classes.textField}
              onChange={(e) => setShopStock(Number(e.target.value))}
            />
          </Grid>
          <Grid>
            <CssTextField
              id="standard-basic"
              label="Stock in godown"
              value={godownStock}
              className={classes.textField}
              onChange={(e) => setGodownStock(Number(e.target.value))}
            />
          </Grid>
          <Grid style={{ alignContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                history.goBack();
              }}
            >
              Cancel
            </Button>
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
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
