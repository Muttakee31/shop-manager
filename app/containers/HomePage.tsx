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
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityIconOff from '@material-ui/icons/VisibilityOff';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


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
      textUnderlinePosition: 'under',
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
    },
    card: {
      width: 290,
      boxShadow: '5px 5px 15px #010101'
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
    },
    cardContainer: {
      display: 'flex',
      flexDirection: 'row',
      color: 'white',
      justifyContent: 'space-evenly',
      margin: 17,
      borderRadius: 9
    },
    title: {
      fontSize: 14
    },
    amount: {
      fontSize: '20px',
      margin: '8px 0'
    }
  }),
);


export default function HomePage() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [alert, setAlert] = useState<string | null>(null);
  /*const [options, setOption] = useState({
    chart: {
      id: 'line-example'
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
    }
  });*/

  /*const [series, setSeries] = useState(
    [{
      name: 'series-1',
      data: [30, 40, 45, 50, 49, 60, 70, 91]
    }])*/

  const dispatch = useDispatch();
  const authFlag= useSelector(isAuthenticated);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setAlert(null);
    setOpen(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(prevState => !prevState);
  }

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
              const token = jwt.sign({ username }, dbpath.SECRET_KEY, { expiresIn: '24h' });
              //console.log(token);
              dispatch(setAuthToken({token, username}));
              handleClose();
            }
            else {
              console.log('did not match');
              setAlert("Username or password did not match!");
            }
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }

  return (
    <Grid className={classes.grid}>

      <Grid className={classes.header}>
        <h3>Welcome to Shop Manager</h3>
      </Grid>

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
      </Grid>

      <Grid className={classes.cardContainer}>
        <Card className={classes.card} variant="outlined" style={{background: '#018af8'}}>
          <CardContent className={classes.content}>
            <span className={classes.title}>Total transaction</span>
             <span className={classes.amount}>123234</span>
          </CardContent>
        </Card>
        <Card className={classes.card} variant="outlined" style={{background: '#2fa758'}}>
          <CardContent className={classes.content}>
            <span className={classes.title}>Total sales</span>
            <span className={classes.amount}>123234</span>
          </CardContent>
        </Card>
      </Grid>

      <Grid className={classes.cardContainer}>
        <Card className={classes.card} variant="outlined" style={{background: '#1abfaa'}}>
          <CardContent className={classes.content}>
            <span className={classes.title}>Total expense</span>
            <span className={classes.amount}>123234</span>
          </CardContent>
        </Card>
        <Card className={classes.card} variant="outlined" style={{background: '#dc0835'}}>
          <CardContent className={classes.content}>
            <span className={classes.title}>Payments due</span>
            <span className={classes.amount}>123234</span>
          </CardContent>
        </Card>
      </Grid>

      {/*<Grid className={classes.header}>
        <h3>Transaction of last 30 days</h3>
      </Grid>*/}


      {/*<Grid className={classes.cardContainer}>
        <Chart options={options}
               series={series}
               type="line" width={620} height={320} />
      </Grid>*/}




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
                type={showPassword ? 'text' : 'password'}
                value={password}
                fullWidth
                className={classes.textField}
                onChange={(e) => setPassword(e.target.value)}
                InputProps = {{ endAdornment :
                  <InputAdornment position="end">
                    <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    >
                      {!showPassword ?
                        <VisibilityIcon className={classes.texts}/> :
                        <VisibilityIconOff className={classes.texts}/>}
                    </IconButton>
                  </InputAdornment>
                }}
              />
            </Grid>
            {alert !== null &&
            <Alert severity="error" className={classes.gridMargin}>
              {alert}
            </Alert>
            }
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
