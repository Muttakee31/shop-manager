import React from 'react';
import Grid from '@material-ui/core/Grid';
import Customers from '../components/users/Customers';
import Sidebar from './Sidebar';

export default function OverviewPage() {
  return (
    <Grid container>
      <Grid item xs={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9}>
        <Customers />
      </Grid>
    </Grid>
  );
}
