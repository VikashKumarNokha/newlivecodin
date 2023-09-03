
const router = require("express").Router();

const {body, validationResult } = require("express-validator")

const users = require("../models/user.models");



router.get("/", async (req, res)=>{
     try{ 
       const data = await users.find();
       return res.status(200).json(data);

     }catch(err){
         console.log("err", err);
     }
})


router.post("/", 
   body("name").trim().not().isEmpty().custom((val)=>{
       if(val.length < 5){
        throw new Error("name should be more than three charecterr");
       }
       return true;
   }),
   body("email").isEmail().custom( async (value)=>{
        const mail = await users.findOne({email : value});
         if(mail){
           throw new Error("emaill already exist");
         }
         return true;
   }),
   body("password").not().isEmpty().withMessage("empty pass not allowed").custom((val)=>{
    var passw= /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,15}$/;
    if(!val.match(passw)) {
       throw new Error("password must be strong");
    }
      return true;
   }),

  async (req, res)=>{ 
    try{
        const result = validationResult(req);
        if (!result.isEmpty()) {
          return res.status(400).send({ errors: result.array() });
        }

      
      const newdata = users(req.body);
      const data = await newdata.save();
      return res.status(200).json(data);

    }catch(err){
        console.log("err", err);
    }
})


router.patch("/:id", async (req, res)=>{
    try{
     
      const updated = await users.findByIdAndUpdate(req.params.id, {$set : req.body}, {new : true } );

      return res.status(200).json(updated);

    }catch(err){
        console.log(err)
    }
})


router.delete("/:id", async (req, res)=>{
     try{
       const deleted = await users.findByIdAndDelete(req.params.id)
        return res.status(200).json(deleted);
     }catch(err){
        console.log("err", err);
     }
} )



module.exports = router;