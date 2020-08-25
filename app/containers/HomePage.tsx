import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import * as dbpath from '../constants/config';
import Alert from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthenticated, logOutUser, setAuthToken } from '../features/auth/authSlice';

const sqlite3 = require('sqlite3').verbose();
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');


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

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      border: '2px solid #000',
      background: '#232c39',
      boxShadow: '3px 3px 20px #010101',
      padding: 15,
      margin: 15,
      width: 400,
      height: 300,
    },
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
      margin: '0 0 16px 0',
    },
    input: {
      color: 'white',
    },
    gridMargin: {
      margin: '10px 0'
    }
  }),
);


export default function HomePage() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<string | null>(null);

  const dispatch = useDispatch();
  const authFlag= useSelector(isAuthenticated);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const signIn = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    setAlert(null);
    try{
      db.all(`SELECT * FROM USER WHERE name = ? AND is_admin = ?`, [username, 1],
        function(err: Error, instant:any) {
          if (err) {
            console.log(err);
          }
          else {
            const hashedPass : string =  CryptoJS.SHA256(password).toString();
            if (instant.length !== 0 && instant[0].password == hashedPass) {
              const token = jwt.sign({ username }, dbpath.SECRET_KEY, { expiresIn: '5m' });
              //console.log(token);
              dispatch(setAuthToken({token, username}));
              handleClose();
            }
            else {
              console.log('did not match');
              setAlert("Username or password did not match");
            }
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }

  return (
    <Grid>
      {!authFlag ?
        <Button color='primary' variant='contained' onClick={handleOpen}>
          View as Admin
        </Button>
        :
        <Button color='primary' variant='contained' onClick={()=> dispatch(logOutUser())}>
          Log out
        </Button>
      }
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Grid className={classes.header}>
              <h3>Sign in</h3>
            </Grid>
            <Grid>
              <CssTextField
                id="standard-required"
                label="Username"
                value={username}
                className={classes.textField}
                fullWidth
                onChange={(e) => setUserName(e.target.value)}
              />
            </Grid>

            <Grid>
              <CssTextField
                id="standard-basic"
                label="Password"
                type='password'
                value={password}
                fullWidth
                className={classes.textField}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            {alert !== null &&
            <Alert severity="error" className={classes.gridMargin}>{alert}</Alert>}
            <Grid>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.gridMargin}
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Sign in
              </Button>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </Grid>
  );
}
