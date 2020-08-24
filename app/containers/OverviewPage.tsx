import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Sidebar from './Sidebar';
import * as dbpath from '../constants/config';
import dayjs from 'dayjs';
import HomePage from './HomePage';

const sqlite3 = require('sqlite3').verbose();
const CryptoJS = require("crypto-js");

interface Product {
  id: number;
  code: string;
  title: string;
  price: number;
  shop_stock_count: number;
  godown_stock_count: number;
  unit: string | null;
  out_of_stock: number | null;
}

export default function OverviewPage() {
  useEffect(() => {
    console.log(CryptoJS.SHA256("eucsu-204").toString());
    try {
      const db = new sqlite3.Database(dbpath.dbPath);
      // const dbPath = (process.env.NODE_ENV === 'development') ? 'shopdb.sqlite3' : path.resolve(app.getPath('userData'), 'shopdb.sqlite3');
      // const db = new sqlite3.Database(dbpath.dbPath);
      db.all(
        'SELECT name FROM sqlite_master WHERE type=? AND name= ?',
        ['table', 'User'],
        (err: Error, instant: any) => {
          if (err) {
            console.log(err);
          }
          else {
            if (instant.length === 0) {
              db.run("CREATE TABLE \"User\" ( `id` INTEGER PRIMARY KEY AUTOINCREMENT," +
                " `name` TEXT, `address` TEXT," +
                " `phone` TEXT, `is_customer` INTEGER DEFAULT 0," +
                " `is_supplier` INTEGER DEFAULT 0," +
                " `has_due_bill` INTEGER DEFAULT 0, `due_amount` REAL )", (err: Error) => {
                if (err) {
                  console.log(err);
                }
                else {
                  console.log("User added.")}
                  db.all(
                    'SELECT name FROM sqlite_master WHERE type=? AND name= ?', ["table", 'Product'],
                    (err: Error, instant: any) => {
                      if (err) {
                        console.log(err);
                      }
                      else {
                        if (instant.length === 0) {
                          db.run("CREATE TABLE \"Product\" ( `id` INTEGER PRIMARY KEY AUTOINCREMENT," +
                            " `title` TEXT NOT NULL, `price` REAL," +
                            " `shop_stock_count` INTEGER DEFAULT 0, `unit` TEXT," +
                            " `godown_stock_count` INTEGER DEFAULT 0," +
                            " `code` TEXT UNIQUE )", (err: Error) => {
                            if (err) {
                              console.log(err);
                            }
                            else {
                              console.log("Product added.")
                              db.all(
                                'SELECT name FROM sqlite_master WHERE type=? AND name= ?', ["table", 'Orders'],
                                (err: Error, instant: any) => {
                                  if (err) {
                                    console.log(err);
                                  }
                                  else {
                                    if (instant.length === 0) {
                                      db.run("CREATE TABLE \"Orders\" ( `id` INTEGER PRIMARY KEY AUTOINCREMENT," +
                                        " `customer` INTEGER, `timestamp` TEXT, `customer_name` TEXT," +
                                        " `total_cost` REAL, FOREIGN KEY(`customer`) REFERENCES `User`(`id`) " +
                                        "ON DELETE SET NULL ON UPDATE NO ACTION )", (err: Error) => {
                                        if (err) {
                                          console.log(err);
                                        }
                                        else {
                                          console.log("Orders added.")}
                                          db.all(
                                            'SELECT name FROM sqlite_master WHERE type=? AND name= ?', ["table", 'Supply'],
                                            (err: Error, instant: any) => {
                                              if (err) {
                                                console.log(err);
                                              }
                                              else {
                                                if (instant.length === 0) {
                                                  db.run("CREATE TABLE \"Supply\" ( `id` INTEGER PRIMARY KEY AUTOINCREMENT," +
                                                    " `supplier` INTEGER, `timestamp` TEXT," +
                                                    " `supplier_name` TEXT, `total_cost` REAL )", (err: Error) => {
                                                    if (err) {
                                                      console.log(err);
                                                    }
                                                    else {
                                                      console.log("Supplier added.");
                                                      db.run("CREATE TABLE \"OrderedItem\" ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, " +
                                                        "`product` INTEGER, `order_id` INTEGER," +
                                                        " `price` REAL, `quantity` INTEGER," +
                                                        " FOREIGN KEY(`product`) REFERENCES `Product`(`id`)" +
                                                        " ON DELETE CASCADE ON UPDATE NO ACTION," +
                                                        " FOREIGN KEY(`order_id`) REFERENCES `Orders`(`id`)" +
                                                        " ON DELETE CASCADE ON UPDATE NO ACTION )", (err: Error) => {
                                                        if (err) {
                                                          console.log(err);
                                                        }
                                                        else {
                                                          console.log("Ordered_item added.");
                                                        }
                                                      });

                                                      db.run("CREATE TABLE `SupplyItem` ( `supply_id` INTEGER," +
                                                        " `id` INTEGER PRIMARY KEY AUTOINCREMENT, `product` INTEGER," +
                                                        " `quantity` INTEGER, `price` REAL," +
                                                        " FOREIGN KEY(`product`) REFERENCES `Product`(`id`)" +
                                                        " ON DELETE SET NULL ON UPDATE NO ACTION," +
                                                        " FOREIGN KEY(`supply_id`) REFERENCES `SupplyItem`(`id`)" +
                                                        " ON DELETE CASCADE ON UPDATE NO ACTION )", (err: Error) => {
                                                        if (err) {
                                                          console.log(err);
                                                        }
                                                        else {
                                                          console.log("Supply item added.");
                                                        }
                                                      });

                                                      db.run("CREATE TABLE \"Transactions\"" +
                                                        " ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, `client` INTEGER," +
                                                        " `order_id` INTEGER, `paid_amount` REAL, `client_name` TEXT," +
                                                        " `supply_cost` REAL, `order_cost` REAL, `labour_cost` REAL," +
                                                        " `discount` REAL, `type` TEXT, " +
                                                        "`due_amount` REAL," +
                                                        " `supply_id` INTEGER, FOREIGN KEY(`order_id`)" +
                                                        " REFERENCES `Orders`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION," +
                                                        " FOREIGN KEY(`client`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION," +
                                                        " FOREIGN KEY(`supply_id`) REFERENCES `Supply`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION )", (err: Error) => {
                                                        if (err) {
                                                          console.log(err);
                                                        }
                                                        else {
                                                          console.log("transaction added.");
                                                        }
                                                      });

                                                    }
                                                  })
                                                }
                                              }
                                            }
                                          );
                                        })
                                    }
                                  }
                                }
                              );
                            }

                          })
                        }
                      }
                    }
                  );

              })
            }
          }
        }
      );
      db.close();
    } catch (e) {
      console.log(e);
    }
    insertDailyStockUpdate();
  }, []);

  const insertDailyStockUpdate = () => {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database(dbpath.dbPath);
    const temp = new Date();
    temp.setHours(0,0,0,0);
    const midnight = dayjs(temp).format('YYYY-MM-DDThh:mm:ss[Z]');
    try {
      db.all(
        'SELECT * FROM StockHistory ORDER BY id DESC LIMIT 1',
        (err: Error, instant:any) => {
          if (err) {
            console.log(err);
          } else {
            console.log(instant);
            console.log(midnight);
            console.log(dayjs(midnight).isBefore(instant.date_created));
            const date = dayjs(new Date()).format('YYYY-MM-DDThh:mm:ss[Z]');

            if (instant.length === 0 ||
              dayjs(midnight).isBefore(instant.date_created)) {
              try {
                db.all(
                  'SELECT * FROM Product',
                  (err: Error, products : Product[]) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(products);
                      const stmt = db.prepare(
                        `INSERT INTO StockHistory(product, product_title, date_created, date_updated,
                      prev_shop_stock, current_shop_stock, prev_godown_stock, current_godown_stock)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?) `
                      );
                      products.map(product => {
                        stmt.run(
                          product.id,
                          product.title,
                          midnight,
                          date,
                          product.shop_stock_count,
                          product.shop_stock_count,
                          product.godown_stock_count,
                          product.godown_stock_count,
                          function (error_1: Error) {
                            if (error_1) {
                              console.log(error_1.message);
                            } else {
                              console.log(`stock history added`);
                            }
                          }
                        );
                      })
                      stmt.finalize();
                    }
                  }
                );
              }
              catch (e) {
                console.log('sldfsldkf');
              }
            }
          }
        }
      );
      db.close();
    }
    catch (e) {
      console.log(e);
    }

  };

  return (
    <Grid container>
      <Grid item xs={4} md={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={8} md={9}>
        <HomePage />
      </Grid>
    </Grid>
  );
}
