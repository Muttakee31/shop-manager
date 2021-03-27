import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as dbpath from '../constants/config';
import { transactionType } from '../constants/config';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import CssTextField from '../components/snippets/CssTextField';
import NumberFormat from 'react-number-format';

const sqlite3 = require('sqlite3').verbose();

interface Transaction {
  id: number;
  client: number;
  order_id: number;
  paid_amount: number;
  client_name: string;
  supply_cost: number;
  order_cost: number;
  labour_cost: number;
  discount: number | null;
  payment_type: number;
  transaction_type: number;
  due_amount: number | null;
  supply_id: number;
  timestamp: string;
}

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

interface SeriesData {
  name: string;
  data: number[];
}

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      border: '2px solid #000',
      background: '#232c39',
      boxShadow: '3px 3px 20px #010101',
      padding: 15,
      margin: 15,
      width: 400,
      height: 330,
    },
    texts: {
      color: 'whitesmoke',
    },
    btn: {
      height: '40px',
      marginLeft: 10
    },
    header: {
      textAlign: 'center',
      color: 'white',
      textDecoration: 'underline',
      textUnderlinePosition: 'under',
    },
    topbin: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    textField: {
      color: 'white',
      borderColor: 'white',
      margin: '0 0 16px 0',
    },
    input: {
      color: 'white',
    },
    gridMargin: {
      margin: '10px 0'
    },
    card: {
      boxShadow: '5px 5px 15px #010101',
      marginRight: '16px'
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
    },
    cardContainer: {
      display: 'flex',
      flexDirection: 'row',
      color: 'white',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 9
    },
    graphHeader: {
      textAlign: 'center',
      fontSize: 14,
      textDecoration: 'underline',
      textUnderlinePosition: 'under',
    },
    title: {
      fontSize: 14
    },
    amount: {
      fontSize: '20px',
      margin: '8px 0'
    }
  }),
);


export default function HomePage() {
  const classes = useStyles();
  const [orderCount, setOrderCount] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalInput, setTotalInput] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [totalLabourCost, setTotalLabourCost] = useState(0);

  const [shopSeries, setShopSeries] = useState<SeriesData[]>([]);
  const [godownSeries, setGodownSeries] = useState<SeriesData[]>([]);

  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
  const [options, setOption] = useState({
    chart: {
      type: 'bar',
      height: 300,
      stacked: true,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: true
      }
    },
    title: {
      text: "",
      align: 'center',
      margin: 0,
      style: {
        color: 'whitesmoke'
      }
    },
    tooltip: {
      theme: 'dark'
    },
    yaxis: {
      labels: {
        trim: true,
        style: {
          colors: 'whitesmoke',
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      type: 'string',
      categories: [],
    },
    legend: {
      position: 'top',
      offsetY: 10,
      labels: {
        useSeriesColors: true
      },
      dataLabels: {
        style: {
        color: '#000'
        }
      }
    },
    fill: {
      colors: ['rgb(0,143,251)', 'rgb(255,69,96)', 'rgb(0, 227, 150)'],
      opacity: 1
    },
    colors: ['rgb(0,143,251)', 'rgb(255,69,96)', 'rgb(0, 227, 150)'],
  });

  useEffect(()=> {
    getTransactionCount(selectedDate);
    getStockRecordToday();
  }, []);

  const getStockRecordToday = () => {
    try {
      const db = new sqlite3.Database(dbpath.dbPath);
      db.all(
        'SELECT * FROM StockHistory ORDER BY id DESC LIMIT 9',
        (_err: Error, instant: StockHistory[]) => {
          if (_err) {
            console.log(_err);
          } else {
            //console.log(instant);
            let productNames: string[] = [];
            let lBar: number[] = [], lBar2: number[] = [];
            let mBar:number[] = [], mBar2: number[] = [];
            let tBar:number[] = [], tBar2: number[] = [];
            instant.map(item => {
              productNames.push(item.product_title);
              if (item.current_shop_stock < item.prev_shop_stock) {
                lBar.push(item.current_shop_stock);
                mBar.push(item.prev_shop_stock - item.current_shop_stock);
                tBar.push(0);
              }
              else {
                lBar.push(item.prev_shop_stock);
                mBar.push(0);
                tBar.push(item.current_shop_stock - item.prev_shop_stock);
              }

              if (item.current_godown_stock < item.prev_godown_stock) {
                lBar2.push(item.current_godown_stock);
                mBar2.push(item.prev_godown_stock - item.current_godown_stock);
                tBar2.push(0);
              }
              else {
                lBar2.push(item.current_godown_stock);
                mBar2.push(0);
                tBar2.push(item.current_godown_stock - item.prev_godown_stock);
              }
            });
            // setlowBar(lBar);
            // setMidBar(mBar);
            // setTopBar(tBar);
            setShopSeries([{
              name: 'yesterday stock',
              data: lBar
            }, {
              name: 'Net sold',
              data: mBar
            }, {
              name: 'Net added',
              data: tBar
            }
            ]);
            setGodownSeries([{
              name: 'yesterday stock',
              data: lBar2
            }, {
              name: 'Net sold',
              data: mBar2
            }, {
              name: 'Net added',
              data: tBar2
            }
            ]);

            // @ts-ignore
            setOption( prevState => {
              return ({
                ...prevState,
                xaxis: {
                  type: 'string',
                  categories: productNames,
                  labels: {
                    trim: true,
                    style: {
                      colors: 'whitesmoke'
                    }
                  }
                }
              });
            })
          }
        }
      );

      db.close();
    }
    catch (e) {
      console.log(e);
    }
  };

  const getTransactionCount = (date:string) => {
    try {
      const db = new sqlite3.Database(dbpath.dbPath);
      db.all(
        'SELECT * FROM Transactions WHERE timestamp LIKE ?',
        [date + "%"],
        (_err: Error, instant: Transaction[]) => {
          if (_err) {
            console.log(_err)
          } else {
            if (instant !== undefined) {
              let orderSum: number = 0;
              let saleSum: number = 0;
              let orderCount: number = 0;
              let totalInputSum: number = 0;
              let laborCost: number = 0;
              instant.map(item => {
                if (item.transaction_type === transactionType["order"]) {
                  orderSum += Number(item.order_cost);
                  totalInputSum += Number(item.paid_amount);
                  orderCount++;
                }
                if (item.transaction_type === transactionType["supply"] ||
                  item.transaction_type === transactionType["other"] ||
                  item.transaction_type === transactionType["bill"]) {
                  saleSum += Number(item.paid_amount);
                }
                if (item.transaction_type === transactionType["due"]) {
                  totalInputSum += Number(item.paid_amount)
                }
                laborCost += Number(item.labour_cost);
              });

              setTotalSale(orderSum);
              setTotalExpense(saleSum);
              setOrderCount(orderCount);
              setTotalInput(totalInputSum);
              setTotalLabourCost(laborCost);
            }
          }
        }
      );

      db.all(
        'SELECT * FROM User',
        (_err: Error, instant: any[]) => {
          if (_err) {
            console.log(_err)
          } else {
            let dues = 0;
            instant.map(user => {
              if (user.due_amount !== null) {
                if (user.due_amount > 0) dues += Number(user.due_amount);
              }
            });
            setTotalDue(dues);
          }
        }
      );
      db.close();
    }
    catch (e) {
      console.log(e);
    }
  };

  const changeDate = async (e:React.ChangeEvent) => {
    // @ts-ignore
    const value: string = e.target.value;
    await setSelectedDate(value);
    await getTransactionCount(value);
  }


  return (
    <Grid>

      <Grid className={classes.header}>
        <h3>Overview</h3>
      </Grid>

      <Grid item xs={8} lg={9} className={classes.topbin}>
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


      <Grid container className={classes.cardContainer}>
        <Grid item xs={4}>
          <Card className={classes.card} variant="outlined" style={{background: '#018af8'}}>
            <CardContent className={classes.content}>
              <span className={classes.title}>Total orders</span>
              <span className={classes.amount}>{orderCount}</span>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card className={classes.card} variant="outlined" style={{background: '#2fa758'}}>
            <CardContent className={classes.content}>
              <span className={classes.title}>Total sales</span>
              <span className={classes.amount}>
              <NumberFormat value={totalSale} displayType={'text'}
                            thousandSeparator={true} thousandsGroupStyle="lakh"/>
            </span>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card className={classes.card} variant="outlined" style={{background: '#1abfaa'}}>
            <CardContent className={classes.content}>
              <span className={classes.title}>Total expense</span>
              <span className={classes.amount}>
              <NumberFormat value={totalExpense} displayType={'text'}
                            thousandSeparator={true} thousandsGroupStyle="lakh"/>
            </span>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container className={classes.cardContainer}>
        <Grid item xs={4}>
          <Card className={classes.card} variant="outlined" style={{background: '#254498'}}>
            <CardContent className={classes.content}>
              <span className={classes.title}>Total Input</span>
              <span className={classes.amount}>
              <NumberFormat value={totalInput} displayType={'text'}
                            thousandSeparator={true} thousandsGroupStyle="lakh"/>
            </span>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card className={classes.card} variant="outlined" style={{background: '#dc0835'}}>
            <CardContent className={classes.content}>
              <span className={classes.title}>Payments due</span>
              <span className={classes.amount}>
                <NumberFormat value={totalDue} displayType={'text'}
                              thousandSeparator={true} thousandsGroupStyle="lakh"/>
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.card} variant="outlined" style={{background: '#99154e'}}>
            <CardContent className={classes.content}>
              <span className={classes.title}>Total Labour Cost</span>
              <span className={classes.amount}>
                <NumberFormat value={totalLabourCost} displayType={'text'}
                              thousandSeparator={true} thousandsGroupStyle="lakh"/>
              </span>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6} className={classes.graphHeader}>
          <h3>Shop</h3>
        </Grid>
        <Grid item xs={6} className={classes.graphHeader}>
          <h3>Godown</h3>
        </Grid>
      </Grid>


      <Grid id='chart' className={classes.cardContainer}>
        {shopSeries &&
        <ReactApexChart options={options}
                        series={shopSeries}
                        type='bar' height={300} width={375} />

        }
        {godownSeries &&
        <ReactApexChart options={options}
                        series={godownSeries}
                        type='bar' height={300} width={375} />
        }
      </Grid>
    </Grid>
  );
}
