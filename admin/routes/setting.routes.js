module.exports = app => {



  var router = require("express").Router();

 


  app.use('/admin/v1/setting', router);
};
