import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../../containers/Sidebar';
import * as dbpath from '../../constants/config';
import Button from '@material-ui/core/Button';
import routes from '../../constants/routes.json';
import { useHistory } from 'react-router';
import { transactionType } from '../../constants/config';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import dayjs from 'dayjs';
import Chip from '@material-ui/core/Chip';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useSelector } from 'react-redux';
import { isAuthenticated } from '../../features/auth/authSlice';
import DeleteIcon from '@material-ui/icons/Delete';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';

const sqlite3 = require('sqlite3').verbose();

interface Transaction {
  id: number;
  client: number;
  order_id: number;
  paid_amount: number;
  client_name: string;
  order_cost: number;
  labour_cost: number;
  discount: number | null;
  payment_type: number;
  transaction_type: number;
  due_amount: number | null;
  supply_id: number;
  timestamp: string;
}

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
    margin: 10,
  },
  topbin: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btn: {
    height: '40px'
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
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    border: '2px solid #000',
    background: '#232c39',
    boxShadow: '3px 3px 20px #010101',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 400,
    height: 170,
    margin: 15
  },
});

/*const type = {
  '0': 'Paid',
  '1': 'Due',
  '2': 'Both',
};*/

/*function compare(a:Transaction, b:Transaction) {
  if (dayjs(a.timestamp).isBefore(b.timestamp)) return 1;
  if (dayjs(a.timestamp).isAfter(b.timestamp)) return -1;
  return 0;
}*/

const chipColor = ['#2cb115', '#3638aa', '#b12423', '#388f9c']

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
    '& .MuiInputBase-root': {
      color: 'floralwhite',
    },
    '& .MuiFormLabel-root': {
      color: 'floralwhite',
    },
    '& .MuiSelect-select.MuiSelect-select': {
      color: 'floralwhite',
    },
  },
})(TextField);

export default function TransactionList(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const authFlag= useSelector(isAuthenticated);

  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
  const [deleteModal, setDeleteModal] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(-1);

  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  //const [visibleTransactionList, setVisibleTransactionList] = useState<Transaction[]>([]);
  // const history = useHistory();
  // console.log('Connected to the shop database.');
  // const [transactionList, setTransactionList] = useState([]);

  useEffect(() => {
    // add db.all function to get all transactions
    getTransactionList();
  }, [selectedDate]);

  const openDeleteTransaction = (instant: Transaction) => {
    setDeleteModal(true);
    setToBeDeleted(instant.id);
  };

  const getTransactionList = () => {
   try {
     console.log(selectedDate);
     const db = new sqlite3.Database(dbpath.dbPath);
     db.all(
       `SELECT * FROM Transactions WHERE timestamp LIKE ?`,
       [selectedDate  + "%"],
       (_err: Error, instant: Transaction[]) => {
         if (instant !== undefined) {
           setTransactionList(instant);
         }         //setVisibleTransactionList(instant);
         /*setVisibleTransactionList(
           instant.filter(item => dayjs(item.timestamp).format('YYYY-MM-DD') === selectedDate).sort(compare))*/
       }
     );
     db.close();
  } catch (e) {

   }
  }

  const deleteTransaction = () => {
    try {
      const db = new sqlite3.Database(dbpath.dbPath);
      db.run(
        'DELETE FROM Transactions WHERE id = ?', [toBeDeleted],
        (_err: Error) => {
          if (_err) {
            console.log(_err);
          } else {
            setDeleteModal(false);
            getTransactionList();
          }
        }
      );
      db.close();
    } catch (e) {
      console.log(e);
    }
  }

  const changeDate = (e:React.ChangeEvent) => {
    // @ts-ignore
    const value: string = e.target.value;
    setSelectedDate(value);
    //console.log(value);
    //const filtered = transactionList.filter(item => dayjs(item.timestamp).format('YYYY-MM-DD') === value);
    //setVisibleTransactionList(transactionList);
  }



  const getChip = (type : number) => {
    const text = Object.keys(transactionType).filter(item => {
      // @ts-ignore
     return transactionType[item] == type;
    })[0];

    console.log(type);
    return (
      <Chip
        label={text}
        style={{textTransform: 'capitalize', color: 'floralwhite',
          backgroundColor: chipColor[type-1]}}
      />

    )
  }

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <Grid container>
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>
        <Grid className={classes.header}>
          <h3>List of Transactions</h3>
        </Grid>

        <Grid item xs={8} lg={9} className={classes.topbin}>
          <Button
            variant="contained"
            color="primary"
            className={classes.btn}
            onClick={() =>
              history.push({
                pathname: routes.DUE_PAYMENT,
              })}
          >
            Add due payment
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
                <TableCell className={classes.texts}>Client name</TableCell>
                <TableCell className={classes.texts}>Type</TableCell>
                <TableCell className={classes.texts}>Cost</TableCell>
                <TableCell className={classes.texts}>Paid amount</TableCell>
                <TableCell className={classes.texts}>Due amount</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionList.length === 0 ?
                <TableRow>
                  <TableCell colSpan={6} align="left" className={classes.texts} style={{ textAlign: 'center' }}>
                    No items
                  </TableCell>
                </TableRow>
                :transactionList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left" className={classes.texts}>
                    {row.client_name === null ? 'N/A' : row.client_name}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {getChip(row.transaction_type)}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.order_cost}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.paid_amount}
                  </TableCell>
                  {/*<TableCell align="left" className={classes.texts}>
                    {row.labour_cost !== null ? "N/A" : row.labour_cost}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.discount === null ? 'N/A' : row.discount}
                  </TableCell>*/}
                  <TableCell align="left" className={classes.texts}>
                    {row.due_amount === null ? 'N/A' : row.due_amount}
                  </TableCell>
                    <TableCell align="center" className={classes.texts}>
                      <VisibilityIcon
                        onClick={() => history.push(`/transaction-details/${row.id}`)}
                        style={{ padding: '0 5px' }}
                      />
                      {authFlag &&
                        <>
                          <EditIcon onClick={() => history.push(`/update-transaction/${row.id}`)}/>
                          <DeleteIcon onClick={() => openDeleteTransaction(row)} style={{ padding: '0 5px' }}/>
                        </>
                      }
                    </TableCell>
                </TableRow>
              ))}
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
                  deleteTransaction();
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
