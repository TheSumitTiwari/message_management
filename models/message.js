var mongoose = require("mongoose");

var askqSchema = new mongoose.Schema({
   type: String,
   name: String,
   code: String,
   date : String,
   
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
   
});

module.exports = mongoose.model("askq", askqSchema);