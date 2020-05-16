var express = require("express");
var router  = express.Router();
var Message = require("../models/message");
var userr = require("../models/user");


router.get("/", function(req, res){
    res.render("main/main"); 
 });

 router.get("/message", function(req, res){
    res.render("main/message"); 
 });

 router.get("/search", function(req, res){
    res.render("main/search"); 
 });

 router.get("/searchH", function(req, res){
    res.render("main/searchH"); 
 });


//CREATE - add new Messages to DB
router.post("/", isLoggedIn, async function(req, res){
    
    var type = req.body.type;
    var name = req.body.name;
    var code = req.body.type+req.body.code;
    var date = req.body.date;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var today = new Date();
    var month = today.getUTCMonth() + 1; //months from 1-12
    var day =  today.getUTCDate();
    var year =  today.getUTCFullYear();
    date =   day + "/" + month + "/" + year;
    var newMessage = {type:type,name:name,code:code,date: date, author:author}
    
    Message.create(newMessage, function(err, newlyCreated){
        if(err){
            console.log(err);
            return res.render("main/message", {"error": err.message});
        } else {
            //redirect back to message page
            console.log(newlyCreated);
            return res.render("main/message", {"success": "Message created succesfully!"});
        }
    });
});


//My messages
router.get("/history",isLoggedIn, function(req, res){
    // Get all message from DB
    var nae = req.user.username;
    console.log(nae);
    Message.find({'author.username':nae}, function(err, allMessages){
     if(err){
         console.log(err);
     } else {
        res.render("main/history",{messages:allMessages,nae:nae});
     }
  });
});


// my search msges
router.get("/searchH/msgH",isLoggedIn, function(req, res){
    // Get all message from DB
    var nae = req.user.username;
     var type = req.query.type;
    var name = req.query.name;
    var code = req.query.code;

    console.log(nae);

    Message.find({
      $and: [
          {'author.username':nae},
          { $or: [{'type': type},{'name': name},{'code':code}]}
      ]
  }, function(err,allMessages){
        if(err){
            res.send(err);
            }            
        else{
            console.log(allMessages)
            res.render("main/searchHmsg",{messages:allMessages,nae:nae,error:"No Messages Found"});
        }
    }); 
 });


// searches
router.get("/search/msg",isLoggedIn, function(req, res){

    var type = req.query.type;
    var name = req.query.name;
    var code = req.query.code;

    var nae = req.user.username;

        Message.find({$or:[{'type': type},{'name': name},{'code':code}]}, function(err,allMessages){
            if(err){
                res.send(err);
            }            
            else{
                console.log(allMessages)
                res.render("main/searchmsg",{messages:allMessages,nae:nae,error:"No Messages Found"});
            }
    });   
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