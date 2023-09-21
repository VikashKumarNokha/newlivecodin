const express = require("express")

 const app = express();

app.use(express.json());

 const passport = require("./configs/google-oauth")

 const connect = require("./configs/db");

 const usercontriller = require("./controllers/user.controllers")
  const {register, login, genearteTocken} = require("./controllers/auth.controller")
  const productController = require("./controllers/product.controller")
  

app.get("/", (req, res)=>{      
     return res.status(200).json("Hello server");
})


app.post("/register", register);
app.post("/login", login);



app.use("/users", usercontriller);

app.use("/product", productController);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', "email" ],  }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session : false }),
  function(req, res) {
    // Successful authentication, redirect home.
     const tocken = genearteTocken(req.user);
    res.status(200).send({"user" : req.user, "tocken" : tocken}) ;
  });


  app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'profile', "email" ], }));

  app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login', session : false  }),
  function(req, res) {
    // Successful authentication, redirect home.
    const tocken = genearteTocken(req.user);
    res.status(200).send({"user" : req.user, "tocken" : tocken}) ;
  });


app.listen(5000, async ()=>{
    try{

        await connect();
       console.log("server  running on port 5000");
    }catch(err){
         console.log("err", err);
    }
})

