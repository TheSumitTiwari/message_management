var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user");


    require('dotenv').config();
    

var indexRoutes      = require("./routes/index"),
    mainRoutes    = require("./routes/main");


//Seting up
mongoose.connect("mongodb://localhost/message");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());

// session for login
app.use(require("express-session")({
    secret: "Secret",
    resave: false,
    saveUninitialized: false
 }));

 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());


 app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
  });

  app.use("/", indexRoutes);
  app.use("/main", mainRoutes);
  
  app.listen("4010", function(){
    console.log("Message server is running on port 4010"); 
 });