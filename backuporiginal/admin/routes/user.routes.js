module.exports = app => {
    const User = require("../controllers/user/user.controller.js");
    const Attendance = require("../controllers/user/attendance.controller.js");
    const Leave = require("../controllers/user/leave.controller.js");

    
    var router = require("express").Router();
  
   
    // User
    router.get("/listUser", User.listUsers);
    router.post("/user", User.saveUser);
    router.get("/user/:id", User.getUser);
    router.put("/user/:id", User.updateUser);
    router.put("/user/password/:id", User.updateUserPassword);
    router.put("/user/status/:id", User.statusUser);
    router.delete("/user/:id", User.deleteUser);
    router.post("/user/uploadBulkUser", User.uploadBulkUser);


    // Attendance
    router.get("/listAttendance", Attendance.listAttendance);
    //Leave
    router.get("/listLeave", Leave.listLeaves);
    router.put("/leave/status/:id/:status", Leave.statusLeave);
    router.delete("/leave/:id", Leave.deleteLeave);

    router.get("/saveWeekOff", Attendance.saveWeekOff);
    

    app.use('/admin/v1/user', router);
  };
  