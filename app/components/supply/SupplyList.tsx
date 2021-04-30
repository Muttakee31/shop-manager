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
import { useHistory, useLocation } from 'react-router';
import dayjs from 'dayjs';
import routes from '../../constants/routes.json';
import * as dbpath from '../../constants/config';
import { useSelector } from 'react-redux';
import { isAuthenticated } from '../../features/auth/authSlice';
import DeleteIcon from '@material-ui/icons/Delete';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import CssTextField from '../snippets/CssTextField';
import NumberFormat from 'react-number-format';

const sqlite3 = require('sqlite3').verbose();

interface Supply {
  id: number;
  supplier: number;
  supplier_name: string;
  total_cost: number;
  timestamp: string;
}

interface SupplyItem {
  id: number;
  product: number;
  product_title: string;
  title: string;
  quantity: number;
  price: number;
  storage: string;
}

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

const useStyles = makeStyles({
  texts: {
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
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    height: '40px',
    marginLeft: 10
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

export default function SupplyList(): JSX.Element {
  const classes = useStyles();
  const [supplyList, setSupplyList] = useState<Supply[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<null | Supply>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
  const history = useHistory();
  const location = useLocation();
  const authFlag= useSelector(isAuthenticated);

  // console.log('Connected to the shop database.');
  // const [SupplyList, setSupplyList] = useState([]);

  useEffect(() => {
    if (typeof location.state !== 'undefined') {
      setSelectedDate(location.state.selectedDate);
    }
  }, [])

  useEffect(() => {
    // add db.all function to get all Supplys
    getSupplies();
  }, [selectedDate]);

  const openDeleteSupply = (instant: Supply) => {
    setDeleteModal(true);
    setToBeDeleted(instant);
  }

  const getSupplies = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    try {
      db.all(
        'SELECT * FROM Supply WHERE timestamp LIKE ? ORDER BY id DESC',
        [selectedDate  + "%"],
        (_err: Error, instant: Supply[]) => {
          setSupplyList(instant);
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

  const deleteSupply = () => {
    try {
      const today = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss[Z]')
      const db = new sqlite3.Database(dbpath.dbPath);
      db.all(
        'SELECT * FROM SupplyItem WHERE supply_id = ?', [toBeDeleted?.id],
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
                    console.log(JSON.stringify(this) + ' updated');
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
                    console.log('updated');
                  }
                })
              db.run(
                `DELETE FROM SupplyItem WHERE id = ?`,
                [item.id],
                function (error_4: Error) {
                  if (error_4) {
                    console.log(error_4.message);
                  } else {
                    console.log(item.id + ' deleted');
                  }
                })
            })
          }
          deleteTransaction();
          db.run(
            'DELETE FROM Supply WHERE id = ?', [toBeDeleted?.id],
            (_err: Error) => {
              if (_err) {
                console.log(_err);
              } else {
                console.log('supply deleted');
                setDeleteModal(false);
                getSupplies();
              }
            }
          );
        }
      )
      db.close();
    } catch (e) {
      console.log(e);
    }
  }

  const deleteTransaction = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    db.get(
      `SELECT * FROM Transactions WHERE supply_id = ?`,
      [toBeDeleted?.id],
      function (err : Error, instant : Transaction) {
        if (err) {
          console.log(err);
        } else {
          if (instant) {
            db.run(
              `UPDATE User SET due_amount = due_amount + ? WHERE id = ?`,
              [instant.due_amount, toBeDeleted?.supplier],
              function(error_3: Error) {
                if (error_3) {
                  console.log(error_3.message);
                } else {
                  console.log('due updated');
                }
              })
            db.run(
              'DELETE FROM Transactions WHERE id = ?', [instant.id],
              (_err: Error) => {
                if (_err) {
                  console.log(_err);
                } else {
                  console.log('deleted transaction');
                }
              }
            );
          }
        }
      })
  }

  return (
    <>
      <div>
        <Grid className={classes.header}>
          <h3>List of Supply</h3>
        </Grid>

        <Grid item xs={8} xl={9} className={classes.topbin}>
          <Button
            variant='contained'
            color='primary'
            onClick={() =>
              history.push({
                pathname: routes.ADD_SUPPLY,
                state: { product: null },
              })}
            className={classes.btn}
          >
            Add supply
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
                <TableCell className={classes.texts}>Supplier name</TableCell>
                <TableCell className={classes.texts}>Total cost</TableCell>
                <TableCell className={classes.texts}>Time of supply</TableCell>
                <TableCell className={classes.texts} />
              </TableRow>
            </TableHead>
            <TableBody>
              {supplyList.length === 0 ?
                <TableRow>
                  <TableCell colSpan={6} align="left" className={classes.texts} style={{ textAlign: 'center' }}>
                    No supply event yet.
                  </TableCell>
                </TableRow>
                :
                supplyList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left" className={classes.texts}>
                    {row.supplier_name}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    <NumberFormat value={row.total_cost} displayType={'text'}
                                  thousandSeparator={true} thousandsGroupStyle="lakh"
                                  decimalScale={2}/>
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {dayjs(row.timestamp.split('Z')[0]).format('MMMM DD, YYYY [a]t hh:mm A')}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    <VisibilityIcon style={{ padding: '0 5px' }}
                      onClick={() => history.push({
                        pathname: `/supply/${row.id}`,
                        state: {selectedDate: selectedDate}
                        }
                      )}
                    />
                    {authFlag &&
                    <DeleteIcon onClick={() => openDeleteSupply(row)} style={{ padding: '0 5px' }} />
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
                  deleteSupply();
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
