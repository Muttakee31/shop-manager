import React, { useState } from 'react';
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

interface User {
  id: number | null;
  name: string;
  phone: string;
  address: string;
  is_customer: number;
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

const paymentType: object = {
  paid: 0,
  due: 1,
  both: 2,
};

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
  selectedCustomer: User | null;
}): JSX.Element {
  const [paidByCustomer, setPaidByCustomer] = useState('');
  const [type, setType] = useState(0);
  const [labourCost, setLabourCost] = useState('');
  const [discount, setDiscount] = useState('');

  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(Number(event.target.value));
    // const product = productList.find()
    // setSelectedProduct(product);
  };

  return (
    <Grid container direction="column" justify="center"
    >
      <Grid className={classes.header}>
        <h3>Add a product</h3>
      </Grid>

      <form autoComplete="off" style={{ width: '320px', margin: 'auto' }}>
        <Grid>
          <FormControl className={classes.selectField}>
            <InputLabel id="demo-simple-select-label">
              Select a product
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              onChange={handleChange}
            >
              <MenuItem value="">Choose a product</MenuItem>
              {Object.entries(paymentType).forEach(([key, value]) => {
                // @ts-ignore
                return <MenuItem value={value}>{key}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid>
          <CssTextField
            id="standard-required"
            label="Name"
            value={paidByCustomer}
            className={classes.textField}
            fullWidth
            onChange={(e) => setPaidByCustomer(e.target.value)}
          />
        </Grid>

        <Grid>
          <CssTextField
            id="standard-basic"
            label="Price"
            value={labourCost}
            fullWidth
            className={classes.textField}
            onChange={(e) => setLabourCost(e.target.value)}
          />
        </Grid>

        <Grid>
          <CssTextField
            id="standard-basic"
            label="Unit"
            value={discount}
            className={classes.textField}
            fullWidth
            onChange={(e) => setDiscount(e.target.value)}
          />
        </Grid>

        <Grid style={{ marginTop: '30px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              // createProduct();
            }}
          >
            Submit
          </Button>
        </Grid>
      </form>
    </Grid>
  );
}
