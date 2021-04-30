import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { transactionType } from '../../constants/config';
import dayjs from 'dayjs';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import NumberFormat from 'react-number-format';
import TableContainer from '@material-ui/core/TableContainer';

interface Transaction {
  id: number;
  client: number;
  order_id: number;
  paid_amount: number;
  client_name: string;
  order_cost: number;
  labour_cost: number;
  discount: number | null;
  payment_type: number;
  transaction_type: number;
  due_amount: number | null;
  supply_id: number;
  timestamp: string;
  description: string;
}

class PrintTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getType = (type:number) => {
    const text = Object.keys(transactionType).filter(item => {
      // @ts-ignore
      return transactionType[item] == type;
    })[0];
    return text;
  }

  showFinalDetails = () => {
    if (Number(this.props.type) === transactionType['order']) {
      return (
        <>
          <div>
            Paid by customer: {this.props.totalBill}
          </div>
          <div>
            Total sales: {this.props.totalOrderCost}
          </div>
          <div>
            Total due: {this.props.totalDue}
          </div>
          <div>
            Total discount: {this.props.totalDiscount}
          </div>
          <div>
            Total labour cost: {this.props.totalLabourCost}
          </div>
        </>
      )
    }
    else if (Number(this.props.type) === transactionType['supply']) {
      return (
        <>
          <div>
            paid to supplier: {this.props.totalBill}
          </div>
          <div>
            Total goods bought: {this.props.totalOrderCost}
          </div>
          <div>
            Total Balance: {this.props.totalDue}
          </div>
          <div>
            Total labour cost: {this.props.totalLabourCost}
          </div>
        </>
      )
    }
    else if (Number(this.props.type) === transactionType['due']) {
      return (
        <>
          <div>
            Total due paid: {this.props.totalBill}
          </div>
        </>
      )
    }
    else if (Number(this.props.type) === transactionType['bill']) {
      return (
        <>
          <div>
            Total bill: {this.props.totalBill}
          </div>
        </>
      )
    }
    else {
      return (
        <>
          <div>
            Total Other bills: {this.props.totalBill}
          </div>
        </>
      )
    }
  }

  render() {
    const {type, transactionList} = this.props;
    return (
      <div className='pagebreak' style={{ padding: '5% 10%', color: '#0a0a0a', fontSize: '12px'
      }}>
        <Grid style={{margin: 16}}>
          <Typography align='center' variant='h5'>
            Sarker & Sons' <br />
            Transaction Report
          </Typography>
          <div>
            Printed on: {dayjs(new Date()).format('DD MMMM, YYYY [a]t hh:mm A')}
          </div>
          <div>
            Transaction Type: {this.getType(type)}
          </div>
          {this.showFinalDetails()}
          {/* <Typography>
            Date Range:
          </Typography>*/}
        </Grid>
        <TableContainer style={{overflow: 'hidden'}}>
          <Table aria-label="simple table" size='small'>
            <TableHead>
              <TableRow>
                <TableCell>
                  {Number(type) === transactionType['other'] ? "Reason" : "Client name"}</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Paid amount</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Labour cost</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>
                  {Number(type) === transactionType['supply'] ? "Balance" : "Due amount"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionList.length === 0 ?
                <TableRow>
                  <TableCell colSpan={6} align="left" style={{ textAlign: 'center' }}>
                    No items
                  </TableCell>
                </TableRow>
                :
                transactionList.map((row:Transaction) => (
                  <TableRow key={row.id}>
                    <TableCell align="left" style={{fontSize: '12px', borderBottom: 'none'}} >
                      {Number(type) === transactionType['other'] ?
                        row.description === null ? 'N/A' : row.description :
                        row.client_name === null ? 'N/A' : row.client_name
                      }
                    </TableCell>
                    <TableCell align="left" style={{fontSize: '12px', borderBottom: 'none'}}>
                      {this.getType(row.transaction_type)}
                    </TableCell>
                    <TableCell align='left'>
                      {dayjs(row.timestamp).format('DD MMMM, YYYY [a]t hh:mm A')}
                    </TableCell>
                    <TableCell align="left" style={{fontSize: '12px', borderBottom: 'none'}}>
                      <NumberFormat value={row.paid_amount} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={2}/>
                    </TableCell>
                    <TableCell align="left" style={{fontSize: '12px', borderBottom: 'none'}}>
                      <NumberFormat value={row.order_cost} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={2}/>
                    </TableCell>
                    <TableCell align="left" style={{fontSize: '12px', borderBottom: 'none'}}>
                      {row.labour_cost === null ? "N/A" : row.labour_cost}
                    </TableCell>
                    <TableCell align="left" style={{fontSize: '12px', borderBottom: 'none'}}>
                      {row.discount === null ? 'N/A' : row.discount}
                    </TableCell>
                    <TableCell align="left" style={{fontSize: '12px', borderBottom: 'none'}}>
                      {row.due_amount === null ?
                        'N/A' :
                        <NumberFormat value={row.due_amount} displayType={'text'}
                                      thousandSeparator={true} thousandsGroupStyle="lakh"
                                      decimalScale={2}/>}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }
}

export default PrintTransactions;
