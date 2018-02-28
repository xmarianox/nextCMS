const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const routes = require('./routes/router');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


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

  // use sessions for tracking logins
  server.use(session({
    secret: 'nextAdminSecretKey',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  }));

  // middleware
  // parse incoming request
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());

  // use routes
  server.use('/', routes);


  server.get('*', (req, res) => {
    return handle(req, res);
  });

  // listener
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`>> Ready on http://localhost:${port}`);
  });

});
