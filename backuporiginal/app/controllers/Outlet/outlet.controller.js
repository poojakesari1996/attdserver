// const authModel = require("../../models/auth.model.js");
const outletModel = require("../../models/outlet/outlet.model.js");

exports.DatewiseOutlet = (req, res) => {
    outletModel.DatewiseOutlet(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};



exports.DatewiseOutlet_data = (req, res) => {
    outletModel.DatewiseOutlet_data(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};


exports.countOutlet = (req, res) => {
    outletModel.countOutlet(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};

exports.SelectedOutlet = (req, res) => {
    outletModel.SelectedOutlet(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};

exports.udateinfo = (req, res) => {
    outletModel.udateinfo(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};

exports.udatehospitalinfo = (req, res) => {
  outletModel.udatehospitalinfo(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.retail_activity = (req, res) => {
    outletModel.retail_activity(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};

exports.hospitalContact = (req, res) => {
  outletModel.hospitalContact(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.customeradd = (req, res) => {
  outletModel.customeradd(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.validationActivity = (req, res) => {
  outletModel.validationActivity(req,(data) => {
  // console.log('listAuth -------', data);
  res.send(data);
});


};


exports.updateCustomer = (req, res) => {
  outletModel.updateCustomer(req,(data) => {
  // console.log('listAuth -------', data);
  res.send(data);
});
};


exports.CustomerDetailShow = (req, res) => {
  outletModel.CustomerDetailShow(req,(data) => {
  // console.log('listAuth -------', data);
  res.send(data);
});
};

