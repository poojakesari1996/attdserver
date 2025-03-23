// const authModel = require("../../models/auth.model.js");
const reportsModel = require("../../models/reports/reports.model.js");

exports.SelectedBeat = (req, res) => {
    reportsModel.SelectedBeat(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};

exports.SelectOutlet_OrderHistory = (req, res) => {
    reportsModel.SelectOutlet_OrderHistory(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};

exports.OrderHistory_MIS = (req, res) => {
    reportsModel.OrderHistory_MIS(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};


exports.Selectdate = (req, res) => {
    reportsModel.Selectdate(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};


exports.ActivityHistory_MIS = (req, res) => {
    reportsModel.ActivityHistory_MIS(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};

exports.SelectActivitydate = (req, res) => {
    reportsModel.SelectActivitydate(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};

exports.AttendanceHistory = (req, res) => {
    reportsModel.AttendanceHistory(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};

exports.EodDate = (req, res) => {
  reportsModel.EodDate(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.EodOrder = (req, res) => {
  reportsModel.EodOrder(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.EodOrderbutton = (req, res) => {
  reportsModel.EodOrderbutton(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};


exports.EodDateReturn = (req, res) => {
  reportsModel.EodDateReturn(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.EodReturn = (req, res) => {
  reportsModel.EodReturn(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.ActivityData = (req, res) => {
  reportsModel.ActivityData(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.EODActivityDate = (req, res) => {
  reportsModel.EODActivityDate(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.EODAttendance = (req, res) => {
  reportsModel.EODAttendance(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.EodNotPunchIn = (req, res) => {
  reportsModel.EodNotPunchIn(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.EodShareUpdate = (req, res) => {
  reportsModel.EodShareUpdate(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};



exports.EodDatebutton = (req, res) => {
  reportsModel.EodDatebutton(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};


exports.EodDateReturnbutton = (req, res) => {
  reportsModel.EodDateReturnbutton(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.EodReturnbutton = (req, res) => {
  reportsModel.EodReturnbutton(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.EODActivityDatebutton = (req, res) => {
  reportsModel.EODActivityDatebutton(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.ActivityDatabutton = (req, res) => {
  reportsModel.ActivityDatabutton(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.EODAttendancebutton = (req, res) => {
  reportsModel.EODAttendancebutton(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};


exports.skuorderwise = (req, res) => {
  reportsModel.skuorderwise(req,(data) => {
  // console.log('listAuth -------', data);
  res.send(data);
});


};

exports.Totalskuorderwise = (req, res) => {
  reportsModel.Totalskuorderwise(req,(data) => {
  // console.log('listAuth -------', data);
  res.send(data);
});


};