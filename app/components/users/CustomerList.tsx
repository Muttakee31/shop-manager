import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Sidebar from '../../containers/Sidebar';
import * as dbpath from '../../constants/config';

const sqlite3 = require('sqlite3').verbose();

interface Customer {
  id: number;
  name: string;
  address: string;
  phone: string;
  is_customer: number;
  is_supplier: number;
  due_amount: number;
}

const useStyles1 = makeStyles({
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

export default function CustomerList(): JSX.Element {
  const classes = useStyles1();
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  // const [productList, setProductList] = useState<Product[]>([]);
  const history = useHistory();
  // console.log('Connected to the shop database.');
  useEffect(() => {
    const db = new sqlite3.Database(dbpath.dbPath);
    db.all(
      'SELECT * FROM User where is_customer=?',
      [1],
      (_err: Error, instant: React.SetStateAction<Customer[]>) => {
        setCustomerList(instant);
      }
    );
    db.close();
  }, []);

  const viewCustomer = (instant: Customer) => {
    history.push({
      pathname: `/user-details/0/${instant.id}`,
    });
  };

  return (
    <Grid container>
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>
        <Grid className={classes.header}>
          <h3>List of Customers</h3>
        </Grid>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.texts}>Name</TableCell>
                <TableCell className={classes.texts}>Phone</TableCell>
                <TableCell className={classes.texts}>Address</TableCell>
                <TableCell className={classes.texts}>Due amount</TableCell>
                <TableCell className={classes.texts} />
              </TableRow>
            </TableHead>
            <TableBody>
              {customerList.map((row: Customer) => (
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
                    {row.due_amount}
                  </TableCell>
                  <TableCell align="center" className={classes.texts}>
                    <VisibilityIcon onClick={() => viewCustomer(row)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
