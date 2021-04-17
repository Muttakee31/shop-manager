import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import dayjs from 'dayjs';
import NumberFormat from 'react-number-format';
import Typography from '@material-ui/core/Typography';

interface SupplyItem {
  product_id: number;
  product_title: string;
  title: string;
  quantity: number;
  price: number;
  storage: string;
}

class PrintSupply extends Component {
  constructor(props) {
    super(props);
  }
  // console.log('Connected to the shop database.');

  render() {
    const {supplyInfo, itemList, transactionInfo} = this.props;
    return (
      <>
        <div style={{padding: '5%', color: '#0a0a0a', fontSize: '12px'}}>
          <Typography align='center' variant='h5'>
            Sarker & Sons'<br/>
            Supply Details
          </Typography>
          <div>
            Supplier Name: {supplyInfo.supplier_name}
          </div>

          <div>
            Date of supply: {dayjs(supplyInfo.timestamp.split('Z')[0]).format('DD MMMM, YYYY [a]t hh:mm A')}
          </div>

          <div>
            <h4 style={{textAlign: 'center'}}>List of items</h4>
          </div>

          <Grid>
            <TableContainer style={{overflow: 'hidden'}}>
              <Table aria-label="simple table" size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell style={{fontSize: '12px'}}>Title</TableCell>
                    <TableCell style={{fontSize: '12px'}}>Rate</TableCell>
                    <TableCell style={{fontSize: '12px'}}>Qty</TableCell>
                    <TableCell style={{fontSize: '12px'}}>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="left"
                                 style={{textAlign: 'center', fontSize: '12px', borderBottom: 'none'}}>
                        No items
                      </TableCell>
                    </TableRow>
                  ) : (
                    itemList.map((row:SupplyItem) => (
                      <TableRow key={row.product_id}>
                        <TableCell style={{fontSize: '12px', borderBottom: 'none'}} align="left">
                          {row.product_title}
                        </TableCell>
                        <TableCell style={{fontSize: '12px', borderBottom: 'none'}} align="left">
                          <NumberFormat value={row.price} displayType={'text'}
                                        thousandSeparator={true} thousandsGroupStyle="lakh"
                                        decimalScale={2}/>
                        </TableCell>
                        <TableCell style={{fontSize: '12px', borderBottom: 'none'}}  align="left">
                          {row.quantity}
                        </TableCell>
                        <TableCell style={{fontSize: '12px', borderBottom: 'none'}}  align="left" >
                          <NumberFormat value={row.quantity * row.price} displayType={'text'}
                                        thousandSeparator={true} thousandsGroupStyle="lakh"
                                        decimalScale={2}/>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid style={{textAlign: 'center'}}>
            <h4>Transaction info</h4>
          </Grid>

          <div>
            Paid to supplier:  <NumberFormat value={transactionInfo.paid_amount} displayType={'text'}
                                             thousandSeparator={true} thousandsGroupStyle="lakh"
                                             decimalScale={2}/>
          </div>

          <div>
            Labour cost:
            <NumberFormat value={transactionInfo.labour_cost} displayType={'text'}
                          thousandSeparator={true} thousandsGroupStyle="lakh"
                          decimalScale={2}/>
          </div>

          <div>
            Total cost: <NumberFormat value={supplyInfo.total_cost} displayType={'text'}
                                      thousandSeparator={true} thousandsGroupStyle="lakh"/>
          </div>

          <div>
            Balance:
            <NumberFormat value={transactionInfo.due_amount} displayType={'text'}
                          thousandSeparator={true} thousandsGroupStyle="lakh"
                          decimalScale={2}/>
          </div>
        </div>
      </>
    );
  }
}
export default PrintSupply;
