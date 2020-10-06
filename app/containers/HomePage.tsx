import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import * as dbpath from '../constants/config';
import { transactionType } from '../constants/config';
import Alert from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthenticated, logOutUser, setAuthToken } from '../features/auth/authSlice';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityIconOff from '@material-ui/icons/VisibilityOff';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';


const sqlite3 = require('sqlite3').verbose();
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

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
    '& .MuiFormLabel-root.Mui-disabled': {
      color: '#c1bbae',
    }
  },
})(TextField);

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
      height: '40px'
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
    grid: {
      marginTop: 40,
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
      width: 290,
      boxShadow: '5px 5px 15px #010101'
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
      justifyContent: 'space-evenly',
      margin: 17,
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
  const [open, setOpen] = useState(false);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  const [shopSeries, setShopSeries] = useState<SeriesData[]>([]);
  const [godownSeries, setGodownSeries] = useState<SeriesData[]>([]);

  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));

  const [alert, setAlert] = useState<string | null>(null);
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

  const dispatch = useDispatch();
  const authFlag= useSelector(isAuthenticated);

  useEffect(()=> {
    getTransactionCount(selectedDate);
    getStockRecordToday();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setAlert(null);
    setOpen(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(prevState => !prevState);
  }

  const signIn = () => {
    const db = new sqlite3.Database(dbpath.dbPath);
    setAlert(null);
    try{
      db.all(`SELECT * FROM USER WHERE name = ? AND is_admin = ?`, [username, 1],
        function(err: Error, instant:any) {
          if (err) {
            console.log(err);
          }
          else {
            const hashedPass : string =  CryptoJS.SHA256(password).toString();
            if (instant.length !== 0 && instant[0].password == hashedPass) {
              const token = jwt.sign({ username }, dbpath.SECRET_KEY, { expiresIn: '24h' });
              //console.log(token);
              dispatch(setAuthToken({token, username}));
              handleClose();
            }
            else {
              console.log('did not match');
              setAlert("Username or password did not match!");
            }
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }

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
              name: '',
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
              name: '',
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
              instant.map(item => {
                if (item.transaction_type === transactionType["order"]) {
                  orderSum += Number(item.order_cost);
                  orderCount++;
                }
                if (item.transaction_type === transactionType["supply"] ||
                  item.transaction_type === transactionType["other"]) saleSum += Number(item.order_cost);
              });
              setTotalSale(orderSum);
              setTotalExpense(saleSum);
              setOrderCount(orderCount);
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
            instant.map(item => {
              if (item.due_amount !== null && item.due_amount > 0) dues += Number(item.due_amount);
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
    <Grid className={classes.grid}>

      <Grid className={classes.header}>
        <h3>Welcome to Shop Manager</h3>
      </Grid>

      <Grid item xs={8} lg={9} className={classes.topbin}>
        {!authFlag ?
          <Button color='primary' variant='contained'
                  onClick={handleOpen} className={classes.btn}>
            View as Admin
          </Button>
          :
          <Button color='primary' variant='contained'
                  className={classes.btn} onClick={()=> dispatch(logOutUser())}>
            Log out
          </Button>
        }

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


      <Grid className={classes.cardContainer}>
        <Card className={classes.card} variant="outlined" style={{background: '#018af8'}}>
          <CardContent className={classes.content}>
            <span className={classes.title}>Total orders</span>
             <span className={classes.amount}>{orderCount}</span>
          </CardContent>
        </Card>
        <Card className={classes.card} variant="outlined" style={{background: '#2fa758'}}>
          <CardContent className={classes.content}>
            <span className={classes.title}>Total sales</span>
            <span className={classes.amount}>{totalSale}</span>
          </CardContent>
        </Card>
      </Grid>

      <Grid className={classes.cardContainer}>
        <Card className={classes.card} variant="outlined" style={{background: '#1abfaa'}}>
          <CardContent className={classes.content}>
            <span className={classes.title}>Total expense</span>
            <span className={classes.amount}>{totalExpense}</span>
          </CardContent>
        </Card>
        <Card className={classes.card} variant="outlined" style={{background: '#dc0835'}}>
          <CardContent className={classes.content}>
            <span className={classes.title}>Payments due</span>
            <span className={classes.amount}>{totalDue}</span>
          </CardContent>
        </Card>
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
        <ReactApexChart options={options}
                        series={shopSeries}
                        type="bar" height={300} width={375} />

        <ReactApexChart options={options}
                        series={godownSeries}
                        type="bar" height={300} width={375} />
      </Grid>




      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Grid className={classes.header}>
              <h3>Sign in</h3>
            </Grid>
            <Grid>
              <CssTextField
                id="standard-required"
                label="Username"
                value={username}
                className={classes.textField}
                fullWidth
                onChange={(e) => setUserName(e.target.value)}
              />
            </Grid>

            <Grid>
              <CssTextField
                id="standard-basic"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                fullWidth
                className={classes.textField}
                onChange={(e) => setPassword(e.target.value)}
                InputProps = {{ endAdornment :
                  <InputAdornment position="end">
                    <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    >
                      {!showPassword ?
                        <VisibilityIcon className={classes.texts}/> :
                        <VisibilityIconOff className={classes.texts}/>}
                    </IconButton>
                  </InputAdornment>
                }}
              />
            </Grid>
            {alert !== null &&
            <Alert severity="error" className={classes.gridMargin}>
              {alert}
            </Alert>
            }
            <Grid>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.gridMargin}
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Sign in
              </Button>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </Grid>
  );
}
