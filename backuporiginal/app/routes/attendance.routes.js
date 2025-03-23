

module.exports = app => {
    const Attendance = require("../controllers/Attendance/attendance.controller");
  
    var router = require("express").Router();
  
   
    // Retrieve all published osbss
    router.post("/ValidationAttendance", Attendance.ValidationAttendance);
    router.post("/attendance_punch_in", Attendance.attendance_punch_in);
    router.post("/attendance_punchout", Attendance.attendance_punchout);
    router.post("/LeaveApp", Attendance.LeaveApp);
    router.post("/LeaveCount", Attendance.LeaveCount);
   
    app.use('/', router);
  };
  