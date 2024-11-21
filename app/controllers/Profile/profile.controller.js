// const authModel = require("../../models/auth.model.js");
const profileModel = require("../../models/profile/profile.model");

exports.profiledata = (req, res) => {
    profileModel.profiledata(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};

exports.testServer = (req, res) => {
  profileModel.testServer(req,(data) => {
  console.log('testServer -------', data);
  res.send(data);
});


};

