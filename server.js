'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var cors        = require('cors');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

const helmet    = require('helmet');
const mongoose  = require('mongoose');
const dotenv    = require('dotenv');

dotenv.config();

var app = express();

app.use(helmet({
  hidePoweredBy: {
    setTo: 'PHP 4.2.0'
  },
  noCache: true
}));

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Connect to the database
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let db = mongoose.connection;

db.on('error', () => {
  console.log('Database error: ' + err);
});

//Index page (static HTML)
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

db.once('open', (err) => {
  if(err){
    console.log('Could not connect to the database');
  }
  else {
    console.log('Connected to database.');

    //For FCC testing purposes
    fccTestingRoutes(app);
  
    //Routing for API 
    apiRoutes(app); 
  
    //404 Not Found Middleware
    app.use(function(req, res, next) {
      res.status(404)
        .type('text')
        .send('Not Found');
    });
  }
});


//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + (process.env.PORT || 3000));
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = {
  app,
  db
}; //for unit/functional testing
