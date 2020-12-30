import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
import dayjs from 'dayjs';
import routes from '../../constants/routes.json';
import Sidebar from '../../containers/Sidebar';
import * as dbpath from '../../constants/config';
import DeleteIcon from '@material-ui/icons/Delete';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { useSelector } from 'react-redux';
import { isAuthenticated } from '../../features/auth/authSlice';
import CssTextField from '../snippets/CssTextField';

const sqlite3 = require('sqlite3').verbose();

interface Order {
  id: number;
  customer_name: string;
  total_cost: number;
  timestamp: string;
}

const useStyles = makeStyles({
  texts: {
  },
  header: {
    textAlign: 'center',
    textDecoration: 'underline',
    textUnderlinePosition: 'under'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topbin: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  paper: {
    background: '#ffffff',
    boxShadow: '3px 3px 20px #f8fafe',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 400,
    height: 170,
    margin: 15
  },
  textField: {
    color: 'white',
    borderColor: 'white',
    margin: 10,
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

export default function OrderList(): JSX.Element {
  const classes = useStyles();
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(-1);
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));

  const history = useHistory();
  const authFlag= useSelector(isAuthenticated);

  // console.log('Connected to the shop database.');
  // const [OrderList, setOrderList] = useState([]);

  useEffect(() => {
    // add db.all function to get all Orders
    getOrders();
  }, [selectedDate]);

  const openDeleteOrder = (instant: Order) => {
    setDeleteModal(true);
    setToBeDeleted(instant.id);
  }

  const getOrders = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    try {
      db.all(
        'SELECT * FROM Orders WHERE timestamp LIKE ? ORDER BY id DESC',
        [selectedDate  + "%"],
        (_err: Error, instant: Order[]) => {
          setOrderList(instant);
        }
      );
      db.close();
    }
    catch (e) {
    }
  };

  const changeDate = (e:React.ChangeEvent) => {
    // @ts-ignore
    const value: string = e.target.value;
    setSelectedDate(value);
    //console.log(value);
    //const filtered = transactionList.filter(item => dayjs(item.timestamp).format('YYYY-MM-DD') === value);
    //setVisibleTransactionList(transactionList);
  }


  const deleteOrder = () => {
    try {
      const db = new sqlite3.Database(dbpath.dbPath);
      db.run(
        'DELETE FROM Orders WHERE id = ?', [toBeDeleted],
        (_err: Error) => {
          if (_err) {
            console.log(_err);
          } else {
            setDeleteModal(false);
            getOrders();
          }
        }
      );
      db.close();
    } catch (e) {

    }
  }

  return (
    <Grid container>
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>
        <Grid className={classes.header}>
          <h3>List of Orders</h3>
        </Grid>

        <Grid item xs={8} lg={9} className={classes.topbin}>

          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              history.push({
                pathname: routes.PLACE_ORDERS,
                state: { order: null },
              })}
            style={{marginLeft: '10px'}}
          >
            Create an order
          </Button>

          <CssTextField
            id="date"
            label="Date"
            type="date"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            value={selectedDate}
            onChange={changeDate}
          />
        </Grid>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.texts}>Customer name</TableCell>
                <TableCell className={classes.texts}>Total cost</TableCell>
                <TableCell className={classes.texts}>Time of order</TableCell>
                <TableCell className={classes.texts} />
              </TableRow>
            </TableHead>
            <TableBody>
              {orderList.length === 0 ?
                  <TableRow>
                    <TableCell colSpan={6} align="left" className={classes.texts} style={{ textAlign: 'center' }}>
                      No orders yet.
                    </TableCell>
                  </TableRow>
                  :
                  orderList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="left" className={classes.texts}>
                      {row.customer_name}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.total_cost}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {dayjs(row.timestamp.split('Z')[0]).format('MMM DD, YYYY [at] hh:mm a')}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      <VisibilityIcon style={{padding: '0 5px'}}
                        onClick={() => history.push(`/order/${row.id}`)}
                      />
                      {authFlag &&
                      <DeleteIcon onClick={() => openDeleteOrder(row)} style={{ padding: '0 5px' }}/>
                      }
                    </TableCell>
                  </TableRow>
                  )
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={deleteModal}
        onClose={()=> setDeleteModal(false)}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={deleteModal}>
          <div className={classes.paper}>

            <Grid style={{textAlign: 'center'}}>
              <h3>
                Are you sure?
              </h3>
            </Grid>

            <Grid>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.deleteButton}
                onClick={() => {
                  deleteOrder();
                }}
              >
                Delete
              </Button>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </Grid>
  );
}
