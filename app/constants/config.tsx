const { remote } = require('electron');
const path = require('path');

const app = remote.app;

export const dbPath =
  (app)?
    (process.env.NODE_ENV === 'development') ?
      'shopdb.sqlite3' : path.resolve(app.getPath('userData'), 'shopdb.sqlite3') : '';
