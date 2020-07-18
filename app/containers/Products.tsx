import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

let sqlite3 = require('sqlite3').verbose();

interface Product {
  id: number,
  title: string,
  price: number,
}

export default function ProductList(): JSX.Element {
  const [productList, setProductList] = useState<Product[]>([]);
    // console.log('Connected to the shop database.');
  useEffect(()=> {
    let db = new sqlite3.Database('shopdb.sqlite3');
    db.all('SELECT * FROM Product', (_err: any, instant: React.SetStateAction<Product[]>) => {
      // console.log(instant.id + ": " + instant.title);
      setProductList(instant);
    });
    db.close();
  }, [productList])

  return (
    <Container data-tid="container">
      <Grid style={{textAlign: 'center', color: 'white'}}>
        <h3>List of Products</h3>
      </Grid>
      <Grid>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow style={{color: 'white'}}>
                <TableCell>Title</TableCell>
                <TableCell>Price</TableCell>
                {/*<TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>*/}
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left" style={{color: 'white'}}>{row.title}</TableCell>
                  <TableCell align="left" style={{color: 'white'}}>{row.price}</TableCell>
                 {/* <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>*/}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
}
