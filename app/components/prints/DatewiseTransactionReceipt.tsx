import React, { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import PrintTransactions from './PrintTransactions';
import Button from '@material-ui/core/Button';
import { transactionType } from '../../constants/config';

const DatewiseTransactionReceipt = ({type, transactionList}) => {
  const [totalDue, setTotalDue] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const [totalOrderCost, setTotalOrderCost] = useState(0);
  const [totalSupplyCost, setTotalSupplyCost] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalLabourCost, setTotalLabourCost] = useState(0);

  const componentRef = useRef();

  useEffect(() => {
    let due = 0;
    let cost = 0;
    let bill = 0;
    let discount = 0;
    let labour = 0;
    transactionList.map((instant, index) => {
      due += instant.due_amount ? Number(instant.due_amount) : 0;
      cost += instant.order_cost ? Number(instant.order_cost) : 0;
      bill += instant.paid_amount ? Number(instant.paid_amount) : 0;
      discount += instant.discount ? Number(instant.discount) : 0;
      labour += instant.labour_cost ? Number(instant.labour_cost) : 0;
    })
    setTotalDue(due);
    setTotalBill(bill);
    setTotalOrderCost(cost);
    setTotalDiscount(discount);
    setTotalLabourCost(labour);
  }, [transactionList])
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
      />
      <div style={{display: 'none'}}>
        <PrintTransactions
          type={type}
          transactionList={transactionList}
          ref={componentRef}
          totalDue={totalDue}
          totalBill={totalBill}
          totalOrderCost={totalOrderCost}
          totalDiscount={totalDiscount}
          totalLabourCost={totalLabourCost}/>
      </div>
    </>
  );
};

export default DatewiseTransactionReceipt;
