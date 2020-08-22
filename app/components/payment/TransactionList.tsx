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
import * as dbpath from '../../constants/config';
import Button from '@material-ui/core/Button';
import routes from '../../constants/routes.json';
import { useHistory } from 'react-router';
import { transactionType } from '../../constants/config';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import dayjs from 'dayjs';
import Chip from '@material-ui/core/Chip';

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
  payment_type: number;
  transaction_type: number;
  due_amount: number | null;
  supply_id: number;
  timestamp: string;
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
  textField: {
    color: 'white',
    borderColor: 'white',
    margin: 10,
  },
  topbin: {
    display: 'flex',
    justifyContent: 'space-between',
  }
});

/*const type = {
  '0': 'Paid',
  '1': 'Due',
  '2': 'Both',
};*/

const chipColor = ['#2cb115', '#3638aa', '#b12423', '#388f9c']

const CssTextField = withStyles({
  root: {
    '& label': {
      color: 'floralwhite',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: 'floralwhite',
    },
    '& label.Mui-focused': {
      color: 'lightblue',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'lightblue',
    },
    '& input': {
      color: 'floralwhite',
    },
    '& .MuiInputBase-root': {
      color: 'floralwhite',
    },
    '& .MuiFormLabel-root': {
      color: 'floralwhite',
    },
    '& .MuiSelect-select.MuiSelect-select': {
      color: 'floralwhite',
    },
  },
})(TextField);

export default function TransactionList(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));

  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [visibleTransactionList, setVisibleTransactionList] = useState<Transaction[]>([]);
  // const history = useHistory();
  // console.log('Connected to the shop database.');
  // const [transactionList, setTransactionList] = useState([]);

  useEffect(() => {
    // add db.all function to get all transactions
    const db = new sqlite3.Database(dbpath.dbPath);
    db.all(
      'SELECT * FROM Transactions',
      (_err: Error, instant: Transaction[]) => {
        setTransactionList(instant);
        setVisibleTransactionList(
          instant.filter(item => dayjs(item.timestamp).format('YYYY-MM-DD') === selectedDate))
      }
    );
    db.close();
  }, []);

  const changeDate = (e:React.ChangeEvent) => {
    // @ts-ignore
    const value: string = e.target.value;
    setSelectedDate(value);
    //console.log(value);
    const filtered = transactionList.filter(item => dayjs(item.timestamp).format('YYYY-MM-DD') === value);
    transactionList.map(item => {
      console.log(dayjs(item.timestamp).format('YYYY-MM-DD hh:mm A'));
    })
    setVisibleTransactionList(filtered);
  }

  const getChip = (type : number) => {
    const text = Object.keys(transactionType).filter(item => {
      // @ts-ignore
     return transactionType[item] == type;
    })[0];

    console.log(type);
    return (
      <Chip
        label={text}
        style={{textTransform: 'capitalize', color: 'floralwhite',
          backgroundColor: chipColor[type-1]}}
      />

    )
  }

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <Grid container>
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>
        <Grid className={classes.header}>
          <h3>List of Transactions</h3>
        </Grid>

        <Grid item xs={8} lg={9} className={classes.topbin}>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              history.push({
                pathname: routes.DUE_PAYMENT,
              })}
          >
            Add due payment
          </Button>

          <CssTextField
            id="date"
            label="Date"
            type="date"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            value={selectedDate}
            onChange={changeDate}
          />
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
              {visibleTransactionList.length === 0 ?
                <TableRow>
                  <TableCell colSpan={7} align="left" className={classes.texts} style={{ textAlign: 'center' }}>
                    No items
                  </TableCell>
                </TableRow>
                :visibleTransactionList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left" className={classes.texts}>
                    {row.client_name === null ? 'N/A' : row.client_name}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {getChip(row.transaction_type)}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.supply_id !== null ? row.supply_cost : row.order_cost}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.paid_amount}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.labour_cost !== null ? "N/A" : row.labour_cost}
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
