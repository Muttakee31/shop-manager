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
// import Sidebar from '../../containers/Sidebar';

const sqlite3 = require('sqlite3').verbose();

interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
  due_amount: number;
}
const useStylesToo = makeStyles({
  texts: {
    color: 'whitesmoke',
  },
  header: {
    textAlign: 'center',
    color: 'white',
  },
});

export default function SupplierList(): JSX.Element {
  const classes = useStylesToo();
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  // const [productList, setProductList] = useState<Product[]>([]);
  const history = useHistory();
  // console.log('Connected to the shop database.');
  useEffect(() => {
    // add db.all function to get all suppliers
    const db = new sqlite3.Database('shopdb.sqlite3');
    db.all(
      'SELECT * FROM User where is_supplier = ?',
      [1],
      (_err: Error, instant: React.SetStateAction<Supplier[]>) => {
        setSupplierList(instant);
      }
    );
    db.close();
  }, []);
  const viewSupplier = (instant: Supplier) => {
    history.push({
      pathname: `/user-details/1/${instant.id}` ,
    });
  };
  /*
  return (
    <Grid container>
      <Grid item xs={4} md={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9} md={8}>
        add SupplierListthe table for supplier here
      </Grid>
    </Grid>
  );
  */
  return (
    <Grid container direction="row">
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>
        <Grid className={classes.header}>
          <h3>List of Suppliers</h3>
        </Grid>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.texts}>Supplier Name</TableCell>
                <TableCell className={classes.texts}>Phone</TableCell>
                <TableCell className={classes.texts}>Address</TableCell>
                <TableCell className={classes.texts}>Due</TableCell>
                <TableCell className={classes.texts} />
              </TableRow>
            </TableHead>
            <TableBody>
              {supplierList.map((row) => (
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
                    <VisibilityIcon onClick={() => viewSupplier(row)} />
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
