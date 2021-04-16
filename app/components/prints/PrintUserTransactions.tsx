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

const sqlite3 = require('sqlite3').verbose();

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

class PrintUserTransactions extends Component {
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

  render() {
    const {user, transactionList} = this.props;
    return (
      <div className='pagebreak' style={{ padding: '5% 10%', color: '#0a0a0a', fontSize: '0.8rem'
      }}>
        <Grid style={{margin: 16}}>
          <Typography align='center' variant='h5'>
            User Transactions
          </Typography>
          <Typography>
            Name: {user.name}
          </Typography>
          <Typography>
            Address: {user.address}
          </Typography>
          <Typography>
            Phone: {user.phone}
          </Typography>
          <Typography>
            Printed on: {dayjs(new Date()).format('DD/MM/YYYY [a]t hh:mm A')}
          </Typography>
        </Grid>
        <TableContainer>
          <Table aria-label="simple table" size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Paid amount</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Labour cost</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>
                  Balance/Due amount
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
                    <TableCell align="left">
                      {Number(row.transaction_type) === transactionType['other'] ?
                        row.description === null ? 'N/A' : row.description :
                        row.client_name === null ? 'N/A' : row.client_name
                      }
                    </TableCell>
                    <TableCell align="left">
                      {this.getType(row.transaction_type)}
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat value={row.paid_amount} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={2}/>
                    </TableCell>
                    <TableCell align="left">
                      <NumberFormat value={row.order_cost} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={2}/>
                    </TableCell>
                    <TableCell align="left" >
                      {row.labour_cost !== null ? "N/A" : row.labour_cost}
                    </TableCell>
                    <TableCell align="left">
                      {row.discount === null ? 'N/A' : row.discount}
                    </TableCell>
                    <TableCell align="left">
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

export default PrintUserTransactions;
