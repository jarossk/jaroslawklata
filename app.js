const express = require('express'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
  //  sysInfo    = require('./utils/sys-info'),
      http          = require('http'),
      env          = process.env;

require('./models/models');

var api = require('./routes/api');
var boo = require('./routes/boo');

var mongoURI = "mongodb://admin:31ziSXgTmvL@127.10.164.2:27017/testsalon";
var mongoURILoc = "mongodb://127.0.0.1:27017/testsalon";

var mongoose = require('mongoose');
// Connect to MongoDB
mongoose.connect(mongoURI);
mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});
//  || "mongodb://127.0.0.1:27019/testsalon"
// var connection_string = process.env.OPENSHIFT_MONGO_DB_HOST + "/" + process.env.OPENSHIFT_APP_NAME;
// default to a 'localhost' configuratino:
// var mongoURI = "127.0.0.1/testsalon" || connection_string;
// if OPENSHIFT env variables are present, use the available conncetion info:
/*
5782744c7628e19da0000103@testsalon-24pl.rhcloud.com
if(process.env.OPENSHIFT_MONGO_DB_PASSWORD) {
  conncetion_string =
  process.env.OPENSHIFT_MONGO_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGO_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGO_DB_HOST + ":" +
  process.env.OPENSHIFT_MONGO_DB_PASSWORD + "/" +
  process.env.OPENSHIFT_APP_NAME;
}

console.log(mongoURI);
var mongoose = require('mongoose');
mongoose.connect('mongodb://'+ process.env.OPENSHIFT_MONGO_DB_HOST + "/" + process.env.OPENSHIFT_APP_NAME);
*/
var app = express();
//var port = process.env.PORT || '3000';
//app.set('port', port);
var server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(session({
  secret: 'mysecsec'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));
//app.use(express.static(__dirname + '/static'));

app.use('/', api);
app.use('/boo', boo);
app.get('/[^\.]+$', function(req, res){
    res.sendfile("index.html", { root: __dirname + '/static' });
});

app.get('/about', function (req, res, next) {
  res.send('About');
});

/*app.get('/:file(*)', function(req, res, next){
  var file = req.params.file
    , path = __dirname + '/static' + file;

  res.download(path);
});
*/
app.get('/', function(req, res) {
  var filePath = "/cv.pdf";
      fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});



app.use(function(err, req, res, next){
  // special-case 404s,
  // remember you could
  // render a 404 template here
  if (404 == err.status) {
    res.statusCode = 404;
    res.send('Cant find that file, sorry!');
  } else {
    next(err);
  }
});


/*app.res.download('/report-12345.pdf', 'report.pdf', function(err){
  if (err) {
    // Handle error, but keep in mind the response may be partially-sent
    // so check res.headersSent
  } else {
    // decrement a download credit, etc.
  }
});
*/


// error handlers - development error handler
// will print stcaktrace
if(app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// production error handler no tracktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500 );
  res.render('error', {
    message: err.message,
    error: {}
  });
});

 server.listen(env.NODE_PORT || 4000, env.NODE_IP || 'localhost', function () { console.log(`Application worker ${process.pid} started...`); });
//  server.listen( 3000, function () { console.log(`Application worker ${process.pid} started...`); });

module.exports = app;

/*
let server = http.createServer(function (req, res) {
  let url = req.url;
  if (url == '/') {
    url += 'index2.html';
  }

  // IMPORTANT: Your application HAS to respond to GET /health with status 200
  //            for OpenShift health monitoring

  if (url == '/health') {
    res.writeHead(200);
    res.end();
  } else if (url == '/info/gen' || url == '/info/poll') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
  } else {
    fs.readFile('./static' + url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
      } else {
        let ext = path.extname(url).slice(1);
        res.setHeader('Content-Type', contentTypes[ext]);
        if (ext === 'html') {
          res.setHeader('Cache-Control', 'no-cache, no-store');
        }
        res.end(data);
      }
    });
  }
});
*/
