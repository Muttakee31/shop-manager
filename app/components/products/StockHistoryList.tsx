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
import Sidebar from '../../containers/Sidebar';
import dayjs from 'dayjs';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';

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

const CssTextField = withStyles({
  root: {
    '& label': {
      color: 'floralwhite',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: 'floralwhite',
    },
    '& label.Mui-focused': {
      color: 'lightblue',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'lightblue',
    },
    '& input': {
      color: 'floralwhite',
    },
    '& .MuiInputBase-root': {
      color: 'floralwhite',
    },
    '& .MuiFormLabel-root': {
      color: 'floralwhite',
    },
    '& .MuiSelect-select.MuiSelect-select': {
      color: 'floralwhite',
    },
  },
})(TextField);


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

      const dateFilter = dayjs(selectedDate).format('YYYY-MM-DDThh:mm:ss[Z]');

      db.all(
        'SELECT * FROM StockHistory WHERE date_created = ?',
        [dateFilter],
        (err: Error, instant: StockHistory[]) => {
          if (err) {
            console.log(err);
          } else {
            setStockHistoryList(instant);
            console.log(instant);
          }
        }
      );
      db.close();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Grid container>
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>
        <Grid className={classes.header}>
          <h3>Stock History</h3>
        </Grid>

        <Grid>
          <CssTextField
            id="date"
            label="Date"
            type="date"
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
                      {row.prev_shop_stock} / {row.current_shop_stock}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.prev_godown_stock} / {row.current_godown_stock}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {dayjs(row.date_updated).format('MMMM DD, YYYY [a]t hh:mm A')}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
}
