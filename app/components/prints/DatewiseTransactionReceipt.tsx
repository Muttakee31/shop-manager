import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import PrintTransactions from './PrintTransactions';
import Button from '@material-ui/core/Button';
import dayjs from 'dayjs';
import { transactionType } from '../../constants/config';

const DatewiseTransactionReceipt = ({type, transactionList}) => {
  const componentRef = useRef();
  const getType = (type:number) => {
    const text = Object.keys(transactionType).filter(item => {
      // @ts-ignore
      return transactionType[item] == type;
    })[0];
    return text;
  }
  return (
    <>
      <ReactToPrint
        trigger={() =>
          <Button variant="contained" color="primary">
            Print
          </Button>
        }
        content={() => componentRef.current}
        documentTitle={`${getType(type)}-${dayjs(new Date()).format('DD MMMM YYYY')}`}
      />
      <div style={{display: 'none'}}>
        <PrintTransactions
          type={type}
          transactionList={transactionList}
          ref={componentRef} />
      </div>
    </>
  );
};

export default DatewiseTransactionReceipt;
