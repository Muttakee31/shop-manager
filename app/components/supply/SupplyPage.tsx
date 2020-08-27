import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Sidebar from '../../containers/Sidebar';
import SelectSupplier from './SelectSupplier';
import SelectProducts from './SelectProducts';
import StepperComponent from './StepperComponent';


export default function SupplyPage(): JSX.Element {
  const [supplyState, setSupplyState] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  // setOrderState(1);
  /*  useEffect(() => {
    // setOrderState(0);
  }, [orderState]); */
  return (
    <Grid container>
      <Grid item xs={4}>
        <Sidebar />
      </Grid>
      <Grid item xs={8}>
        <StepperComponent orderState={supplyState} />
        {supplyState === 0 && (
          <SelectSupplier
            setSupplyState={setSupplyState}
            setSelectedUser={setSelectedUser}
          />
        )}
        {supplyState === 1 && (
          <SelectProducts
            setSupplyState={setSupplyState}
            selectedSupplier={selectedUser}
          />
        )}
      </Grid>
    </Grid>
  );
}
