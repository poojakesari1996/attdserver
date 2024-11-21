module.exports = app => {
    const Profile = require("../controllers/Profile/profile.controller");
  
    var router = require("express").Router();
  
   
    // Retrieve all published osbss
    router.post("/profiledata", Profile.profiledata);
    router.get("/testServer", Profile.testServer);
    app.use('/', router);
  };
  