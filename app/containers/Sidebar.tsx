import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import sidebarConfig from '../constants/sidebarConfig';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import { isAuthenticated, logOutUser, setAuthToken, userName } from '../features/auth/authSlice';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import * as dbpath from '../constants/config';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import CssTextField from '../components/snippets/CssTextField';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityIconOff from '@material-ui/icons/VisibilityOff';
import Link from '@material-ui/core/Link';

const drawerWidth: number = 256;
const sqlite3 = require('sqlite3').verbose();
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');


const useStyles = makeStyles((theme: Theme) => ({
  /*sidebarContainer: {
    top: 0,
    position: 'sticky',
    height: '100vh',
    maxHeight: '100vh',
    boxShadow: '0 -2px 22px 0 rgba(0,0,0,.1)',
  },
  links: {
    textDecoration: 'none',
    padding: 12,
    cursor: 'pointer',
  },
  whiteWashedLinks: {
    textDecoration: 'none',
    backgroundColor: '#277ea7',
    padding: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    color: 'whitesmoke',
  },
  icons: {
    fontSize: 42,
  },
  sideBarChild: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sideText: {
    margin: 10,
  },*/
  root: {
    top: 0,
    position: 'sticky',
    maxHeight: '100vh',
    boxShadow: '0 -2px 22px 0 rgba(0,0,0,.3)',
    width: '100%',
    maxWidth: drawerWidth
  },
  textField: {
    margin: '0 0 16px 0'
  },
  header: {
    textAlign: 'center',
    textDecoration: 'underline',
    textUnderlinePosition: 'under'
  },
  topbin: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  grid: {
    marginTop: 40
  },
  input: {
  },
  gridMargin: {
    margin: '10px 0'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    border: '2px solid #000',
    background: '#fff',
    boxShadow: '3px 3px 20px #010101',
    padding: 15,
    margin: 15,
    width: 400,
    height: 330
  },
  texts: {
  },
  btn: {
    height: '40px',
    marginLeft: 10
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth

  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0

  },
    drawerPaper: {
      width: drawerWidth,
      background: 'inherit',
      boxShadow: '6px 0px 18px rgba(0, 0, 0, 0.06)',
      border: 'none'
    },
  drawerHeader: {
    color: '#EFB60E',
    fontSize: '1.25rem',
    margin: '12px'
  },
  parentList: {
  },
  nestedList: {
    width: '100%'
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  nested: {
    '&:hover': {
      background: 'rgba(39, 126, 167, 0.2)',
      borderRadius: 58.5
    }
  },
  activeListItem: {
    width: '100%',
    background: 'rgba(39, 126, 167, 0.2)',
    borderRadius: 58.5,
    '&:hover': {
      background: 'rgba(39, 126, 167, 0.2)',
      borderRadius: 58.5
    }
  },
    icon: {
    },
    listItems: {
      flexDirection: 'column',
      paddingLeft: 0,
      paddingRight: 0
    },
    userMargin: {
      padding: '24px 12px'
    },
    subtitle: {
      fontSize: '0.75rem',
      textDecoration: 'underline',
      textUnderlinePosition: 'under',
      cursor: 'pointer',
      color: '#28D9C3'
    },
    avatarSize: {
      width: 47,
      height: 47,
      background: '#28D9C3',
      color: 'whitesmoke'
    }
  })
);

const Sidebar: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();
  const [collapseFlag, setCollapseFlag] = useState(new Array(sidebarConfig.length).fill(true));
  const [openSignInModal, setOpenSignInModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const authFlag = useSelector(isAuthenticated);
  const loggedInUser = useSelector(userName);

  const handleClick = (key: number) => {
    const flag = (collapseFlag[key] === false);
    const temp = [...collapseFlag];
    temp[key] = flag;
    setCollapseFlag(temp);
  };

  const handleOpen = () => {
    setOpenSignInModal(true);
  };

  const handleClose = () => {
    setAlert(null);
    setOpenSignInModal(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  const signIn = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    setAlert(null);
    try {
      db.all(`SELECT * FROM USER WHERE name = ? AND is_admin = ?`, [fullName, 1],
        function(err: Error, instant: any) {
          if (err) {
            console.log(err);
          } else {
            const hashedPass: string = CryptoJS.SHA256(password).toString();
            if (instant.length !== 0 && instant[0].password == hashedPass) {
              const token = jwt.sign({ fullName }, dbpath.SECRET_KEY, { expiresIn: '12h' });
              //console.log(token);
              dispatch(setAuthToken({ token, username: fullName }));
              handleClose();
              setSuccessMessage(true);
            } else {
              setAlert('Username or password did not match!');
            }
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={classes.root}>

      <Modal
        aria-labelledb="transition-modal-title"
        aria-describedb="transition-modal-description"
        className={classes.modal}
        open={openSignInModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={openSignInModal}>
          <div className={classes.paper}>
            <Grid className={classes.header}>
              <h3>Sign in</h3>
            </Grid>
            <Grid>
              <CssTextField
                id='standard-required'
                label='Username'
                value={fullName}
                className={classes.textField}
                fullWidth
                onChange={(e) => setFullName(e.target.value)}
              />
            </Grid>

            <Grid>
              <CssTextField
                id='standard-basic'
                label='Password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                fullWidth
                className={classes.textField}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment:
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                      >
                        {!showPassword ?
                          <VisibilityIcon className={classes.texts} /> :
                          <VisibilityIconOff className={classes.texts} />}
                      </IconButton>
                    </InputAdornment>
                }}
              />
            </Grid>
            {alert !== null &&
            <Alert severity='error' className={classes.gridMargin}>
              {alert}
            </Alert>
            }
            <Grid>
              <Button
                variant='contained'
                color='primary'
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
      <Snackbar open={successMessage} autoHideDuration={6000}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                onClose={() => setSuccessMessage(false)}>
        <Alert onClose={() => setSuccessMessage(false)} severity='success'>
          Welcome, {loggedInUser}
        </Alert>
      </Snackbar>

      <Drawer
        className={classes.drawer}
        variant='permanent'
        classes={{
          paper: classes.drawerPaper
        }}
        anchor='left'
      >
        {/*<div className={classes.toolbar}>
          <div className={classes.drawerHeader}>
            <img src={logo_horizontal_blue} alt="itehk" width='80'/>
          </div>
        </div>
        <Divider />*/}

        <Grid container className={classes.userMargin}>
          <Grid item xs={2} style={{ margin: 'auto' }}>
            <Avatar src='invalid-url'
                    alt={loggedInUser ? loggedInUser : ''}
                    className={classes.avatarSize} />
          </Grid>
          <Grid item xs={9}>
            {!authFlag ?
              <Button color='primary' variant='contained'
                      onClick={handleOpen} className={classes.btn}>
                Sign in
              </Button>
              :
              <div style={{
                display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-start', alignItems: 'center'
              }}>
                <div style={{ fontSize: '1.25em' }}>
                  {loggedInUser}
                </div>
                <Link onClick={() => dispatch(logOutUser())}>
                  Log out
                </Link>
              </div>

            }

          </Grid>
        </Grid>

        <List component='nav' disablePadding className={classes.parentList}>
          {sidebarConfig.map((config, index) => (
            <ListItem button key={config.title} className={classes.listItems}>
              <ListItem button onClick={() => handleClick(index)}>

                <ListItemText primary={config.title} style={{ fontWeight: 'bold' }} />
                {collapseFlag && collapseFlag[index] == true ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={collapseFlag && collapseFlag[index] == true} timeout='auto' unmountOnExit className={classes.nestedList}>
                <List component='div' disablePadding>
                  {config.menu?.map((instant) => (
                      <ListItem button key={instant.title}
                                className={instant.url !== location.pathname ?
                                  classes.activeListItem : classes.nested}
                                onClick={() => history.push(instant.url)}>
                        <ListItemIcon className={classes.icon}>
                          {instant.icon}
                        </ListItemIcon>
                        <ListItemText primary={instant.title} />
                      </ListItem>
                    )
                  )}

                </List>
              </Collapse>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
    </div>
  );
};
export default Sidebar;
