var express = require('express');
var router = express.Router();
var User = require('./../models/User');


///////////// Registration///////////////////////

router.post('/register', function(req, res, next) {
  console.log("Registration");
   User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      res.render('500');
    } else if (user) {
      // req.flash('danger', 'Email address already in use');
      // res.redirect('/users/signup');
    } else {
      var user = new User();
      user.username = req.body.username; 
      user.email = req.body.email;
      user.password = user.generateHash(req.body.password);
      user.save(function(err) {
        if (err) {
          res.render('500');
        } else {
            res.cookie('userid', user.id,{ maxAge: 2592000000 }); 
            res.cookie('username',user.username, { maxAge: 2592000000 }); 
          // req.flash('success', "Thank's for signing up! You're now logged in.")
          res.json(user);
        }
      });
    }
  });
});


///////////////////Login//////////////////////////////

router.post('/login', function(req, res, next) {
  console.log("Login");
    User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      // res.render('500');
    } else if (!user || !user.isValidPassword(req.body.password)) {
      // req.flash('danger', 'Email or password is incorrect');
      // res.redirect('/users/login');
    } else {
        req.login(user, function(err) {
          if (err) { 
            // res.render('500'); 
          } else {
            res.cookie('userid', user.id,{ maxAge: 2592000000 }); 
            res.cookie('username',user.username, { maxAge: 2592000000 }); 
            // req.flash('success', "You're now logged in.")
           res.json(user);
          }
        });
      
    }
  });
});

router.get('/logout', function(req, res, next) {
  console.log("Logout");
    req.logout();
    res.clearCookie('userid');
    res.clearCookie('username');
    res.send("success");
});

module.exports = router;
