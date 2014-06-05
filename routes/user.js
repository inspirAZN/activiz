var User = require('../models/user');
var passport = require('passport');

exports.login =  function(req,res){
passport.authenticate('local',{failureRedirect: '/' })(req,res,function() {
      res.render('upload', { user: req.body.username });
  });
}


exports.logout = function(req, res) {
	req.logout();
    res.render('/', {message: "You have been logged out."});
}

exports.signup = function(req, res) {
	res.render('signup', { title: 'Activity Viz'});
}

exports.saveUser = function(req, res) {
	User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
        if (err) {
        	console.log(err);
            return res.render('upload', { user : user });
        }
 
        passport.authenticate('local',{failureRedirect: '/' })(req, res, function () {
          res.redirect('/');
        });
    });
}

