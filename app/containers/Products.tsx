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

const sqlite3 = require('sqlite3').verbose();

interface Product {
  id: number;
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
});

export default function ProductList(): JSX.Element {
  const classes = useStyles();
  const [productList, setProductList] = useState<Product[]>([]);
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

  return (
    <Container data-tid="container">
      <Grid style={{ textAlign: 'center', color: 'white' }}>
        <h3>List of Products</h3>
      </Grid>
      <Grid>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.texts}>Title</TableCell>
                <TableCell className={classes.texts}>Price</TableCell>
                <TableCell className={classes.texts}>
                  Shop Stock count
                </TableCell>
                <TableCell className={classes.texts}>
                  Godown Stock count
                </TableCell>
                <TableCell className={classes.texts}>Unit</TableCell>
                {/* <TableCell className={classes.texts}>Out of stock</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left" className={classes.texts}>
                    {row.title}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
}
