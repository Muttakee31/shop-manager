import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Customers from '../components/users/Customers';
import Sidebar from './Sidebar';

export default function CustomerPage() {
  return (
    <Grid container>
      <Grid item xs={3}>
        <Paper>
          <Sidebar />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <Paper>
          <Customers />
        </Paper>
      </Grid>
    </Grid>
  );
}
