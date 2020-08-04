import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useRouteMatch } from 'react-router';
import dayjs from 'dayjs';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Sidebar from '../../containers/Sidebar';

const sqlite3 = require('sqlite3').verbose();

interface User {
  id: number;
  name: string;
  phone: string;
  address: string;
  due_amount: number;
}

interface Order {
  id: number;
  customer_name: string;
  supplier_name: string;
  timestamp: string;
  total_cost: number;
}

const useStyles1 = makeStyles({
  texts: {
    color: 'whitesmoke',
  },
  details: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  header: {
    textAlign: 'center',
    color: 'white',
  },
});

const emptyUser: User = {
  id: 0,
  name: '',
  phone: '',
  address: '',
  due_amount: 0,
};

export default function UserDetails(): JSX.Element {
  const classes = useStyles1();
  const [user, setUser] = useState<User>(emptyUser);
  const [orderList, setOrderList] = useState<Order[]>([]);
  const history = useHistory();
  const match = useRouteMatch();
  // @ts-ignore
  const type: number = match.params.type;
  // @ts-ignore
  const id: number = match.params.id;
  // console.log('Connected to the shop database.');
  useEffect(() => {
    // const { id } = useParams();
    console.log(id);
    const db = new sqlite3.Database('shopdb.sqlite3');
    db.get(
      'SELECT * FROM User where id=?',
      [id],
      (err: Error, instant: React.SetStateAction<User>) => {
        if (err) {
          console.log(err);
        } else {
          setUser(instant);
          console.log(instant);
        }
      }
    );
    if (type === 0) {
      db.all(
        'SELECT * FROM Orders where customer=?',
        [id],
        (err: Error, instant: React.SetStateAction<Order[]>) => {
          if (err) {
            console.log(err);
          } else {
            setOrderList(instant);
            console.log(instant);
          }
        }
      );
    } else {
      db.all(
        'SELECT * FROM Supply where supplier=?',
        [id],
        (err: Error, instant: React.SetStateAction<Order[]>) => {
          if (err) {
            console.log(err);
          } else {
            setOrderList(instant);
            console.log(instant);
          }
        }
      );
    }
    db.close();
  }, []);

  const seeDetails = (id: number) => {
    type === 0 ? history.push(`/order/${id}`) : history.push(`/supply/${id}`);
  };

  return (
    <Grid container>
      <Grid item xs={4} lg={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} lg={9}>
        <Grid className={classes.header}>
          <h3>User Details</h3>
        </Grid>

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Name:
{' '}
          </Grid>
          <Grid item xs={6}>
            {user.name}
          </Grid>
        </Grid>

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Phone:
{' '}
          </Grid>
          <Grid item xs={6}>
            {user.phone}
          </Grid>
        </Grid>

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Address:
{' '}
          </Grid>
          <Grid item xs={6}>
            {user.address}
          </Grid>
        </Grid>

        <Grid className={classes.details}>
          <Grid item xs={6}>
            Due amount:
{' '}
          </Grid>
          <Grid item xs={6}>
            {user.due_amount}
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
                  <TableCell className={classes.texts}>name</TableCell>
                  <TableCell className={classes.texts}>Total cost</TableCell>
                  <TableCell className={classes.texts}>Time of event</TableCell>
                  <TableCell className={classes.texts} />
                </TableRow>
              </TableHead>
              <TableBody>
                {orderList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="left" className={classes.texts}>
                      {type === 1 ? row.supplier_name : row.customer_name}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {row.total_cost}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      {dayjs(row.timestamp).format(
                        'MMMM DD, YYYY [a]t hh:mm a'
                      )}
                    </TableCell>
                    <TableCell align="left" className={classes.texts}>
                      <VisibilityIcon onClick={() => seeDetails(row.id)} />
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
