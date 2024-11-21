const authModel = require("../models/auth.model.js");
const helper = require("../helper/helper.js");



exports.login = (req, res) => {
  authModel.login(req,(data) => {

    console.log('listAuth -------', data);
    res.send(data);

  });
};

exports.verifyToken = (req, res) => {
    authModel.verifyToken(req,(data) => {
  
      console.log('verifyToken -------', data);
      res.send(data);
  
    });
  };
  





