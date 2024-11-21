// const authModel = require("../../models/auth.model.js");
const authModel = require("../models/auth.model.js");

exports.login = (req, res) => {
  authModel.login(req,(data) => {

    console.log('listAuth -------', data);
    res.send(data);
  });


};

exports.changepassword = (req, res) => {
  authModel.changepassword(req,(data) => {

    console.log('listAuth -------', data);
    res.send(data);
  });


};