const { remote } = require('electron');
const path = require('path');

const app = remote.app;

export const dbPath =
  (app)?
    (process.env.NODE_ENV === 'development') ?
      'shopdb.sqlite3' : path.resolve(app.getPath('userData'), 'shopdb.sqlite3') : '';

export const transactionType = {
  "order": 1,
  "supply": 2,
  "due": 3,
  "other": 4,
}

export const SECRET_KEY = "Baneshwar1405";
