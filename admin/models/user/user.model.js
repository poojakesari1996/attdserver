const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const user = function (aa) {
  this.title = aa.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List User>
*/

user.listUsers = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "e.emp_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";
  const divisionId = req.query.filter_division_id;
  const zoneId = req.query.filter_zone_id;
 

  var querySearch = '';
  var queryWhere = 'where  e.deleted_at is null ';
  var total = 0;
  var user = JSON.parse(req.headers.authorization);

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
      'e.emp_id',
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


  if(divisionId > 0){
    queryWhere += ` AND e.division = '${divisionId}'`
  }
  if(zoneId > 0){
    queryWhere += ` AND e.zone_id = '${zoneId}'`
  }

  if (status) {
    queryWhere += ` AND e.status = '${status}'`
  } 

  if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  } 
  queryWhere +=` ORDER BY ${sort}  ${order}`

  sql.query(`select z.zone_name,ss.state_name,e.city_id ,cc.city_name,cc.city_type, e.dealer_id, dd.dealer_name,e.zone_id, e.emp_id as id,e.emp_id,e.emp_code, e.user_name,e.email,e.phone_number,e.status,e.Head_Quater_name AS head_quater_name,e.user_locked_date,
            dv.division_id, dv.division_name, ds.designation_id, ds.designation_name, r.role_id, r.role_name,dp.department_id, dp.department_name, rp.emp_id AS reporting_id, rp.user_name AS reporting_name from cor_emp_m AS e
            LEFT JOIN cor_division_m AS dv ON e.division = dv.division_id
            LEFT JOIN cor_designation_m AS ds  ON e.designation = ds.designation_id
            LEFT JOIN cor_role_m AS r ON e.role = r.role_id
            LEFT JOIN cor_dealer_m AS dd ON e.dealer_id = dd.dealer_id
            LEFT JOIN cor_city_m AS cc ON e.city_id = cc.city_id
            LEFT JOIN cor_state_m AS ss ON e.state_id = ss.state_id
            LEFT JOIN cor_department_m AS dp ON e.department_id = dp.department_id
            LEFT JOIN cor_emp_m AS rp ON e.reporting_to  = rp.emp_id 
            LEFT JOIN cor_zone_m AS z ON e.zone_id = z.zone_id
          ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
      // console.log("User Model- listUser ", res);
      total = await countTotalRows(`select count(*) AS total from cor_emp_m AS e
                                    LEFT JOIN cor_division_m AS dv ON e.division = dv.division_id
                                    LEFT JOIN cor_designation_m AS ds  ON e.designation = ds.designation_id
                                    LEFT JOIN cor_role_m AS r ON e.role = r.role_id
                                    LEFT JOIN cor_dealer_m AS dd ON e.dealer_id = dd.dealer_id
                                    LEFT JOIN cor_city_m AS cc ON e.city_id = cc.city_id
                                    LEFT JOIN cor_state_m AS ss ON e.state_id = ss.state_id
                                    LEFT JOIN cor_department_m AS dp ON e.department_id = dp.department_id
                                    LEFT JOIN cor_zone_m AS z ON e.zone_id = z.zone_id
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
*@Description:      <get User>
*/

user.getUser = (id, result) => {

  sql.query(`select ss.state_id,ss.state_name,cc.city_id,cc.city_name, dd.dealer_id, dd.dealer_name,e.emp_id as id,e.emp_id,e.emp_code,e.zone_id, e.user_name,e.email,e.phone_number,e.status,e.Head_Quater_name AS head_quater_name,e.user_locked_date,
  dv.division_id, dv.division_name, ds.designation_id, ds.designation_name, r.role_id, r.role_name,dp.department_id, dp.department_name,rp.emp_id AS reporting_id, rp.user_name AS reporting_name 
  from cor_emp_m AS e
  LEFT JOIN cor_division_m AS dv ON e.division = dv.division_id
  LEFT JOIN cor_designation_m AS ds  ON e.designation = ds.designation_id
  LEFT JOIN cor_role_m AS r ON e.role = r.role_id
  LEFT JOIN cor_dealer_m AS dd ON e.dealer_id = dd.dealer_id
  LEFT JOIN cor_city_m AS cc ON e.city_id = cc.city_id
  LEFT JOIN cor_state_m AS ss ON e.state_id = ss.state_id
  LEFT JOIN cor_department_m AS dp ON e.department_id = dp.department_id
  LEFT JOIN cor_emp_m AS rp ON e.reporting_to  = rp.emp_id  where e.emp_id=${id}`,
    (err, res) => {

      result(helper.checkDataRow(err, res))
    });
}


/*User
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update User>
*/

user.updateUser = (idData, data, result) => {

  updateQuery = helper.updateQuery(idData, data, 'cor_emp_m')
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
*@Description:      <Save User>
*/

user.saveUser = (data, result) => {

  insertData = helper.insertFunction(data)


  console.log('insertQuery  ==================',   `INSERT INTO cor_emp_m  (emp_id,${insertData.keys}) VALUES (all_auto_no(11), ${insertData.values})`);
  sql.query(  `INSERT INTO cor_emp_m (emp_id,${insertData.keys}) VALUES (all_auto_no(11), ${insertData.values})`,
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
*@Description:      <Change status User>
*/

user.statusUser = (id, result) => {

  var data = {
    error: true,
  }
  var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, emp_id AS id FROM cor_emp_m where emp_id='${id}'`,
    (err, res) => {
      if (res) {
        if (res.length > 0) {
          if (res[0].status == "I") {
            status = "A"
          } else {
            status = "I"
          }

          sql.query(`UPDATE cor_emp_m SET status='${status}' WHERE emp_id=${id}`,
            (err, res) => {

              if (res && res.affectedRows == 1) {
                result({
                  error: false,
                  message: status == 'A' ? 'Data active successfully.' : 'Data inactive successfully.'
                });
              } else {
                result({ ...data, message: err });
              }
            });

        } else {
          result({ ...data, message: err });
        }

      } else {
        result({ ...data, message: err });
      }
    });


};


///////


user.uploadBulkUser = (field, result) => {
  var response =  {
    error:false,
    message:'Data inserted successfully.'
  };
  for (const [key, data] of Object.entries(field)) {
    insertQuery = helper.insertQuery(data,'cor_emp_m') 
    console.log('insertQuery  ==================', insertQuery);
      sql.query(insertQuery,
      (err, res) => {

        if(res && res.affectedRows==1){
          response =  {
            error:false,
            message:'Data inserted successfully.'
          }
        }else{
          response =  {
            error:true,
            message:err.message 
          }
        }
     
    
        });

      }
      result(response);
 
};


module.exports = user;
