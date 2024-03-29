import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import * as dbpath from '../../constants/config';
import dayjs from 'dayjs';
import CssTextField from '../snippets/CssTextField';
import NumberFormat from 'react-number-format';

interface StockHistory {
  id: number;
  product: number;
  product_title: string;
  prev_shop_stock: number;
  current_shop_stock: number;
  prev_godown_stock: number;
  current_godown_stock: number;
  date_created: string;
  date_updated: string;
}

const useStyles = makeStyles({
  texts: {
    color: 'whitesmoke',
  },
  header: {
    textAlign: 'center',
    color: 'white',
    textDecoration: 'underline',
    textUnderlinePosition: 'under'
  },
  textField: {
    color: 'white',
    borderColor: 'white',
    margin: 10,
  },
});


function compare(a:StockHistory, b:StockHistory) {
  if (dayjs(a.date_updated).isBefore(b.date_updated)) return 1;
  if (dayjs(a.date_updated).isAfter(b.date_updated)) return -1;
  return 0;
}

export default function StockHistoryList(): JSX.Element {
  const classes = useStyles();
  const [stockHistoryList, setStockHistoryList] = useState<StockHistory[]>([]);
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));

  // console.log('Connected to the shop database.');
  useEffect(() => {
    getStockHistoryByDate();
  }, [selectedDate]);

  const changeDate = (e:React.ChangeEvent) => {
    // @ts-ignore
    const value: string = e.target.value;
    setSelectedDate(value);
  }

  const getStockHistoryByDate = () => {
    try {
      const sqlite3 = require('sqlite3').verbose();
      const db = new sqlite3.Database(dbpath.dbPath);

      const dateFilter = dayjs(selectedDate).format('YYYY-MM-DDTHH:mm:ss[Z]');

      db.all(
        'SELECT * FROM StockHistory WHERE date_created = ?',
        [dateFilter],
        (err: Error, instant: StockHistory[]) => {
          if (err) {
            console.log(err);
          } else {
            setStockHistoryList(instant.sort(compare));
          }
        }
      );
      db.close();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <div>
        <Grid className={classes.header}>
          <h3>Stock History</h3>
        </Grid>

        <Grid>
          <CssTextField
            id='date'
            label='Date'
            type='date'
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            value={selectedDate}
            onChange={changeDate}
          />
        </Grid>

        <Grid>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.texts}>Title</TableCell>
                  <TableCell className={classes.texts}>Shop Stock</TableCell>
                  <TableCell className={classes.texts}>Godown Stock</TableCell>
                  <TableCell className={classes.texts}>Last updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockHistoryList.length === 0 ?
                  <TableRow>
                    <TableCell colSpan={4} align="center" className={classes.texts}>
                      No entries yet.
                    </TableCell>
                  </TableRow>
                  :
                  stockHistoryList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="left" className={classes.texts}>
                      {row.product_title}
                    </TableCell>

                    <TableCell align="left" className={classes.texts}>
                      <NumberFormat value={row.prev_shop_stock} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={3}/> /
                      <NumberFormat value={row.current_shop_stock} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={3}/>
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      <NumberFormat value={row.prev_godown_stock} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={3}/> /
                      <NumberFormat value={row.current_godown_stock} displayType={'text'}
                                    thousandSeparator={true} thousandsGroupStyle="lakh"
                                    decimalScale={3}/>
                    </TableCell>
                    <TableCell align='left' className={classes.texts}>
                      {dayjs(row.date_updated.split('Z')[0]).format('MMMM DD, YYYY [a]t hh:mm A')}
                    </TableCell>

                  </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </div>
    </>
  );
}
