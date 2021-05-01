import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory, useLocation } from 'react-router';
import EditIcon from '@material-ui/icons/Edit';
import routes from '../../constants/routes.json';
import * as dbpath from '../../constants/config';
import DeleteIcon from '@material-ui/icons/Delete';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { useSelector } from 'react-redux';
import { isAuthenticated } from '../../features/auth/authSlice';
import NumberFormat from 'react-number-format';

const sqlite3 = require('sqlite3').verbose();


interface Product {
  id: number;
  code: string;
  title: string;
  price: number;
  shop_stock_count: number;
  godown_stock_count: number;
  unit: string | null;
  out_of_stock: number | null;
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
  textField: {
    color: 'white',
    borderColor: 'white',
    margin: '0 0 16px 0',
  },
  gridMargin: {
    margin: '10px 0'
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
});

export default function ProductList(): JSX.Element {
  const classes = useStyles();
  const [productList, setProductList] = useState<Product[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(-1);

  const history = useHistory();
  const location = useLocation();
  const listRef = useRef(null);
  const authFlag= useSelector(isAuthenticated);

  // console.log('Connected to the shop database.');
  useEffect(() => {
    getProductList();
    //window.scrollTo(location.state.verticalScrollHeight);
  }, []);

  useLayoutEffect(()=> {
    if (location.state) {
      window.scrollTo({
        left: 0,
        top: location.state.verticalScrollHeight,
      })
    }
  })

  const getProductList = () => {
    try {
      const sqlite3 = require('sqlite3').verbose();
      const db = new sqlite3.Database(dbpath.dbPath);
      // const dbPath = (process.env.NODE_ENV === 'development') ? 'shopdb.sqlite3' : path.resolve(app.getPath('userData'), 'shopdb.sqlite3');
      // const db = new sqlite3.Database(dbpath.dbPath);
      db.all(
        'SELECT * FROM Product',
        (err: Error, instant: Product[]) => {
          if (err) {
            console.log(err);
          } else {
            setProductList(instant);
          }
        }
      );
      db.close();
    } catch (e) {
      console.log(e);
    }
  }

  const editProduct = (instant: Product) => {
    history.push({
      pathname: routes.ADD_PRODUCTS,
      state: { product: instant, verticalScrollHeight: window.scrollY },
    });
  };

  const openDeleteProduct = (instant: Product) => {
    setDeleteModal(true);
    setToBeDeleted(instant.id);
  }

  const deleteProduct = () => {
    try {
      const db = new sqlite3.Database(dbpath.dbPath);
      db.run(
        'DELETE FROM Product WHERE id = ?', [toBeDeleted],
        (_err: Error) => {
          if (_err) {
            console.log(_err);
          }
          else {
            setDeleteModal(false);
            getProductList();
          }
        }
      );
      db.close();
    }
    catch (e) {
      console.log(e);
    }
  };


  return (
    <>
      <div ref={listRef}>
        <Grid className={classes.header}>
          <h3>List of Products</h3>
        </Grid>

        <Grid>
          <Button
            variant='contained'
            color='primary'
            onClick={() =>
              history.push({
                pathname: routes.ADD_PRODUCTS,
                state: { product: null, verticalScrollHeight: window.scrollY },
              })}
            className={classes.btn}
          >
            Add product
          </Button>
        </Grid>

        <Grid>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.texts}>Title</TableCell>
                  <TableCell className={classes.texts}>Code</TableCell>
                  <TableCell className={classes.texts}>Price</TableCell>
                  <TableCell className={classes.texts}>Shop Stock</TableCell>
                  <TableCell className={classes.texts}>Godown Stock</TableCell>
                  <TableCell className={classes.texts}>Unit</TableCell>
                  <TableCell className={classes.texts} />
                </TableRow>
              </TableHead>
              <TableBody>
                {productList.length === 0 ?
                  <TableRow>
                    <TableCell colSpan={6} align="left" className={classes.texts} style={{ textAlign: 'center' }}>
                      No items
                    </TableCell>
                  </TableRow>
                  :
                  productList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="left" className={classes.texts}>
                      {row.title}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.code}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      <NumberFormat value={row.price} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={2}/>
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      <NumberFormat value={row.shop_stock_count} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={2}/>
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      <NumberFormat value={row.godown_stock_count} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={2}/>
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.unit === null ? 'N/A' : row.unit}
                    </TableCell>
                    <TableCell align="center" className={classes.texts}>
                      <EditIcon onClick={() => editProduct(row)} style={{padding: '0 5px'}}/>
                      {authFlag &&
                      <DeleteIcon onClick={() => openDeleteProduct(row)} style={{ padding: '0 5px' }} />
                      }
                    </TableCell>
                  </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
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
                  deleteProduct();
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
