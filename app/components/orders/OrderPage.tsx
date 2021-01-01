import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Sidebar from '../../containers/Sidebar';
import SelectCustomer from './SelectCustomer';
import SelectProducts from './SelectProducts';
import StepperComponent from './StepperComponent';

export default function OrderPage(): JSX.Element {
  const [orderState, setOrderState] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  // setOrderState(1);
  /*  useEffect(() => {
    // setOrderState(0);
  }, [orderState]); */
  return (
    <Grid container>
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>
        <StepperComponent orderState={orderState} />
        {orderState === 0 && (
          <SelectCustomer
            setOrderState={setOrderState}
            setSelectedUser={setSelectedUser}
          />
        )}
        {orderState === 1 && (
          <SelectProducts
            setOrderState={setOrderState}
            selectedCustomer={selectedUser}
          />
        )}

      </Grid>
    </Grid>
  );
}
