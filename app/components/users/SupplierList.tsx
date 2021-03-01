import React, { useEffect, useLayoutEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Sidebar from '../../containers/Sidebar';
import * as dbpath from '../../constants/config';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { useSelector } from 'react-redux';
import { isAuthenticated } from '../../features/auth/authSlice';
import NumberFormat from 'react-number-format';

const sqlite3 = require('sqlite3').verbose();

interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
  due_amount: number;
}
const useStylesToo = makeStyles({
  texts: {
    color: 'whitesmoke',
  },
  header: {
    textAlign: 'center',
    color: 'white',
    textDecoration: 'underline',
    textUnderlinePosition: 'under'
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

export default function SupplierList(): JSX.Element {
  const classes = useStylesToo();
  const [deleteModal, setDeleteModal] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(-1);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);

  const authFlag= useSelector(isAuthenticated);
  const history = useHistory();
  const location = useLocation();

  // console.log('Connected to the shop database.');
  useEffect(() => {
    // add db.all function to get all suppliers
    getSupplierList();
  }, []);

  const viewSupplier = (instant: Supplier) => {
    history.push({
      pathname: `/user-details/1/${instant.id}`,
      state: {verticalScrollHeight: window.scrollY}
    });
  };

  useLayoutEffect(()=> {
    if (location.state) {
      window.scrollTo({
        left: 0,
        top: location.state.verticalScrollHeight,
      })
    }
  })

  const getSupplierList = () => {
    try {
      const db = new sqlite3.Database(dbpath.dbPath);
      db.all(
        'SELECT * FROM User where is_supplier = ?',
        [1],
        (_err: Error, instant: Customer[]) => {
          setSupplierList(instant);
        }
      );
      db.close();
    }
    catch (e) {
      console.log(e);
    }
  }

  const openDeleteSupplier = (instant: Transaction) => {
    setDeleteModal(true);
    setToBeDeleted(instant.id);
  };

  const deleteSupplier = () => {
    try {
      const db = new sqlite3.Database(dbpath.dbPath);
      db.run(
        'DELETE FROM User WHERE id = ?', [toBeDeleted],
        (_err: Error) => {
          if (_err) {
            console.log(_err);
          } else {
            setDeleteModal(false);
            getSupplierList();
          }
        }
      );
      db.close();
    } catch (e) {
      console.log(e);
    }
  }
  /*
  return (
    <Grid container>
      <Grid item xs={4} md={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9} md={8}>
        add SupplierListthe table for supplier here
      </Grid>
    </Grid>
  );
  */
  return (
    <Grid container direction="row" style={{height: '140vh'}}>
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>
        <Grid className={classes.header}>
          <h3>List of Suppliers</h3>
        </Grid>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.texts}>Supplier Name</TableCell>
                <TableCell className={classes.texts}>Phone</TableCell>
                <TableCell className={classes.texts}>Address</TableCell>
                <TableCell className={classes.texts}>Due Amount</TableCell>
                <TableCell className={classes.texts}>Balance</TableCell>
                <TableCell className={classes.texts} />
              </TableRow>
            </TableHead>
            <TableBody>
              {supplierList.length === 0 ?
                <TableRow>
                  <TableCell colSpan={6} align="left" className={classes.texts} style={{ textAlign: 'center' }}>
                    No items
                  </TableCell>
                </TableRow>
                :
                supplierList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left" className={classes.texts}>
                    {row.name}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.phone}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.address}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.due_amount < 0 ? 0 :
                      <NumberFormat value={row.due_amount} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={2}/>}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.due_amount > 0 ? 0 :
                      <NumberFormat value={row.due_amount * -1} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={2}/>}
                  </TableCell>
                  <TableCell align="center" className={classes.texts}>
                    <VisibilityIcon onClick={() => viewSupplier(row)} />
                    {authFlag &&
                    <>
                      <EditIcon onClick={() => history.push({
                        pathname: `/update-user/1/${row.id}`,
                        state: {verticalScrollHeight: window.scrollY}
                      })}
                                style={{ padding: '0 5px'}} />
                      <DeleteIcon onClick={() => openDeleteSupplier(row)} />
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
                  deleteSupplier();
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
