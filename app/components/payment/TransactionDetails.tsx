import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteMatch } from 'react-router';
import * as dbpath from '../../constants/config';
import { transactionType } from '../../constants/config';
import BackButton from '../snippets/BackButton';
import dayjs from 'dayjs';
import NumberFormat from 'react-number-format';
import routes from '../../constants/routes.json';
import { useHistory, useLocation } from 'react-router-dom';

const sqlite3 = require('sqlite3').verbose();

interface Transaction {
  id: number;
  transaction_type: number;
  payment_type: string;
  client_name: string | null;
  discount: number | null;
  paid_amount: number;
  labour_cost: number | null;
  due_amount: number | null;
  description: string;
  timestamp: string;
  supply_cost: number | null;
  order_cost: number | null;
  supply_id: number | null;
  order_id: number | null;
}

const useStyles1 = makeStyles({
  texts: {
    color: 'whitesmoke',
  },
  details: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  header: {
    textAlign: 'center',
    color: 'white',
    textDecoration: 'underline',
    textUnderlinePosition: 'under'
  },
});


const emptyTransaction: Transaction = {
  id: 0,
  transaction_type: 0,
  payment_type: '0',
  discount: 0,
  paid_amount: 0,
  labour_cost: 0,
  due_amount: 0,
  client_name: '',
  description: '',
  timestamp: '',
  supply_cost: 0,
  order_cost: 0,
  supply_id : null,
  order_id: null,
};

export default function TransactionDetails(): JSX.Element {
  const classes = useStyles1();
  const location = useLocation();

  const [transactionInfo, setTransactionInfo] = useState<Transaction>(
    emptyTransaction
  );
  const history = useHistory();
  const match = useRouteMatch();
  // console.log('Connected to the shop database.');
  useEffect(() => {
    // const { id } = useParams();

    // @ts-ignore
    const id: number = match.params.id;
    const db = new sqlite3.Database(dbpath.dbPath);
    db.get(
      'SELECT * FROM Transactions where id=?',
      [id],
      (err: Error, instant: Transaction) => {
        if (err) {
          console.log(err);
        } else {
          setTransactionInfo(instant);
          //console.log(instant);
        }
      }
    );
    db.close();
  }, []);

  const returnToPreviousPage = () => {
    history.replace({
      pathname: routes.TRANSACTIONS,
      state: {
        verticalScrollHeight: location.state.verticalScrollHeight,
        selectedDate: typeof location.state !== 'undefined' ?
          location.state.selectedDate : dayjs(new Date()).format('YYYY-MM-DD'),
        type: location.state.type
      },
    })
  }

  return (
    <>
      <div>

        <Grid className={classes.header}>
          <h3>Transaction Details</h3>
        </Grid>

        <BackButton customGoBack={returnToPreviousPage} />

        <Grid style={{ border: '1px solid #ccc', margin: '10px' }}>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              {transactionInfo.supply_id === null ? "Supplier" : "Customer"}
              {' '}
            </Grid>
            <Grid item xs={6}>
              {transactionInfo.client_name === null ? "N/A" : transactionInfo.client_name}
            </Grid>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              Time of transaction:
              {' '}
            </Grid>
            <Grid item xs={6}>
              {dayjs(transactionInfo.timestamp.split('Z')[0]).format("MMMM DD, YYYY [a]t hh:mm A")}
            </Grid>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              Paid by customer:
              {' '}
            </Grid>
            <Grid item xs={6}>
              {transactionInfo.paid_amount === null ? "N/A" : transactionInfo.paid_amount}
            </Grid>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              Total cost:
              {' '}
            </Grid>
            <Grid item xs={6}>
              <NumberFormat value={transactionInfo.order_cost} displayType={'text'}
                            thousandSeparator={true} thousandsGroupStyle="lakh"
                            decimalScale={2}/>
            </Grid>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              {transactionInfo.transaction_type === transactionType['supply'] ?
                "Balance:" : "Due amount:"
              }
              {' '}
            </Grid>
            <Grid item xs={6}>
              {transactionInfo.due_amount  === null ? "N/A" : transactionInfo.due_amount}
            </Grid>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              Labour cost:
              {' '}
            </Grid>
            <Grid item xs={6}>
              {transactionInfo.labour_cost  === null ? "N/A" : transactionInfo.labour_cost}
            </Grid>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              Discount:
              {' '}
            </Grid>
            <Grid item xs={6}>
              {transactionInfo.discount  === null ? "N/A" : transactionInfo.discount}
            </Grid>
          </Grid>
          <Grid className={classes.details}>
            <Grid item xs={6}>
              Note:
              {' '}
            </Grid>
            <Grid item xs={6}>
              {transactionInfo.description === null ? 'N/A' : transactionInfo.description}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
