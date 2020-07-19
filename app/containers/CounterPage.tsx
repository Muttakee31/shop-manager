/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Counter from '../features/counter/Counter';
import Sidebar from './Sidebar';

export default function CounterPage() {
  return (
    <Grid container>
      <Grid item xs={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9}>
        <Counter />
      </Grid>
    </Grid>
  );
}
