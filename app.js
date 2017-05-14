var express = require("express");
var app = express();
var passport = require('passport');
var cookieParser = require('cookie-parser');

// middleware
var morgan = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('favicon'); //use this to add icon to webpage
require('./src/config/passport.js')(passport);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// ports
var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port " + port);

// routing to server
var server = require('./src/server/server.js');
app.use('/', server);

// cross-site & options
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header("Access-Control-Allow-Headers", "*");
  // res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// serving client files
app.use(express.static('src/client'));

// facebook authentication strategy
app.get('/auth/facebook',  passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/', // '/profile'
  failureRedirect: '/'
}));

// logout passport strategy
// app.get('/logout', function(req, res) {
//   console.log("logging out!");
//   req.logOut();
//   req.session.destroy();
//   res.redirect('/');
// });

// logout with cookie delete
// app.get('/logout', function(req, res){
//   cookie = req.cookies;
//   for (var prop in cookie) {
//     if (!cookie.hasOwnProperty(prop)) {
//       continue;
//     }
//     res.cookie(prop, '', {expires: new Date(0)});
//   }
//   res.redirect('/');
// });

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
  return next();
  res.redirect('/');
}

module.exports = app;
