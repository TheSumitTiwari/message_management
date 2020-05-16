var express = require("express");
var router  = express.Router();
var Message = require("../models/message");
var passport = require("passport");
var User = require("../models/user");


//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/main"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/main",
        failureRedirect: "/login",
        failureFlash: true,
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success","Logged you out!");
   res.redirect("/");
});


//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","please login first!");
    res.redirect("/login");
}

module.exports = router;