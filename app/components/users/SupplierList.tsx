import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Sidebar from '../../containers/Sidebar';

export default function SupplierList() {

  const [supplierList, setSupplierList] = useState([]);

  useEffect(()=> {
    // add db.all function to get all suppliers
  }, [])


  return (
    <Grid container>
      <Grid item xs={4} md={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9} md={8}>
        add the table for supplier here
      </Grid>
    </Grid>
  );
}
