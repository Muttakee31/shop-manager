import React, { useState } from 'react';
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
    <>
      <div>
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
      </div>
    </>
  );
}
