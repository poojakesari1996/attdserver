// const authModel = require("../../models/auth.model.js");
const outletModel = require("../../models/outlet/outlet.model.js");

// exports.DatewiseOutlet = (req, res) => {
//     outletModel.DatewiseOutlet(req,(data) => {
//     console.log('listAuth -------', data);
//     res.send(data);
//   });


// };

exports.dateWiseOutlet = (req, res) => {
  outletModel.dateWiseOutlet(req,(data) => {
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


exports.Dealernamelist = (req, res) => {
  outletModel.Dealernamelist(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};


exports.jioAddress = (req, res) => {
  outletModel.jioAddress(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.getAddress = (req, res) => {
  outletModel.getAddress(req,(data) => {
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


exports.Reporting_hierarchy = (req, res) => {
  outletModel.Reporting_hierarchy(req,(data) => {
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


exports.outlet_activity = (req, res) => {
  outletModel.outlet_activity(req,(data) => {
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

