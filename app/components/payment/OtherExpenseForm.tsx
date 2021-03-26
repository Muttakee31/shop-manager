import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory, useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import * as dbpath from '../../constants/config';
import { transactionType } from '../../constants/config';
import routes from '../../constants/routes.json';
import dayjs from 'dayjs';
import CssTextField from '../snippets/CssTextField';

const sqlite3 = require('sqlite3').verbose();

const useStyles = makeStyles({
  texts: {
    color: '',
  },
  header: {
    textAlign: 'center',
    textDecoration: 'underline',
    textUnderlinePosition: 'under'
  },
  grid: {
    marginTop: 40,
  },
  textField: {
    margin: 10,
  },
  deleteButton: {
    background: '#ca263d',
    marginRight: 15,
    color: 'floralwhite',
    '&:hover' : {
      background: '#d7495d',
      color: 'floralwhite',
    },
    '&:focus' : {
      background: '#d94056',
      color: 'floralwhite',
    },
  },
});

export default function OtherExpenseForm(): JSX.Element {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    // @ts-ignore
    const { state } = location;
    /* if (location.state.instant !== undefined) {
      console.log(location.state.instant);
    } */
  }, []);

  const createOtherExpense = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    const date = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss[Z]');

    db.run(
      `INSERT INTO Transactions(transaction_type,
       payment_type, order_cost, paid_amount, description, timestamp)
       VALUES(?, ?, ?, ?, ?, ?) `,
      [
        transactionType['other'],
        0,
        amount,
        amount,
        description,
        date
      ],
      function (err: Error) {
        if (err) {
          console.log(err.message);
        } else {
          history.push(routes.TRANSACTIONS);
        }
      });
    // close the database connection
    db.close();
  };

  return (
    <>
      <div>
        <Grid className={classes.header}>
          <h3>Add other expense</h3>
        </Grid>
        <form autoComplete="off" style={{ width: '320px', margin: 'auto' }}
              onSubmit={(e) => {
                e.preventDefault();
                createOtherExpense();
              }}
        >

          <Grid>
            <CssTextField
              id='standard-required'
              label='Amount'
              value={amount}
              type='number'
              className={classes.textField}
              fullWidth
              required
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>

          <Grid>
            <CssTextField
              id="standard-basic"
              label="Reason"
              value={description}
              fullWidth
              multiline
              rows={3}
              required
              className={classes.textField}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          <Grid style={{ marginTop: '30px' }}>
            <Button
              variant="contained"
              className={classes.deleteButton}
              onClick={(e) => {
                e.preventDefault();
                history.goBack();
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </Grid>
        </form>
      </div>
    </>
  );
}
