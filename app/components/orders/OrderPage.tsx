import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Sidebar from '../../containers/Sidebar';
import SelectCustomer from './SelectCustomer';
import SelectProducts from './SelectProducts';
import EnterPayment from './EnterPayment';
import StepperComponent from './StepperComponent';

export default function OrderPage(): JSX.Element {
  const [orderState, setOrderState] = useState(0);
  // setOrderState(1);
  useEffect(() => {
    setOrderState(0);
  }, [orderState]);
  return (
    <Grid container>
      <Grid item xs={4}>
        <Sidebar />
      </Grid>
      <Grid item xs={8}>
        <StepperComponent orderState={orderState} />
        {orderState === 0 && <SelectCustomer setOrderState={setOrderState} />}
        {orderState === 1 && <SelectProducts />}
        {orderState === 2 && <EnterPayment />}
      </Grid>
    </Grid>
  );
}
