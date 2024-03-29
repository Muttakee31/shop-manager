import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import * as dbpath from '../../constants/config';
import { transactionType } from '../../constants/config';
import Button from '@material-ui/core/Button';
import { useHistory, useLocation } from 'react-router';
import dayjs from 'dayjs';
import Chip from '@material-ui/core/Chip';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useSelector } from 'react-redux';
import { isAuthenticated } from '../../features/auth/authSlice';
import DeleteIcon from '@material-ui/icons/Delete';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import CssTextField from '../snippets/CssTextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import NumberFormat from 'react-number-format';
import DatewiseTransactionReceipt from '../prints/DatewiseTransactionReceipt';

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
  description: string;
}

interface OrderItem {
  product: number;
  product_title: string;
  title: string;
  quantity: number;
  price: number;
  storage: string;
}

interface SupplyItem {
  product: number;
  product_title: string;
  title: string;
  quantity: number;
  price: number;
  storage: string;
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
    height: '40px',
    marginLeft: 10
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
  selectField: {
    width: 210
  }
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

const chipColor = ['#2cb115', '#3638aa', '#b12423', '#388f9c', '#541212']


export default function TransactionList(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const authFlag= useSelector(isAuthenticated);
  const cellRef = useRef();

  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
  const [deleteModal, setDeleteModal] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<Transaction | null>(null);
  const [type, setType] = useState(transactionType["order"]);

  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  //const [visibleTransactionList, setVisibleTransactionList] = useState<Transaction[]>([]);
  // const history = useHistory();
  // console.log('Connected to the shop database.');
  // const [transactionList, setTransactionList] = useState([]);

  useEffect(() => {
    if (typeof location.state !== 'undefined') {
      setType(location.state.type);
      setSelectedDate(location.state.selectedDate);
    }
  }, [])

  useEffect(() => {
    // add db.all function to get all transactions
    getTransactionList();
  }, [selectedDate, type]);

  useLayoutEffect(()=> {
    if (location.state) {
      window.scrollTo({
        left: 0,
        top: location.state.verticalScrollHeight,
      })
    }
  })

  const openDeleteTransaction = (instant: Transaction) => {
    setDeleteModal(true);
    setToBeDeleted(instant);
  };

  const getTransactionList = () => {
   try {
     const db = new sqlite3.Database(dbpath.dbPath);
     let params = [];
     params.push(selectedDate + "%");
     let statement : string = `SELECT * FROM Transactions WHERE timestamp LIKE ?`;
     params.push(type);
     statement += ` AND transaction_type = ?`;

     db.all(
       statement,
       params,
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
      deleteAction();
      const db = new sqlite3.Database(dbpath.dbPath);
      db.run(
        'DELETE FROM Transactions WHERE id = ?', [toBeDeleted?.id],
        (_err: Error) => {
          if (_err) {
            console.log(_err);
          } else {
            setDeleteModal(false);
            setToBeDeleted(null);
            getTransactionList();
          }
        }
      );
      db.close();
    } catch (e) {
      console.log(e);
    }
  }

  const deleteAction = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    const temp = new Date();
    temp.setHours(0, 0, 0, 0);
    const today = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss[Z]');
    if (toBeDeleted?.transaction_type !== transactionType['other']) {
      resetDueBalance();
    }
    if (toBeDeleted?.transaction_type === transactionType['order']) {
      try {
        console.log('here');
        db.all(
          'SELECT * FROM OrderedItem WHERE order_id = ?', [toBeDeleted.order_id],
          (_err: Error, instant: OrderItem[]) => {
            if (_err) {
              console.log(_err);
            } else {
              console.log(instant);
              instant?.map(item => {
                const dest = item.storage === '0' ? 'shop_stock_count' : 'godown_stock_count';
                db.run(
                  `UPDATE Product set ${dest}=${dest} + ? where id=?`,
                  [item.quantity, item.product],
                  function (error_1: Error) {
                    if (error_1) {
                      console.log(error_1.message);
                    } else {
                      console.log(item.product_title + ' updated');
                    }
                  })
                const store = item.storage === '0' ? 'current_shop_stock' : 'current_godown_stock';
                db.run(
                  `UPDATE StockHistory SET ${store} = ${store} + ?, date_updated= ? WHERE
id in (SELECT id FROM StockHistory WHERE product = ? ORDER BY id DESC LIMIT 1)`,
                  [
                    item.quantity,
                    today,
                    item.product
                  ],
                  function (error_2: Error) {
                    if (error_2) {
                      console.log(error_2.message);
                    } else {
                      console.log(item.product_title + ' stock updated');
                    }
                  })
              })
              db.run(
                'DELETE FROM Orders WHERE id = ?', [toBeDeleted.order_id],
                (_err: Error) => {
                  if (_err) {
                    console.log(_err);
                  } else {
                    console.log('order deleted');
                  }
                }
              );
            }
          }
        )
      } catch (e) {
        console.log(e);
      }
    }
    else if (toBeDeleted?.transaction_type === transactionType['supply']){
      try {
        db.all(
          'SELECT * FROM SupplyItem WHERE supply_id = ?', [toBeDeleted.supply_id],
          (_err: Error, instant: SupplyItem[]) => {
            if (_err) {
              console.log(_err);
            } else {
              instant?.map(item => {
                const dest = item.storage === '0' ? 'shop_stock_count' : 'godown_stock_count';
                db.run(
                  `UPDATE Product set ${dest}=${dest} - ? where id= ?`,
                  [item.quantity, item.product],
                  function (error_1: Error) {
                    if (error_1) {
                      console.log(error_1.message);
                    } else {
                    }
                  })
                const store = item.storage === '0' ? 'current_shop_stock' : 'current_godown_stock';
                db.run(
                  `UPDATE StockHistory SET ${store} = ${store} - ?, date_updated= ?
WHERE id in (SELECT id FROM StockHistory WHERE product = ? ORDER BY id DESC LIMIT 1)`,
                  [
                    item.quantity,
                    today,
                    item.product
                  ],
                  function (error_2: Error) {
                    if (error_2) {
                      console.log(error_2.message);
                    } else {
                    }
                  })
              })
            }
          }
        )
        db.run(
          'DELETE FROM Supply WHERE id = ?', [toBeDeleted.supply_id],
          (_err: Error) => {
            if (_err) {
              console.log(_err);
            } else {
              console.log('supply deleted');
            }
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
    db.close();
  }

  const resetDueBalance = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    const stmt = db.prepare(
      `UPDATE User SET due_amount = due_amount - ? WHERE id = ?`
    )

    let resetAmount: number | null = 0;
    if (toBeDeleted?.transaction_type === transactionType['order']) {
      resetAmount = Number(toBeDeleted.due_amount);
    }
    else if (toBeDeleted?.transaction_type === transactionType['supply']) {
      resetAmount = Number(toBeDeleted.due_amount) * -1
    }
    else if (toBeDeleted?.transaction_type === transactionType['due']) {
      resetAmount = toBeDeleted.paid_amount * -1
    }
    else if (toBeDeleted?.transaction_type === transactionType['bill']) {
      resetAmount = toBeDeleted.paid_amount
    }

    stmt.run(
      [resetAmount, toBeDeleted?.client],
      function (error_3: Error) {
        if (error_3) {
          console.log(error_3.message);
        } else {
          console.log('due updated');
        }
      })
    stmt.finalize();
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
    <>
      <div>
        <Grid className={classes.header}>
          <h3>List of Transactions</h3>
        </Grid>

        <Grid item xs={12} className={classes.topbin}>
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-label" className={classes.textField}>Payment type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              className={classes.selectField}
              onChange={(event)=>
                setType(event.target.value as string)}
            >
              {Object.keys(transactionType).map((type:string, index)=> {
                return (
                  <MenuItem value={String(transactionType[type])}>{type}</MenuItem>
                )
              })
              }

            </Select>
          </FormControl>

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
          <DatewiseTransactionReceipt type={type} transactionList={transactionList}/>
        </Grid>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.texts}>
                  {Number(type) === transactionType['other'] ? "Reason" : "Client name"}</TableCell>
                <TableCell className={classes.texts}>Type</TableCell>
                <TableCell className={classes.texts}>Cost</TableCell>
                <TableCell className={classes.texts}>Paid amount</TableCell>
                <TableCell className={classes.texts}>
                  {Number(type) === transactionType['supply'] ? "Balance" : "Due amount"}
                </TableCell>
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
                    {Number(type) === transactionType['other'] ?
                      row.description === null ? 'N/A' : row.description :
                      row.client_name === null ? 'N/A' : row.client_name
                    }
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {getChip(row.transaction_type)}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    <NumberFormat value={row.order_cost} displayType={'text'}
                                  thousandSeparator={true} thousandsGroupStyle="lakh"
                                  decimalScale={2}/>
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    <NumberFormat value={row.paid_amount} displayType={'text'}
                                  thousandSeparator={true} thousandsGroupStyle="lakh"
                                  decimalScale={2}/>
                  </TableCell>
                  {/*<TableCell align="left" className={classes.texts}>
                    {row.labour_cost !== null ? "N/A" : row.labour_cost}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.discount === null ? 'N/A' : row.discount}
                  </TableCell>*/}
                  <TableCell align="left" className={classes.texts}>
                    {row.due_amount === null ?
                      'N/A' :
                      <NumberFormat value={row.due_amount} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={2}/>}
                  </TableCell>
                    <TableCell align="center" className={classes.texts}>
                      <VisibilityIcon
                        onClick={() => history.push({
                          pathname: `/transaction-details/${row.id}`,
                          state: {
                            verticalScrollHeight: window.scrollY,
                            type: type,
                            selectedDate: selectedDate
                          }
                        })}
                        style={{ padding: '0 5px' }}
                      />
                      {authFlag &&
                        <>
                          <EditIcon onClick={() => history.push({
                            pathname: `/update-transaction/${row.id}`,
                            state: {
                              verticalScrollHeight: window.scrollY,
                              type: type,
                              selectedDate: selectedDate
                            }
                            })
                          } />
                          <DeleteIcon onClick={() => openDeleteTransaction(row)} style={{ padding: '0 5px' }} />
                        </>
                      }
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        closeAfterTransition
        BackdropProps={{
          timeout: 500
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
    </>
  );
}
