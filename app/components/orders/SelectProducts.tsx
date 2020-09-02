import React, { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import DeleteIcon from '@material-ui/icons/Delete';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import TableContainer from '@material-ui/core/TableContainer';
import dayjs from 'dayjs';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as dbpath from '../../constants/config';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from 'react-router';
import { transactionType } from '../../constants/config';

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

interface User {
  id: number;
  name: string;
  phone: string;
  address: string;
  is_customer: number;
}

interface OrderItem {
  product_id: number;
  title: string;
  quantity: number;
  price: number;
  store: string;
}

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
    '& .MuiFormLabel-root': {
      color: 'floralwhite !important',
    },
    '& .MuiSelect-select.MuiSelect-select': {
      color: 'floralwhite',
    },
    '& .MuiInputBase-root': {
      color: 'floralwhite',
    },
  },
})(TextField);

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
  total: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '20px 4.5vw 40px 15px',
    fontSize: '20px',
  },
  selectField: {
    width: '210px',
    margin: 10,
    '&:input' : {
      color: 'white',
    },
    '&:before': {
      borderColor: 'white',
      color: 'white'
    },
    '&:after': {
      borderColor: 'lightblue',
      color: 'lightblue'
    },
    icon: {
      fill: 'white',
    },
  },
});

const sqlite3 = require('sqlite3').verbose();

export default function SelectProducts(props: {
  selectedCustomer: User;
  setOrderState: SetStateAction<any>
}): JSX.Element {
  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedProductID, setSelectedProductID] = useState<Product | string>('');
  const [orderItemList, setOrderItemList] = useState<OrderItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [quantity, setQuantity] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [store, setStore] = useState('0');

  const [paidByCustomer, setPaidByCustomer] = useState('');
  const [type, setType] = useState(0);
  const [labourCost, setLabourCost] = useState('');
  const [discount, setDiscount] = useState('0');
  //const [moneyToReturn, setMoneyToReturn] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const history = useHistory();
  //const [totalCost, setTotalCost] = useState(0);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStore((event.target as HTMLInputElement).value);
  };

  const classes = useStyles();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    db.all(
      'SELECT * FROM Product',
      (_err: Error, instant: Product[]) => {
        setProductList(instant);
      }
    );
    db.close();
  };

  const addProduct = () => {
    const product = productList.filter(
      (instant) => instant.id === Number(selectedProductID)
    )[0];

    const order: OrderItem = {
      product_id: product.id,
      title: product.title,
      quantity: Number(quantity),
      price: Number(finalPrice),
      store,
    };

    setOrderItemList((prevState) => [...prevState, order]);
    setTotalPrice(totalPrice + Number(finalPrice) * Number(quantity));
    setQuantity('');
    setFinalPrice('');
  };

  const deleteProduct = (row: OrderItem) => {
    setTotalPrice(totalPrice - row.price * row.quantity);
    setOrderItemList(
      orderItemList.filter((item) => item.product_id !== row.product_id)
    );
  };

  const createOrder = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    const date = dayjs(new Date()).format('YYYY-MM-DDThh:mm:ss[Z]');
    const temp = new Date();
    temp.setHours(0,0,0,0);
    const midnight = dayjs(temp).format('YYYY-MM-DDThh:mm:ss[Z]');

    let id:number;
        // console.log(JSON.stringify(props.selectedCustomer));
    db.run(
      `INSERT INTO Orders(customer, customer_name, timestamp, total_cost) VALUES(?,?,?,?)  `,
      [
        props.selectedCustomer.id,
        props.selectedCustomer.name,
        date,
        Number(totalPrice),
      ],
      function (err: Error) {
        if (err) {
          console.log(err.message);
        }
        else {
          // @ts-ignore
          id = this.lastID;
          //console.log(typeof this.lastID);
          //setOrderID(id);
          //props.setOrderDetails(order);
          createTransaction(id);
          const stmt = db.prepare(
            `INSERT INTO OrderedItem(order_id, product, product_title, quantity, price, storage) VALUES (?, ?, ?, ?, ?, ?) `
          );
          orderItemList.map((instant) => {
            //console.log(instant);
            stmt.run(
              id,
              instant.product_id,
              instant.title,
              instant.quantity,
              instant.price,
              instant.store,
              function (error: Error) {
                if (error) {
                  console.log(error.message);
                } else {
                  //console.log(`order item added.${instant.store}`);
                  const dest =
                    instant.store === '0'
                      ? 'shop_stock_count'
                      : 'godown_stock_count';
                  db.run(
                    `UPDATE Product set ${dest}=${dest}  - ? where id=?`,
                    [instant.quantity, instant.product_id],
                    function (error_1: Error) {
                      if (error_1) {
                        console.log(error_1.message);
                      } else {
                        //console.log('updated');
                      }
                    }
                  );

                  const storage =
                    instant.store === '0'
                      ? 'current_shop_stock'
                      : 'current_godown_stock';
                  db.run(
                    `UPDATE StockHistory SET ${storage} = ${storage} - ?,
                    date_updated = ? WHERE product = ? AND date_created = ?`,
                    [instant.quantity, date, instant.product_id, midnight],
                    function(err:Error) {
                      if (err) {
                        console.log(err.message);
                      }
                      else {
                        //history.goBack();
                      }
                    });
                }
              }
            );
          });

          stmt.finalize();
        }
        }
        // @ts-ignore
    );
    db.close(() => { history.push(`/order/${id}`) });
    //console.log(id);
    //history.push(`/order/${id}`);
    // history.push(`/order/${orderID}`);
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(Number(event.target.value));
    // const product = productList.find()
    // setSelectedProduct(product);
  };

  const createTransaction = (order_id:number) => {
    const db = new sqlite3.Database(dbpath.dbPath);
    const date = dayjs(new Date()).format('YYYY-MM-DDThh:mm:ss[Z]');
    let due = totalPrice + Number(labourCost) - Number(discount) - Number(paidByCustomer) <= 0 ?
      0 : totalPrice + Number(labourCost) - Number(discount) - Number(paidByCustomer);
    // insert one row into the langs table
    db.run(
      `INSERT INTO Transactions(order_id, order_cost, client, client_name, transaction_type,
       payment_type, due_amount, paid_amount, labour_cost, discount, timestamp)
       VALUES(?,?,?,?,?,?,?,?,?,?,?) `,
      [
        order_id,
        totalPrice + Number(labourCost) - Number(discount),
        props.selectedCustomer.id,
        props.selectedCustomer.name,
        transactionType['order'],
        Number(type),
        due,
        paidByCustomer,
        labourCost,
        discount,
        date
      ],
      function (err: Error) {
        if (err) {
          console.log(err.message);
        } else if (due> 0 ||
          props.selectedCustomer.is_customer !== 1) {
          db.run(
            `UPDATE User set due_amount = due_amount + ?, has_due_bill = ?, is_customer = ? WHERE id = ?`,
            [due, due>0?1:0, 1, props.selectedCustomer.id],
            function (error: Error) {
              if (error) {
                console.log(error.message);
              } else {
                console.log('updated');
              }
            }
          );
        }

        // console.log(`A row has been inserted`);
      }
    );

    // close the database connection
    // props.setOrderState(3);
  };

  // console.log(props.selectedCustomer);
  return (
    <>
      <Grid container>

        <Grid item xs={4}>
          <Autocomplete
            id="combo-box-demo"
            options={productList}
            getOptionLabel={(option: Product) =>
              option.title + ' - ' + option.code
            }
            style={{ margin: 10 }}
            onChange={(event: ChangeEvent<{}>, newValue: Product) => {
              setSelectedProductID(String(newValue.id));
              setFinalPrice(String(newValue.price));
            }}
            renderInput={(params) => (
              <CssTextField {...params} label="Select products" />
              )}
          />
        </Grid>
        <Grid item xs={4}>
          <CssTextField
            id="standard-required"
            label="Price"
            value={finalPrice}
            className={classes.textField}
            onChange={(e) => setFinalPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <CssTextField
            id="standard-required"
            label="Quantity"
            value={quantity}
            className={classes.textField}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid direction="row" style={{margin: '0 20px'}}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select storage</FormLabel>
          <RadioGroup
            aria-label="select storage"
            name="store"
            value={store}
            onChange={handleRadioChange}
            row
          >
            <FormControlLabel
              value="0"
              control={<Radio color="primary" />}
              label="Shop"
            />
            <FormControlLabel
              value="1"
              control={<Radio color="primary" />}
              label="Godown"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid style={{margin: '0 20px'}}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => addProduct()}
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
                <TableCell className={classes.texts}>Rate</TableCell>
                <TableCell className={classes.texts}>Quantity</TableCell>
                <TableCell className={classes.texts}>Storage</TableCell>
                <TableCell className={classes.texts}>Price</TableCell>
                <TableCell className={classes.texts} />
              </TableRow>
            </TableHead>
            <TableBody>
              {orderItemList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="left" className={classes.texts} style={{ textAlign: 'center' }}>
                    No items
                  </TableCell>
                </TableRow>
              ) : (
                orderItemList.map((row) => (
                  <TableRow key={row.product_id}>
                    <TableCell align="left" className={classes.texts}>
                      {row.title}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.price}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.quantity}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.store === '1' ? 'Godown' : 'Shop'}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.quantity * row.price}
                    </TableCell>
                    <TableCell align="center" className={classes.texts}>
                      <DeleteIcon onClick={() => deleteProduct(row)} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {orderItemList.length > 0 && (
        <Grid className={classes.total}>
          <div>Total</div>
          <div>{totalPrice}</div>
        </Grid>
      )}

      <form autoComplete="off" style={{ width: '320px', margin: 'auto' }}>
        <Grid style={{margin: '20px auto'}}>
          <FormControl style={{color: 'white'}}>
            <InputLabel id="demo-simple-select-label" className={classes.textField}>Payment type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              className={classes.selectField}
              onChange={handleChange}
            >
              <MenuItem value="0">Paid</MenuItem>
              <MenuItem value="1">Due</MenuItem>
              <MenuItem value="2">Both</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid>
          <CssTextField
            id="standard-basic"
            label="Labour cost"
            value={labourCost}
            className={classes.textField}
            onChange={(e) => setLabourCost(e.target.value)}
          />
        </Grid>

        <Grid>
          <CssTextField
            id="standard-basic"
            label="Discount"
            value={discount}
            className={classes.textField}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </Grid>

        <Grid>
          <CssTextField
            id="standard-required"
            label="Paid by customer"
            value={paidByCustomer}
            className={classes.textField}
            onChange={(e) => setPaidByCustomer(e.target.value)}
          />
        </Grid>

        {/*<Grid container justify="center" direction="row">
          <Grid
            item
            style={{
              padding: '20px',
              background: '#277ea7',
              borderRadius: '9px',
            }}
          >
            <div style={{ marginBottom: '10px' }}>Money to return: </div>
            <div> {moneyToReturn}</div>
          </Grid>
          <Grid item xs={1} />
          <Grid
            item
            style={{
              padding: '20px',
              background: '#277ea7',
              borderRadius: '9px',
            }}
          >
            <div style={{ marginBottom: '10px' }}>Due amount: &nbsp; &nbsp;</div>
            <div> {dueAmount}</div>
          </Grid>
        </Grid>*/}

        <Grid style={{ margin: '20px auto', width: '240px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              createOrder();
            }}
            disabled={orderItemList.length === 0}
          >
            Create Order
          </Button>
        </Grid>
      </form>
    </>
  );
}
