const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const user = function (aa) {
  this.title = aa.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List User>
*/

user.listUsers = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 100;
  const assignStatus = req.query.filter_assign_status ? req.query.filter_assign_status : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "beat_count";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";

  var querySearch = '';
  var queryWhere = 'where  e.deleted_at is null ';
  var total = 0;

  if (search) {

    columnSearch = [
      'e.emp_id',
      'e.user_name',
      'e.email',
      'e.phone_number',
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (assignStatus) {
    var queryStatus = ` e.status = '${assignStatus}'`
  } else {
    var queryStatus = ``
  }

  var querySort = ` ORDER BY ${sort}  ${order}`

  if (querySearch && queryStatus) {
    queryWhere += ` AND ${querySearch} AND ${queryStatus} `
  } else if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  } else if (queryStatus) {
    queryWhere += ` AND ${queryStatus} `
  } 


  queryWhere += " GROUP BY e.emp_id";
  queryWhere += querySort;

  console.log(`select e.emp_id as id,e.emp_id, e.user_name,e.email,e.phone_number,e.zone_id,e.Head_Quater_name AS head_quater_name,e.user_locked_date,dv.division_id, dv.division_name,
  (select count(b.beat_assigning_form_id) from cor_beat_m as b where b.beat_assigning_form_id = e.emp_id AND b.deleted_at is null AND b.status='A') AS beat_count              
  from cor_emp_m AS e
                LEFT JOIN cor_division_m AS dv ON e.division = dv.division_id
          ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);
  sql.query(`select e.emp_id as id,e.emp_id, e.user_name,e.email,e.phone_number,e.zone_id,e.Head_Quater_name AS head_quater_name,e.user_locked_date,dv.division_id, dv.division_name,
  (select count(b.beat_assigning_form_id) from cor_beat_m as b where b.beat_assigning_form_id = e.emp_id AND b.deleted_at is null AND b.status='A') AS beat_count              
  from cor_emp_m AS e
                LEFT JOIN cor_division_m AS dv ON e.division = dv.division_id
          ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
      // console.log("User Model- listUser ", res);
      total = await countTotalRows(`select count(emp_id) AS total from
                                 (select e.emp_id,
                                  (select count(b.beat_assigning_form_id) from cor_beat_m as b where b.beat_assigning_form_id = e.emp_id AND b.deleted_at is null AND b.status='A') AS beat_count
                                  from cor_emp_m AS e
                                  LEFT JOIN cor_division_m AS dv ON e.division = dv.division_id
                                  ${queryWhere} ) bb`);
      result(total, helper.checkDataRows(err, res));
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

module.exports = user;