const sql = require("../db.js");
const helper = require("../../helper/helper.js");
var moment = require('moment');

// constructor
const attendance = function (osbs) {
  this.title = osbs.title;
  this.description = osbs.description;
  this.published = osbs.published;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Attendance>
*/

attendance.listAttendance = (req, result) => {

  const currentDate = moment().format("YYYY-MM-DD");

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 200;
  const start = ((page - 1) * perPage);
  var sort = req.query.sort || "e.emp_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";
  const punchdate = req.query.filter_punchdate || currentDate;
  const punch_status = req.query.filter_punch_status || 1;

  const startDate = req.query.filter_startdate ? req.query.filter_startdate : helper.date();
  const endDate = req.query.filter_enddate ? req.query.filter_enddate : '';

  var querySearch = '';
  var queryWhere = 'where e.deleted_at is null AND e.status="A"';
  var total = 0;
  var join = '';

  var user = JSON.parse(req.headers.authorization)
  // var reportingWhereCondition = '';
  // var reportingLeftJoin = '';
  // var conditionWhere = '';
  
  if (user.role == 1) {

   }else {

    queryWhere +=  ` AND e.emp_id in (WITH RECURSIVE subordinate AS (
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

  if(endDate != ''){
    // console.log(helper.dateFormat(startDate));
    // console.log(helper.dateFormat(endDate));
    var subQuery = ` punch_date BETWEEN '${helper.dateFormat(startDate)}' AND '${helper.dateFormat(endDate)}' `;
  }else{
    var subQuery =  ` punch_date='${helper.dateFormat(startDate)}'`
  }

  if (search) {

    columnSearch = [
      'e.user_name',
      'e.emp_id'
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  sort = sort == 'emp_id' ? 'e.emp_id' : sort;

  var querySort = ` ORDER BY ${sort}  ${order}`

  if(querySearch){
    queryWhere += ` AND ${querySearch}`;
  }
  // if(punchdate){
  //   queryWhere += ` `;
  // }

  if(punch_status == 1){
    //punch in
    join = `JOIN cor_attendance_m AS a ON e.emp_id = a.emp_id AND ${subQuery} `; //punch_date='${punchdate}'
  }else if(punch_status == 2){
    //not punch in
    join = `LEFT JOIN cor_attendance_m AS a ON e.emp_id = a.emp_id AND ${subQuery} `; //punch_date='${punchdate}' 
    queryWhere += ` AND a.punch_in is null`
  }else{
    //all
    join = `LEFT JOIN cor_attendance_m AS a ON e.emp_id = a.emp_id AND ${subQuery} `; //punch_date='${punchdate}'
  }


  queryWhere += querySort;

console.log(`select a.*, a.attendance_id as id, e.user_name,e.emp_id, e.emp_code from cor_emp_m AS e  
${join} 
${queryWhere}  LIMIT ${perPage} OFFSET ${start}`);

  sql.query(`select a.*, a.attendance_id as id, r.emp_id AS reporting_id,r.user_name AS reporting_name , e.user_name,e.emp_id, e.emp_code 
  from cor_emp_m AS e 
  LEFT JOIN  cor_emp_m  AS r ON  e.reporting_to = r.emp_id 
  ${join} 
  ${queryWhere}  LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
     // console.log("Attendance Model- listAttendance ", res);
      total = await countTotalRows(`select count(e.user_name) AS total from cor_emp_m AS e  
      ${join} 
  ${queryWhere} `);

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



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Save saveWeekOff>
*/

attendance.saveWeekOff = (req, result) => {

  var weekOffdate = ['2023-03-05','2023-03-12','2023-03-19','2023-03-26','2023-04-02','2023-04-09','2023-04-16','2023-04-23','2023-04-30','2023-05-07','2023-05-14','2023-05-21','2023-05-28','2023-06-04','2023-06-11','2023-06-18','2023-06-25','2023-07-02','2023-07-09','2023-07-16','2023-07-23','2023-07-30','2023-08-06','2023-08-13','2023-08-20','2023-08-27','2023-09-03','2023-09-10','2023-09-17','2023-09-24','2023-10-01','2023-10-08','2023-10-15','2023-10-22','2023-10-29','2023-11-05','2023-11-12','2023-11-19','2023-11-26','2023-12-03','2023-12-10','2023-12-17','2023-12-24','2023-12-31'];

 sql.query(`SELECT emp_id FROM cor_emp_m where deleted_at is null`,
   (err, res) => {
      
   if(res){
    res.map((item)=>{
     
      if(item.emp_id == 11000010 || item.emp_id ==  11000011 || item.emp_id ==  11000101){

      }else{
        console.log(item.emp_id);
        insertWeekOff(item.emp_id , weekOffdate)
      }
      
    })
   }

   result(res);
   

  });


};


function insertWeekOff(emp_id, weekOffdate){

  weekOffdate.map((date)=>{
    console.log('date ====='+date+" emp_id="+emp_id);

    sql.query(  `INSERT INTO cor_attendance_m(attendance_id,emp_id,shift,punch_date,enter_by,enter_date,leave_status,holiday_status,status) 
                            VALUES ( (select all_auto_no('55')), ${emp_id},'D','${date}',1,'${helper.dateTime()}','-1',2,-1 )`,

    (err, res) => {        
     
    });
  })

}

module.exports = attendance;
