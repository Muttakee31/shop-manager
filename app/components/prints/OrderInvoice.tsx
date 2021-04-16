import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import Button from '@material-ui/core/Button';
import dayjs from 'dayjs';
import PrintOrder from './PrintOrder';

const OrderInvoice = ({orderInfo, transactionInfo, itemList}) => {
  const componentRef = useRef();

  return (
    <>
      <ReactToPrint
        trigger={() =>
          <Button variant="contained" color="primary">
            Print invoice
          </Button>
        }
        content={() => componentRef.current}
        documentTitle={`Order invoice-${dayjs(new Date()).format('DD MMMM YYYY')}`}
      />
      <div style={{display: 'none'}}>
        <PrintOrder
          orderInfo={orderInfo}
          itemList={itemList}
          transactionInfo={transactionInfo}
          ref={componentRef} />
      </div>
    </>
  );
};

export default OrderInvoice;
