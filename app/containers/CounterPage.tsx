import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Counter from '../features/counter/Counter';
import Sidebar from './Sidebar';

export default function CounterPage() {
  return(
  <Grid container>
    <Grid item xs={3}>
      <Paper>
        <Sidebar />
      </Paper>
    </Grid>
    <Grid item xs={9}>
      <Paper>
        <Counter />
      </Paper>
    </Grid>
  </Grid>
  );
}
