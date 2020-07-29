import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
// import Sidebar from '../../containers/Sidebar';
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

interface TransactionList {
  id: number;
  client: number;
  order_id: number;
  paid_amount: number;
  client_name: string;
  supply_cost: number;
  order_cost: number;
  labour_cost: number;
  discount: number | null;
  type: string;
  due_amount: number | null;
  supply_id: number;
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

export default function TransactionList(): JSX.Element {
  const classes = useStyles();
  const [transactionList, setTransactionList] = useState<TransactionList[]>([]);
  const history = useHistory();
  // console.log('Connected to the shop database.');
  // const [transactionList, setTransactionList] = useState([]);

  useEffect(() => {
    // add db.all function to get all transactions
    const db = new sqlite3.Database('shopdb.sqlite3');
    db.all(
      'SELECT rowId as ID, * FROM Transactions',
      (_err: Error, instant: React.SetStateAction<TransactionList[]>) => {
        setTransactionList(instant);
      }
    );
    db.close();
  }, []);
  const editTransactions = (instant: TransactionList) => {
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
        <h3>List of Transactions</h3>
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
                <TableCell className={classes.texts}>Client</TableCell>
                <TableCell className={classes.texts}>OrderId</TableCell>
                <TableCell className={classes.texts}>PaidAmount</TableCell>
                <TableCell className={classes.texts}>ClientName</TableCell>
                <TableCell className={classes.texts}>SupplyCost</TableCell>
                <TableCell className={classes.texts}>OrderCost</TableCell>
                <TableCell className={classes.texts}>LabourCost</TableCell>
                <TableCell className={classes.texts}>Discount</TableCell>
                <TableCell className={classes.texts}>Type</TableCell>
                <TableCell className={classes.texts}>DueAmount</TableCell>
                <TableCell className={classes.texts}>SupplyId</TableCell>
                <TableCell className={classes.texts} />
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left" className={classes.texts}>
                    {row.client}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.order_id}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.paid_amount}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.client_name}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.supply_cost}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.order_cost}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.labour_cost}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.discount === null ? 'N/A' : row.discount}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.type}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.due_amount === null ? 'N/A' : row.due_amount}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.supply_id}
                  </TableCell>
                  <TableCell align="center" className={classes.texts}>
                    <EditIcon onClick={() => editTransactions(row)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
    /*
    <Grid container>
      <Grid item xs={4} md={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9} md={8}>
        add the table for transaction here
      </Grid>
    </Grid>
    */
  );
}

