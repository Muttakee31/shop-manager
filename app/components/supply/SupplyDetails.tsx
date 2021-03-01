import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteMatch } from 'react-router';
import dayjs from 'dayjs';
import Sidebar from '../../containers/Sidebar';
import * as dbpath from '../../constants/config';
import BackButton from '../snippets/BackButton';
import NumberFormat from 'react-number-format';

const sqlite3 = require('sqlite3').verbose();

interface SupplyItem {
  product_id: number;
  product_title: string;
  quantity: number;
  price: number;
  store: string;
}

interface Supply {
  id: number;
  supplier_name: string;
  timestamp: string;
  total_cost: number;
}

interface Transaction {
  id: number;
  type: string;
  discount: number;
  paid_amount: number;
  labour_cost: number;
  due_amount: number;
}

const useStyles1 = makeStyles({
  texts: {
  },
  details: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  header: {
    textAlign: 'center',
    textDecoration: 'underline',
    textUnderlinePosition: 'under'
  },
});

const emptySupply: Supply = {
  id: 0,
  supplier_name: '',
  timestamp: '',
  total_cost: 0,
};

const emptyTransaction: Transaction = {
  id: 0,
  type: '0',
  discount: 0,
  paid_amount: 0,
  labour_cost: 0,
  due_amount: 0,
};

export default function SupplyDetails(): JSX.Element {
  const classes = useStyles1();
  const [supply, setSupply] = useState<Supply>(emptySupply);
  const [transactionInfo, setTransactionInfo] = useState<Transaction>(
    emptyTransaction
  );
  const [itemList, setItemList] = useState<SupplyItem[]>([]);
  // const history = useHistory();
  const match = useRouteMatch();
  // console.log('Connected to the shop database.');
  useEffect(() => {
    // const { id } = useParams();

    // @ts-ignore
    const { id } = match.params;
    console.log(id);
    const db = new sqlite3.Database(dbpath.dbPath);
    db.get(
      'SELECT * FROM Supply where id=?',
      [id],
      (err: Error, instant: Supply) => {
        if (err) {
          console.log(err);
        } else {
          setSupply(instant);
          console.log(instant);
        }
      }
    );
    db.all(
      'SELECT * FROM SupplyItem where supply_id=?',
      [id],
      (err: Error, instant: SupplyItem[]) => {
        if (err) {
          console.log(err);
        } else {
          setItemList(instant);
          console.log(instant);
        }
      }
    );
    db.get(
      'SELECT * FROM Transactions where supply_id=?',
      [id],
      (err: Error, instant: Transaction) => {
        if (err) {
          console.log(err);
        } else {
          instant !== undefined && setTransactionInfo(instant);
          console.log(instant);
        }
      }
    );
    db.close();
  }, []);

  return (
    <Grid container>
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>
        <Grid className={classes.header}>
          <h3>Supply Details</h3>
        </Grid>

        <BackButton />

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Supplier Name:
{' '}
          </Grid>
          <Grid item xs={6}>
            {supply.supplier_name}
          </Grid>
        </Grid>

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Date of supply:
{' '}
          </Grid>
          <Grid item xs={6}>
            {dayjs(supply.timestamp.split('Z')[0]).format('MMMM DD, YYYY [a]t hh:mm')}
          </Grid>
        </Grid>

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Total cost:
{' '}
          </Grid>
          <Grid item xs={6}>
            {supply.total_cost}
          </Grid>
        </Grid>

        <Grid className={classes.header}>
          <h3>List of items</h3>
        </Grid>

        <Grid>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.texts}>Title</TableCell>
                  <TableCell className={classes.texts}>Rate</TableCell>
                  <TableCell className={classes.texts}>Quantity</TableCell>
                  <TableCell className={classes.texts}>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="left" className={classes.texts} style={{ textAlign: 'center' }}>
                      No items
                    </TableCell>
                  </TableRow>
                ) : (
                  itemList.map((row) => (
                    <TableRow key={row.product_id}>
                      <TableCell align="left" className={classes.texts}>
                        {row.product_title}
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
                        <NumberFormat value={row.price} displayType={'text'}
                                      thousandSeparator={true} thousandsGroupStyle="lakh"
                                      decimalScale={2}/>
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
                        {row.quantity}
                      </TableCell>
                      <TableCell align="left" className={classes.texts}>
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

        <Grid>
          <Grid className={classes.header}>
            <h3>Transaction info</h3>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              Paid to supplier:
{' '}
            </Grid>
            <Grid item xs={6}>
              {transactionInfo.paid_amount}
            </Grid>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              Balance:
{' '}
            </Grid>
            <Grid item xs={6}>
              {transactionInfo.due_amount}
            </Grid>
          </Grid>

          <Grid className={classes.details}>
            <Grid item xs={6}>
              Labour cost:
{' '}
            </Grid>
            <Grid item xs={6}>
              {transactionInfo.labour_cost}
            </Grid>
          </Grid>

        </Grid>
      </Grid>
    </Grid>
  );
}
