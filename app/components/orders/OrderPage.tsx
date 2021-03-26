import React, { useState } from 'react';
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
    <>
      <div>
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

      </div>
    </>
  );
}
