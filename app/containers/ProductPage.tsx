import React from 'react';
import Grid from '@material-ui/core/Grid';
import ProductList from './Products';
import Sidebar from './Sidebar';

export default function ProductPage(): JSX.Element {
  return (
    <Grid container>
      <Grid item xs={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9}>
        <ProductList />
      </Grid>
    </Grid>
  );
}
