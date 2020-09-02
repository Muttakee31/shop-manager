import React, { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as dbpath from '../../constants/config';

const sqlite3 = require('sqlite3').verbose();

interface User {
  id: number;
  name: string;
  phone: string;
  address: string;
  is_customer: number;
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
  textField: {
    color: 'white',
    borderColor: 'white',
    margin: '10px 0',
  },
  selectField: {
    color: 'white',
    borderColor: 'white',
    minWidth: 320,
    margin: 10,
  },
});

export default function SelectCustomer(props: {
  setOrderState: SetStateAction<any>;
  setSelectedUser: SetStateAction<any>;
}): JSX.Element {
  const [userList, setUserList] = useState<User[]>([]);
  const [userName, setUserName] = useState('');
  const [userPhone, setPhone] = useState('');
  const [userAddress, setAddress] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const classes = useStyles();

  useEffect(() => {
    const db = new sqlite3.Database(dbpath.dbPath);
    db.all(
      'SELECT * FROM USER where is_admin is NULL',
      (err: Error, instant: User[]) => {
        if (!err) {
          setUserList(instant);
        }
      }
    );
    db.close();
  }, []);

  const createCustomer = (e: any) => {
    e.preventDefault();
    const db = new sqlite3.Database(dbpath.dbPath);

    // insert one row into the langs table
    db.run(
      `INSERT INTO User(name, phone, address, is_customer, due_amount) VALUES(?,?,?,?,?) `,
      [userName, userPhone, userAddress, 1, 0],
      function (err: Error) {
        if (err) {
          console.log(err.message);
        }

        const user: User = {
          // @ts-ignore
          id: this.lastID,
          name: userName,
          address: userAddress,
          phone: userPhone,
          is_customer: 1,
        };

        props.setSelectedUser(user);
        props.setOrderState(1);
        // console.log(`A row has been inserted`);
      }
    );

    // close the database connection
    db.close();
  };

  const confirmCustomer = () => {
    console.log(selectedUser);
    // const user = userList.filter((item) => item.id === Number(selectedUser))[0];
    props.setSelectedUser(selectedUser);
    props.setOrderState(1);
  };

  return (
    <Grid container direction='column'>

      <Grid className={classes.header}>
        <h3>Choose a customer</h3>
      </Grid>

      <Grid>
        <Autocomplete
          id="combo-box-demo"
          options={userList}
          getOptionLabel={(option: User) => `${option.name} - ${option.phone}`}
          style={{ width: 250, margin: 'auto' }}
          onChange={(event: ChangeEvent<{}>, newValue: User) => {
            setSelectedUser(newValue);
          }}
          renderInput={(params) => (
            <CssTextField {...params} label="Find a customer" />
          )}
        />
      </Grid>

      <Grid style={{margin: '12px auto'}}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => confirmCustomer()}
        >
          Select Customer
        </Button>
      </Grid>

      <Grid className={classes.header}>
        <h3>Or,<br/> Create a customer</h3>
      </Grid>

      <Grid item style={{width: '250px', margin: '0 auto'}}>
        <form>
          <Grid>
            <CssTextField
              id="standard-required"
              label="Name"
              value={userName}
              className={classes.textField}
              fullWidth
              onChange={(e) => setUserName(e.target.value)}
            />
          </Grid>
          <Grid>
            <CssTextField
              id="standard-required"
              label="Phone number"
              value={userPhone}
              className={classes.textField}
              fullWidth
              onChange={(e) => setPhone(e.target.value)}
            />
          </Grid>

          <Grid>
            <CssTextField
              id="standard-required"
              label="Address"
              value={userAddress}
              className={classes.textField}
              fullWidth
              onChange={(e) => setAddress(e.target.value)}
            />
          </Grid>
          <Grid style={{marginTop: '12px'}}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={(e) => createCustomer(e)}
            >
              Create customer
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
