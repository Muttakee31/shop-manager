import React, { ChangeEvent, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Sidebar from '../../containers/Sidebar';
import * as dbpath from '../../constants/config';
import { transactionType } from '../../constants/config';
import Autocomplete from '@material-ui/lab/Autocomplete';
import routes from '../../constants/routes.json';

const sqlite3 = require('sqlite3').verbose();

interface User {
  id: number;
  name: string;
  phone: string;
  address: string;
}

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

export default function DueTransaction(): JSX.Element {
  const [amount, setAmount] = useState('');
  const [customer, setCustomer] = useState<User | null>(null);
  const [description, setDescription] = useState('');
  const [userList, setUserList] = useState<User[]>([]);

  // const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    const db = new sqlite3.Database(dbpath.dbPath);
    db.all(
      'SELECT * FROM USER',
      (err: Error, instant: React.SetStateAction<User[]>) => {
        if (!err) {
          setUserList(instant);
        }
      }
    );
    db.close();
  }, []);

  const createDuePayment = () => {
    const db = new sqlite3.Database(dbpath.dbPath);

    db.run(
      `INSERT INTO Transactions(client, client_name, transaction_type,
       payment_type, paid_amount, discount, description)
       VALUES(?,?,?,?,?,?,?) `,
      [
        customer.id,
        customer.name,
        transactionType['due'],
        1,
        amount,
        0,
        description
      ],
      function (err: Error) {
        if (err) {
          console.log(err.message);
        } else {
          db.run(
            `UPDATE User set due_amount = due_amount - ?, has_due_bill = ? WHERE id = ?`,
            [amount, 0, customer.id],
            function (error: Error) {
              if (error) {
                console.log(error.message);
              } else {
                console.log('updated');
                history.push(routes.TRANSACTIONS);
              }
            }
          );
        }

        // console.log(`A row has been inserted`);
      }
    );
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
          <h3>Add due payment</h3>
        </Grid>
        <form autoComplete="off" style={{ width: '320px', margin: 'auto' }}>

          <Grid item xs={12}>
            <Autocomplete
              id="combo-box-demo"
              options={userList}
              getOptionLabel={(option: User) => `${option.name} - ${option.phone}`}
              style={{ width: 320, margin: 'auto' }}
              onChange={(event: ChangeEvent<{}>, newValue: User) => {
                setCustomer(newValue);
              }}
              renderInput={(params) => (
                <CssTextField {...params} label="Select customer" />
              )}
            />
          </Grid>

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
                createDuePayment();
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
