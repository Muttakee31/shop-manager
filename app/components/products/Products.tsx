import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
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

const sqlite3 = require('sqlite3').verbose();

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
  },
});

export default function ProductList(): JSX.Element {
  const classes = useStyles();
  const [productList, setProductList] = useState<Product[]>([]);
  const history = useHistory();
  // console.log('Connected to the shop database.');
  useEffect(() => {
    const db = new sqlite3.Database('shopdb.sqlite3');
    db.all(
      'SELECT * FROM Product',
      (_err: Error, instant: React.SetStateAction<Product[]>) => {
        setProductList(instant);
      }
    );
    db.close();
  }, []);

  const editProduct = (instant: Product) => {
    history.push({
      pathname: routes.ADD_PRODUCTS,
      state: { product: instant },
    });
  };

  return (
    <Container data-tid="container">
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
                <TableCell className={classes.texts}>
                  Shop Stock count
                </TableCell>
                <TableCell className={classes.texts}>
                  Godown Stock count
                </TableCell>
                <TableCell className={classes.texts}>Unit</TableCell>
                <TableCell className={classes.texts} />
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((row) => (
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
    </Container>
  );
}
