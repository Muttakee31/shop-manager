import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import dayjs from 'dayjs';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Sidebar from '../../containers/Sidebar';
import * as dbpath from '../../constants/config';
import { transactionType } from '../../constants/config';
import BackButton from '../snippets/BackButton';
import NumberFormat from 'react-number-format';
import routes from '../../constants/routes.json';

const sqlite3 = require('sqlite3').verbose();

interface User {
  id: number;
  name: string;
  phone: string;
  address: string;
  due_amount: number;
}

interface Transaction {
  id: number;
  client: number;
  order_id: number;
  paid_amount: number;
  client_name: string;
  order_cost: number;
  labour_cost: number;
  discount: number | null;
  payment_type: number;
  transaction_type: number;
  due_amount: number | null;
  supply_id: number;
  timestamp: string;
}

interface Order {
  id: number;
  customer_name: string;
  supplier_name: string;
  timestamp: string;
  total_cost: number;
}

const useStyles1 = makeStyles({
  texts: {
  },
  details: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  header: {
    textAlign: 'center',
    textDecoration: 'underline',
    textUnderlinePosition: 'under'
  },
});

const emptyUser: User = {
  id: 0,
  name: '',
  phone: '',
  address: '',
  due_amount: 0,
};

export default function UserDetails(): JSX.Element {
  const classes = useStyles1();
  const [user, setUser] = useState<User>(emptyUser);
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  // @ts-ignore
  const type: string = match.params.type;
  // @ts-ignore
  const id: string = match.params.id;

  // console.log(type + "   " + id);
  useEffect(() => {
    // const { id } = useParams();
    const db = new sqlite3.Database(dbpath.dbPath);
    db.get(
      'SELECT * FROM User where id=?',
      [id],
      (err: Error, instant: User) => {
        if (err) {
          console.log(err);
        } else {
          setUser(instant);
          //console.log(instant);
        }
      }
    );
    if (type === '0') {
      //console.log('customer');
      db.all(
        'SELECT * FROM Orders where customer=?',
        [id],
        (err: Error, instant: Order[]) => {
          if (err) {
            console.log(err);
          } else {
            setOrderList(instant);
            //console.log(instant);
          }
        }
      );
    } else {
      console.log('supplier');
      db.all(
        'SELECT * FROM Supply where supplier=?',
        [id],
        (err: Error, instant: Order[]) => {
          if (err) {
            console.log(err);
          } else {
            setOrderList(instant);
            console.log(instant);
          }
        }
      );
    }
    db.all(
      'SELECT * FROM Transactions WHERE client = ?', [id],
      (_err: Error, instant: Transaction[]) => {
        setTransactionList(instant);
      }
    );
    db.close();
  }, []);

  const seeDetails = (id: number) => {
    type === '0' ? history.push(`/order/${id}`) : history.push(`/supply/${id}`);
  };

  const returnToPreviousPage = () => {
    history.replace({
      pathname: type === '0' ? routes.CUSTOMERS : routes.SUPPLIERS,
      state: {  verticalScrollHeight: location.state.verticalScrollHeight },
    })
  }

  return (
    <Grid container>
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>

        <Grid className={classes.header}>
          <h3>User Details</h3>
        </Grid>

        <BackButton customGoBack={returnToPreviousPage} />

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Name:
{' '}
          </Grid>
          <Grid item xs={6}>
            {user.name}
          </Grid>
        </Grid>

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Phone:
{' '}
          </Grid>
          <Grid item xs={6}>
            {user.phone}
          </Grid>
        </Grid>

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Address:
{' '}
          </Grid>
          <Grid item xs={6}>
            {user.address}
          </Grid>
        </Grid>

        <Grid className={classes.details}>
          <Grid item xs={6}>
            {type === '0' ? "Due of the customer" : "Due to pay the supplier"}
{' '}
          </Grid>
          <Grid item xs={6}>
            {user.due_amount ?
              type === '0' ? user.due_amount : user.due_amount * -1
            : 0
            }
          </Grid>
        </Grid>

        <Grid className={classes.header}>
          <h3>List of {type === '0' ? "Orders" : "Supplies"}</h3>
        </Grid>

        <Grid>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.texts}>name</TableCell>
                  <TableCell className={classes.texts}>Total cost</TableCell>
                  <TableCell className={classes.texts}>Time of event</TableCell>
                  <TableCell className={classes.texts} />
                </TableRow>
              </TableHead>
              <TableBody>
                {orderList.length === 0 ?
                  <TableRow>
                    <TableCell colSpan={4} align="left" className={classes.texts} style={{ textAlign: 'center' }}>
                      No item
                    </TableCell>
                  </TableRow>
                  :
                  orderList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="left" className={classes.texts}>
                      {type === '1' ? row.supplier_name : row.customer_name}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.total_cost}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {dayjs(row.timestamp.split('Z')[0]).format(
                        'MMMM DD, YYYY [a]t hh:mm a'
                      )}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      <VisibilityIcon onClick={() => seeDetails(row.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid className={classes.header}>
          <h3>List of Transactions</h3>
        </Grid>

        <Grid>
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
                {transactionList.length === 0 ?
                  <TableRow>
                    <TableCell colSpan={7} align="left" className={classes.texts} style={{ textAlign: 'center' }}>
                      No transactions
                    </TableCell>
                  </TableRow>
                  :transactionList.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="left" className={classes.texts}>
                        {row.client_name}
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
                        {Object.keys(transactionType).find(item => {
                          // @ts-ignore
                          return transactionType[item] === row.transaction_type;
                        })}
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
                        <NumberFormat value={row.order_cost} displayType={'text'}
                                      thousandSeparator={true} thousandsGroupStyle="lakh"
                                      decimalScale={2}/>
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
                        <NumberFormat value={row.paid_amount} displayType={'text'}
                                      thousandSeparator={true} thousandsGroupStyle="lakh"
                                      decimalScale={2}/>
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
                        <NumberFormat value={row.labour_cost} displayType={'text'}
                                      thousandSeparator={true} thousandsGroupStyle="lakh"
                                      decimalScale={2}/>
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
                        {row.discount === null ? 'N/A' : row.discount}
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
                        {row.due_amount === null ? 'N/A' :
                          <NumberFormat value={row.due_amount} displayType={'text'}
                                        thousandSeparator={true} thousandsGroupStyle="lakh"
                                        decimalScale={2}/>}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
}
