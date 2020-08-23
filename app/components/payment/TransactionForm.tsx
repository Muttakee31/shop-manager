import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory, useRouteMatch } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Sidebar from '../../containers/Sidebar';
import * as dbpath from '../../constants/config';

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
    '& input': {
      color: 'floralwhite',
    },
    '& .MuiFormLabel-root.Mui-disabled': {
      color: '#c1bbae',
    }
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

export default function TransactionForm(): JSX.Element {
  const [paidAmount, setPaidAmount] = useState('');
  const [labourCost, setLabourCost] = useState('');
  const [discount, setDiscount] = useState('');
  const [totalCost, setTotalCost] = useState('');

  // const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const match = useRouteMatch();

  useEffect(() => {
    // @ts-ignore
    const id: number = match.params.id;
    //console.log(id);
    const db = new sqlite3.Database(dbpath.dbPath);
    db.get(
      'SELECT * FROM Transactions where id=?',
      [id],
      (err: Error, instant:any) => {
        if (err) {
          console.log(err);
        } else {
          setTotalCost(instant.order_cost);
          setDiscount(instant.discount);
          setLabourCost(instant.labour_cost);
          setPaidAmount(instant.paid_amount);
          //console.log(instant);
        }
      }
    );
    db.close();
    /* if (location.state.instant !== undefined) {
      console.log(location.state.instant);
    } */
  }, []);

  const updateTransaction = () => {
    const db = new sqlite3.Database(dbpath.dbPath);

    // insert one row into the langs table
    db.run(
      `UPDATE SET Transactions
      (paidAmount, total_cost, discount, labour_cost)
       VALUES(?,?,?,?,?,?) `,
      [
        paidAmount,
        totalCost,
        discount,
        labourCost
      ],
      function (err: Error) {
        if (err) {
          console.log(err.message);
        }
        else {
          // @ts-ignore
          history.goBack();
        }
        // get the last insert id
        // console.log(`A row has been inserted`);
      }
    );

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
          <h3>Update transaction</h3>
        </Grid>

        <form autoComplete="off" style={{ width: '320px', margin: 'auto' }}>
          <Grid>
            <CssTextField
              id="standard-required"
              label="Paid Amount"
              value={paidAmount}
              className={classes.textField}
              fullWidth
              onChange={(e) => setPaidAmount(e.target.value)}
            />
          </Grid>

          <Grid>
            <CssTextField
              id="standard-required"
              label="Total cost"
              value={totalCost}
              className={classes.textField}
              fullWidth
              onChange={(e) => setTotalCost(e.target.value)}
            />
          </Grid>

          <Grid>
            <CssTextField
              id="standard-basic"
              label="Labour cost"
              value={labourCost}
              fullWidth
              className={classes.textField}
              onChange={(e) => setLabourCost(e.target.value)}
            />
          </Grid>
          <Grid>
            <CssTextField
              id="standard-basic"
              label="Discount"
              value={discount}
              className={classes.textField}
              fullWidth
              onChange={(e) => setDiscount(e.target.value)}
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
                updateTransaction();
              }}
            >
              Update
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}