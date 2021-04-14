import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteMatch } from 'react-router';
import dayjs from 'dayjs';
import * as dbpath from '../../constants/config';
import BackButton from '../snippets/BackButton';
import NumberFormat from 'react-number-format';
import routes from '../../constants/routes.json';
import { useHistory, useLocation } from 'react-router-dom';

const sqlite3 = require('sqlite3').verbose();

interface OrderItem {
  product_id: number;
  product_title: string;
  title: string;
  quantity: number;
  price: number;
  storage: string;
}

interface Order {
  id: number;
  customer_name: string;
  timestamp: string;
  total_cost: number;
}

interface Transaction {
  id: number;
  type: string;
  discount: number;
  paid_amount: number;
  labour_cost: number;
  due_amount: number;
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

const emptyOrder: Order = {
  id: 0,
  customer_name: '',
  timestamp: '',
  total_cost: 0,
};

const emptyTransaction: Transaction = {
  id: 0,
  type: '0',
  discount: 0,
  paid_amount: 0,
  labour_cost: 0,
  due_amount: 0,
};

export default function OrderDetails(): JSX.Element {
  const classes = useStyles1();
  const history = useHistory();
  const location = useLocation();
  const [order, setOrder] = useState<Order>(emptyOrder);
  const [transactionInfo, setTransactionInfo] = useState<Transaction>(
    emptyTransaction
  );
  const [itemList, setItemList] = useState<OrderItem[]>([]);
  // const history = useHistory();
  const match = useRouteMatch();
  // console.log('Connected to the shop database.');
  useEffect(() => {
    // const { id } = useParams();

    // @ts-ignore
    const id: number = match.params.id;
    console.log(id);
    const db = new sqlite3.Database(dbpath.dbPath);
    db.get(
      'SELECT * FROM Orders where id=?',
      [id],
      (err: Error, instant: Order) => {
        if (err) {
          console.log(err);
        } else {
          setOrder(instant);
          //console.log(instant);
        }
      }
    );
    db.all(
      'SELECT * FROM OrderedItem where order_id=?',
      [id],
      (err: Error, instant: OrderItem[]) => {
        if (err) {
          console.log(err);
        } else {
          setItemList(instant);
          console.log(instant);
        }
      }
    );
    db.get(
      'SELECT * FROM Transactions where order_id=?',
      [id],
      (err: Error, instant: Transaction) => {
        if (err) {
          console.log(err);
        } else {
          instant !== undefined && setTransactionInfo(instant);
          console.log(instant);
        }
      }
    );
    db.close();
  }, []);

  const returnToList = () => {
    history.replace({
      pathname: routes.ORDERS,
      state: {
        selectedDate:location.state.selectedDate
      }
    })
  }

  return (
    <>
      <div>
        <Grid className={classes.header}>
          <h3>Order Details</h3>
        </Grid>

        <BackButton customGoBack={returnToList} />

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Customer Name:
            {' '}
          </Grid>
          <Grid item xs={6}>
            {order.customer_name}
          </Grid>
        </Grid>

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Date of order:
{' '}
          </Grid>
          <Grid item xs={6}>
            {dayjs(order.timestamp.split('Z')[0]).format('MMMM DD, YYYY [a]t hh:mm A')}
          </Grid>
        </Grid>

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Total cost:
{' '}
          </Grid>
          <Grid item xs={6}>
            <NumberFormat value={order.total_cost} displayType={'text'}
                          thousandSeparator={true} thousandsGroupStyle="lakh"/>
          </Grid>
        </Grid>

        <Grid className={classes.header}>
          <h3>List of items</h3>
        </Grid>

        <Grid>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.texts}>Title</TableCell>
                  <TableCell className={classes.texts}>Rate</TableCell>
                  <TableCell className={classes.texts}>Quantity</TableCell>
                  <TableCell className={classes.texts}>Price</TableCell>
                  <TableCell className={classes.texts}>Store</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="left" className={classes.texts} style={{textAlign: 'center'}}>
                      No items
                    </TableCell>
                  </TableRow>
                ) : (
                  itemList.map((row) => (
                    <TableRow key={row.product_id}>
                      <TableCell align="left" className={classes.texts}>
                        {row.product_title}
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
                        <NumberFormat value={row.price} displayType={'text'}
                                      thousandSeparator={true} thousandsGroupStyle="lakh"
                                      decimalScale={2}/>
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
                        {row.quantity}
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
                        <NumberFormat value={row.quantity * row.price} displayType={'text'}
                                      thousandSeparator={true} thousandsGroupStyle="lakh"
                                      decimalScale={2}/>
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
                        {row.storage === "0" ? "Shop" : "Godown"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid>
          <Grid className={classes.header}>
            <h3>Transaction info</h3>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              Paid by customer:
{' '}
            </Grid>
            <Grid item xs={6}>
              <NumberFormat value={transactionInfo.paid_amount} displayType={'text'}
                            thousandSeparator={true} thousandsGroupStyle="lakh"
                            decimalScale={2}/>
            </Grid>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              Due amount:
{' '}
            </Grid>
            <Grid item xs={6}>
              <NumberFormat value={transactionInfo.due_amount} displayType={'text'}
                            thousandSeparator={true} thousandsGroupStyle="lakh"
                            decimalScale={2}/>
            </Grid>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              Labour cost:
{' '}
            </Grid>
            <Grid item xs={6}>
              <NumberFormat value={transactionInfo.labour_cost} displayType={'text'}
                            thousandSeparator={true} thousandsGroupStyle="lakh"
                            decimalScale={2}/>
            </Grid>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              Discount:
              {' '}
            </Grid>
            <Grid item xs={6}>
              <NumberFormat value={transactionInfo.discount} displayType='text'
                            thousandSeparator={true} thousandsGroupStyle='lakh'
                            decimalScale={2} />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
