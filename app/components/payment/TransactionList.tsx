import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../../containers/Sidebar';

const sqlite3 = require('sqlite3').verbose();

interface Transaction {
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

const type = {
  "0": "Paid",
  "1": "Due",
  "2": "Both"
};

export default function TransactionList(): JSX.Element {
  const classes = useStyles();
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  // const history = useHistory();
  // console.log('Connected to the shop database.');
  // const [transactionList, setTransactionList] = useState([]);

  useEffect(() => {
    // add db.all function to get all transactions
    const db = new sqlite3.Database('shopdb.sqlite3');
    db.all(
      'SELECT rowId as ID, * FROM Transactions',
      (_err: Error, instant: React.SetStateAction<Transaction[]>) => {
        setTransactionList(instant);
      }
    );
    db.close();
  }, []);

  return(
    <Grid container>
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>
        <Grid className={classes.header}>
          <h3>List of Transactions</h3>
        </Grid>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.texts}>Client name</TableCell>
                <TableCell className={classes.texts}>Type</TableCell>
                <TableCell className={classes.texts}>Cost</TableCell>
                <TableCell className={classes.texts}>Paid amount</TableCell>
                <TableCell className={classes.texts}>Labour cost</TableCell>
                <TableCell className={classes.texts}>Discount</TableCell>
                <TableCell className={classes.texts}>Due amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left" className={classes.texts}>
                    {row.client_name}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {type[row.type]}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.supply_id !== null && row.supply_cost}
                    {row.order_id !== null && row.order_cost}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.paid_amount}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.labour_cost}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.discount === null ? 'N/A' : row.discount}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.due_amount === null ? 'N/A' : row.due_amount}
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

