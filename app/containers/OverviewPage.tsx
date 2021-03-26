import React, { useEffect } from 'react';
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
                " `name` TEXT, `address` TEXT, `phone` TEXT, `is_customer` INTEGER DEFAULT 0," +
                " `is_supplier` INTEGER DEFAULT 0, `has_due_bill` INTEGER DEFAULT 0," +
                " `due_amount` REAL, `password` TEXT, `is_admin` INTEGER DEFAULT 0 )",
                (err: Error) => {
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
                            " `title` TEXT NOT NULL, `price` REAL, `shop_stock_count` INTEGER DEFAULT 0," +
                            " `unit` TEXT, `godown_stock_count` INTEGER DEFAULT 0," +
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
                                                      db.run("CREATE TABLE \"OrderedItem\" ( `id` INTEGER PRIMARY KEY AUTOINCREMENT," +
                                                        " `product` INTEGER, `order_id` INTEGER, `price` REAL," +
                                                        " `quantity` INTEGER, `product_title` TEXT," +
                                                        " `storage` TEXT DEFAULT \"0\", FOREIGN KEY(`order_id`) " +
                                                        "REFERENCES `Orders`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION, FOREIGN KEY(`product`)" +
                                                        " REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION )", (err: Error) => {
                                                        if (err) {
                                                          console.log(err);
                                                        }
                                                        else {
                                                          console.log("Ordered_item added.");
                                                        }
                                                      });

                                                      db.run("CREATE TABLE \"SupplyItem\" ( `id` INTEGER PRIMARY KEY AUTOINCREMENT," +
                                                        " `supply_id` INTEGER, `product` INTEGER, `price` NUMERIC," +
                                                        " `quantity` INTEGER, `product_title` TEXT," +
                                                        " `storage` TEXT DEFAULT \"0\", FOREIGN KEY(`product`)" +
                                                        " REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION," +
                                                        " FOREIGN KEY(`supply_id`) REFERENCES `SupplyItem`(`id`)" +
                                                        " ON DELETE CASCADE ON UPDATE NO ACTION )", (err: Error) => {
                                                        if (err) {
                                                          console.log(err);
                                                        }
                                                        else {
                                                          console.log("Supply item added.");
                                                        }
                                                      });

                                                      db.run("CREATE TABLE \"Transactions\" ( `id` INTEGER PRIMARY KEY AUTOINCREMENT," +
                                                        " `transaction_type` INTEGER, `client` INTEGER, `order_id` INTEGER," +
                                                        " `supply_id` INTEGER, `paid_amount` REAL," +
                                                        " `client_name` TEXT, `supply_cost` REAL," +
                                                        " `order_cost` REAL, `labour_cost` REAL," +
                                                        " `discount` REAL, `payment_type` TEXT," +
                                                        " `due_amount` REAL, `description` TEXT DEFAULT null," +
                                                        " `timestamp` TEXT, FOREIGN KEY(`supply_id`) REFERENCES" +
                                                        " `Supply`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION, FOREIGN KEY(`client`)" +
                                                        " REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION," +
                                                        " FOREIGN KEY(`order_id`) REFERENCES `Orders`(`id`)" +
                                                        " ON DELETE SET NULL ON UPDATE NO ACTION )", (err: Error) => {
                                                        if (err) {
                                                          console.log(err);
                                                        }
                                                        else {
                                                          console.log("transaction added.");
                                                        }
                                                      });

                                                      db.run("CREATE TABLE \"StockHistory\" ( `id` INTEGER, `product` INTEGER," +
                                                        " `product_title` TEXT, `date_created` TEXT," +
                                                        " `date_updated` TEXT, `prev_shop_stock` INTEGER," +
                                                        " `current_shop_stock` INTEGER, `prev_godown_stock` INTEGER," +
                                                        " `current_godown_stock` INTEGER, PRIMARY KEY(`id`)," +
                                                        " FOREIGN KEY(`product`) REFERENCES `Product`(`id`)" +
                                                        " ON DELETE SET NULL ON UPDATE NO ACTION )", (err: Error) => {
                                                        if (err) {
                                                          console.log(err);
                                                        }
                                                        else {
                                                          console.log("stock history added.");
                                                        }
                                                      });
                                                      db.run(
                                                        `INSERT INTO User(name, phone, address, password, is_admin) VALUES(?,?,?,?,?) `,
                                                        ["Shop Admin", null, null, CryptoJS.SHA256('EUCSU-204').toString() , 1],
                                                        function (err: Error) {
                                                          if (err) {
                                                            console.log(err.message);
                                                          }
                                                          else {
                                                            console.log('super user added.');
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
    const midnight = dayjs(temp).format('YYYY-MM-DDTHH:mm:ss[Z]');
    try {
      db.all(
        'SELECT * FROM StockHistory ORDER BY id DESC LIMIT 1',
        (err: Error, instant:any) => {
          if (err) {
            console.log(err);
          } else {
            // console.log(instant[0].date_created);
            // console.log(midnight);

            const date = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss[Z]');
            //console.log(dayjs(midnight).isBefore(instant.date_created));
            //console.log(dayjs(midnight).isSameOrBefore(instant.date_created));
            //console.log(dayjs(midnight).isBefore(instant[0].date_created));
            if (instant.length === 0 ||
              dayjs(instant[0].date_created).isBefore(midnight)) {
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
                console.log(e);
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
    <>
      <HomePage />
    </>
  );
}
