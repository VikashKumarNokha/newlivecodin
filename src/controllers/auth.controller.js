
 const userSchema = require("../models/user.models")
 require("dotenv").config()
  const jwt = require('jsonwebtoken');

  const transporter = require("../configs/mail")
  

 // process.env.secrete_key
   const genearteTocken = (newuser)=>{
     return jwt.sign({  newuser }, "masaisecret"  );
   }

const register = async (req, res)=>{
    
       try{     
            const user = await userSchema.findOne({ email : req.body.email });
            if(user){
             return res.status(400).json( {message : "useralready registered"} )
            }
             const newuser = await userSchema.create(req.body);  
             
             const tocken =  genearteTocken(newuser);


             const info = transporter.sendMail({
              from: '"Fred Foo 👻" <foo@example.com>', // sender address
              to: "vikashkumarnokha@gmail.com", // list of receivers
              subject: "Hello ✔", // Subject line
              text: "Hello world?", // plain text body
              html: "<b>Hello world?</b>", // html body
            });
            console.log("Message sent: %s", info);
             
             return res.status(200).json({newuser, tocken});

       }catch(err){
           return res.status(400).json(err);
       }
}


const login = async (req, res)=>{
      try{
        const user = await userSchema.findOne({ email : req.body.email });
            if(!user){
             return res.status(400).json( {message : "invalid email or password"} )
            }

            const match = user.checkPassword(req.body.password);

             if(!match){
                return res.status(400).send({massage : "wrong  email or password"});
             }
              console.log("match", match, user);

              let tocken = genearteTocken(user)
            return res.status(200).json({user, tocken});

      }catch(err){
         return res.status(400).json({err : err});
      }
}

module.exports = {register, login, genearteTocken};