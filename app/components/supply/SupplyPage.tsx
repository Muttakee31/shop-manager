import React, { useState } from 'react';
import SelectSupplier from './SelectSupplier';
import SelectProducts from './SelectProducts';
import StepperComponent from './StepperComponent';
import { Prompt } from 'react-router-dom';


export default function SupplyPage(): JSX.Element {
  const [supplyState, setSupplyState] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  // setOrderState(1);
  /*  useEffect(() => {
    // setOrderState(0);
  }, [orderState]); */
  return (
    <>
      <Prompt when={supplyState === 1}
              message="Are you sure? Your purchase will be canceled."
      />
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
