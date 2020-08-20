import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory, useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Sidebar from '../../containers/Sidebar';
import * as dbpath from '../../constants/config';
import { transactionType } from '../../constants/config';
import routes from '../../constants/routes.json';

const sqlite3 = require('sqlite3').verbose();

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
    '& .MuiInputBase-input': {
      color: 'white'
    },
    '& input': {
      color: 'floralwhite',
    },
  },
})(TextField);

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
  grid: {
    marginTop: 40,
  },
  textField: {
    color: 'white',
    borderColor: 'white',
    margin: 10,
  },
  input: {
    color: 'white',
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

    db.run(
      `INSERT INTO Transactions(transaction_type,
       payment_type, order_cost, paid_amount, description)
       VALUES(?, ?, ?, ?, ?) `,
      [
        transactionType['other'],
        0,
        amount,
        amount,
        description,
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
    <Grid container direction="row">

      <Grid item sm={4} lg={3}>
        <Sidebar />
      </Grid>

      <Grid
        item
        sm={8}
        lg={9}
        direction="column"
        justify="center"
        className={classes.grid}
      >
        <Grid className={classes.header}>
          <h3>Add other expense</h3>
        </Grid>
        <form autoComplete="off" style={{ width: '320px', margin: 'auto' }}>

          <Grid>
            <CssTextField
              id="standard-required"
              label="Amount"
              value={amount}
              className={classes.textField}
              fullWidth
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
              onClick={(e) => {
                e.preventDefault();
                createOtherExpense();
              }}
            >
              Submit
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
