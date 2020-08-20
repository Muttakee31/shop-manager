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
import { useHistory } from 'react-router';
import { transactionType } from '../../constants/config';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

interface Product {
  id: number;
  title: string;
  code: string;
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
  is_supplier: number;
}

interface SupplyItem {
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
  selectedSupplier: User;
  setSupplyState: SetStateAction<any>;
  setSupplyDetails: SetStateAction<any>;
}): JSX.Element {
  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedProductID, setSelectedProductID] = useState<Product | string>(
    ''
  );
  const [supplyItemList, setSupplyItemList] = useState<SupplyItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [quantity, setQuantity] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [store, setStore] = useState('0');

  const [paidToSupplier, setPaidToSupplier] = useState('');
  const [type, setType] = useState(0);
  const [labourCost, setLabourCost] = useState('');
  //const [moneyToReturn, setMoneyToReturn] = useState(0);
  const history = useHistory();

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

    const supply: SupplyItem = {
      product_id: product.id,
      title: product.title,
      quantity: Number(quantity),
      price: Number(finalPrice),
      store,
    };

    setSupplyItemList((prevState) => [...prevState, supply]);
    setTotalPrice(totalPrice + Number(finalPrice) * Number(quantity));
    setQuantity('');
    setFinalPrice('');
  };

  const deleteProduct = (row: SupplyItem) => {
    setTotalPrice(totalPrice - row.price * row.quantity);
    setSupplyItemList(
      supplyItemList.filter((item) => item.product_id !== row.product_id)
    );
  };

  const createSupply = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    const date = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss[Z]');
    let id = -1;
    // console.log(JSON.stringify(props.selectedSupplier));
    db.run(
      `INSERT INTO Supply(supplier, supplier_name, timestamp, total_cost) VALUES(?,?,?,?)  `,
      [
        props.selectedSupplier.id,
        props.selectedSupplier.name,
        date,
        Number(totalPrice),
      ],
      function (err: Error) {
        if (err) {
          console.log(err.message);
        } else {
          // @ts-ignore
          id = this.lastID;
          createTransaction(id);

          const stmt = db.prepare(
            `INSERT INTO SupplyItem(supply_id, product, product_title, quantity, price, storage) VALUES (?, ?, ?, ?, ?, ?) `
          );
          supplyItemList.map((instant) => {
            console.log(instant);
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
                  console.log(`supply item added.${instant.store}`);
                  const dest =
                    instant.store === '0'
                      ? 'shop_stock_count'
                      : 'godown_stock_count';
                  db.run(
                    `UPDATE Product set ${dest}=${dest}  + ? where id=?`,
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
      }
    );
    db.close(() => { history.push(`/supply/${id}`) });
  };

  const createTransaction = (supply_id:number) => {
    const db = new sqlite3.Database(dbpath.dbPath);
    let due = totalPrice + Number(labourCost) - Number(paidToSupplier) <= 0 ?
      0 : totalPrice + Number(labourCost) - Number(paidToSupplier);
    // insert one row into the langs table
    db.run(
      `INSERT INTO Transactions(supply_id, supply_cost, client, client_name, transaction_type,
       payment_type, due_amount, paid_amount, labour_cost, discount)
       VALUES(?,?,?,?,?,?,?,?,?,?) `,
      [
        supply_id,
        totalPrice + Number(labourCost),
        props.selectedSupplier.id,
        props.selectedSupplier.name,
        transactionType['supply'],
        Number(type),
        due,
        paidToSupplier,
        labourCost,
        0,
      ],
      function (err: Error) {
        if (err) {
          console.log(err.message);
        } else if (due> 0 ||
          props.selectedSupplier.is_supplier !== 1) {
          db.run(
            `UPDATE User set due_amount = due_amount - ?, has_due_bill = ?, is_customer = ? WHERE id = ?`,
            [due, due>0?1:0, 1, props.selectedSupplier.id],
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

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(Number(event.target.value));
    // const product = productList.find()
    // setSelectedProduct(product);
  };


  // console.log(props.selectedSupplier);
  // @ts-ignore
  // @ts-ignore
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
              {supplyItemList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="left" className={classes.texts} style={{ textAlign: 'center' }}>
                    No items
                  </TableCell>
                </TableRow>
              ) : (
                supplyItemList.map((row) => (
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

      {supplyItemList.length > 0 && (
        <Grid className={classes.total}>
          <div>Total</div>
          <div>{totalPrice}</div>
        </Grid>
      )}

      <form autoComplete="off" style={{ width: '320px', margin: 'auto' }}>
        <Grid>
          <FormControl className={classes.selectField}>
            <InputLabel id="demo-simple-select-label">Payment type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
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
            fullWidth
            className={classes.textField}
            onChange={(e) => setLabourCost(e.target.value)}
          />
        </Grid>

        <Grid>
          <CssTextField
            id="standard-required"
            label="Paid to supplier"
            value={paidToSupplier}
            className={classes.textField}
            fullWidth
            onChange={(e) => setPaidToSupplier(e.target.value)}
          />
        </Grid>

      </form>

      <Grid>
        <Button variant="contained" color="primary" onClick={createSupply}>
          Confirm
        </Button>
      </Grid>
    </>
  );
}
