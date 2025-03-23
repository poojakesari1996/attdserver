// const dashboardmodel = require("../../Dashboard/dashboard.controller");

const attendancemodel = require("../../models/attendance/attendance.model");

exports.ValidationAttendance = (req, res) => {
    attendancemodel.ValidationAttendance(req,(data) => {
  
      console.log('dashboardmodel -------', data);
      res.send(data);
    });
  
  
  };


  exports.attendance_punch_in = (req, res) => {
    attendancemodel.attendance_punch_in(req,(data) => {
  
      console.log('dashboardmodel -------', data);
      res.send(data);
    });
  
  
  };

  exports.attendance_punchout = (req, res) => {
    attendancemodel.attendance_punchout(req,(data) => {
  
      console.log('dashboardmodel -------', data);
      res.send(data);
    });
  
  
  };


  exports.LeaveApp = (req, res) => {
    attendancemodel.LeaveApp(req,(data) => {
  
      console.log('dashboardmodel -------', data);
      res.send(data);
    });
  
  
  };

  exports.LeaveCount = (req, res) => {
    attendancemodel.LeaveCount(req,(data) => {
  
      console.log('dashboardmodel -------', data);
      res.send(data);
    });
  
  
  };
  

  