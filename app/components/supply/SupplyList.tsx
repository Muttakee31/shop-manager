import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Sidebar from '../../containers/Sidebar';
import Button from '@material-ui/core/Button';
import routes from '../../constants/routes.json';
import { useHistory } from 'react-router';

const sqlite3 = require('sqlite3').verbose();

interface Supply {
  id: number;
  supplier_name: string;
  total_cost: number;
  timestamp: string;
}

const useStyles = makeStyles({
  texts: {
    color: 'whitesmoke',
  },
  header: {
    textAlign: 'center',
    color: 'white',
  },
});

export default function SupplyList(): JSX.Element {
  const classes = useStyles();
  const [supplyList, setSupplyList] = useState<Supply[]>([]);
  const history = useHistory();
  // console.log('Connected to the shop database.');
  // const [SupplyList, setSupplyList] = useState([]);

  useEffect(() => {
    // add db.all function to get all Supplys
    const db = new sqlite3.Database('shopdb.sqlite3');
    db.all(
      'SELECT * FROM Supply',
      (_err: Error, instant: React.SetStateAction<Supply[]>) => {
        setSupplyList(instant);
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
          <h3>List of Supply</h3>
        </Grid>

        <Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              history.push({
                pathname: routes.ADD_SUPPLY,
                state: { product: null },
              })}
          >
            Add supply
          </Button>
        </Grid>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.texts}>Supplier name</TableCell>
                <TableCell className={classes.texts}>Total cost</TableCell>
                <TableCell className={classes.texts}>Time of supply</TableCell>
                <TableCell className={classes.texts} />
              </TableRow>
            </TableHead>
            <TableBody>
              {supplyList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="left" className={classes.texts}>
                    {row.supplier_name}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.total_cost}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    {row.timestamp}
                  </TableCell>
                  <TableCell align="left" className={classes.texts}>
                    <VisibilityIcon />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
