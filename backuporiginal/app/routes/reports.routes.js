module.exports = app => {
    const Reports = require("../controllers/Reports/reports.controller");
  
    var router = require("express").Router();
  
   
    // Retrieve all published osbss
    router.post("/SelectedBeat", Reports.SelectedBeat);
    router.post("/SelectOutlet_OrderHistory", Reports.SelectOutlet_OrderHistory);
    router.post("/OrderHistory_MIS", Reports.OrderHistory_MIS);
    router.post("/Selectdate", Reports.Selectdate);
    router.post("/ActivityHistory_MIS", Reports.ActivityHistory_MIS);
    router.post("/SelectActivitydate", Reports.SelectActivitydate);
    router.post("/AttendanceHistory", Reports.AttendanceHistory);
    router.post("/EodDate", Reports.EodDate);
    router.post("/EodOrder", Reports.EodOrder);
    router.post("/EodDateReturn", Reports.EodDateReturn);
    router.post("/EodReturn", Reports.EodReturn);
    router.post("/ActivityData", Reports.ActivityData);
    router.post("/EODActivityDate", Reports.EODActivityDate);
    router.post("/EODAttendance", Reports.EODAttendance);
    router.post("/EodNotPunchIn", Reports.EodNotPunchIn);
    router.post("/EodShareUpdate", Reports.EodShareUpdate);
    router.post("/EodDatebutton", Reports.EodDatebutton);
    router.post("/EodOrderbutton", Reports.EodOrderbutton);
    router.post("/EodDateReturnbutton", Reports.EodDateReturnbutton);
    router.post("/EodReturnbutton", Reports.EodReturnbutton);
    router.post("/EODActivityDatebutton", Reports.EODActivityDatebutton);
    router.post("/ActivityDatabutton", Reports.ActivityDatabutton);
    router.post("/EODAttendancebutton", Reports.EODAttendancebutton);
    router.post("/skuorderwise", Reports.skuorderwise);
    router.post("/Totalskuorderwise", Reports.Totalskuorderwise);
    app.use('/', router);
  };
  