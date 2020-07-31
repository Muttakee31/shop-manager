import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const sqlite3 = require('sqlite3').verbose();


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

/*
const paymentType: object = {
  'paid': '0',
  'due': '1',
  'both': '2',
};
*/

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

export default function EnterPayment(props: {
  selectedCustomer: any;
  orderDetails: any
}): JSX.Element {
  const [paidByCustomer, setPaidByCustomer] = useState('');
  const [type, setType] = useState(0);
  const [labourCost, setLabourCost] = useState('');
  const [discount, setDiscount] = useState('0');
  const [moneyToReturn, setMoneyToReturn] = useState(0);
  const [dueAmount, setDueAmount] = useState(props.orderDetails.price);
  const [totalCost, setTotalCost] = useState(props.orderDetails.price);

  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(Number(event.target.value));
    // const product = productList.find()
    // setSelectedProduct(product);
  };

  const createTransaction = () => {
    const db = new sqlite3.Database('shopdb.sqlite3');

    // insert one row into the langs table
    db.run(
      `INSERT INTO Transactions(order_id, order_cost, client, client_name, type, due_amount, paid_amount, labour_cost, discount)
       VALUES(?,?,?,?,?,?,?,?,?) `,
      [props.orderDetails.order_id, props.orderDetails.price, props.selectedCustomer.id,
        props.selectedCustomer.name, Number(type),
        dueAmount, paidByCustomer, labourCost, discount],
      function (err: Error) {
        if (err) {
          console.log(err.message);
        }
        else {
          if (dueAmount > 0) {
            db.run(`UPDATE User set due_amount = due_amount + ?, has_due_bill = 1`,
              [dueAmount],
              function(error: Error) {
                if (error) {
                  console.log(error.message);
                }
                else {
                  console.log('updated');
                }
              })
          }
        }

        // console.log(`A row has been inserted`);
      }
    );

    // close the database connection
    db.close();
    //props.setOrderState(3);
  }

  useEffect(() => {
    const money = Number(paidByCustomer) - Number(labourCost) - props.orderDetails.price + Number(discount)
    if (money > 0) {
      setMoneyToReturn(money);
      setDueAmount(0);
    }
    else {
      setDueAmount(money * -1);
      setMoneyToReturn(0);
    }
  }, [paidByCustomer, discount, labourCost])

  return (
    <Grid container direction="column" justify="center"
    >
      <Grid className={classes.header}>
        <h3>Add payment details</h3>
      </Grid>

      <Grid container justify='center' direction='row'>
        <Grid item style={{padding: '20px', background: '#277ea7', borderRadius: '9px'}}>
          <div style={{marginBottom: '10px'}}>Money to return: </div>
          <div> {moneyToReturn}</div>
        </Grid>
        <Grid item xs={1} />
        <Grid item style={{padding: '20px', background: '#277ea7', borderRadius: '9px'}}>
          <div style={{marginBottom: '10px'}}>Due amount: &nbsp; &nbsp;</div>
          <div> {dueAmount}</div>
        </Grid>
      </Grid>

      <form autoComplete="off" style={{ width: '320px', margin: 'auto' }}>
        <Grid>
          <FormControl className={classes.selectField}>
            <InputLabel id="demo-simple-select-label">
             Payment type
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              onChange={handleChange}
            >
              <MenuItem value='0'>Paid</MenuItem>
              <MenuItem value='1'>Due</MenuItem>
              <MenuItem value='2'>Both</MenuItem>

            </Select>
          </FormControl>
        </Grid>

        <Grid>
          <CssTextField
            id="standard-basic"
            label="Cost"
            value={totalCost}
            className={classes.textField}
            disabled
            fullWidth
            onChange={(e) => setTotalCost(e.target.value)}
          />
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
            id="standard-basic"
            label="Discount"
            value={discount}
            className={classes.textField}
            fullWidth
            onChange={(e) => setDiscount(e.target.value)}
          />
        </Grid>

        <Grid>
          <CssTextField
            id="standard-required"
            label="Paid by customer"
            value={paidByCustomer}
            className={classes.textField}
            fullWidth
            onChange={(e) => setPaidByCustomer(e.target.value)}
          />
        </Grid>


        <Grid style={{ marginTop: '30px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              createTransaction();
            }}
          >
            Submit
          </Button>
        </Grid>
      </form>
    </Grid>
  );
}
