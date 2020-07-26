import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Sidebar from '../../containers/Sidebar';

//declare transaction interface here

export default function TransactionList() {
  const [transactionList, setTransactionList] = useState([]);

  useEffect(()=> {
    // add db.all function to get all transactions
  }, [])


  return (
    <Grid container>
      <Grid item xs={4} md={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9} md={8}>
        add the table for transaction here
      </Grid>
    </Grid>
  );
}

