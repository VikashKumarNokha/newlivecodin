
  const mongoose = require("mongoose");

  const productSchema = new mongoose.Schema({
    title : {type : String , required : true},
    price : {type : Number , required : true},
    user_id : {type:  mongoose.Schema.Types.ObjectId,  ref : "livecodingAgain", required : true  }
  },{
     timestamps : true,
     versionKey : false
  })

module.exports = mongoose.model("product", productSchema);

