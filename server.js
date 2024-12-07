const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const cors = require('cors');
const corsOptions = {
  origin: 'http://127.0.0.1:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  allowedHeaders: 'Content-Type,Authorization'
};

require('dotenv').config();
const process = require('process');
const port = process.env.PORT || 5000;
const mdApp = express();

process.once('warning', (warning) => {
  console.warn('Warning Stack Trace =>' + warning.stack)
})

require('./server/config/mdDatabase');

mdApp
  .use(cors(corsOptions))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname,'dist','mean-ddbjr')))
  .use(cookieParser("TheBigSecret369"))
  .use(session({
    saveUninitialized: true,
    secret: "369TheSecondBigSecret",
    resave: false,
    name: "session",
    rolling: true,
    cookie: {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
      maxAge:3600000
    }
  }))
  .use(require('./server/routes'))
  .listen(port);
