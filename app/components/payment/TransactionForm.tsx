import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import * as dbpath from '../../constants/config';
import { transactionType } from '../../constants/config';
import { useSelector } from 'react-redux';
import { authToken, isAuthenticated, logOutUser, userName } from '../../features/auth/authSlice';
import Alert from '@material-ui/lab/Alert';
import CssTextField from '../snippets/CssTextField';
import routes from '../../constants/routes.json';

const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

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
  const [dueAmount, setDueAmount] = useState(0);
  const [type, setType] = useState(transactionType['order']);
  const [client, setClient] = useState<number | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const match = useRouteMatch();
  const authFlag= useSelector(isAuthenticated);
  const user= useSelector(userName);
  const token= useSelector(authToken);

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
          setType(instant.transaction_type);
          setTotalCost(instant.order_cost);
          setDiscount(instant.discount);
          setLabourCost(instant.labour_cost);
          setPaidAmount(instant.paid_amount);
          setDueAmount(instant.due_amount);
          setClient(instant.client);
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
    // @ts-ignore
    const id: number = match.params.id;
    try {
      setAlert(null);
      const decoded = jwt.verify(token, dbpath.SECRET_KEY);
      const db = new sqlite3.Database(dbpath.dbPath);
      let latestDue = Number(totalCost) + Number(labourCost) - Number(discount) - Number(paidAmount);
      if (decoded.username === user) {
        db.run(
          `UPDATE Transactions SET paid_amount = ?, order_cost = ?,
           discount = ?, labour_cost = ?, due_amount = ? WHERE id = ?`,
          [
            paidAmount,
            totalCost,
            discount,
            labourCost,
            latestDue,
            id
          ],
          function(err: Error) {
            if (err) {
              console.log(err.message);
              setAlert("Something went wrong!");
            } else {
              resetDueBalance();
              // @ts-ignore
              returnToPreviousPage();
            }
            // get the last insert id
            // console.log(`A row has been inserted`);
          }
        );

        // close the database connection
        db.close();
      }
      else {
        logOutUser();
        setAlert("Your session has expired. Please sign in again!")
      }
    }
    catch (e) {
      console.log(e);
      logOutUser();
      setAlert("Your session has expired. Please sign in again!")
    }
  };

  const resetDueBalance = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    const stmt = db.prepare(
      `UPDATE User SET due_amount = due_amount - ? WHERE id = ?`
    )

    let resetAmount = 0;
    let latestDue = Number(totalCost) + Number(labourCost) - Number(discount) - Number(paidAmount);
    if (type === transactionType['order']) {
      resetAmount = Number(dueAmount) - latestDue;
    }
    else if (type === transactionType['supply']) {
      resetAmount = latestDue - Number(dueAmount);
    }
    else if (type === transactionType['due']) {
      resetAmount = latestDue - Number(paidAmount);
    }
    else if (type === transactionType['bill']) {
      resetAmount = Number(paidAmount) - latestDue;
    }

    stmt.run(
      [resetAmount, client],
      function (error_3: Error) {
        if (error_3) {
          console.log(error_3.message);
        } else {
          console.log('due updated');
        }
      })
    stmt.finalize();
  }

  const returnToPreviousPage = () => {
    history.replace({
      pathname: routes.TRANSACTIONS,
      state: {
        verticalScrollHeight: location.state.verticalScrollHeight,
        selectedDate: location.state.selectedDate,
        type: location.state.type},
    })
  }


  return (
    <>
      <div>
        <Grid className={classes.header}>
          <h3>Update transaction</h3>
        </Grid>

        <form autoComplete='off' style={{ width: '320px', margin: 'auto' }}>
          <Grid>
            <CssTextField
              id='standard-required'
              label='Paid Amount'
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
              disabled={type !== transactionType['order']}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </Grid>

          {alert !== null &&
          <Alert severity="error" style={{margin: '12px 0'}}>
            {alert}
          </Alert>
          }

          <Grid style={{ marginTop: '30px' }}>
            <Button
              variant="contained"
              className={classes.deleteButton}
              onClick={(e) => {
                e.preventDefault();
                returnToPreviousPage();
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
              disabled={!authFlag}
            >
              Update
            </Button>
          </Grid>
        </form>
      </div>
    </>
  );
}
