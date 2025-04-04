const { error, log } = require("console");
const sql = require("../db.js");
const crypto = require('crypto');
const moment = require('moment-timezone');

// constructor
const attendance = function (osbs) {
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


attendance.ValidationAttendance = (req, result) => {
  sql.query(`SELECT status,emp_id FROM romsondb.cor_attendance_m where punch_date = curdate() and enter_by='${req.body.enterBy}'`, (err, res) => {
    console.log("osbss: ", res);
    if (err) {
      result({ error: true, data: "Something Went Wrong" })
    }
    result({ error: false, data: res })
  });
};

attendance.attendance_punch_in = (req, result) => {
  // SQL query using parameterized values
  const attendanceQuery = `
      INSERT INTO crm_dev_db.cor_attendance_m
        (attendance_id, emp_id, shift, punch_date, punch_in, in_lat, in_lng, enter_by, enter_date, in_remark, work_place, in_address, app_version)
      SELECT
        crm_dev_db.all_auto_no(55),
        ?, 'D', CURDATE(), NOW(), ?, ?, ?, NOW(), ?, ?, ?, ?
      FROM
        DUAL
      WHERE
        NOT EXISTS (
          SELECT
            1
          FROM
            crm_dev_db.cor_attendance_m
          WHERE
            emp_id = ?
            AND punch_date = CURDATE()
        );
  `;

  // Parameters array
  const params = [
    req.body.empid,         // Employee ID
    req.body.in_lat,        // Latitude
    req.body.in_lng,        // Longitude
    req.body.enterBy,       // Entered by
    req.body.emp_in_rmrk,   // Remark
    req.body.emp_workplace, // Workplace
    req.body.emp_in_address, // Address
    req.body.app_version,   // App version
    req.body.empid,         // Employee ID (for WHERE clause)
  ];

  // Execute the query
  sql.query(attendanceQuery, params, (err, res) => {
    console.log("Executing Query: ", attendanceQuery);
    console.log("With Parameters: ", params);

    if (err) {
      console.error("Database Error: ", err); // Log the actual error for debugging
      result({ error: true, data: err.message }); // Respond with the error message
      return;
    }

    // Check if a row was inserted
    if (res.affectedRows > 0) {
      result({ success: false, message: "Attendance recorded successfully." });
    } else {
      result({ msg: true, message: "Attendance already exists for today." });
    }
  });
};

attendance.attendance_punchout = (req, result) => {
  const currentHour = new Date().getHours();

  // Check if the current time is after 9 PM
  if (currentHour >= 21) {
    result({ error: true, message: "You are not allowed to punch out after 9 PM" });
    return;
  }

  // Check if the punch-out already exists for the user today
  sql.query(`
      SELECT * FROM crm_dev_db.cor_attendance_m 
      WHERE emp_id = '${req.body.empid}' 
      AND punch_date = curdate() 
      AND punch_out IS NOT NULL`,
    (err, res) => {
      if (err) {
        result({ error: true, message: "Something went wrong while checking punch-out" });
      } else {
        if (res.length > 0) { 
          result({ error: true, message: "You have already punched out today." });
        } else {
          
          sql.query(`
            UPDATE crm_dev_db.cor_attendance_m 
            SET 
                punch_out = sysdate(),
                out_lat = '${req.body.out_lat}', 
                out_long = '${req.body.out_long}', 
                out_remark = '${req.body.out_remark}', 
                out_address = '${req.body.add_res}' 
            WHERE 
                emp_id = '${req.body.empid}' 
                AND punch_date = curdate()`,
            (err, res) => {
              if (err) {
                result({ error: true, message: "Something went wrong while updating punch-out" });
              } else {
                if (res.affectedRows > 0) {
                  result({ success: true, message: "Successfully punched out" });
                } else {
                  result({ error: true, message: "Could not update punch-out, please try again" });
                }
              }
            });
        }
      }
    });
};









// attendance.attendance_punchout = (req, result) => {
//   const currentHour = new Date().getHours();

//   // Check if the current time is after 9 PM
//   if (currentHour >= 21) {
//     result({ error: true, data: "You are not allowed to punch out after 9 PM" });
//     return;
//   }

//   sql.query(`
//       UPDATE crm_dev_db.cor_attendance_m 
//       SET 
//           punch_out = sysdate(),
//           out_lat = '${req.body.out_lat}', 
//           out_long = '${req.body.out_long}', 
//           out_remark = '${req.body.out_remark}', 
//           out_address = '${req.body.add_res}' 
//       WHERE 
//           emp_id = '${req.body.empid}' 
//           AND punch_date = curdate()`,
//     (err, res) => {
//       console.log("Response: ", res);

//       if (err) {
//         result({ error: true, data: "Something Went Wrong" });
//       } else {
//         if (res.affectedRows > 0) {  // If punch-out record updated successfully
//           result({
//             success: false,
//             message: "Successfully punched out"
//           });
//         }
//       }
//     });
// };




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


// attendance.LeaveApp = (req, result) => {
//   const { empID, rpPerson, fromDate, toDate, numofdays, leavereason, enterBy } = req.body;

//   // Determine initial leave type based on number of days
//   let conditionalLeaveType = numofdays > 2 ? 'EL' : 'CL';

//   // Query to check leave balances for the employee
//   const leaveBalanceQuery = `
//     SELECT 
//       GREATEST(
//         COALESCE(MAX(CASE WHEN sm.leave_type = 'CL' THEN sm.leave_count ELSE 0 END), 12) - 
//         COALESCE(SUM(CASE WHEN lm.leave_type = 'CL' THEN lm.leave_days ELSE 0 END), 0), 
//         0
//       ) AS cl_balance,
//       GREATEST(
//         COALESCE(MAX(CASE WHEN sm.leave_type = 'EL' THEN sm.leave_count ELSE 0 END), 15) - 
//         COALESCE(SUM(CASE WHEN lm.leave_type = 'EL' THEN lm.leave_days ELSE 0 END), 0), 
//         0
//       ) AS el_balance
//     FROM 
//       crm_dev_db.cor_leave_summary sm
//     LEFT JOIN 
//       crm_dev_db.cor_leave_m lm 
//     ON 
//       sm.emp_id = lm.emp_id 
//       AND sm.leave_type = lm.leave_type
//       AND YEAR(lm.enter_date) = YEAR(CURRENT_DATE())
//     WHERE 
//       sm.emp_id = '${empID}'
//     GROUP BY 
//       sm.emp_id`;

//   sql.query(leaveBalanceQuery, (err, balanceRes) => {
//     if (err) {
//       console.log(err);
//       result({ error: true, data: "Something Went Wrong" });
//       return;
//     }

//     // Extract leave balances or assign default values
//     const { cl_balance, el_balance } = balanceRes[0] || { cl_balance: 12, el_balance: 15 };

//     // Determine final leave type based on balance and number of days
//     let lopMessage = null;

//     // Check if EL or CL balance is sufficient for the requested leave
//     if (conditionalLeaveType === 'EL' && el_balance > 0) {
//       // EL leave requested and balance is available
//       conditionalLeaveType = 'EL';
//     } else if (conditionalLeaveType === 'CL' && cl_balance > 0) {
//       // CL leave requested and balance is available
//       conditionalLeaveType = 'CL';
//     } else {
//       // If both balances are zero or the requested leave type is not available, set to LOP
//       conditionalLeaveType = 'LOP';
//       lopMessage = "You do not have sufficient leave balance. Your leave will be marked as LOP (Loss of Pay).";
//     }

//     // Check for overlapping leave applications
//     const overlapCheckQuery = `
//       SELECT * FROM crm_dev_db.cor_leave_m 
//       WHERE emp_id = '${empID}' 
//       AND (
//         (start_date <= '${fromDate}' AND end_date >= '${fromDate}') OR
//         (start_date <= '${toDate}' AND end_date >= '${toDate}') OR
//         (start_date >= '${fromDate}' AND end_date <= '${toDate}')
//       )`;

//     sql.query(overlapCheckQuery, (err, res) => {
//       if (err) {
//         console.log(err);
//         result({ error: true, data: "Something Went Wrong" });
//         return;
//       }

//       if (res.length > 0) {
//         result({ error: true, data: "Leave already applied for the selected dates" });
//         return;
//       }

//       // Insert leave application with the determined leave type
//       const insertLeaveQuery = `
//         INSERT INTO crm_dev_db.cor_leave_m 
//           (emp_id, reporting_to, leave_type, start_date, end_date, leave_days, leave_reason, enter_by, enter_date)
//         VALUES 
//           ('${empID}', '${rpPerson}', '${conditionalLeaveType}', '${fromDate}', '${toDate}', '${numofdays}', '${leavereason}', '${enterBy}', sysdate())`;

//       sql.query(insertLeaveQuery, (err, insertRes) => {
//         if (err) {
//           console.log(err);
//           result({ error: true, data: "Something Went Wrong" });
//           return;
//         }

//         // Provide appropriate response message
//         result({
//           error: false,
//           data: insertRes,
//           msg: lopMessage
//             ? lopMessage + " Leave application submitted successfully."
//             : "Leave application submitted successfully.",
//         });
//       });
//     });
//   });
// };





attendance.LeaveApp = (req, result) => {
  const { empID, rpPerson, fromDate, toDate, numofdays, leavereason, enterBy } = req.body;

  // Determine initial leave type based on number of days
  let conditionalLeaveType;
  if (numofdays === 1) {
    conditionalLeaveType = 'SL';
  } else if (numofdays === 2) {
    conditionalLeaveType = 'CL';
  } else {
    conditionalLeaveType = 'EL';
  }

  // Query to check leave balances for the employee
  const leaveBalanceQuery = `
    SELECT 
      GREATEST(
        COALESCE(MAX(CASE WHEN sm.leave_type = 'CL' THEN sm.leave_count ELSE 0 END), 12) - 
        COALESCE(SUM(CASE WHEN lm.leave_type = 'CL' THEN lm.leave_days ELSE 0 END), 0), 
        0
      ) AS cl_balance,
      GREATEST(
        COALESCE(MAX(CASE WHEN sm.leave_type = 'EL' THEN sm.leave_count ELSE 0 END), 15) - 
        COALESCE(SUM(CASE WHEN lm.leave_type = 'EL' THEN lm.leave_days ELSE 0 END), 0), 
        0
      ) AS el_balance,
      GREATEST(
        COALESCE(MAX(CASE WHEN sm.leave_type = 'SL' THEN sm.leave_count ELSE 0 END), 6) - 
        COALESCE(SUM(CASE WHEN lm.leave_type = 'SL' THEN lm.leave_days ELSE 0 END), 0), 
        0
      ) AS sl_balance
    FROM 
      crm_dev_db.cor_leave_summary sm
    LEFT JOIN 
      crm_dev_db.cor_leave_m lm 
    ON 
      sm.emp_id = lm.emp_id 
      AND sm.leave_type = lm.leave_type
      AND YEAR(lm.enter_date) = YEAR(CURRENT_DATE())
    WHERE 
      sm.emp_id = '${empID}'
    GROUP BY 
      sm.emp_id`;

  sql.query(leaveBalanceQuery, (err, balanceRes) => {
    if (err) {
      console.log(err);
      result({ error: true, data: "Something Went Wrong" });
      return;
    }

    // Extract leave balances or assign default values
    const { cl_balance, el_balance, sl_balance } = balanceRes[0] || { cl_balance: 12, el_balance: 15, sl_balance: 6 };

    // Determine final leave type based on balance and number of days
    let lopMessage = null;

    if (conditionalLeaveType === 'SL' && sl_balance > 0) {
      conditionalLeaveType = 'SL';
    } else if (conditionalLeaveType === 'CL' && cl_balance > 0) {
      conditionalLeaveType = 'CL';
    } else if (conditionalLeaveType === 'EL' && el_balance > 0) {
      conditionalLeaveType = 'EL';
    } else {
      conditionalLeaveType = 'LOP';
      lopMessage = "You do not have sufficient leave balance. Your leave will be marked as LOP (Loss of Pay).";
    }

    // Check for overlapping leave applications
    const overlapCheckQuery = `
      SELECT * FROM crm_dev_db.cor_leave_m 
      WHERE emp_id = '${empID}' 
      AND (
        (start_date <= '${fromDate}' AND end_date >= '${fromDate}') OR
        (start_date <= '${toDate}' AND end_date >= '${toDate}') OR
        (start_date >= '${fromDate}' AND end_date <= '${toDate}')
      )`;

    sql.query(overlapCheckQuery, (err, res) => {
      if (err) {
        console.log(err);
        result({ error: true, data: "Something Went Wrong" });
        return;
      }

      if (res.length > 0) {
        result({ error: true, data: "Leave already applied for the selected dates" });
        return;
      }

      // Insert leave application with the determined leave type
      const insertLeaveQuery = `
        INSERT INTO crm_dev_db.cor_leave_m 
          (emp_id, reporting_to, leave_type, start_date, end_date, leave_days, leave_reason, enter_by, enter_date)
        VALUES 
          ('${empID}', '${rpPerson}', '${conditionalLeaveType}', '${fromDate}', '${toDate}', '${numofdays}', '${leavereason}', '${enterBy}', sysdate())`;

      sql.query(insertLeaveQuery, (err, insertRes) => {
        if (err) {
          console.log(err);
          result({ error: true, data: "Something Went Wrong" });
          return;
        }

        // Provide appropriate response message
        result({
          error: false,
          data: insertRes,
          msg: lopMessage
            ? lopMessage + " Leave application submitted successfully."
            : "Leave application submitted successfully.",
        });
      });
    });
  });
};









attendance.LeaveCount = (req, result) => {
  sql.query(`SELECT sum(leave_days) as leaveTake FROM romsondb.cor_leave_m where emp_id='${req.body.empid}'  AND YEAR(enter_date) = YEAR(CURRENT_DATE());`,
    (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result(res)
    });
};





// attendance.attandance_count = (req, result) => {
//   const punchDate = req.query.punch_date; // Date parameter
//   const empId = req.query.emp_id; // Employee ID parameter (optional)

//   var user = JSON.parse(req.headers.authorization);

//   if (user.role == 1) {

//     // Base query
//     let query = `
//       SELECT 
//         -- Generate fixed unique ID for absent records
//         CASE 
//           WHEN a.attendance_id IS NOT NULL THEN a.attendance_id
//           ELSE CONCAT('A-', LPAD(CONV(FLOOR(RAND() * 10000), 10, 36), 4, '0')) -- Random ID for absent records (not fixed)
//         END AS attendance_id,

//         d.punch_date, 
//         IFNULL(TIME(a.punch_in), '00:00:00') AS punch_in_time,
//         IFNULL(TIME(a.punch_out), '00:00:00') AS punch_out_time,
//         e.emp_id,
//         e.emp_code, 
//         e.user_name,

//         CASE
//           WHEN e.emp_code BETWEEN 'D001' AND 'D999' THEN 'RGPL'
//           WHEN e.emp_code BETWEEN 'D1000' AND 'D1999' THEN 'Romsons Medsource'
//           WHEN e.emp_code LIKE 'R1%' OR e.emp_code LIKE 'R500%' THEN 'RGPL'
//           WHEN e.emp_code BETWEEN 'MS001' AND 'MS999' THEN 'Romsons Medsource'
//           WHEN e.emp_code BETWEEN 'R0001' AND 'R9999' THEN 'RPPL'
//           WHEN e.emp_code BETWEEN 'RX01' AND 'RX099' THEN 'RENNEX MEDICAL'
//           ELSE 'Unknown'
//         END AS company_name,

//         CASE
//           WHEN a.leave_status = 2 THEN 'L'
//           WHEN a.leave_status = 1 THEN 'A'
//           WHEN a.status = 1 THEN 'P'
//           WHEN a.status IS NULL THEN 'A'
//           ELSE 'A'
//         END AS attendance_status,

//         CASE 
//           WHEN a.leave_status = 2 THEN IF(l.leave_type = 'CL', 'CL', IF(l.leave_type = 'EL', 'EL', '0'))
//           ELSE '0'
//         END AS leave_type,

//         IF(a.status = 1 AND a.punch_in IS NOT NULL AND a.punch_out IS NOT NULL, 
//           TIMESTAMPDIFF(HOUR, a.punch_in, a.punch_out), 
//           0
//         ) AS total_hours
//       FROM 
//         (SELECT ? AS punch_date) d
//       LEFT JOIN 
//         romsondb.cor_emp_m e ON 1 = 1
//       LEFT JOIN 
//         romsondb.cor_attendance_m a ON e.emp_id = a.emp_id AND a.punch_date = d.punch_date
//       LEFT JOIN 
//         romsondb.cor_leave_m l ON e.emp_id = l.emp_id AND l.start_date = d.punch_date
//     `;

//     // Filter by employee ID if provided
//     if (empId) {
//       query += ` WHERE e.emp_id = ?`;
//     }

//     // Execute the query
//     const queryParams = empId ? [punchDate, empId] : [punchDate];

//     sql.query(query, queryParams, (err, res) => {
//       if (err) {
//         console.error("Query Error: ", err);
//         result({ error: true, data: "Something Went Wrong" });
//       } else {
//         // Generate a fixed unique ID for each absent record
//         const fixedIdResults = res.map(record => {
//           if (record.attendance_status === 'A') {
//             // Generate a fixed unique ID
//             record.attendance_id = crypto.createHash('md5').update(record.emp_id + record.punch_date).digest('hex').substring(0, 10).toUpperCase();
//           }
//           return record;
//         });

//         console.log("Query Results: ", fixedIdResults);
//         result(fixedIdResults);
//       }
//     });
//   }
// };





















































// attendance.attandance_count = (req, result) => {
//   const punchDate = req.query.punch_date; // Date parameter (YYYY-MM-DD)
//   const empId = req.query.emp_id; // Employee ID parameter (optional)

//   var user = JSON.parse(req.headers.authorization);

//   if (user.role == 1) {
//     // Base query
//     let query = `
//       SELECT 
//         a.attendance_id,
//         d.punch_date, 
//         IFNULL(TIME(a.punch_in), '00:00:00') AS punch_in_time,
//         IFNULL(TIME(a.punch_out), '00:00:00') AS punch_out_time,
//         e.emp_id,
//         TRIM(e.emp_code) AS emp_code, -- Trim whitespace from emp_code
//         TRIM(e.user_name) AS user_name, -- Trim whitespace from user_name

//         -- Ensure all RX prefixed codes map to RENNEX MEDICAL
//         COALESCE(
//           CASE
//             WHEN e.emp_code BETWEEN 'D0001' AND 'D9999' THEN 'RGPL'
//             WHEN e.emp_code BETWEEN 'R01' AND 'R99' THEN 'RGPL'
//             WHEN e.emp_code BETWEEN 'MS001' AND 'MS999' THEN 'Romsons Medsource'
//             WHEN e.emp_code LIKE 'RP%' THEN 'RPPL'
//             WHEN e.emp_code BETWEEN 'RX001' AND 'RX999' THEN 'RENNEX MEDICAL'
//           END,
//           'Unknown'
//         ) AS company_name,

//         CASE
//           WHEN a.leave_status = 2 THEN 'L'
//           WHEN a.leave_status = 1 THEN 'A'
//           WHEN a.status = 1 AND a.punch_out IS NULL THEN 'A'
//           WHEN a.status = 1 THEN 'P'
//           WHEN a.status IS NULL THEN 'A'
//           ELSE 'A'
//         END AS attendance_status,

//         CASE 
//           WHEN a.leave_status = 2 THEN IF(l.leave_type = 'CL', 'CL', IF(l.leave_type = 'EL', 'EL', '0'))
//           ELSE '0'
//         END AS leave_type,

//         IF(a.status = 1 AND a.punch_in IS NOT NULL AND a.punch_out IS NOT NULL, 
//           TIMESTAMPDIFF(HOUR, a.punch_in, a.punch_out), 
//           0
//         ) AS total_hours
//       FROM 
//         (SELECT ? AS punch_date) d
//       LEFT JOIN 
//         romsondb.cor_emp_m e ON 1 = 1
//       LEFT JOIN 
//         romsondb.cor_attendance_m a ON e.emp_id = a.emp_id AND a.punch_date = d.punch_date
//       LEFT JOIN 
//         romsondb.cor_leave_m l ON e.emp_id = l.emp_id AND l.start_date = d.punch_date
//       WHERE 
//         e.status = 'A'  -- Only fetch active users
//       GROUP BY 
//         a.attendance_id  -- Ensure only unique attendance IDs are included
//     `;

//     if (empId) {
//       query += ` AND e.emp_id = ?`; // Add to existing WHERE clause
//     }

//     const queryParams = empId ? [punchDate, empId] : [punchDate];

//     sql.query(query, queryParams, (err, res) => {
//       if (err) {
//         console.error("Query Error: ", err);
//         result({ error: true, data: "Something Went Wrong" });
//       } else {
//         const convertedResults = res.map(record => {
//           if (record.punch_in_time !== '00:00:00') {
//             record.punch_in_time = moment
//               .tz(record.punch_in_time, 'HH:mm:ss', 'GMT')
//               .tz('Asia/Kolkata')
//               .format('h:mm A');
//           }

//           if (record.punch_out_time !== '00:00:00') {
//             record.punch_out_time = moment
//               .tz(record.punch_out_time, 'HH:mm:ss', 'GMT')
//               .tz('Asia/Kolkata')
//               .format('h:mm A');
//           }

//           record.emp_code = record.emp_code ? record.emp_code.trim() : record.emp_code;

//           if (record.attendance_status === 'A' && !record.attendance_id) {
//             const fixedPrefix = '100';
//             const uniqueKey = `${record.emp_id}-${punchDate}`;
//             const hash = crypto.createHash('sha256')
//               .update(uniqueKey)
//               .digest('hex');
//             const uniqueSuffix = Math.abs(parseInt(hash.slice(-5), 16)) % 100000;
//             record.attendance_id = fixedPrefix * 100000 + uniqueSuffix;
//           }

//           return record;
//         });

//         console.log("Query Results: ", convertedResults);
//         result({
//           error: false,
//           data: convertedResults
//         });
//       }
//     });
//   }
// };



// attendance.attandance_count = (req, result) => {
//   const punchDate = req.query.punch_date; // Date parameter (YYYY-MM-DD)
//   const empId = req.query.emp_id; // Employee ID parameter (optional)

//   const user = JSON.parse(req.headers.authorization);

//   if (user.role === 1) {
//     let query = `
//       SELECT 
//         IFNULL(a.attendance_id, NULL) AS attendance_id,
//         d.punch_date, 
//         COALESCE(TIME(a.punch_in), '00:00:00') AS punch_in_time,
//         COALESCE(TIME(a.punch_out), '00:00:00') AS punch_out_time,
//         e.emp_id,
//         TRIM(e.emp_code) AS emp_code, 
//         TRIM(e.user_name) AS user_name, 

//         'RGPL' AS company_name,

//         CASE 
//          WHEN e.state_id = 39 AND DAYOFWEEK(d.punch_date) = 7 AND a.punch_in IS NULL AND a.punch_out IS NULL THEN 'WEO' 
//           WHEN DAYOFWEEK(d.punch_date) = 1 THEN 
//             CASE 
//               WHEN a.leave_status = 2 THEN 'L' -- Leave applied on Sunday
//               WHEN a.punch_in IS NULL AND a.punch_out IS NULL THEN 'WEO' 
//               ELSE 
//                 CASE 
//                   WHEN a.leave_status = 1 THEN 'A'
//                   WHEN a.status = 1 AND TIMESTAMPDIFF(HOUR, a.punch_in, a.punch_out) >= 8 THEN 'P' 
//                   WHEN a.status = 1 AND TIMESTAMPDIFF(HOUR, a.punch_in, a.punch_out) >= 4 THEN 'ABSHD' 
//                   ELSE 'A'
//                 END 
//             END
//           ELSE 
//             CASE 
//               WHEN a.leave_status = 2 THEN 'L'
//               WHEN a.leave_status = 1 THEN 'A'
//               WHEN a.status = 1 AND TIMESTAMPDIFF(HOUR, a.punch_in, a.punch_out) >= 8 THEN 'P' 
//               WHEN a.status = 1 AND TIMESTAMPDIFF(HOUR, a.punch_in, a.punch_out) >= 4 THEN 'ABSHD' 
//               ELSE 'A'
//             END
//         END AS attendance_status,

//         CASE 
//           WHEN a.leave_status = 2 THEN 
//             COALESCE(l.leave_type, '0')  
//           ELSE 
//             '0'  
//         END AS leave_type,

//         IF(a.status = 1 AND a.punch_in IS NOT NULL AND a.punch_out IS NOT NULL, 
//           TIMESTAMPDIFF(HOUR, a.punch_in, a.punch_out), 
//           0
//         ) AS total_hours
//       FROM 
//         (SELECT ? AS punch_date) d
//       LEFT JOIN 
//         crm_dev_db.cor_emp_m e ON 1 = 1
//       LEFT JOIN 
//         crm_dev_db.cor_attendance_m a ON e.emp_id = a.emp_id AND a.punch_date = d.punch_date
//       LEFT JOIN 
//         crm_dev_db.cor_leave_m l ON e.emp_id = l.emp_id 
//         AND l.start_date <= d.punch_date 
//         AND (l.end_date >= d.punch_date OR l.end_date IS NULL)
//       WHERE 
//         e.status = 'A'
//     `;

//     if (empId) {
//       query += ` AND e.emp_id = ?`;
//     }

//     const queryParams = empId ? [punchDate, empId] : [punchDate];

//     sql.query(query, queryParams, (err, res) => {
//       if (err) {
//         console.error("Query Error: ", err);
//         result({ error: true, message: "Failed to fetch attendance data" });
//         return;
//       }

//       const convertedResults = res.map(record => {
//         // Convert punch-in and punch-out times
//         if (record.punch_in_time !== '00:00:00') {
//           record.punch_in_time = moment
//             .tz(record.punch_in_time, 'HH:mm:ss', 'GMT')
//             .tz('Asia/Kolkata')
//             .format('h:mm A');
//         }

//         if (record.punch_out_time !== '00:00:00') {
//           record.punch_out_time = moment
//             .tz(record.punch_out_time, 'HH:mm:ss', 'GMT')
//             .tz('Asia/Kolkata')
//             .format('h:mm A');
//         }

//         // Ensure consistent format for attendance_id
//         if (!record.attendance_id) {
//           const fixedPrefix = '100';
//           const uniqueKey = `${record.emp_id}-${record.punch_date}`;
//           const hash = crypto.createHash('sha256')
//             .update(uniqueKey)
//             .digest('hex');
//           const uniqueSuffix = Math.abs(parseInt(hash.slice(-5), 16)) % 100000;
//           record.attendance_id = `${fixedPrefix}${String(uniqueSuffix).padStart(5, '0')}`;
//         }

//         return record;
//       });

//       result({ error: false, data: convertedResults });
//     });
//   } else {
//     result({ error: true, message: "Unauthorized access" });
//   }
// };


attendance.attandance_count = (req, result) => {
  const punchDate = req.query.punch_date; // Date parameter (YYYY-MM-DD)
  const empId = req.query.emp_id; // Employee ID parameter (optional)

  const user = JSON.parse(req.headers.authorization);

  if (user.role === 1) {
    let query = `
     SELECT 
        IFNULL(a.attendance_id, NULL) AS attendance_id,
        d.punch_date, 
        COALESCE(TIME(a.punch_in), '00:00:00') AS punch_in_time,
        COALESCE(TIME(a.punch_out), '00:00:00') AS punch_out_time,
        e.emp_id,
        TRIM(e.emp_code) AS emp_code, 
        TRIM(e.user_name) AS user_name, 
        'RGPL' AS company_name,

        -- Attendance status logic with WEO and PHY
        CASE
        WHEN h.date IS NOT NULL AND DAYOFWEEK(h.date) = 1 AND a.punch_in IS NULL AND a.punch_out IS NULL THEN 'WEO' -- Holiday on Sunday without punch-in/out
            WHEN h.date IS NOT NULL AND a.punch_in IS NULL AND a.punch_out IS NULL THEN 'PHY' -- Holiday without punch-in/out
WHEN a.leave_status = 2 THEN 'L' -- Leave applied
    WHEN a.leave_status = 1 THEN 'A' -- Absent
            WHEN e.state_id = 39 AND DAYOFWEEK(d.punch_date) = 7 AND a.punch_in IS NULL AND a.punch_out IS NULL THEN 'WEO' -- Saturday weekly off for specific state
            WHEN DAYOFWEEK(d.punch_date) = 1 AND a.punch_in IS NULL AND a.punch_out IS NULL THEN 'WEO' -- Sunday weekly off
            WHEN a.punch_in IS NULL AND a.punch_out IS NULL THEN 'A' -- Absent on non-holiday
            WHEN a.status = 1 AND TIMESTAMPDIFF(HOUR, a.punch_in, a.punch_out) >= 8 THEN 'P' -- Present for full day
            WHEN a.status = 1 AND TIMESTAMPDIFF(HOUR, a.punch_in, a.punch_out) >= 4 THEN 'ABSHD' -- Half-day absent
            ELSE 'A' -- Default absent
        END AS attendance_status,

        -- Leave type logic
        CASE 
            WHEN a.leave_status = 2 THEN COALESCE(l.leave_type, '0')  
            ELSE '0'  
        END AS leave_type,

        -- Total hours worked
        IF(a.status = 1 AND a.punch_in IS NOT NULL AND a.punch_out IS NOT NULL, 
            TIMESTAMPDIFF(HOUR, a.punch_in, a.punch_out), 
            0
        ) AS total_hours

     FROM 
        (SELECT ? AS punch_date) d
     LEFT JOIN 
        crm_dev_db.cor_emp_m e ON 1 = 1
     LEFT JOIN 
        crm_dev_db.cor_attendance_m a ON e.emp_id = a.emp_id AND a.punch_date = d.punch_date
     LEFT JOIN 
        crm_dev_db.cor_leave_m l ON e.emp_id = l.emp_id 
        AND l.start_date <= d.punch_date 
        AND (l.end_date >= d.punch_date OR l.end_date IS NULL)
     LEFT JOIN
        crm_dev_db.holiday_m h ON FIND_IN_SET(e.state_id, h.state_id) > 0
  AND h.date = d.punch_date
     WHERE 
        e.status = 'A'
    `;

    if (empId) {
      query += ` AND e.emp_id = ?`;
    }

    const queryParams = empId ? [punchDate, empId] : [punchDate];

    sql.query(query, queryParams, (err, res) => {
      if (err) {
        console.error("Query Error: ", err);
        result({ error: true, message: "Failed to fetch attendance data" });
        return;
      }

      const convertedResults = res.map(record => {
        // Convert punch-in and punch-out times
        if (record.punch_in_time !== '00:00:00') {
          record.punch_in_time = moment
            .tz(record.punch_in_time, 'HH:mm:ss', 'GMT')
            .tz('Asia/Kolkata')
            .format('h:mm A');
        }

        if (record.punch_out_time !== '00:00:00') {
          record.punch_out_time = moment
            .tz(record.punch_out_time, 'HH:mm:ss', 'GMT')
            .tz('Asia/Kolkata')
            .format('h:mm A');
        }

        // Ensure consistent format for attendance_id
        if (!record.attendance_id) {
          const fixedPrefix = '100';
          const uniqueKey = `${record.emp_id}-${record.punch_date}`;
          const hash = crypto.createHash('sha256')
            .update(uniqueKey)
            .digest('hex');
          const uniqueSuffix = Math.abs(parseInt(hash.slice(-5), 16)) % 100000;
          record.attendance_id = `${fixedPrefix}${String(uniqueSuffix).padStart(5, '0')}`;
        }

        return record;
      });

      result({ error: false, data: convertedResults });
    });
  } else {
    result({ error: true, message: "Unauthorized access" });
  }
};




// attendance.punchInOutTime = (req, result) => {
//   sql.query(`
//     SELECT 
//     DATE_FORMAT(CONVERT_TZ(punch_in, '+00:00', '+05:30'), '%h:%i %p') AS punch_in,
//     DATE_FORMAT(CONVERT_TZ(punch_out, '+00:00', '+05:30'), '%h:%i %p') AS punch_out
// FROM crm_dev_db.cor_attendance_m 
// WHERE emp_id = '${req.body.empidd}' 
// AND (
//     DATE(CONVERT_TZ(punch_in, '+00:00', '+05:30')) = DATE(CONVERT_TZ(NOW(), '+00:00', '+05:30'))
//     OR DATE(CONVERT_TZ(punch_out, '+00:00', '+05:30')) = DATE(CONVERT_TZ(NOW(), '+00:00', '+05:30'))
// );

  
//   `, (err, res) => {
    
//     console.log("Result Data: ", res);

//     if (err) {
//       result({ error: true, data: "Something Went Wrong" });
//     } else {
//       result({ error: false, data: res });
//     }
//   });
// };


attendance.punchInOutTime = (req, result) => {
  sql.query(`
    SELECT 
      DATE_FORMAT(CONVERT_TZ(punch_in, '+00:00', '+05:30'), '%h:%i %p') AS punch_in,
      DATE_FORMAT(CONVERT_TZ(punch_out, '+00:00', '+05:30'), '%h:%i %p') AS punch_out,
      TIMESTAMPDIFF(HOUR, punch_in, punch_out) AS total_hours
    FROM crm_dev_db.cor_attendance_m 
    WHERE emp_id = '${req.body.empidd}' 
    AND (
      DATE(CONVERT_TZ(punch_in, '+00:00', '+05:30')) = DATE(CONVERT_TZ(NOW(), '+00:00', '+05:30'))
      OR DATE(CONVERT_TZ(punch_out, '+00:00', '+05:30')) = DATE(CONVERT_TZ(NOW(), '+00:00', '+05:30'))
    );
  `, (err, res) => {
    
    console.log("Result Data: ", res);

    if (err) {
      result({ error: true, data: "Something Went Wrong" });
    } else {
      result({ error: false, data: res });
    }
  });
};



attendance.shiftDetails = (req, result) => {
  sql.query(`
    SELECT 
    DATE_FORMAT(start_time, '%h:%i %p') AS start_time,
    DATE_FORMAT(end_time, '%h:%i %p') AS end_time,
    DATE_FORMAT(grace_start_time, '%h:%i %p') AS grace_start_time,
    DATE_FORMAT(grace_end_time, '%h:%i %p') AS grace_end_time,
    DATE_FORMAT(late_start_coming, '%h:%i %p') AS late_start_coming,
    DATE_FORMAT(late_end_coming, '%h:%i %p') AS late_end_coming
FROM 
    crm_dev_db.cor_shift_m;
  `, (err, res) => {
    
    console.log("Result Data: ", res);

    if (err) {
      result({ error: true, data: "Something Went Wrong" });
    } else {
      result({ error: false, data: res });
    }
  });
};







attendance.attandance_summary = (req, result) => {
  const empId = req.query.emp_id; // Employee ID parameter

  
  const query = `
    SELECT 
      DATE_FORMAT(CONVERT_TZ(punch_in, '+00:00', '+05:30'), '%l:%i %p') AS punch_in_time,  -- punch_in in AM/PM format
      DATE_FORMAT(CONVERT_TZ(punch_out, '+00:00', '+05:30'), '%l:%i %p') AS punch_out_time,  -- punch_out in AM/PM format
      TIMESTAMPDIFF(HOUR, 
        CONVERT_TZ(punch_in, '+00:00', '+05:30'), 
        CONVERT_TZ(punch_out, '+00:00', '+05:30')
      ) AS total_hours -- Total hours worked
    FROM 
      crm_dev_db.cor_attendance_m
    WHERE 
      emp_id = ?
      AND DATE(CONVERT_TZ(punch_in, '+00:00', '+05:30')) = CURDATE()
      AND punch_in IS NOT NULL 
      AND punch_out IS NOT NULL;
  `;

  // Execute the query
  sql.query(query, [empId], (err, res) => {
    if (err) {
      console.error("Query Error: ", err);
      result({ error: true, data: "Something Went Wrong" });
    } else {
      result({
        error: false,
        data: res
      });
    }
  });
};





attendance.leave_history = (req, result) => {
  const empId = req.query.emp_id; // Employee ID parameter (optional)
  console.log(empId, "[]]]]]]]]]]");

  // Base query to fetch leave details
  let query = `
   SELECT 
    sm.emp_id,
    
    -- CL Leave Details
    COALESCE(SUM(CASE WHEN lm.leave_type = 'CL' THEN lm.leave_days ELSE 0 END), 0) AS cl_availed,
    COALESCE(MAX(CASE WHEN sm.leave_type = 'CL' THEN sm.leave_count ELSE 0 END), 0) AS cl_allocated,
    GREATEST(
        COALESCE(MAX(CASE WHEN sm.leave_type = 'CL' THEN sm.leave_count ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN lm.leave_type = 'CL' THEN lm.leave_days ELSE 0 END), 0),
        0
    ) AS cl_balance,
    
    -- EL Leave Details
    COALESCE(SUM(CASE WHEN lm.leave_type = 'EL' THEN lm.leave_days ELSE 0 END), 0) AS el_availed,
    COALESCE(MAX(CASE WHEN sm.leave_type = 'EL' THEN sm.leave_count ELSE 0 END), 0) AS el_allocated,
    GREATEST(
        COALESCE(MAX(CASE WHEN sm.leave_type = 'EL' THEN sm.leave_count ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN lm.leave_type = 'EL' THEN lm.leave_days ELSE 0 END), 0),
        0
    ) AS el_balance,
    
    -- SL Leave Details (Added SL Logic)
    COALESCE(SUM(CASE WHEN lm.leave_type = 'SL' THEN lm.leave_days ELSE 0 END), 0) AS sl_availed,
    COALESCE(MAX(CASE WHEN sm.leave_type = 'SL' THEN sm.leave_count ELSE 0 END), 0) AS sl_allocated,
    GREATEST(
        COALESCE(MAX(CASE WHEN sm.leave_type = 'SL' THEN sm.leave_count ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN lm.leave_type = 'SL' THEN lm.leave_days ELSE 0 END), 0),
        0
    ) AS sl_balance,

    -- Total Allocated Leave (Including SL)
    COALESCE(MAX(CASE WHEN sm.leave_type = 'CL' THEN sm.leave_count ELSE 0 END), 0) +
    COALESCE(MAX(CASE WHEN sm.leave_type = 'EL' THEN sm.leave_count ELSE 0 END), 0) +
    COALESCE(MAX(CASE WHEN sm.leave_type = 'SL' THEN sm.leave_count ELSE 0 END), 0) AS total_allocated_leave

FROM 
    crm_dev_db.cor_leave_summary sm
LEFT JOIN 
    crm_dev_db.cor_leave_m lm 
ON 
    sm.emp_id = lm.emp_id 
    AND sm.leave_type = lm.leave_type
    AND YEAR(lm.enter_date) = YEAR(CURRENT_DATE())  -- Filter on enter_date for current year
WHERE 
    sm.emp_id = ?
GROUP BY 
    sm.emp_id;
`;

  // Check if empId exists and pass it as a parameter
  const queryParams = [empId];

  sql.query(query, queryParams, (err, res) => {
    if (err) {
      console.error("Query Error: ", err);
      result({ error: true, data: "Something Went Wrong" });
    } else {
      result({
        error: false,
        data: res
      });
    }
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


///for select leave type

attendance.LeaveType = (req, result) => {
  sql.query(`select leave_type,leave_description from crm_dev_db.cor_leave_type`, (err, res) => {
    // console.log("osbss: ", res);
    if (err) {
      result({ error: true, data: "Something Went Wrong" })
    }
    result({ error: false, data: res })
  });
};



attendance.HolidayList = (req, result) => {
  const query = `
    SELECT 
      h.year,
      h.date,
      DAYNAME(h.date) AS day_name,  -- DAYNAME returns the correct day name for the date
      h.holiday_name,
      h.holiday_type,
      h.state_id
    FROM 
      crm_dev_db.holiday_m h
    INNER JOIN 
      crm_dev_db.cor_emp_m e ON FIND_IN_SET(e.state_id, h.state_id) > 0
    WHERE 
      e.emp_id = '${req.body.empId}'  -- Replace dynamically with the logged-in employee ID
      AND h.year = '${req.body.year}'  -- Replace dynamically with the selected year
    ORDER BY 
      h.date;
  `;

  sql.query(query, (err, res) => {
    if (err) {
      console.error("Error executing query:", err);
      return result({ error: true, data: "Something Went Wrong" });
    }
    return result({ error: false, data: res });
  });
};







module.exports = attendance;