import React, { useEffect, useState } from 'react';
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

const drawerWidth: number = 256;

const useStyles = makeStyles((theme: Theme) => ({
    /*sidebarContainer: {
      top: 0,
      position: 'sticky',
      height: '100vh',
      maxHeight: '100vh',
      boxShadow: '0 -2px 22px 0 rgba(0,0,0,.3)',
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
      // color: 'black',
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
      color: 'whitesmoke'
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    nested: {
      width: '100%',
      '&:hover': {
        background: 'rgba(40, 217, 195, 0.2)',
        borderRadius: 58.5
      }
    },
    activeListItem: {
      width: '100%',
      background: 'rgba(40, 217, 195, 0.2)',
      borderRadius: 58.5,
      '&:hover': {
        background: 'rgba(40, 217, 195, 0.2)',
        borderRadius: 58.5
      }
    },
    icon: {
      color: 'whitesmoke'
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
      background: '#1d2951',
      color: '#28D9C3'
    }
  })
);

const Sidebar: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = useState(1);

  useEffect(() => {
    sidebarConfig.map((config, index) => {
      config.menu?.map(item => item.url === location.pathname && setOpen(index));
    });
  }, []);

  const handleClick = (key: number) => {
    (open === key) ? setOpen(-1) : setOpen(key);
  };

  return (
    <div className={classes.root}>

      <Drawer
        className={classes.drawer}
        variant'"permanen'"
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

        {/*<Grid container className={classes.userMargin}>
          <Grid item xs={3} style={{margin: "auto"}}>
            <Avatar alt={auth.user?.full_name} src='invalid-url'
                    className={classes.avatarSize} />
          </Grid>
          <Grid item xs={9}>
            <div>
              {auth.user?.full_name}
            </div>
            <div style={{fontSize: '0.75rem'}}>
              {auth.user?.email}
            </div>
            <div style={{fontSize: '0.75rem'}}>
              {auth.user?.phone_no}
            </div>
          </Grid>
        </Grid>*/}

        <List component='nav' disablePadding className={classes.parentList}>
          {sidebarConfig.map((config, index) => (
            <ListItem button key={config.title} className={classes.listItems}>
              <ListItem button onClick={() => handleClick(index)}>

                <ListItemText primary={config.title} style={{ fontWeight: 'bold' }} />
                {open === index ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open === index} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {config.menu && config.menu.map((instant) => (
                      <ListItem button key={instant.title}
                                className={instant.url === location.pathname ?
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
