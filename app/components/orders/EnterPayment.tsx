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
import * as dbpath from '../../constants/config';

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
    textDecoration: 'underline',
    textUnderlinePosition: 'under'
  },
  textField: {
    color: 'white',
    borderColor: 'white',
    margin: 10,
  },

});

export default function EnterPayment(props: {
  selectedCustomer: any;
  orderDetails: any;
}): JSX.Element {


  const classes = useStyles();



  useEffect(() => {

  }, [paidByCustomer, discount, labourCost]);

  return (
    <Grid container direction="column" justify="center"
    >
      <Grid className={classes.header}>
        <h3>Add payment details</h3>
      </Grid>
    </Grid>
  );
}
