import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import Button from '@material-ui/core/Button';
import dayjs from 'dayjs';
import PrintUserTransactions from './PrintUserTransactions';

const UserReceipt = ({user, transactionList}) => {
  const componentRef = useRef();

  return (
    <>
      <ReactToPrint
        trigger={() =>
          <Button variant="contained" color="primary">
            Print all transactions
          </Button>
        }
        content={() => componentRef.current}
        documentTitle={`${user.name}-${dayjs(new Date()).format('DD MMMM YYYY')}`}
      />
      <div style={{display: 'none'}}>
        <PrintUserTransactions
          user={user}
          transactionList={transactionList}
          ref={componentRef} />
      </div>
    </>
  );
};

export default UserReceipt;
