import React, { FormEvent, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import * as dbpath from '../../constants/config';
import { useSelector } from 'react-redux';
import { authToken, isAuthenticated, logOutUser, userName } from '../../features/auth/authSlice';
import Alert from '@material-ui/lab/Alert';
import CssTextField from '../snippets/CssTextField';
import routes from '../../constants/routes.json';

const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');


const useStyles = makeStyles({
  texts: {
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

export default function UpdateUser(): JSX.Element {
  const [username, setUserName] = useState('');
  const [userPhone, setPhone] = useState('');
  const [userAddress, setAddress] = useState('');
  const [dueAmount, setDueAmount] = useState('');
  const [alert, setAlert] = useState<string | null>(null);

  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const match = useRouteMatch();
  const authFlag= useSelector(isAuthenticated);
  const user = useSelector(userName);
  const token= useSelector(authToken);

  useEffect(() => {
    // @ts-ignore
    const id: number = match.params.id;
    //console.log(id);
    const db = new sqlite3.Database(dbpath.dbPath);
    db.get(
      'SELECT * FROM User where id=?',
      [id],
      (err: Error, instant:any) => {
        if (err) {
          console.log(err);
        } else {
          setUserName(instant.name);
          setAddress(instant.address);
          setPhone(instant.phone);
          setDueAmount(instant.due_amount);
          console.log(instant);
        }
      }
    );
    db.close();
    /* if (location.state.instant !== undefined) {
      console.log(location.state.instant);
    } */
  }, []);

  const updateUser = (event : FormEvent) => {
    event.preventDefault();
    // @ts-ignore
    const id: number = match.params.id;
    try {
      setAlert(null);
      const decoded = jwt.verify(token, dbpath.SECRET_KEY);
      const db = new sqlite3.Database(dbpath.dbPath);
      if (decoded.username === user) {
        db.run(
          `UPDATE User SET name = ?, address = ?,
           phone = ?, due_amount = ? WHERE id = ?`,
          [
            username,
            userAddress,
            userPhone,
            dueAmount,
            id
          ],
          function(err: Error) {
            if (err) {
              console.log(err.message);
              setAlert("Something went wrong!");
            } else {
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

  const returnToPreviousPage = () => {
    history.replace({
      pathname: match.params.type === '0' ? routes.CUSTOMERS : routes.SUPPLIERS,
      state: {  verticalScrollHeight: location.state.verticalScrollHeight },
    })
  }

  return (
    <>
      <div className={classes.grid}>
        <Grid className={classes.header}>
          <h3>Update User Details</h3>
        </Grid>

        <form autoComplete='off' onSubmit={(e) => updateUser(e)}
              style={{ width: '320px', margin: 'auto' }}>
          <Grid>
            <CssTextField
              id='standard-required'
              label='Name'
              value={username}
              className={classes.textField}
              fullWidth
              required
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
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </Grid>

          <Grid>
            <CssTextField
              id="standard-required"
              label="Due Amount"
              value={dueAmount}
              className={classes.textField}
              fullWidth
              onChange={(e) => setDueAmount(e.target.value)}
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
              type='submit'
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
