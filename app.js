var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var mongoose = require('mongoose');

var User = require('./models/User');
// var expressHbs = require('express-handlebars');



var basic = require('./routes/index');
var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');



var app = express();

mongoose.connect('mongodb://localhost/wpl');
var db = mongoose.connection;
// console.log(db);
db.on('error' , function(msg){
    console.log("DB connection failed");
});

db.once('open', function(){
   console.log("DB connection Succeed "); 
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.engine('handlebars', expressHbs({extname:'handlebars', defaultLayout:'index.handlebars'}));
// app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'secret', resave: true, saveUninitialized: true, cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(function(req, res, next) {
  res.locals.message = req.flash();
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use('/index', routes);
app.use('/sumit', routes);
app.use('/posts', posts);
app.use('/sumit/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
