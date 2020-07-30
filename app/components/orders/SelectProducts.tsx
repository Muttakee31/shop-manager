import React, { SetStateAction, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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
  },
})(TextField);

const useStyles = makeStyles({
  texts: {
    color: 'whitesmoke',
  },
  header: {
    textAlign: 'center',
    color: 'white',
  },
  textField: {
    color: 'white',
    borderColor: 'white',
    margin: 10,
  },
  selectField: {
    color: 'white',
    borderColor: 'white',
    width: '20vw',
    margin: 10,
  },
  total: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '20px 4.5vw 40px 15px',
    fontSize: '20px',
  },
});

const sqlite3 = require('sqlite3').verbose();

export default function SelectProducts(props: {
  selectedCustomer: User;
  setOrderState: SetStateAction<any>;
  setOrderDetails: SetStateAction<any>;
}): JSX.Element {
  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedProductID, setSelectedProductID] = useState<Product | string>(
    ''
  );
  const [orderItemList, setOrderItemList] = useState<OrderItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [quantity, setQuantity] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [store, setStore] = useState('0');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedProductID(event.target.value as string);
    const product: Product = productList.filter(
      (item) => item.id === Number(event.target.value)
    )[0];
    setFinalPrice(String(product.price));

    // const product = productList.find()
    // setSelectedProduct(product);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStore((event.target as HTMLInputElement).value);
  };

  const classes = useStyles();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    const db = new sqlite3.Database('shopdb.sqlite3');
    db.all(
      'SELECT * FROM Product',
      (_err: Error, instant: React.SetStateAction<Product[]>) => {
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
    const db = new sqlite3.Database('shopdb.sqlite3');
    const date = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss[Z]');
    let id = -1;
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
        // @ts-ignore
        id = this.lastID;
        const order: any = {
          order_id: id,
          customer: props.selectedCustomer.id,
          customer_name: props.selectedCustomer.name,
          date,
          price: Number(totalPrice),
        };
        props.setOrderDetails(order);
        const stmt = db.prepare(
          `INSERT INTO OrderedItem(order_id, product, quantity, price) VALUES (?, ?, ?, ?) `
        );
        orderItemList.map((instant) => {
          console.log(instant);
          stmt.run(
            id,
            instant.product_id,
            instant.quantity,
            instant.price,
            function (error: Error) {
              if (error) {
                console.log(error.message);
              } else {
                console.log(`order item added.${instant.store}`);
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
                      console.log('updated');
                    }
                  }
                );
              }
            }
          );
        });

        stmt.finalize();
      }
    );
    db.close();
    props.setOrderState(2);
  };

  // console.log(props.selectedCustomer);
  return (
    <>
      <Grid container>
        <Grid item xs={4}>
          <FormControl className={classes.selectField}>
            <InputLabel id="demo-simple-select-label">
              Select a product
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedProductID}
              onChange={handleChange}
            >
              <MenuItem value="">Choose a product</MenuItem>
              {productList.map((instant) => {
                return (
                  <MenuItem value={String(instant.id)}>
                    {instant.title}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
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
      <Grid direction="row">
        <FormControl component="fieldset">
          <FormLabel component="legend">Select storage</FormLabel>
          <RadioGroup
            aria-label="select storage"
            name="store"
            value={store}
            onChange={handleRadioChange}
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
      <Grid>
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
                <div style={{ textAlign: 'center' }}>No item added yet</div>
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

      <Grid>
        <Button variant="contained" color="primary" onClick={createOrder}>
          Confirm order
        </Button>
      </Grid>
    </>
  );
}
