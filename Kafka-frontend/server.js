const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const path = require('path');
const bodyParser = require('body-parser');

// Log requests to console
var morgan = require('morgan');

//passport auth require
var config = require('./config/settings');
//var passport = require('passport');

console.log("Initializing passport");
//app.use(passport.initialize());

// Bring in defined Passport Strategy
//require('./config/passport').passport;

var config = require('./config/settings');
var mongoose = require('mongoose');
var connStr = config.database_type + '://' + config.database_username + ':' + config.database_password + '@' + config.database_host + ':' + config.database_port + '/' + config.database_name;
//var connStr = config.connection_string;
console.log(connStr);
mongoose.connect(connStr, { useNewUrlParser: true, poolSize: 10, }, function(err) {
  if (err) throw err;
  else {
      console.log('Successfully connected to MongoDB');
  }
});

const loginSignupRoutes = require('./src/routes/loginSignupRoutes');
const ownerMenuRoutes = require('./src/routes/ownerMenuRoutes');
const restaurantSearchRoutes = require('./src/routes/restaurantSearchRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const chatRoutes = require('./src/routes/chatRoutes');

app.use('/uploads', express.static(path.join(__dirname, '/uploads/')));

app.use(session({
    secret: 'cmpe273_canvas_node_react_mysql',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://'+config.client+':3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });


// Log requests to console
app.use(morgan('dev'));

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://'+config.client+':3000', credentials: true }));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', loginSignupRoutes);
//app.use('/', ownerMenuRoutes);
app.use("/", ownerMenuRoutes);
app.use("/", restaurantSearchRoutes);
app.use("/", orderRoutes);
app.use("/", chatRoutes);
// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

