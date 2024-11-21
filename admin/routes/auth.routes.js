module.exports = app => {
    const Auth = require("../controllers/auth.controller.js");
  
    var router = require("express").Router();
  
   
    // Retrieve all published osbss
    router.post("/login", Auth.login);
    router.post("/verify_token", Auth.verifyToken);
  

    app.use('/admin/v1/auth', router);
  };
  