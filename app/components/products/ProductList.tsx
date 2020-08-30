import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
import EditIcon from '@material-ui/icons/Edit';
import routes from '../../constants/routes.json';
import * as dbpath from '../../constants/config';
import Sidebar from '../../containers/Sidebar';

interface Product {
  id: number;
  code: string;
  title: string;
  price: number;
  shop_stock_count: number;
  godown_stock_count: number;
  unit: string | null;
  out_of_stock: number | null;
}

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
});

export default function ProductList(): JSX.Element {
  const classes = useStyles();
  const [productList, setProductList] = useState<Product[]>([]);
  const history = useHistory();
  // console.log('Connected to the shop database.');
  useEffect(() => {
    try {
      const sqlite3 = require('sqlite3').verbose();
      const db = new sqlite3.Database(dbpath.dbPath);
      // const dbPath = (process.env.NODE_ENV === 'development') ? 'shopdb.sqlite3' : path.resolve(app.getPath('userData'), 'shopdb.sqlite3');
      // const db = new sqlite3.Database(dbpath.dbPath);
      db.all(
        'SELECT * FROM Product',
        (err: Error, instant: Product[]) => {
          if (err) {
            console.log(err);
          } else {
            setProductList(instant);
            console.log(instant);
          }
        }
      );
      db.close();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const editProduct = (instant: Product) => {
    history.push({
      pathname: routes.ADD_PRODUCTS,
      state: { product: instant },
    });
  };

  return (
    <Grid container>
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>
        <Grid className={classes.header}>
          <h3>List of Products</h3>
        </Grid>

        <Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              history.push({
                pathname: routes.ADD_PRODUCTS,
                state: { product: null },
              })}
          >
            Add product
          </Button>
        </Grid>

        <Grid>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.texts}>Title</TableCell>
                  <TableCell className={classes.texts}>Code</TableCell>
                  <TableCell className={classes.texts}>Price</TableCell>
                  <TableCell className={classes.texts}>Shop Stock</TableCell>
                  <TableCell className={classes.texts}>Godown Stock</TableCell>
                  <TableCell className={classes.texts}>Unit</TableCell>
                  <TableCell className={classes.texts} />
                </TableRow>
              </TableHead>
              <TableBody>
                {productList.length === 0 ?
                  <TableRow>
                    <TableCell colSpan={6} align="left" className={classes.texts} style={{ textAlign: 'center' }}>
                      No items
                    </TableCell>
                  </TableRow>
                  :
                  productList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="left" className={classes.texts}>
                      {row.title}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.code}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.price}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.shop_stock_count}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.godown_stock_count}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.unit === null ? 'N/A' : row.unit}
                    </TableCell>
                    <TableCell align="center" className={classes.texts}>
                      <EditIcon onClick={() => editProduct(row)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
}
