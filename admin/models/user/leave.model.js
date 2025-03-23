const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const leave = function (aa) {
  this.title = aa.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Leave>
*/

leave.listLeaves = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "l.start_date";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";


  

  var user = JSON.parse(req.headers.authorization)

  var querySearch = '';
  var queryWhere = 'where l.deleted_at is NULL ';
  var total = 0;

  if (user.role == 1) {

  } else {

    queryWhere += ` AND e.emp_id in (WITH RECURSIVE subordinate AS (
      SELECT  emp_id,
       emp_code,
       reporting_to,
       0 AS level
       FROM cor_emp_m
       WHERE api_token = '${user.api_token}'
     UNION ALL
       SELECT  e.emp_id,
               e.emp_code,
         e.reporting_to,
               level + 1
       FROM cor_emp_m e
   JOIN subordinate s
   ON e.reporting_to = s.emp_id
   )
   SELECT 
     s.emp_id
   FROM subordinate s
   JOIN cor_emp_m m
   ON s.reporting_to = m.emp_id
   ORDER BY level)`

  }


  if (search) {

    columnSearch = [
      'l.emp_id',
      'e.user_name',
      'e.email',
      'e.phone_number',
      'e.Head_Quater_name',
      'dv.division_name',
      'ds.designation_name',
      'r.role_name',
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    queryWhere += ` AND l.status = '${status}'`
  }

  if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  }

  queryWhere += ` ORDER BY ${sort}  ${order}`

  
  sql.query(`select l.id,l.status,l.leave_type,l.start_date,l.end_date,l.leave_days,l.leave_reason,
             l.emp_id,emp_appr.user_name AS approval_name,l.approved_by,l.approved_date, e.user_name,e.email,e.phone_number,e.Head_Quater_name AS head_quater_name,
             rp.emp_id AS reporting_id, rp.user_name AS reporting_name from cor_leave_m AS l
             LEFT JOIN cor_emp_m AS e ON l.emp_id  = e.emp_id          
             LEFT JOIN cor_emp_m AS rp ON e.reporting_to  = rp.emp_id 
             LEFT JOIN cor_emp_m AS emp_appr ON l.approved_by  = emp_appr.emp_id 
          ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
      // console.log("Leave Model- listLeave ", res);
      total = await countTotalRows(`select count(*) AS total from cor_leave_m AS l
                                    LEFT JOIN cor_emp_m AS e ON l.emp_id  = e.emp_id          
                                    LEFT JOIN cor_emp_m AS rp ON e.reporting_to  = rp.emp_id 
                                  ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <02-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Leave>
*/

leave.getLeave = (id, result) => {

  sql.query(`select e.emp_id as id,e.emp_id,e.zone_id, e.user_name,e.email,e.phone_number,e.status,e.Head_Quater_name AS head_quater_name,
  dv.division_id, dv.division_name, ds.designation_id, ds.designation_name, r.role_id, r.role_name, rp.emp_id AS reporting_id, rp.user_name AS reporting_name 
  from cor_emp_m AS e
  LEFT JOIN cor_division_m AS dv ON e.division = dv.division_id
  LEFT JOIN cor_designation_m AS ds  ON e.designation = ds.designation_id
  LEFT JOIN cor_role_m AS r ON e.role = r.role_id
  LEFT JOIN cor_emp_m AS rp ON e.reporting_to  = rp.emp_id  where e.emp_id=${id}`,
    (err, res) => {

      result(helper.checkDataRow(err, res))
    });
}


/*Leave
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Leave>
*/

leave.updateLeave = (idData, data, result) => {

  updateQuery = helper.updateQuery(idData, data, 'cor_leave_m')
  console.log('updateQuery  ==================', updateQuery);
  sql.query(updateQuery,
    (err, res) => {

      if (res && res.affectedRows == 1) {
        data = {
          error: false,
          message: 'Data updated successfully.'
        }
      } else {
        data = {
          error: true,
          message: err.message
        }
      }

      result(data);
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Save Leave>
*/

leave.saveLeave = (data, result) => {

  insertData = helper.insertFunction(data)


  console.log('insertQuery  ==================', `INSERT INTO cor_leave_m  (emp_id,${insertData.keys}) VALUES (all_auto_no(11), ${insertData.values})`);
  sql.query(`INSERT INTO cor_leave_m (emp_id,${insertData.keys}) VALUES (all_auto_no(11), ${insertData.values})`,
    (err, res) => {

      if (res && res.affectedRows == 1) {
        response = {
          error: false,
          message: 'Data inserted successfully.'
        }
      } else {
        response = {
          error: true,
          message: err.message
        }
      }

      result(response);
    });
};


const countTotalRows = (query) => {
  console.log(query);
  try {
    return new Promise((resolve, reject) => {
      sql.query(
        query,
        (err, result) => {
          if (err) {
            reject(0)
          } else {
            if (result) {
              resolve(result[0].total)
            } else {
              reject(0)
            }
          };
        })
    })
  } catch (error) {
    console.log(error);
  }
}

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Change status Leave>
*/

leave.statusLeave = (idData, data, result) => {

  console.log(`select * from cor_leave_m  where ${idData.key}='${idData.value}'`);

  sql.query(`select * from cor_leave_m  where ${idData.key}='${idData.value}'`,
    (err, res) => {
      console.log(res);
      if (res.length > 0) {
        console.log('res[0].status ', res[0].status);
        if (res[0].status == 1) {

          var emp_id = res[0].emp_id;
          var s = res[0].start_date;
          var e = res[0].end_date;
          var leave_type = res[0].leave_type;

          var getDaysArray = function (s, e) { for (var a = [], d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) { a.push(new Date(d)); } return a; };
          var daysArray = getDaysArray(s, e);

          for (let i = 0; i < daysArray.length; i++) {

            var DataArray = {
              "emp_id": emp_id,
              "shift": 'D',
              "punch_date": helper.dateFormat(daysArray[i]),
              "status": data.status,
              "leave_type": leave_type,
              "leave_status": 2,
              "holiday_status": -1,
              'enter_by': 1,//req.body.leave_id,
              'enter_date': helper.dateTime(),
            }

            insertData = helper.insertFunction(DataArray)

            console.log('insertQuery  ==================', `INSERT INTO cor_attendance_m  (attendance_id,${insertData.keys}) VALUES ((select all_auto_no(55)),(select all_auto_no(33)) AS auto1, ${insertData.values})`);
            sql.query(`INSERT INTO cor_attendance_m (attendance_id,${insertData.keys}) VALUES ( (select all_auto_no('55')), ${insertData.values})`,

              // insertQuery = helper.insertQuery(DataArray, 'cor_attendance_m')
              // console.log('insertQuery  ==================', insertQuery);
              // sql.query(insertQuery,
              (err, res) => {

                // if (res && res.affectedRows == 1) {
                //   response = {
                //     error: true,
                //     message: 'Data inserted successfully.'
                //   }

                // } else {
                //   response = {
                //     error: true,
                //     message: err.message
                //   }
                // }
              });

          }

          updateQuery = helper.updateQuery(idData, data, 'cor_leave_m')
          console.log('updateQuery  ==================', updateQuery);
          sql.query(updateQuery,
            (err, res) => {

              if (res && res.affectedRows == 1) {
                result({
                  error: false,
                  message: 'Leave updated successfully.'
                })
              } else {
                result({
                  error: true,
                  message: err
                })
              }
            });//end update leave
        } else {
          result({
            error: true,
            message: 'Approval process done.'
          })
        }
      } else {
        result({
          error: true,
          message: err.message
        })
      }
    });
}

module.exports = leave;
