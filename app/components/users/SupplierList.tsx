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

interface SupplierList {
  id: number;
  supplier: number;
  timestamp: string;
  supplier_name: string;
  total_cost: number;
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

export default function SupplierList(): JSX.Element {
  const classes = useStyles();
  const [supplierList, setSupplierList] = useState<SupplierList[]>([]);
  // const [productList, setProductList] = useState<Product[]>([]);
  const history = useHistory();
  // console.log('Connected to the shop database.');
  useEffect(() => {
    // add db.all function to get all suppliers
    const db = new sqlite3.Database('shopdb.sqlite3');
    db.all(
      'SELECT rowId as ID, * FROM Supply',
      (_err: Error, instant: React.SetStateAction<SupplierList[]>) => {
        setSupplierList(instant);
      }
    );
    db.close();
  }, []);
  const editSupplier = (instant: SupplierList) => {
    /*
    history.push({
      //pathname: routes.ADD_PRODUCTS,
      //state: { product: instant },
    });
     */
  };
  /*
  return (
    <Grid container>
      <Grid item xs={4} md={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9} md={8}>
        add the table for supplier here
      </Grid>
    </Grid>
  );
  */
  return (
    <Container data-tid="container">
      <Grid className={classes.header}>
        <h3>List of Suppliers</h3>
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
                <TableCell className={classes.texts}>id</TableCell>
                <TableCell className={classes.texts}>Supplier</TableCell>
                <TableCell className={classes.texts}>Timestamp</TableCell>
                <TableCell className={classes.texts}>SupplierName</TableCell>
                <TableCell className={classes.texts}>TotalCost</TableCell>
                <TableCell className={classes.texts} />
              </TableRow>
            </TableHead>
            <TableBody>
              {supplierList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left" className={classes.texts}>
                    {row.supplier}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.timestamp}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.supplier_name}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.total_cost}
                  </TableCell>
                  <TableCell align="center" className={classes.texts}>
                    <EditIcon onClick={() => editSupplier(row)} />
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
