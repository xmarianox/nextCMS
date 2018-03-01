const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const routes = require('./routes/router');
const mongoose = require('mongoose');
let expressSession = require('express-session');
let MongoStore = require('connect-mongo')(expressSession);


const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_DEV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


app.prepare()
.then(() => {
  const server = express();

  // database 
  mongoose.connect('mongodb://localhost/nextcms');
  const db = mongoose.connection;

  // handle mongo error
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log(`we're connected!`);
    // we're connected!
  });

  // middleware
  // parse incoming request
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());

  // use sessions for tracking logins
  server.use(expressSession({
    secret: '123456',
    resave: false,
    saveUninitialized: false,
    maxAge: Date.now() + (30 * 86400 * 1000),
    cookie: {maxAge: 1000*60*60*24*30}, //30 days
    store: new MongoStore({
      mongooseConnection: db
    })
  }));

  // use routes
  server.use(routes);

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  // listener
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`>> Ready on http://localhost:${port}`);
  });

});

module.exports = app;