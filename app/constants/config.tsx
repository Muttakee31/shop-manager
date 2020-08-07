const {app} = require('electron');
const path = require('path');

export const dbPath =
  (process.env.NODE_ENV === 'development') ?
  'shopdb.sqlite3' : path.resolve(app.getPath('userData'), 'shopdb.sqlite3');
