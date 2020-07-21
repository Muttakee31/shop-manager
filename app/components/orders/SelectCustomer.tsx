import React, { SetStateAction, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
const sqlite3 = require('sqlite3').verbose();

interface User {
  id: number | null,
  name: string,
  phone: string,
  address: string,
  is_customer: number
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
  },
  textField: {
    color: 'white',
    borderColor: 'white',
    margin: 10,
  },
  selectField: {
    color: 'white',
    borderColor: 'white',
    minWidth: 320,
    margin: 10
  }
});

export default function SelectCustomer(props: {setOrderState: SetStateAction<any>}): JSX.Element {
  const [userList , setUserList] = useState<User[]>([]);
  const [userName , setUserName] = useState('');
  const [userPhone , setPhone] = useState('');
  const [userAddress , setAddress] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const classes = useStyles();

  useEffect(() => {
    const db = new sqlite3.Database('shopdb.sqlite3');
    db.all(
      'SELECT rowId as id, * FROM USER WHERE is_customer = 1',
      (_err: Error, instant: React.SetStateAction<User[]>) => {
        setUserList(instant);
      }
    );
    db.close();
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedUser(event.target.value as string);
  };

  const createCustomer = () => {
    const db = new sqlite3.Database('shopdb.sqlite3');

    // insert one row into the langs table
    db.run(
      `INSERT INTO User(name, phone, address, is_customer) VALUES(?,?,?,?) `,
      [userName, userPhone, userAddress, 1],
      (err: Error) => {
        if (err) {
          console.log(err.message);
        }
        // get the last insert id
        setSelectedUser(this.lastID);
        props.setOrderState(2);
        // console.log(`A row has been inserted`);
      }
    );

    // close the database connection
    db.close();
  };

  return (
    <Grid container>
      <Grid xs={12}>
        <FormControl className={classes.selectField}>
          <InputLabel id="demo-simple-select-label">Select a customer</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedUser}
            onChange={handleChange}
          >
            <MenuItem value=''>Choose an user</MenuItem>
            {userList.map((instant) => {
              return(
              <MenuItem value={String(instant.id)}>{instant.name}</MenuItem>
                )
              }
            )}
          </Select>
        </FormControl>
      </Grid>
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
      </form>
    </Grid>
  );
}
