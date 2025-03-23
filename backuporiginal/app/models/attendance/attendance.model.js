const sql = require("../db.js");

// constructor
const attendance = function(osbs) {
  this.title = osbs.title;
  this.description = osbs.description;
  this.published = osbs.published;
};


/*
*@Author:           <Anubhav Tripathi>
*@Created On:       <16-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Item>
*/


attendance.ValidationAttendance =  (req, result) => {
    sql.query(`SELECT status,emp_id FROM romsondb.cor_attendance_m where punch_date = curdate() and enter_by='${req.body.enterBy}'`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  // attendance.attendance_punch_in =  (req, result) => {
   
  //   sql.query(`INSERT IGNORE INTO romsondb.cor_attendance_m(attendance_id, emp_id, shift, punch_date, punch_in, in_lat, in_lng, enter_by,enter_date,in_remark,work_place,in_address) values((select romsondb.all_auto_no(55)),'${req.body.empid}','D',curdate(),sysdate(),'${req.body.in_lat}','${req.body.in_lng}','${req.body.enterBy}',sysdate(),'${req.body.emp_in_rmrk}','${req.body.emp_workplace}','${req.body.emp_in_address}')`,
  //   console.log(`INSERT IGNORE INTO romsondb.cor_attendance_m(attendance_id, emp_id, shift, punch_date, punch_in, in_lat, in_lng, enter_by,enter_date,in_remark,work_place,in_address) values((select romsondb.all_auto_no(55)),'${req.body.empid}','D',curdate(),sysdate(),'${req.body.in_lat}','${req.body.in_lng}','${req.body.enterBy}',sysdate(),'${req.body.emp_in_rmrk}','${req.body.emp_workplace}','${req.body.emp_in_address}')`),
  //  (err, res) => {
  //     console.log("osbss: ", res);
  //     if (err) {
  //       result({ error: true, data: "Something Went Wrong" })
  //     }
  //     result(res)
  //   });
  // };
  attendance.attendance_punch_in = (req, result) => {
    const attendanceQuery = `
      INSERT INTO romsondb.cor_attendance_m
        (attendance_id, emp_id, shift, punch_date, punch_in, in_lat, in_lng, enter_by, enter_date, in_remark, work_place, in_address,app_version)
      SELECT
        (SELECT romsondb.all_auto_no(55)),
        '${req.body.empid}', 'D', CURDATE(), NOW(), '${req.body.in_lat}', '${req.body.in_lng}',
        '${req.body.enterBy}', NOW(), '${req.body.emp_in_rmrk}', '${req.body.emp_workplace}', '${req.body.emp_in_address}','${req.body.app_version}'
      FROM
        DUAL
      WHERE
        NOT EXISTS (
          SELECT
            *
          FROM
            romsondb.cor_attendance_m
          WHERE
            emp_id = '${req.body.empid}'
            AND punch_date = CURDATE()
        )
    `;
  
    sql.query(attendanceQuery, (err, res) => {
      console.log("Query: ", attendanceQuery);
      console.log("Result: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" });
      }
      result(res);
    });
  };
  

  attendance.attendance_punchout =  (req, result) => {
    sql.query(`update romsondb.cor_attendance_m set punch_out = sysdate(),out_lat='${req.body.out_lat}',out_long='${req.body.out_long}',out_remark='${req.body.out_remark}',out_address='${req.body.add_res}' where emp_id='${req.body.empid}' and punch_date = curdate()`,
   (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result(res)
    });
  };


//   attendance.LeaveApp =  (req, result) => {
//     sql.query(`INSERT INTO romsondb.cor_leave_m(emp_id, reporting_to, leave_type, start_date, end_date, leave_days, leave_reason, enter_by,enter_date)
// values('${req.body.empID}','${req.body.rpPerson}','${req.body.leaveType}','${req.body.fromDate}','${req.body.toDate}','${req.body.numofdays}', '${req.body.leavereason}','${req.body.enterBy}',sysdate())`,
//    (err, res) => {
//       console.log("osbss: ", res);
//       if (err) {
//         result({ error: true, data: "Something Went Wrong" })
//       }
//       result({error:false, data: result,msg:"Sucessfully Submit" });
//     });
//   };


attendance.LeaveApp = (req, result) => {
  const { empID, rpPerson, leaveType, fromDate, toDate, numofdays, leavereason, enterBy } = req.body;
  
  // Check if there is any overlapping leave
  sql.query(`SELECT * FROM romsondb.cor_leave_m WHERE emp_id = '${empID}'
    AND ((start_date <= '${fromDate}' AND end_date >= '${fromDate}')
    OR (start_date <= '${toDate}' AND end_date >= '${toDate}')
    OR (start_date >= '${fromDate}' AND end_date <= '${toDate}'))`, (err, res) => {
    if (err) {
      console.log(err);
      result({ error: true, data: "Something Went Wrong" });
      return;
    }

    if (res.length > 0) {
      result({ error: true, data: "Leave already applied for the selected dates" });
      return;
    }

    // If there is no overlapping leave, insert the new leave application
    sql.query(`INSERT INTO romsondb.cor_leave_m (emp_id, reporting_to, leave_type, start_date, end_date, leave_days, leave_reason, enter_by, enter_date)
      VALUES ('${empID}', '${rpPerson}', '${leaveType}', '${fromDate}', '${toDate}', '${numofdays}', '${leavereason}', '${enterBy}', sysdate())`,
      (err, res) => {
        if (err) {
          console.log(err);
          result({ error: true, data: "Something Went Wrong" });
          return;
        }
        console.log("osbss: ", res);
        result({ error: false, data: result, msg: "Successfully Submitted" });
      });
  });
};


attendance.LeaveCount =  (req, result) => {
  sql.query(`SELECT sum(leave_days) as leaveTake FROM romsondb.cor_leave_m where emp_id='${req.body.empid}'  AND YEAR(enter_date) = YEAR(CURRENT_DATE());`,
 (err, res) => {
    console.log("osbss: ", res);
    if (err) {
      result({ error: true, data: "Something Went Wrong" })
    }
    result(res)
  });
};


  // attendance.attendance_punch_in =  (req, result) => {
  //   sql.query(`SELECT COUNT(*) as count FROM romsondb.cor_attendance_m WHERE emp_id = '${req.body.empID}' AND punch_date = curdate()`,
  //  (err, res) => {
  //     console.log("osbss: ", res);
  //     if (err) {
  //       result({ error: true, data: "Something Went Wrong" })
  //     }
  //     console.log(res[0].count);
    
  //   });
  // };


  
module.exports = attendance;