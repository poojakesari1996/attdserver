

module.exports = app => {
    const Dashboard = require("../controllers/Dashboard/dashboard.controller");
  
    var router = require("express").Router();
  
   
    // Retrieve all published osbss
    router.post("/ScoreCrad", Dashboard.ScoreCrad);
    router.post("/OutletCoverage", Dashboard.OutletCoverage);
    router.post("/ApprovedOrder", Dashboard.ApprovedOrder);
    router.post("/AttendanceDashboard", Dashboard.AttendanceDashboard);
    router.post("/AppVersionCheck", Dashboard.AppVersionCheck);
    router.post("/EmplyeeInfoWeb", Dashboard.EmplyeeInfoWeb);
    router.post("/OutletCoverageWeb", Dashboard.OutletCoverageWeb);
    router.post("/ZonewiseWeb", Dashboard.ZonewiseWeb);
    app.use('/', router);
  };
  