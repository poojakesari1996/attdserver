// const dashboardmodel = require("../../Dashboard/dashboard.controller");

const dashboardmodel = require("../../models/dashboard/dashboard.model");

exports.ScoreCrad = (req, res) => {
    dashboardmodel.ScoreCrad(req,(data) => {
  
      console.log('dashboardmodel -------', data);
      res.send(data);
    });
  
  
  };

  exports.OutletCoverage = (req, res) => {
    dashboardmodel.OutletCoverage(req,(data) => {
  
      console.log('dashboardmodel -------', data);
      res.send(data);
    });
  
  
  };
  

  exports.ApprovedOrder = (req, res) => {
    dashboardmodel.ApprovedOrder(req,(data) => {
  
      console.log('dashboardmodel -------', data);
      res.send(data);
    });
  
  
  };

  exports.AttendanceDashboard = (req, res) => {
    dashboardmodel.AttendanceDashboard(req,(data) => {
  
      console.log('AttendanceDashboard -------', data);
      res.send(data);
    });
  
  
  };

  exports.AppVersionCheck = (req, res) => {
    dashboardmodel.AppVersionCheck(req,(data) => {
  
      console.log('AppVersionCheck -------', data);
      res.send(data);
    });
  
  
  };

  exports.EmplyeeInfoWeb = (req, res) => {
    dashboardmodel.EmplyeeInfoWeb(req,(data) => {
  
      console.log('EmplyeeInfoWeb -------', data);
      res.send(data);
    });
  
  
  };

  exports.OutletCoverageWeb = (req, res) => {
    dashboardmodel.OutletCoverageWeb(req,(data) => {
  
      console.log('OutletCoverageWeb -------', data);
      res.send(data);
    });
  
  
  };

  
  exports.ZonewiseWeb = (req, res) => {
    dashboardmodel.ZonewiseWeb(req,(data) => {
  
      console.log('ZonewiseWeb -------', data);
      res.send(data);
    });
  
  
  };