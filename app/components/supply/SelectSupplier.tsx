import React, { SetStateAction, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

const sqlite3 = require('sqlite3').verbose();

interface User {
  id: number;
  name: string;
  phone: string;
  address: string;
  is_supplier: number;
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
    margin: 10,
  },
});

export default function SelectSupplier(props: {
  setSupplyState: SetStateAction<any>;
  setSelectedUser: SetStateAction<any>;
}): JSX.Element {
  const [userList, setUserList] = useState<User[]>([]);
  const [userName, setUserName] = useState('');
  const [userPhone, setPhone] = useState('');
  const [userAddress, setAddress] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const classes = useStyles();

  useEffect(() => {
    const db = new sqlite3.Database('shopdb.sqlite3');
    db.all(
      'SELECT * FROM USER WHERE is_supplier = 1',
      (_err: Error, instant: React.SetStateAction<User[]>) => {
        setUserList(instant);
      }
    );
    db.close();
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedUser(event.target.value as string);
  };

  const createSupplier = (e: any) => {
    e.preventDefault();
    const db = new sqlite3.Database('shopdb.sqlite3');

    // insert one row into the langs table
    db.run(
      `INSERT INTO User(name, phone, address, is_supplier) VALUES(?,?,?,?) `,
      [userName, userPhone, userAddress, 1],
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
          is_supplier: 1,
        };

        props.setSelectedUser(user);
        props.setSupplyState(1);
        // console.log(`A row has been inserted`);
      }
    );

    // close the database connection
    db.close();
  };

  const confirmSupplier = () => {
    console.log(selectedUser);
    const user = userList.filter((item) => item.id === Number(selectedUser))[0];
    props.setSelectedUser(user);
    props.setSupplyState(1);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormControl className={classes.selectField}>
          <InputLabel id="demo-simple-select-label">
            Select a supplier
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedUser}
            onChange={handleChange}
          >
            <MenuItem value="">Choose an user</MenuItem>
            {userList.map((instant) => {
              return (
                <MenuItem value={String(instant.id)}>{instant.name}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>

      <Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={() => confirmSupplier()}
        >
          Select supplier
        </Button>
      </Grid>

      <Grid>
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
          <Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => createSupplier(e)}
            >
              Create
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}