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
// import Sidebar from '../../containers/Sidebar';

const sqlite3 = require('sqlite3').verbose();

interface CustomerList {
  id: number;
  name: string;
  address: string;
  phone: string;
  is_customer: number;
  is_supplier: number;
  has_due_bill: number | null;
  due_amount: number;
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

export default function CustomerList(): JSX.Element {
  const classes = useStyles();
  const [customerList, setCustomerList] = useState<CustomerList[]>([]);
  // const [productList, setProductList] = useState<Product[]>([]);
  const history = useHistory();
  // console.log('Connected to the shop database.');
  useEffect(() => {
    const db = new sqlite3.Database('shopdb.sqlite3');
    db.all(
      'SELECT rowId as ID, * FROM User',
      (_err: Error, instant: React.SetStateAction<CustomerList[]>) => {
        setCustomerList(instant);
      }
    );
    db.close();
  }, []);
  const editProduct = (instant: CustomerList) => {
    /*
    history.push({
      //pathname: routes.ADD_PRODUCTS,
      //state: { product: instant },
    });
    */
  };

  return(
    <Container data-tid="container">
      <Grid className={classes.header}>
        <h3>List of Customers</h3>
      </Grid>


      <Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            history.push({
              pathname: routes.ADD_PRODUCTS,
              state: { product: null },
            })
          }
        >
          Add product
        </Button>
      </Grid>

      <Grid>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.texts}>ID</TableCell>
                <TableCell className={classes.texts}>Name</TableCell>
                <TableCell className={classes.texts}>Address</TableCell>
                <TableCell className={classes.texts}>Phone</TableCell>
                <TableCell className={classes.texts}>is_Customer</TableCell>
                <TableCell className={classes.texts}>is_supplier</TableCell>
                <TableCell className={classes.texts}>has_due_bill</TableCell>
                <TableCell className={classes.texts}>due_amount</TableCell>
                <TableCell className={classes.texts} />
              </TableRow>
            </TableHead>
            <TableBody>
              {customerList.map((row: CustomerList) => (
                <TableRow key={row.id}>
                  <TableCell align="left" className={classes.texts}>
                    {row.name}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.phone}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.address}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.is_customer}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.is_supplier}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.has_due_bill === null ? 'N/A' : row.has_due_bill}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.due_amount}
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
