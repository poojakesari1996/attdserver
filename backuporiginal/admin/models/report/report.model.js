const sql = require("../db.js");
const helper = require("../../helper/helper.js");


// constructor
const report = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <31-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List performanceSummary>
*/

report.performanceSummary = (req, result) => {

  //const page = req.query.page || 1;
  // const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  // const start = ((page - 1) * perPage);
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const sort = req.query.sort || "e.emp_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";
  const zoneId = req.params.zone_id ? req.query.zone_id : 0;
  const divisionId = req.params.division_id ? req.params.division_id : 0;
  const currentDate = req.params.current_date ? req.params.current_date : '';

  var querySearch = '';
  var queryWhere = 'where e.deleted_at is null AND e.status="A" ';
  var total = 0;

  if (search) {

    columnSearch = [
      'a.emp_id'
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  // date = '2023-03-30';
  // if (date) {
  //   queryWhere += ` AND punch_date='2023-03-30'`
  // }

  if (currentDate) {
    queryWhere += ` AND a.punch_date = '${currentDate}'`
  } else {
    queryWhere += ` AND a.punch_date = '${helper.date()}'`
  }

  if (querySearch) {
    queryWhere += ` AND ${querySearch} } `
  }



  var querySort = ` ORDER BY ${sort}  ${order}`

  queryWhere += querySort;

  console.log("ashad akjdakd================="+`select DATE_FORMAT(punch_date, "%d-%M-%Y") as punch_date,user_name,if(leave_status='-1',"Present","Leave") AS attendance_status,punch_in,punch_out from cor_attendance_m AS a
LEFT JOIN cor_emp_m as e ON a.emp_id=e.emp_id
${queryWhere}`);

  sql.query(`select punch_date,user_name,if(leave_status='-1',"Present","Leave") AS attendance_status,punch_in,punch_out from cor_attendance_m AS a
  LEFT JOIN cor_emp_m as e ON a.emp_id=e.emp_id
  ${queryWhere}`,
    async (err, res) => {
      // console.log("performanceSummaryModel- listperformanceSummary", res);
      result(helper.checkDataRows(err, res));
    });
};






/*
*@Author:           <Ramesh Kumar>
*@Created On:       <01-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List PerformanceSummary>
*/

report.listPerformanceSummary = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  // const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : '';
  const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  const divisionId = req.query.filter_division_id ? req.query.filter_division_id : 0;
  const currentDate = req.query.filter_current_date ? req.query.filter_current_date : '';
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "mtp.outlet_date";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";

  const startDate = req.query.filter_startdate ? req.query.filter_startdate : helper.date();
  const endDate = req.query.filter_enddate ? req.query.filter_enddate : '';



  var user = JSON.parse(req.headers.authorization)

  var querySearch = '';
  var queryWhere = `where em.deleted_at is null `;
  var total = 0;

  if (user.role == 1) {

  } else {

    queryWhere += `AND em.emp_id in (WITH RECURSIVE subordinate AS (
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
      // 'o.outlet_name',
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  // if (status) {
  //   queryWhere += ` AND o.status = '${status}'`
  // }

  if (zoneId > 0) {
    queryWhere += ` AND em.zone_id = ${zoneId}`

  }

  if (divisionId > 0) {
    queryWhere += ` AND em.division = ${divisionId}`

  }

  if(endDate != ''){
     queryWhere += ` AND mtp.outlet_date BETWEEN '${helper.dateFormat(startDate)}' AND '${helper.dateFormat(endDate)}' `;
  }else{
    queryWhere += ` AND mtp.outlet_date= '${startDate}'`
  }

  // if (currentDate) {
  //   queryWhere += ` AND mtp.outlet_date= '${currentDate}'`
  //   var queryDate = currentDate;
  // } else {
  //   queryWhere += ` AND mtp.outlet_date= '${helper.date()}'`
  //   var queryDate = helper.date();
  // }

  if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  }

  console.log(`select mtp.outlet_date, mtp.user_id AS id , em.user_name,em.name AS company_name,aam.punch_date,
  CASE
    WHEN aam.status = 1 THEN 'Present'
    WHEN aam.holiday_status = 2 THEN 'Week Off'
    WHEN aam.holiday_status = 1 THEN 'Holiday'
    WHEN aam.leave_status = 2 THEN 'Leave'
    ELSE 'Absent'
  END AS attendance_status,
aam.punch_in,aam.punch_out,
( SELECT  count(*) as outletcount FROM romsondb.cor_outlet_m om LEFT JOIN romsondb.cor_mtp_a bm ON om.beat_id = bm.beat_id
WHERE om.status = 'A' and om.deleted_at is null and bm.user_id = mtp.user_id  and bm.outlet_date=mtp.outlet_date ) outlet_count,
(SELECT count(*) orderCount FROM romsondb.cor_order_m oc where date_format(date(oc.enter_date),'%Y-%m-%d')= mtp.outlet_date  and oc.enter_by=mtp.user_id AND oc.deleted_at is null AND oc.status = 2) order_count_total,
(SELECT count(*)  as ActivityCount FROM romsondb.cor_outlet_activity_m AS oa WHERE date_format(date(oa.enter_date),'%Y-%m-%d') = mtp.outlet_date  and oa.enter_by=mtp.user_id) activity_total_count,
(SELECT count(DISTINCT(outlet_id)) orderCount FROM romsondb.cor_order_m oc where date_format(date(oc.enter_date),'%Y-%m-%d')= mtp.outlet_date  and  oc.enter_by=mtp.user_id AND oc.deleted_at is null AND oc.status = 2) outlet_order_count_total,
(SELECT count(DISTINCT(outlet_id))  as ActivityCount FROM romsondb.cor_outlet_activity_m AS oa WHERE date_format(date(oa.enter_date),'%Y-%m-%d') = mtp.outlet_date
and oa.enter_by=mtp.user_id AND outlet_id NOT IN(SELECT DISTINCT(outlet_id) orderCount FROM romsondb.cor_order_m oc
where date_format(date(oc.enter_date),'%Y-%m-%d')= mtp.outlet_date  and oc.enter_by=mtp.user_id AND oc.deleted_at is null AND oc.status = 2 )) outlet_activity_total_count,
(SELECT count(*) orderCount FROM romsondb.cor_order_m op where date_format(date(op.enter_date),'%Y-%m-%d')= mtp.outlet_date  and
op.enter_by=mtp.user_id AND op.deleted_at is null AND op.status = 2)  order_count_productive,
(SELECT sum(item_qty) qty FROM romsondb.cor_order_m AS om
LEFT JOIN romsondb.cor_order_d AS od ON om.order_id = od.order_id where  om.order_date=mtp.outlet_date AND om.employee_id = mtp.user_id AND om.deleted_at is null AND om.status = 2) order_qty,
(SELECT round(sum(order_amt),2) orderAMt  FROM romsondb.cor_order_m AS om
LEFT JOIN romsondb.cor_order_d AS od ON om.order_id = od.order_id where  om.order_date=mtp.outlet_date AND om.employee_id = mtp.user_id AND om.deleted_at is null AND om.status = 2) order_amt,
bm.beat_name
from cor_emp_m AS em
LEFT JOIN  cor_mtp_a as mtp ON em.emp_id = mtp.user_id
LEFT JOIN cor_beat_m AS bm ON mtp.beat_id = bm.beat_id
LEFT JOIN cor_attendance_m AS aam ON em.emp_id = aam.emp_id and mtp.outlet_date=aam.punch_date
${queryWhere} LIMIT ${perPage} OFFSET ${start}`);

  sql.query(` select mtp.outlet_date, mtp.user_id AS id , em.user_name,em.name AS company_name,aam.punch_date,
  CASE
    WHEN aam.status = 1 THEN 'Present'
    WHEN aam.holiday_status = 2 THEN 'Week Off'
    WHEN aam.holiday_status = 1 THEN 'Holiday'
    WHEN aam.leave_status = 2 THEN 'Leave'
    ELSE 'Absent'
  END AS attendance_status,
aam.punch_in,aam.punch_out,
( SELECT  count(*) as outletcount FROM romsondb.cor_outlet_m om LEFT JOIN romsondb.cor_mtp_a bm ON om.beat_id = bm.beat_id
WHERE om.status = 'A' and om.deleted_at is null and bm.user_id = mtp.user_id  and bm.outlet_date=mtp.outlet_date ) outlet_count,
(SELECT count(*) orderCount FROM romsondb.cor_order_m oc where date_format(date(oc.enter_date),'%Y-%m-%d')= mtp.outlet_date  and oc.enter_by=mtp.user_id AND oc.deleted_at is null AND oc.status = 2) order_count_total,
(SELECT count(*)  as ActivityCount FROM romsondb.cor_outlet_activity_m AS oa WHERE date_format(date(oa.enter_date),'%Y-%m-%d') = mtp.outlet_date  and oa.enter_by=mtp.user_id) activity_total_count,
(SELECT count(DISTINCT(outlet_id)) orderCount FROM romsondb.cor_order_m oc where date_format(date(oc.enter_date),'%Y-%m-%d')= mtp.outlet_date  and  oc.enter_by=mtp.user_id AND oc.deleted_at is null AND oc.status = 2) outlet_order_count_total,
(SELECT count(DISTINCT(outlet_id))  as ActivityCount FROM romsondb.cor_outlet_activity_m AS oa WHERE date_format(date(oa.enter_date),'%Y-%m-%d') = mtp.outlet_date
and oa.enter_by=mtp.user_id AND outlet_id NOT IN(SELECT DISTINCT(outlet_id) orderCount FROM romsondb.cor_order_m oc
where date_format(date(oc.enter_date),'%Y-%m-%d')= mtp.outlet_date  and oc.enter_by=mtp.user_id AND oc.deleted_at is null AND oc.status = 2 )) outlet_activity_total_count,
(SELECT count(*) orderCount FROM romsondb.cor_order_m op where date_format(date(op.enter_date),'%Y-%m-%d')= mtp.outlet_date  and
op.enter_by=mtp.user_id AND op.deleted_at is null AND op.status = 2)  order_count_productive,
(SELECT sum(item_qty) qty FROM romsondb.cor_order_m AS om
LEFT JOIN romsondb.cor_order_d AS od ON om.order_id = od.order_id where  om.order_date=mtp.outlet_date AND om.employee_id = mtp.user_id AND om.deleted_at is null AND om.status = 2) order_qty,
(SELECT round(sum(order_amt),2) orderAMt  FROM romsondb.cor_order_m AS om
LEFT JOIN romsondb.cor_order_d AS od ON om.order_id = od.order_id where  om.order_date=mtp.outlet_date AND om.employee_id = mtp.user_id AND om.deleted_at is null AND om.status = 2) order_amt,
bm.beat_name
from cor_emp_m AS em
LEFT JOIN  cor_mtp_a as mtp ON em.emp_id = mtp.user_id
LEFT JOIN cor_beat_m AS bm ON mtp.beat_id = bm.beat_id
LEFT JOIN cor_attendance_m AS aam ON em.emp_id = aam.emp_id and mtp.outlet_date=aam.punch_date
${queryWhere} LIMIT ${perPage} OFFSET ${start}`,

    async (err, res) => {

      total = await countTotalRows(`
                select count(id) AS total from  (select mtp.user_id AS id 
                from cor_emp_m AS em 
                LEFT JOIN  cor_mtp_a as mtp ON em.emp_id = mtp.user_id
                LEFT JOIN cor_beat_m AS bm ON mtp.beat_id = bm.beat_id
                LEFT JOIN cor_attendance_m AS aam ON em.emp_id = aam.emp_id and mtp.outlet_date=aam.punch_date 
                ${queryWhere} ) a
                `);
      result(total, helper.checkDataRows(err, res));
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <01-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <count Total Rows>
*/

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
*@Created On:       <05-04-2023>
*@Last Modified By: <06-04-2023>
*@Last Modified:    <>
*@Description:      <List listAttendanceReport>
*/

report.listAttendanceReport = (req, result) => {
  var moment = require('moment');
  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 500;
  // const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : '';
  // const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  // const divisionId = req.query.filter_division_id ? req.query.filter_division_id : 0;
  //const currentDate = req.query.filter_current_date ? req.query.filter_current_date : '';
  const month = req.query.filter_month ? req.query.filter_month : moment().format("MMMM");
  const year = req.query.filter_year ? req.query.filter_year : moment().format("YYYY");
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "a.emp_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";

  var user = JSON.parse(req.headers.authorization)
  console.log(user);

  var querySearch = '';
  var qSearch = '';
  var queryWhere = `where em.deleted_at is null`;
  var total = 0;

  if (search) {

    columnSearch = [
      'a.emp_id',
      'em.user_name',
      'em.emp_code',
      'd.designation_name'
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  // if (status) {
  //   queryWhere += ` AND o.status = '${status}'`
  // }

  // if (zoneId > 0) {
  //   queryWhere += ` AND em.zone_id = ${zoneId}`

  // }

  // if (divisionId > 0) {
  //   queryWhere += ` AND em.division = ${divisionId}`

  // }

  // if (currentDate) {
  //   queryWhere += ` AND mtp.outlet_date= '${currentDate}'`
  //   var queryDate = currentDate;
  // } else {
  //   queryWhere += ` AND mtp.outlet_date= '${helper.date()}'`
  //   var queryDate = helper.date();
  // }

  if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  }

  //queryWhere += ` group by em.emp_id`;
  //queryWhere += ` ORDER BY ${sort}  ${order}`


  if (user.role == 1) {

  } else {

    queryWhere += `  AND em.emp_id in (WITH RECURSIVE subordinate AS (
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



  // if (user.emp_type == 1) {

  // } else {
  //   leftJoin = ` LEFT JOIN cor_emp_m AS rp ON em.reporting_to = rp.emp_id `;
  //   conditionWhere = ` AND rp.api_token='${user.api_token}'`
  // }


  var fromDate = moment().year(year).month(month).startOf('month').format('YYYY-MM-DD');
  var toDate = moment().year(year).month(month).endOf('month').format('YYYY-MM-DD');
  var monthDays = moment(fromDate, 'YYYY-MM-DD').daysInMonth()

  var fromD = moment(fromDate);
  var toD = moment(toDate);
  queryWhere += ` AND punch_date BETWEEN '${fromDate}' AND '${toDate}'`
  var query = '';
  // If you want an exclusive end date (half-open interval)
  for (var m = moment(fromD); m.isSameOrBefore(toD); m.add(1, 'days')) {
    query += `GROUP_CONCAT(if(punch_date = '${m.format('YYYY-MM-DD')}', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd${m.format('D')}',`;
  }

  console.log(`SELECT a.emp_id as id,em.user_name,em.emp_code,d.designation_name,
  ${query}
    COUNT(if(if(a.status = 1, 'P', 'N/A')='P', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 
    'present_days', COUNT(if(if(holiday_status > 1, 'H', 'N/A')='H', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS ' holidays', 
    COUNT(if(if(leave_status = 2, 'L', 'N/A')='L', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS ' leaves',
    ${monthDays} month_days,
    SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(a.punch_out,a.punch_in))) as working_hours 
    FROM cor_attendance_m AS a
  LEFT JOIN cor_emp_m AS em ON a.emp_id = em.emp_id
  LEFT JOIN cor_designation_m AS d  ON em.designation = d.designation_id
   ${queryWhere}
  GROUP BY a.emp_id order by em.reporting_to ASC LIMIT ${perPage} OFFSET ${start}`);


  // sql.query(`SELECT a.emp_id as id,em.user_name,em.emp_code,d.designation_name,
  //         ${query}
  //           COUNT(if(if(a.status = 1, 'P', 'N/A')='P', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 
  //           'present_days', 
  //           COUNT(if(if(holiday_status > 1, 'H', 'N/A')='H', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS ' holidays', 
  //           COUNT(if(if(leave_status = 2, 'L', 'N/A')='L', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS ' leaves',
  //           ${monthDays} month_days,
  //           SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(a.punch_out,a.punch_in))) as working_hours 
  //           FROM cor_attendance_m AS a
  //         LEFT JOIN cor_emp_m AS em ON a.emp_id = em.emp_id
  //         LEFT JOIN cor_designation_m AS d  ON em.designation = d.designation_id
  //          ${queryWhere}
  //         GROUP BY a.emp_id order by em.reporting_to ASC LIMIT ${perPage} OFFSET ${start}`,


  sql.query(`SELECT a.emp_id as id,em.user_name,em.emp_code,d.designation_name,
  ${query}
    COUNT(if(if(a.status = 1, 'P', 'A')='P', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'A' END, null)) AS 
    'present_days', 
    COUNT(if(if(holiday_status > 1, 'H', 'A')='H', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'A' END, null)) AS ' holidays', 
    COUNT(if(if(leave_status = 2, 'L', 'A')='L', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'A' END, null)) AS ' leaves',
    ${monthDays} month_days,
    SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(a.punch_out,a.punch_in))) as working_hours 
    FROM cor_attendance_m AS a
  LEFT JOIN cor_emp_m AS em ON a.emp_id = em.emp_id
  LEFT JOIN cor_designation_m AS d  ON em.designation = d.designation_id
   ${queryWhere}
  GROUP BY a.emp_id order by em.reporting_to ASC LIMIT ${perPage} OFFSET ${start}`,


    //   sql.query(`SELECT a.emp_id as id,em.user_name,d.designation_name,
    //   GROUP_CONCAT(if(DAY(punch_date) = 1, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd1',
    //   GROUP_CONCAT(if(DAY(punch_date) = 2, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd2',
    //   GROUP_CONCAT(if(DAY(punch_date) = 3, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd3',
    //   GROUP_CONCAT(if(DAY(punch_date) = 4, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd4',
    //   GROUP_CONCAT(if(DAY(punch_date) = 5, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd5',
    //   GROUP_CONCAT(if(DAY(punch_date) = 6, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd6',
    //   GROUP_CONCAT(if(DAY(punch_date) = 7, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd7',
    //   GROUP_CONCAT(if(DAY(punch_date) = 8, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd8',
    //   GROUP_CONCAT(if(DAY(punch_date) = 9, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd9',
    //   GROUP_CONCAT(if(DAY(punch_date) = 10, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd10',
    //   GROUP_CONCAT(if(DAY(punch_date) = 11, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd11',
    //   GROUP_CONCAT(if(DAY(punch_date) = 12, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd12',
    //   GROUP_CONCAT(if(DAY(punch_date) = 13, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd13',
    //   GROUP_CONCAT(if(DAY(punch_date) = 14, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd14',
    //   GROUP_CONCAT(if(DAY(punch_date) = 15, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd15',
    //   GROUP_CONCAT(if(DAY(punch_date) = 16, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd16',
    //   GROUP_CONCAT(if(DAY(punch_date) = 17, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd17',
    //   GROUP_CONCAT(if(DAY(punch_date) = 18, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd18',
    //   GROUP_CONCAT(if(DAY(punch_date) = 19, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd19',
    //   GROUP_CONCAT(if(DAY(punch_date) = 20, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd20',
    //   GROUP_CONCAT(if(DAY(punch_date) = 21, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd21',
    //   GROUP_CONCAT(if(DAY(punch_date) = 22, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd22',
    //   GROUP_CONCAT(if(DAY(punch_date) = 23, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd23',
    //   GROUP_CONCAT(if(DAY(punch_date) = 24, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd24',
    //   GROUP_CONCAT(if(DAY(punch_date) = 25, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd25',
    //   GROUP_CONCAT(if(DAY(punch_date) = 26, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd26',
    //   GROUP_CONCAT(if(DAY(punch_date) = 27, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd27',
    //   GROUP_CONCAT(if(DAY(punch_date) = 28, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd28',
    //   GROUP_CONCAT(if(DAY(punch_date) = 29, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd29',
    //   GROUP_CONCAT(if(DAY(punch_date) = 30, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd30',
    //   GROUP_CONCAT(if(DAY(punch_date) = 31, CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 'd31',
    //   COUNT(if(if(a.status = 1, 'P', 'N/A')='P', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS 
    //   'present_days', COUNT(if(if(holiday_status > 1, 'H', 'N/A')='H', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS ' holidays', 
    //   COUNT(if(if(leave_status = 2, 'L', 'N/A')='L', CASE WHEN a.status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS ' leaves'
    // FROM cor_attendance_m AS a
    // LEFT JOIN cor_emp_m AS em ON a.emp_id = em.emp_id
    // LEFT JOIN cor_designation_m AS d  ON em.designation = d.designation_id
    // WHERE punch_date BETWEEN '2023-03-01' AND '2023-03-31'
    // GROUP BY a.emp_id LIMIT ${perPage} OFFSET ${start}`,


    async (err, res) => {

      total = await countTotalRows(`
                select count(emp_id) AS total from  (SELECT a.emp_id FROM cor_attendance_m AS a
                LEFT JOIN cor_emp_m AS em ON a.emp_id = em.emp_id
                LEFT JOIN cor_designation_m AS d  ON em.designation = d.designation_id
                  ${queryWhere}
                GROUP BY a.emp_id  ) a
                `);
      result(total, helper.checkDataRows(err, res));
    });
};




//===============================================Anubhav===============================
report.listDaysummery = (req, result) => {   //order day summery

  // const page = req.query.page || 1;
  // const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  // const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  // const selectedDate = req.query.filter_selectedDate ? req.query.filter_selectedDate : "";
  // const divisionId = req.query.filter_divisionId ? req.query.filter_divisionId : 0;

  // const start = ((page - 1) * perPage);
  // const sort = req.query.sort || "m.order_date";
  // const order = req.query.order || "DESC";
  // const search = req.query.search || "";

  ///////////////////////////

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const userId = req.query.filter_user_id ? req.query.filter_user_id : 0;
  const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  //const selectedDate = req.query.filter_current_date ? req.query.filter_current_date : "";
  const divisionId = req.query.filter_division_id ? req.query.filter_division_id : 0;
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "m.order_date";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";

  const startDate = req.query.filter_startdate ? req.query.filter_startdate : helper.date();
  const endDate = req.query.filter_enddate ? req.query.filter_enddate : '';


  var querySearch = '';
  var queryWhere = 'where outlet.deleted_at is null ';
  var total = 0;

  var user = JSON.parse(req.headers.authorization);


  if (user.role == 1) {

  } else {

    queryWhere += ` AND emp.emp_id in (WITH RECURSIVE subordinate AS (
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
      'emp.user_name',
      'emp.emp_id',
      'bt.beat_id',
      'bt.beat_name',
      'outlet.outlet_name', 
      'outlet.outlet_id' 
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (zoneId > 0) {
    queryWhere += ` AND m.zone_id = ${zoneId}`

  }

  if (divisionId > 0) {
    queryWhere += ` AND m.division_m = ${divisionId}`
  }

  if (userId > 0) {
    queryWhere += ` AND emp.emp_id = ${userId}`
  }


  queryWhere += ` AND m.order_id=d.order_id and outlet.outlet_id = m.outlet_id and outlet.beat_id=bt.beat_id and emp.emp_id = m.employee_id`

  // if (selectedDate != "") {
  //   queryWhere += ` AND m.order_date = ${selectedDate}`

  // } 

  if(endDate != ''){
    // console.log(helper.dateFormat(startDate));
    // console.log(helper.dateFormat(endDate));
    queryWhere += ` AND m.order_date  BETWEEN '${helper.dateFormat(startDate)}' AND '${helper.dateFormat(endDate)}' `;
  }else{
    queryWhere += ` AND m.order_date='${startDate}' `
  }

  // if (selectedDate != "") {
  //   queryWhere += ` AND m.order_date = '${selectedDate}'`
  // }
  // else {
  //   queryWhere += ` AND m.order_date = '${helper.date()}'`
  // }

  if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  }

  queryWhere += ` group by m.order_id, m.order_date`

 

  queryWhere += ` ORDER BY ${sort}  ${order}`

 

  console.log(`SELECT bt.beat_id,bt.beat_name, m.order_id,m.order_lat as lat,m.order_lag AS lg, m.order_id as id, m.order_date , sum(item_qty) qty ,  round(sum(order_amt),2)  
  ExactAMT ,round(sum(order_gst_amt),2) gst,
 ((round(sum(order_amt),2)+round(sum(order_gst_amt),2))-m.scheme_discount)netAMT,m.outlet_id,m.employee_id , outlet.outlet_name , m.enter_date , 
 emp.user_name,m.scheme_discount , m.zone_id , m.division_m
 FROM romsondb.cor_order_m m,romsondb.cor_order_d d , romsondb.cor_outlet_m outlet , romsondb.cor_emp_m emp,  romsondb.cor_beat_m bt
${queryWhere}  LIMIT ${perPage} OFFSET ${start}`);

  sql.query(`SELECT bt.beat_id,bt.beat_name, m.order_id, m.order_lat as lat, m.order_lag AS lng, m.order_id as id, m.order_time order_date , sum(item_qty) qty ,  round(sum(order_amt),2)  
  ExactAMT ,round(sum(order_gst_amt),2) gst,
 ((round(sum(order_amt),2)+round(sum(order_gst_amt),2))-m.scheme_discount)netAMT,m.outlet_id,m.employee_id , outlet.outlet_name , m.enter_date , 
 emp.user_name,m.scheme_discount , m.zone_id , m.division_m, m.Approval_Remarks, m.status
 FROM romsondb.cor_order_m m,romsondb.cor_order_d d , romsondb.cor_outlet_m outlet , romsondb.cor_emp_m emp,  romsondb.cor_beat_m bt
 ${queryWhere}  LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {

      // total = await countTotalRows(`select count(*)
      //AS total from romsondb.cor_order_m m,romsondb.cor_order_d d , romsondb.cor_outlet_m outlet , romsondb.cor_emp_m emp
      //                               ${queryWhere}`);

      total = await countTotalRows(`select count(*)
 AS total from (
        select outlet.outlet_name  from romsondb.cor_order_m m,
        romsondb.cor_order_d d , romsondb.cor_outlet_m outlet ,
        romsondb.cor_emp_m emp,  romsondb.cor_beat_m bt
        ${queryWhere}) a`);

      result(total, helper.checkDataRows(err, res));
    });
};



report.activityListDaysummery = (req, result) => {


  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const userId = req.query.filter_user_id ? req.query.filter_user_id : 0;
  const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  const selectedDate = req.query.filter_current_date ? req.query.filter_current_date : "";
  const divisionId = req.query.filter_division_id ? req.query.filter_division_id : 0;
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "act.activity_date";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";

  const startDate = req.query.filter_startdate ? req.query.filter_startdate : helper.date();
  const endDate = req.query.filter_enddate ? req.query.filter_enddate : '';

  var querySearch = '';
  var queryWhere = 'where outlet.deleted_at is null';
  var total = 0;

  var user = JSON.parse(req.headers.authorization);


  if (user.role == 1) {

  } else {

    queryWhere += ` AND emp.emp_id in (WITH RECURSIVE subordinate AS (
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

    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  // if (status) {
  //   queryWhere += ` AND o.status = '${status}'`
  // } 

  if (zoneId > 0) {
    queryWhere += ` AND act.zone_id = ${zoneId}`

  }

  if (divisionId > 0) {
    queryWhere += ` AND act.division_m = ${divisionId}`
  }

  if (userId > 0) {
    queryWhere += ` AND emp.emp_id = ${userId}`
  }

  //queryWhere += ` AND act.outlet_id=outlet.outlet_id and outlet.beat_id=bt.beat_id and act.item_id=itm.sku_id and emp.emp_id=act.enter_by and cus.customer_name=act.hospital_customer_name`

  // if (selectedDate != "") {
  //   queryWhere += ` AND act.activity_date = ${selectedDate}`

  // } 


  if(endDate != ''){
    queryWhere += ` AND act.activity_date BETWEEN '${helper.dateFormat(startDate)}' AND '${helper.dateFormat(endDate)}' `;
  }else{
    queryWhere += ` AND act.activity_date ='${startDate}'`
  }

  // if (selectedDate != "") {
  //   queryWhere += ` AND act.activity_date = '${selectedDate}'`
  // }
  // else {
  //   queryWhere += ` AND act.activity_date = '${helper.date()}'`
  // }

  // if (dealerId > 0) {
  //   queryWhere += ` AND o.dealer_id = ${dealerId}`
  // } 
  // if (approvalId ) {
  //   queryWhere += ` AND o.approved = ${approvalId}`
  // } 


  if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  }

  queryWhere += ` ORDER BY ${sort}  ${order}`
  //=========================================================old query=====================================================
  //   console.log(`SELECT act.id,bt.beat_id,bt.beat_name,act.outlet_id,act.item_id,act.enter_by,act.user_type,act.remark,act.follow_up,
  //   act.enter_date,act.hospital_name,act.hospital_customer_name,cus.customer_type,act.activity_date,act.zone_id,
  //   act.division_m ,itm.sku_name,itm.segment_id,outlet.outlet_name,emp.user_name
  //   FROM romsondb.cor_outlet_activity_m act,romsondb.cor_sku_m itm ,romsondb.cor_outlet_m outlet ,
  //  romsondb.cor_emp_m emp,romsondb.cor_hospital_customer_m cus  , romsondb.cor_beat_m bt 
  // ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);
  console.log(` SELECT  act.id,bt.beat_id,bt.beat_name,act.outlet_id,act.item_id,act.enter_by,act.user_type,act.remark,act.follow_up,
act.enter_date,act.hospital_name,act.hospital_customer_name,cus.customer_type,act.activity_date,act.zone_id,act.act_lat AS lat,act.act_long AS lng,
act.division_m ,itm.sku_name,itm.segment_id,outlet.outlet_name,emp.user_name
FROM romsondb.cor_outlet_activity_m act 
left join  romsondb.cor_hospital_customer_m cus ON  act.hospital_customer_name =cus.customer_name  AND act.outlet_id =cus.outlet_id
left join romsondb.cor_sku_m itm ON  act.item_id=itm.sku_id 
left join romsondb.cor_outlet_m outlet ON  act.outlet_id=outlet.outlet_id
left join romsondb.cor_emp_m emp ON  act.enter_by  = emp.emp_id
left join romsondb.cor_beat_m bt  ON  outlet.beat_id=bt.beat_id 
${queryWhere} LIMIT ${perPage} OFFSET ${start}`);
  sql.query(` SELECT  act.id,bt.beat_id,bt.beat_name,act.outlet_id,act.item_id,act.enter_by,act.user_type,act.remark,act.follow_up,
              act.enter_date,act.hospital_name,act.hospital_customer_name,cus.customer_type,act.activity_date, act.zone_id, act.act_lat AS lat, act.act_long AS lng,
              act.division_m ,itm.sku_name,itm.segment_id,outlet.outlet_name,emp.user_name
              FROM romsondb.cor_outlet_activity_m act 
              left join  romsondb.cor_hospital_customer_m cus ON  act.hospital_customer_name =cus.customer_name  AND act.outlet_id =cus.outlet_id
              left join romsondb.cor_sku_m itm ON  act.item_id=itm.sku_id 
              left join romsondb.cor_outlet_m outlet ON  act.outlet_id=outlet.outlet_id
              left join romsondb.cor_emp_m emp ON  act.enter_by  = emp.emp_id
              left join romsondb.cor_beat_m bt  ON  outlet.beat_id=bt.beat_id 
          ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {

      // total = await countTotalRows(`select count(*)
      //AS total  FROM romsondb.cor_outlet_activity_m act,romsondb.cor_sku_m itm ,romsondb.cor_outlet_m outlet ,romsondb.cor_attendance_m att,romsondb.cor_emp_m emp,romsondb.cor_hospital_customer_m cus
      //                               ${queryWhere}`);

      total = await countTotalRows(`select count(*)
      AS total from (
      select outlet.outlet_name  FROM romsondb.cor_outlet_activity_m act
      left join  romsondb.cor_hospital_customer_m cus ON  act.hospital_customer_name =cus.customer_name  AND act.outlet_id =cus.outlet_id
      left join romsondb.cor_sku_m itm ON  act.item_id=itm.sku_id 
      left join romsondb.cor_outlet_m outlet ON  act.outlet_id=outlet.outlet_id
      left join romsondb.cor_emp_m emp ON  act.enter_by  = emp.emp_id
      left join romsondb.cor_beat_m bt  ON  outlet.beat_id=bt.beat_id 
      ${queryWhere}) a`);

      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <19-06-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Sku Order Details>
*/
report.listSkuOrderDetails = (req, result) => {


  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const userId = req.query.filter_user_id ? req.query.filter_user_id : 0;
  const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  const selectedDate = req.query.filter_current_date ? req.query.filter_current_date : "";
  const beatId = req.query.filter_beat_id ? req.query.filter_beat_id : 0;
  const start = ((page - 1) * perPage);

  const order = req.query.order || "DESC";
  const search = req.query.search || "";
  const type = req.query.filter_type ? req.query.filter_type : 1;
  if (type == 1) {
    const sort = req.query.sort || "o.order_id";
    var querySearch = '';
    var queryWhere = 'where o.deleted_at is null'; 
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
        'ot.outlet_name',
        'ct.customer_type_name',
        'otc.outlet_category_name',
        'b.beat_name',
        'z.zone_name',
        'e.user_name',
        'reporting_name',
        'sku.sku_name'
      ]
      columnSearch.forEach(item => {
        querySearch += `${item} LIKE '%${search}%' OR `
      });

      if (querySearch) {
        querySearch = `(` + querySearch.slice(0, -4) + `)`
      }
    }

    // if (status) {
    //   queryWhere += ` AND o.status = '${status}'`
    // } 

    if (zoneId > 0) {
      queryWhere += ` AND o.zone_id = ${zoneId}`

    }

    if (beatId > 0) {
      queryWhere += ` AND o.beat_id = ${beatId}`
    }

    if (userId > 0) {
      queryWhere += ` AND o.enter_by = ${userId}`
    }


    if (selectedDate != "") {
      queryWhere += ` AND o.order_date = '${selectedDate}'`
    }
    else {
      queryWhere += ` AND o.order_date = '${helper.date()}'`
    }



    if (querySearch) {
      queryWhere += ` AND ${querySearch} `
    }

    queryWhere += ` ORDER BY ${sort}  ${order}`

    console.log(` select o.order_id,o.order_time,o.outlet_id,ot.outlet_name,ct.customer_type_name,otc.outlet_category_name,o.beat_id,b.beat_name,ot.dealer_id,dl.dealer_name, o.zone_id,z.zone_name, o.enter_by,e.user_name,  r.emp_id AS report_to, r.user_name as reporting_name,
                  od.item_id,sku.sku_name,seg.segment_code,sku_code, od.item_qty,od.item_discount, od.item_price_unit AS sku_price, od.order_amt, od.item_gst, od.order_gst_amt, od.item_value as total_amount, o.Approval_Remarks AS remarks,o.Outlet_lat AS lat,o.Outlet_Long As lng,
                  CASE 
                  WHEN o.status=1 THEN "pending"
                  WHEN o.status=2 THEN "pending"
                  WHEN o.status=3 THEN "pending"
                  ELSE ""
                  END order_status
                  from cor_order_m o
                  left join cor_outlet_m ot ON o.outlet_id = ot.outlet_id
                  left join cor_outlet_category_m otc ON ot.outlet_category_id = otc.outlet_category_id
                  left join cor_customer_type_m ct ON ot.customer_type_id = ct.customer_type_id
                  left join cor_beat_m b ON o.beat_id = b.beat_id
                  left join cor_zone_m z ON o.zone_id = z.zone_id
                  left join cor_emp_m e ON o.enter_by = e.emp_id
                  left join cor_emp_m r ON e.reporting_to = r.emp_id
                  left join cor_order_d od ON o.order_id = od.order_id
                  left join cor_sku_m sku ON od.item_id = sku.sku_id
                  left join cor_segment_m seg ON sku.segment_id = seg.segment_id
                  left join cor_dealer_m dl ON ot.dealer_id = dl.dealer_id
                  ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);
    sql.query(` select o.order_id,o.order_time,o.outlet_id,ot.outlet_name,ct.customer_type_name,otc.outlet_category_name,o.beat_id,b.beat_name,ot.dealer_id,dl.dealer_name, o.zone_id,z.zone_name, o.enter_by,e.user_name,  r.emp_id AS report_to, r.user_name as reporting_name,
    od.item_id,sku.sku_name,seg.segment_code,sku_code, od.item_qty,od.item_discount, od.item_price_unit AS sku_price, od.order_amt, od.item_gst, od.order_gst_amt, od.item_value as total_amount, o.Approval_Remarks AS remarks,o.order_lat AS lat,o.order_lag As lng,
    CASE 
    WHEN o.status=1 THEN "pending"
    WHEN o.status=2 THEN "pending"
    WHEN o.status=3 THEN "pending"
    ELSE ""
    END order_status
    from cor_order_m o
    left join cor_outlet_m ot ON o.outlet_id = ot.outlet_id
    left join cor_outlet_category_m otc ON ot.outlet_category_id = otc.outlet_category_id
    left join cor_customer_type_m ct ON ot.customer_type_id = ct.customer_type_id
    left join cor_mtp_a mtp ON o.order_date = mtp.outlet_date AND o.enter_by = mtp.user_id
    left join cor_beat_m b ON mtp.beat_id = b.beat_id
    left join cor_zone_m z ON o.zone_id = z.zone_id
    left join cor_emp_m e ON o.enter_by = e.emp_id
    left join cor_emp_m r ON e.reporting_to = r.emp_id
    left join cor_order_d od ON o.order_id = od.order_id
    left join cor_sku_m sku ON od.item_id = sku.sku_id
    left join cor_segment_m seg ON sku.segment_id = seg.segment_id
    left join cor_dealer_m dl ON ot.dealer_id = dl.dealer_id
          ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
      async (err, res) => {

        // total = await countTotalRows(`select count(*)
        //AS total  FROM romsondb.cor_outlet_activity_m act,romsondb.cor_sku_m itm ,romsondb.cor_outlet_m outlet ,romsondb.cor_attendance_m att,romsondb.cor_emp_m emp,romsondb.cor_hospital_customer_m cus
        //                               ${queryWhere}`);

        total = await countTotalRows(`
      select count(o.order_id) AS total  from cor_order_m o
      left join cor_outlet_m ot ON o.outlet_id = ot.outlet_id
      left join cor_outlet_category_m otc ON ot.outlet_category_id = otc.outlet_category_id
      left join cor_customer_type_m ct ON ot.customer_type_id = ct.customer_type_id
      left join cor_beat_m b ON o.beat_id = b.beat_id
      left join cor_zone_m z ON o.zone_id = z.zone_id
      left join cor_emp_m e ON o.enter_by = e.emp_id
      left join cor_emp_m r ON e.reporting_to = r.emp_id
      left join cor_order_d od ON o.order_id = od.order_id
      left join cor_sku_m sku ON od.item_id = sku.sku_id
      left join cor_segment_m seg ON sku.segment_id = seg.segment_id
      left join cor_dealer_m dl ON o.dealer_id = dl.dealer_id
      ${queryWhere}`);

        result(total, helper.checkDataRows(err, res));
      });

  } else {
    const sort = req.query.sort || "o.order_return_id";
    var querySearch = '';
    var queryWhere = 'where o.deleted_at is null';
    var total = 0;

    //var user = JSON.parse(req.headers.authorization);


    // if (user.role == 1) {

    // } else {

    //   queryWhere += ` AND emp.emp_id in (WITH RECURSIVE subordinate AS (
    //     SELECT  emp_id,
    //      emp_code,
    //      reporting_to,
    //      0 AS level
    //      FROM cor_emp_m
    //      WHERE api_token = '${user.api_token}'
    //    UNION ALL
    //      SELECT  e.emp_id,
    //              e.emp_code,
    //        e.reporting_to,
    //              level + 1
    //      FROM cor_emp_m e
    //  JOIN subordinate s
    //  ON e.reporting_to = s.emp_id
    //  )
    //  SELECT 
    //    s.emp_id
    //  FROM subordinate s
    //  JOIN cor_emp_m m
    //  ON s.reporting_to = m.emp_id
    //  ORDER BY level)`

    // }

    if (search) {

      columnSearch = [
        'ot.outlet_name',
        'ct.customer_type_name',
        'otc.outlet_category_name',
        'b.beat_name',
        'z.zone_name',
        'e.user_name',
        'reporting_name',
        'sku.sku_name'
      ]
      columnSearch.forEach(item => {
        querySearch += `${item} LIKE '%${search}%' OR `
      });

      if (querySearch) {
        querySearch = `(` + querySearch.slice(0, -4) + `)`
      }
    }

    // if (status) {
    //   queryWhere += ` AND o.status = '${status}'`
    // } 

    if (zoneId > 0) {
      queryWhere += ` AND o.zone_id = ${zoneId}`

    }

    if (beatId > 0) {
      queryWhere += ` AND o.beat_id = ${beatId}`
    }

    if (userId > 0) {
      queryWhere += ` AND o.enter_by = ${userId}`
    }


    if (selectedDate != "") {
      queryWhere += ` AND o.order_return__date = '${selectedDate}'`
    }
    else {
      queryWhere += ` AND o.order_return__date = '${helper.date()}'`
    }



    if (querySearch) {
      queryWhere += ` AND ${querySearch} `
    }

    queryWhere += ` ORDER BY ${sort}  ${order}`

    console.log(`  SELECT
            o.order_return_id AS order_id,o.order_return_time AS order_time, o.outlet_id,ot.outlet_name,ct.customer_type_name,otc.outlet_category_name,
            b.beat_id,b.beat_name,ot.dealer_id,dl.dealer_name,
            o.zone_id,z.zone_name, o.enter_by,e.user_name,   r.emp_id AS report_to, r.user_name as reporting_name,
            od.order_return_reason AS remarks,o.return_order_lat AS lat,o.return_order_lag As lng,
            CASE 
            WHEN o.status=1 THEN "pending"
            WHEN o.status=2 THEN "pending"
            WHEN o.status=3 THEN "pending"
            ELSE ""
            END order_status,
            od.item_id,sku.sku_name,seg.segment_code,sku_code, od.item_qty,
            od.item_price_unit AS sku_price, od.return_order_amt AS order_amt, od.item_gst, od.return_order_gst_amt AS order_gst_amt, od.item_value as total_amount
            FROM cor_order_return_m AS o
 left join  cor_order_return_d AS od  ON  o.order_return_id = od.order_return_id
            left join cor_outlet_m ot ON o.outlet_id = ot.outlet_id
            left join cor_outlet_category_m otc ON ot.outlet_category_id = otc.outlet_category_id
            left join cor_customer_type_m ct ON ot.customer_type_id = ct.customer_type_id
            left join cor_mtp_a mtp ON o.order_return__date = mtp.outlet_date AND o.enter_by = mtp.user_id
            left join cor_beat_m b ON mtp.beat_id = b.beat_id
            left join cor_dealer_m dl ON ot.dealer_id = dl.dealer_id
            left join cor_zone_m z ON o.zone_id = z.zone_id
            left join cor_emp_m e ON o.enter_by = e.emp_id
            left join cor_emp_m r ON e.reporting_to = r.emp_id
            left join cor_sku_m sku ON od.item_id = sku.sku_id
            left join cor_segment_m seg ON sku.segment_id = seg.segment_id
        ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);
    sql.query(` SELECT
                  o.order_return_id AS order_id,o.order_return_time AS order_time, o.outlet_id,ot.outlet_name,ct.customer_type_name,otc.outlet_category_name,
                  b.beat_id,b.beat_name,ot.dealer_id,dl.dealer_name,
                  o.zone_id,z.zone_name, o.enter_by,e.user_name,   r.emp_id AS report_to, r.user_name as reporting_name,
                  od.order_return_reason AS remarks,o.return_order_lat AS lat,o.return_order_lag As lng,
                  CASE 
                  WHEN o.status=1 THEN "pending"
                  WHEN o.status=2 THEN "pending"
                  WHEN o.status=3 THEN "pending"
                  ELSE ""
                  END order_status,
                  od.item_id,sku.sku_name,seg.segment_code,sku_code, od.item_qty,
                  od.item_price_unit AS sku_price, od.return_order_amt AS order_amt, od.item_gst, od.return_order_gst_amt AS order_gst_amt, od.item_value as total_amount
                  FROM cor_order_return_m AS o
                  left join  cor_order_return_d AS od  ON  o.order_return_id = od.order_return_id
                  left join cor_outlet_m ot ON o.outlet_id = ot.outlet_id
                  left join cor_outlet_category_m otc ON ot.outlet_category_id = otc.outlet_category_id
                  left join cor_customer_type_m ct ON ot.customer_type_id = ct.customer_type_id
                  left join cor_mtp_a mtp ON o.order_return__date = mtp.outlet_date AND o.enter_by = mtp.user_id
                  left join cor_beat_m b ON mtp.beat_id = b.beat_id
                  left join cor_dealer_m dl ON ot.dealer_id = dl.dealer_id
                  left join cor_zone_m z ON o.zone_id = z.zone_id
                  left join cor_emp_m e ON o.enter_by = e.emp_id
                  left join cor_emp_m r ON e.reporting_to = r.emp_id
                  left join cor_sku_m sku ON od.item_id = sku.sku_id
                  left join cor_segment_m seg ON sku.segment_id = seg.segment_id
              ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
      async (err, res) => {

        // total = await countTotalRows(`select count(*)
        //AS total  FROM romsondb.cor_outlet_activity_m act,romsondb.cor_sku_m itm ,romsondb.cor_outlet_m outlet ,romsondb.cor_attendance_m att,romsondb.cor_emp_m emp,romsondb.cor_hospital_customer_m cus
        //                               ${queryWhere}`);

        total = await countTotalRows(`
                select count(o.order_return_id) AS total   FROM cor_order_return_m AS o
                left join  cor_order_return_d AS od  ON  o.order_return_id = od.order_return_id
                left join cor_outlet_m ot ON o.outlet_id = ot.outlet_id
                left join cor_outlet_category_m otc ON ot.outlet_category_id = otc.outlet_category_id
                left join cor_customer_type_m ct ON ot.customer_type_id = ct.customer_type_id
                left join cor_mtp_a mtp ON o.order_return__date = mtp.outlet_date AND o.enter_by = mtp.user_id
                left join cor_beat_m b ON mtp.beat_id = b.beat_id
                left join cor_dealer_m dl ON ot.dealer_id = dl.dealer_id
                left join cor_zone_m z ON o.zone_id = z.zone_id
                left join cor_emp_m e ON o.enter_by = e.emp_id
                left join cor_emp_m r ON e.reporting_to = r.emp_id
                left join cor_sku_m sku ON od.item_id = sku.sku_id
                left join cor_segment_m seg ON sku.segment_id = seg.segment_id
          ${queryWhere}`);

        result(total, helper.checkDataRows(err, res));
      });
  }
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <19-06-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Expense>
*/

report.listExpenseDetails = (req, result) => {
  var moment = require('moment');
  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 500;
  const userId = req.query.filter_user_id ? req.query.filter_user_id : 123;
  // const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : '';
  const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  const divisionId = req.query.filter_division_id ? req.query.filter_division_id : 0;
  const currentDate = req.query.filter_current_date ? req.query.filter_current_date : '';
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "exp_date";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";


  var user = JSON.parse(req.headers.authorization)

  var querySearch = '';
  var queryWhere = `where deleted_at is null `;
  var total = 0;


  const month = req.query.filter_month ? req.query.filter_month : moment().format("MMMM");
  const year = req.query.filter_year ? req.query.filter_year : moment().format("YYYY");

  var fromDate = moment().year(year).month(month).startOf('month').format('YYYY-MM');
  var toDate = moment().year(year).month(month).endOf('month').format('YYYY-MM-DD');

  // var monthDays = moment(fromDate, 'YYYY-MM-DD').daysInMonth()
  // var fromD = moment(fromDate);
  // var toD = moment(toDate);
  //queryWhere += ` AND exp_date BETWEEN '${fromDate}' AND '${toDate}'`

  queryWhere += ` AND exp_date like '${fromDate}%' `

  // if (user.role == 1) {

  // } else {

  //   queryWhere += `AND em.emp_id in (WITH RECURSIVE subordinate AS (
  //     SELECT  emp_id,
  //      emp_code,
  //      reporting_to,
  //      0 AS level
  //      FROM cor_emp_m
  //      WHERE api_token = '${user.api_token}'
  //    UNION ALL
  //      SELECT  e.emp_id,
  //              e.emp_code,
  //        e.reporting_to,
  //              level + 1
  //      FROM cor_emp_m e
  //  JOIN subordinate s
  //  ON e.reporting_to = s.emp_id
  //  )
  //  SELECT 
  //    s.emp_id
  //  FROM subordinate s
  //  JOIN cor_emp_m m
  //  ON s.reporting_to = m.emp_id
  //  ORDER BY level)`

  // }



  if (search) {

    columnSearch = [
      // 'o.outlet_name',
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }
  //if (userId > 0) {
    queryWhere += ` AND exp_emp_id = ${userId}`
  //}


  // if (status) {
  //   queryWhere += ` AND o.status = '${status}'`
  // }

  // if (zoneId > 0) {
  //   queryWhere += ` AND em.zone_id = ${zoneId}`

  // }

  // if (divisionId > 0) {
  //   queryWhere += ` AND em.division = ${divisionId}`

  // }

  // if (currentDate) {
  //   queryWhere += ` AND exp_date= '${currentDate}'`
  //  // var queryDate = currentDate;
  // } else {
  //   queryWhere += ` AND exp_date= '${helper.date()}'`
  // //  var queryDate = helper.date();
  // }

  if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  }


  console.log(`select
    exp_date, exp_from_place, exp_to_place1,exp_to_place2,exp_to_place3,exp_to_place4,exp_to_place5,exp_type,exp_traval_mode, exp_distance,exp_ta,
    exp_da,exp_hotel_exp,exp_stationery,exp_printing,exp_medical,exp_postage,exp_fooding,exp_t_meeting,exp_internet,exp_mobile,exp_misc,(ifnull(exp_distance,0)+ifnull(exp_ta,0)+ifnull(exp_da,0)+ifnull(exp_hotel_exp,0) +ifnull(exp_stationery,0) +
    ifnull(exp_printing,0) +ifnull(exp_medical,0) +ifnull(exp_postage,0) +ifnull(exp_fooding,0) +ifnull(exp_t_meeting,0) 
    +ifnull(exp_internet,0) +ifnull(exp_mobile,0) 
    +ifnull(exp_misc,0) ) exp_total,exp_remarks,attachment_flag
    from cor_expense_d  
  ${queryWhere}`);

  sql.query(` select
  exp_date, exp_from_place, exp_to_place1,exp_to_place2,exp_to_place3,exp_to_place4,exp_to_place5,exp_type,exp_traval_mode, exp_distance,exp_ta,
  exp_da,exp_hotel_exp,exp_stationery,exp_printing,exp_medical,exp_postage,exp_fooding,exp_t_meeting,exp_internet,exp_mobile,exp_misc,(ifnull(exp_distance,0)+ifnull(exp_ta,0)+ifnull(exp_da,0)+ifnull(exp_hotel_exp,0) +ifnull(exp_stationery,0) +
  ifnull(exp_printing,0) +ifnull(exp_medical,0) +ifnull(exp_postage,0) +ifnull(exp_fooding,0) +ifnull(exp_t_meeting,0) 
  +ifnull(exp_internet,0) +ifnull(exp_mobile,0) 
  +ifnull(exp_misc,0) ) exp_total,exp_remarks,attachment_flag
  from cor_expense_d  
${queryWhere} LIMIT ${perPage} OFFSET ${start}`,

    async (err, res) => {

      total = await countTotalRows(`
                select count(exp_date) AS total 
                  from cor_expense_d  
                ${queryWhere} 
                `);
      result(total, helper.checkDataRows(err, res));
    });
};



report.expenseReportByUserId = (req, result) => {
  console.log('model  ==================', req);
  //const id = request.params.id;
  var moment = require('moment');

  const userId = req.query.filter_user_id ? req.query.filter_user_id : 123;
  const search = req.query.search || "";
  const sort = req.query.sort || "exp_date";
  const order = req.query.order || "ASC";
  const month = req.query.filter_month ? req.query.filter_month : moment().format("MMMM");
  const year = req.query.filter_year ? req.query.filter_year : moment().format("YYYY");

  var fromDate = moment().year(year).month(month).startOf('month').format('YYYY-MM');
  var toDate = moment().year(year).month(month).endOf('month').format('YYYY-MM-DD');
  var empInfo = [];
  var querySearch = '';
  var queryWhere = `where deleted_at is null `;


  if (search) {

    columnSearch = [
      // 'o.outlet_name',
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  }

  if (userId > 0) {
    queryWhere += ` AND exp_emp_id = ${userId}`
  }

  //queryWhere += ` AND exp_date BETWEEN '${fromDate}' AND '${toDate}'`
  queryWhere += ` AND exp_date like  '${fromDate}%' `

  queryWhere += ` ORDER BY ${sort}  ${order}`

  console.log('-1-', `select
  DATE_FORMAT(exp_date,'%d-%m-%Y') exp_date, exp_from_place,  CONCAT(exp_to_place1,exp_to_place2,exp_to_place3,exp_to_place4,exp_to_place5) AS exp_to_place ,exp_type,exp_traval_mode, exp_distance,
  ifnull(exp_distance,0) exp_distance,
  ifnull(exp_ta,0) exp_ta ,
  ifnull(exp_da,0) exp_da,
  ifnull(exp_hotel_exp,0) exp_hotel_exp,
  ifnull(exp_stationery,0) exp_stationery,
  ifnull(exp_printing,0) exp_printing,
  ifnull(exp_medical,0) exp_medical,
  ifnull(exp_postage,0) exp_postage,
  ifnull(exp_fooding,0) exp_fooding,
  ifnull(exp_t_meeting,0) exp_t_meeting,
  ifnull(exp_internet,0) exp_internet,
  ifnull(exp_mobile,0) exp_mobile,
  ifnull(exp_misc,0) exp_misc, 
  (ifnull(exp_distance,0)+ifnull(exp_ta,0)+ifnull(exp_da,0)+ifnull(exp_hotel_exp,0) +ifnull(exp_stationery,0) +
  ifnull(exp_printing,0) +ifnull(exp_medical,0) +ifnull(exp_postage,0) +ifnull(exp_fooding,0) +ifnull(exp_t_meeting,0) 
  +ifnull(exp_internet,0) +ifnull(exp_mobile,0) 
  +ifnull(exp_misc,0) ) exp_total,exp_remarks,attachment_flag
  from cor_expense_d  ${queryWhere}`);

  sql.query(`select
  DATE_FORMAT(exp_date,'%d-%m-%Y') exp_date, exp_from_place,  CONCAT(exp_to_place1,exp_to_place2,exp_to_place3,exp_to_place4,exp_to_place5) AS exp_to_place, exp_type,exp_traval_mode, exp_distance,
  ifnull(exp_distance,0) exp_distance,
  ifnull(exp_ta,0) exp_ta ,
  ifnull(exp_da,0) exp_da,
  ifnull(exp_hotel_exp,0) exp_hotel_exp,
  ifnull(exp_stationery,0) exp_stationery,
  ifnull(exp_printing,0) exp_printing,
  ifnull(exp_medical,0) exp_medical,
  ifnull(exp_postage,0) exp_postage,
  ifnull(exp_fooding,0) exp_fooding,
  ifnull(exp_t_meeting,0) exp_t_meeting,
  ifnull(exp_internet,0) exp_internet,
  ifnull(exp_mobile,0) exp_mobile,
  ifnull(exp_misc,0) exp_misc, 
  (ifnull(exp_distance,0)+ifnull(exp_ta,0)+ifnull(exp_da,0)+ifnull(exp_hotel_exp,0) +ifnull(exp_stationery,0) +
  ifnull(exp_printing,0) +ifnull(exp_medical,0) +ifnull(exp_postage,0) +ifnull(exp_fooding,0) +ifnull(exp_t_meeting,0) 
  +ifnull(exp_internet,0) +ifnull(exp_mobile,0) 
  +ifnull(exp_misc,0) ) exp_total,exp_remarks,attachment_flag
  from cor_expense_d  ${queryWhere}`,
    async (err, res) => {

      empInfo = await getEmpDetailsByID(userId);
    //  console.log('res', JSON.stringify(res));
      result(empInfo,helper.checkDataRows(err, res));
    });
};

const getEmpDetailsByID = (emp_id) => {

    try {
      return new Promise((resolve, reject) => {
        sql.query(
          `select e.emp_code,e.emp_id,e.user_name, e.reporting_to, rp.user_name AS reporting_name, e.state_id,s.state_name, e.Head_Quater_name,e.division,d.division_name, 
          e.designation,ds.designation_name from cor_emp_m AS e
          left join cor_emp_m AS rp ON e.reporting_to = rp.emp_id
          left join cor_division_m AS d ON e.division = d.division_id
          left join cor_designation_m AS ds ON e.designation = ds.designation_id
          left join cor_state_m AS s ON e.state_id = s.state_id
          where e.emp_id = ${emp_id}`,
          (err, result) => {
            if (err) {
              reject([])
            } else {
              if (result) {
                resolve(result[0])
              } else {
                reject([])
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
*@Created On:       <19-06-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Order Location>
*/

report.listOrderLocation = (req, result) => {


  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const userId = req.query.filter_user_id ? req.query.filter_user_id : 0;
  const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  const selectedDate = req.query.filter_current_date ? req.query.filter_current_date : "";
  const beatId = req.query.filter_beat_id ? req.query.filter_beat_id : 0;
  const start = ((page - 1) * perPage);

  const order = req.query.order || "DESC";
  const search = req.query.search || "";
  const type = req.query.filter_type ? req.query.filter_type : 1;
  if (type == 1) {
    const sort = req.query.sort || "o.enter_by";
    var querySearch = '';
    var queryWhere = 'where o.deleted_at is null'; 
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
        'ot.outlet_name',
        'ct.customer_type_name',
        'otc.outlet_category_name',
        'b.beat_name',
        'z.zone_name',
        'e.user_name',
        'reporting_name',
        'sku.sku_name'
      ]
      columnSearch.forEach(item => {
        querySearch += `${item} LIKE '%${search}%' OR `
      });

      if (querySearch) {
        querySearch = `(` + querySearch.slice(0, -4) + `)`
      }
    }

    // if (status) {
    //   queryWhere += ` AND o.status = '${status}'`
    // } 

    // if (zoneId > 0) {
    //   queryWhere += ` AND o.zone_id = ${zoneId}`

    // }

    if (beatId > 0) {
      queryWhere += ` AND o.beat_id = ${beatId}`
    }

    if (userId > 0) {
      queryWhere += ` AND o.enter_by = ${userId}`
    }


    if (selectedDate != "") {
      queryWhere += ` AND o.order_date = '${selectedDate}'`
    }
    else {
      queryWhere += ` AND o.order_date = '${helper.date()}'`
    }



    if (querySearch) {
      queryWhere += ` AND ${querySearch} `
    }

    queryWhere += ` ORDER BY ${sort}  ${order}`

    console.log(` SELECT o.order_id, o.order_time, o.outlet_id, ot.outlet_name,ct.customer_type_name, 
                  otc.outlet_category_name,o.beat_id,b.beat_name,
                  o.enter_by, e.user_name, o.reporting_to_user_id,r.user_name AS reporting_user_name, o.total_quantity AS order_amt, 
                  o.discount_amount AS total_amount, o.order_lat AS lat, o.order_lag AS lng
                  FROM romsondb.cor_order_m AS o
                  LEFT JOIN cor_outlet_m AS ot ON o.outlet_id = ot.outlet_id
                  LEFT JOIN cor_customer_type_m  AS ct ON ot.customer_type_id = ct.customer_type_id
                  LEFT JOIN cor_outlet_category_m  AS otc ON ot.outlet_category_id = otc.outlet_category_id
                  LEFT JOIN cor_beat_m  AS b ON o.beat_id = b.beat_id
                  LEFT JOIN cor_emp_m  AS e ON o.enter_by = e.emp_id
                  LEFT JOIN cor_emp_m  AS r ON o.reporting_to_user_id = r.emp_id
                  ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);
    sql.query(` SELECT o.order_id, o.order_time, o.outlet_id, ot.outlet_name,ct.customer_type_name, 
                otc.outlet_category_name,o.beat_id,b.beat_name,
                o.enter_by, e.user_name, o.reporting_to_user_id AS report_to,r.user_name AS reporting_name, 
                o.total_quantity AS order_amt, 
                o.discount_amount AS total_amount, o.order_lat AS lat, o.order_lag AS lng
                FROM romsondb.cor_order_m AS o
                LEFT JOIN cor_outlet_m AS ot ON o.outlet_id = ot.outlet_id
                LEFT JOIN cor_customer_type_m  AS ct ON ot.customer_type_id = ct.customer_type_id
                LEFT JOIN cor_outlet_category_m  AS otc ON ot.outlet_category_id = otc.outlet_category_id
                LEFT JOIN cor_beat_m  AS b ON o.beat_id = b.beat_id
                LEFT JOIN cor_emp_m  AS e ON o.enter_by = e.emp_id
                LEFT JOIN cor_emp_m  AS r ON o.reporting_to_user_id = r.emp_id
          ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
      async (err, res) => {

        // total = await countTotalRows(`select count(*)
        //AS total  FROM romsondb.cor_outlet_activity_m act,romsondb.cor_sku_m itm ,romsondb.cor_outlet_m outlet ,romsondb.cor_attendance_m att,romsondb.cor_emp_m emp,romsondb.cor_hospital_customer_m cus
        //                               ${queryWhere}`);

        total = await countTotalRows(`
        select count(o.order_id) AS total FROM romsondb.cor_order_m AS o
        LEFT JOIN cor_outlet_m AS ot ON o.outlet_id = ot.outlet_id
        LEFT JOIN cor_customer_type_m  AS ct ON ot.customer_type_id = ct.customer_type_id
        LEFT JOIN cor_outlet_category_m  AS otc ON ot.outlet_category_id = otc.outlet_category_id
        LEFT JOIN cor_beat_m  AS b ON o.beat_id = b.beat_id
        LEFT JOIN cor_emp_m  AS e ON o.enter_by = e.emp_id
        LEFT JOIN cor_emp_m  AS r ON o.reporting_to_user_id = r.emp_id
        ${queryWhere}`);
          result(total, helper.checkDataRows(err, res));
        });

  } else {
    const sort = req.query.sort || "o.order_return_id";
    var querySearch = '';
    var queryWhere = 'where o.deleted_at is null';
    var total = 0;

    //var user = JSON.parse(req.headers.authorization);


    // if (user.role == 1) {

    // } else {

    //   queryWhere += ` AND emp.emp_id in (WITH RECURSIVE subordinate AS (
    //     SELECT  emp_id,
    //      emp_code,
    //      reporting_to,
    //      0 AS level
    //      FROM cor_emp_m
    //      WHERE api_token = '${user.api_token}'
    //    UNION ALL
    //      SELECT  e.emp_id,
    //              e.emp_code,
    //        e.reporting_to,
    //              level + 1
    //      FROM cor_emp_m e
    //  JOIN subordinate s
    //  ON e.reporting_to = s.emp_id
    //  )
    //  SELECT 
    //    s.emp_id
    //  FROM subordinate s
    //  JOIN cor_emp_m m
    //  ON s.reporting_to = m.emp_id
    //  ORDER BY level)`

    // }

    if (search) {

      columnSearch = [
        'ot.outlet_name',
        'ct.customer_type_name',
        'otc.outlet_category_name',
        'b.beat_name',
        'z.zone_name',
        'e.user_name',
        'reporting_name',
        'sku.sku_name'
      ]
      columnSearch.forEach(item => {
        querySearch += `${item} LIKE '%${search}%' OR `
      });

      if (querySearch) {
        querySearch = `(` + querySearch.slice(0, -4) + `)`
      }
    }

    // if (status) {
    //   queryWhere += ` AND o.status = '${status}'`
    // } 

    if (zoneId > 0) {
      queryWhere += ` AND o.zone_id = ${zoneId}`

    }

    if (beatId > 0) {
      queryWhere += ` AND o.beat_id = ${beatId}`
    }

    if (userId > 0) {
      queryWhere += ` AND o.enter_by = ${userId}`
    }


    if (selectedDate != "") {
      queryWhere += ` AND o.order_return__date = '${selectedDate}'`
    }
    else {
      queryWhere += ` AND o.order_return__date = '${helper.date()}'`
    }



    if (querySearch) {
      queryWhere += ` AND ${querySearch} `
    }

    queryWhere += ` ORDER BY ${sort}  ${order}`

    console.log(`  SELECT
            o.order_return_id AS order_id,o.order_return_time AS order_time, o.outlet_id,ot.outlet_name,ct.customer_type_name,otc.outlet_category_name,
            b.beat_id,b.beat_name,ot.dealer_id,dl.dealer_name,
            o.zone_id,z.zone_name, o.enter_by,e.user_name,   r.emp_id AS report_to, r.user_name as reporting_name,
            od.order_return_reason AS remarks,o.return_order_lat AS lat,o.return_order_lag As lng,
            CASE 
            WHEN o.status=1 THEN "pending"
            WHEN o.status=2 THEN "pending"
            WHEN o.status=3 THEN "pending"
            ELSE ""
            END order_status,
            od.item_id,sku.sku_name,seg.segment_code,sku_code, od.item_qty,
            od.item_price_unit AS sku_price, od.return_order_amt AS order_amt, od.item_gst, od.return_order_gst_amt AS order_gst_amt, od.item_value as total_amount
            FROM cor_order_return_m AS o
 left join  cor_order_return_d AS od  ON  o.order_return_id = od.order_return_id
            left join cor_outlet_m ot ON o.outlet_id = ot.outlet_id
            left join cor_outlet_category_m otc ON ot.outlet_category_id = otc.outlet_category_id
            left join cor_customer_type_m ct ON ot.customer_type_id = ct.customer_type_id
            left join cor_mtp_a mtp ON o.order_return__date = mtp.outlet_date AND o.enter_by = mtp.user_id
            left join cor_beat_m b ON mtp.beat_id = b.beat_id
            left join cor_dealer_m dl ON ot.dealer_id = dl.dealer_id
            left join cor_zone_m z ON o.zone_id = z.zone_id
            left join cor_emp_m e ON o.enter_by = e.emp_id
            left join cor_emp_m r ON e.reporting_to = r.emp_id
            left join cor_sku_m sku ON od.item_id = sku.sku_id
            left join cor_segment_m seg ON sku.segment_id = seg.segment_id
        ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);
    sql.query(` SELECT
                  o.order_return_id AS order_id,o.order_return_time AS order_time, o.outlet_id,ot.outlet_name,ct.customer_type_name,otc.outlet_category_name,
                  b.beat_id,b.beat_name,ot.dealer_id,dl.dealer_name,
                  o.zone_id,z.zone_name, o.enter_by,e.user_name,   r.emp_id AS report_to, r.user_name as reporting_name,
                  od.order_return_reason AS remarks,o.return_order_lat AS lat,o.return_order_lag As lng,
                  CASE 
                  WHEN o.status=1 THEN "pending"
                  WHEN o.status=2 THEN "pending"
                  WHEN o.status=3 THEN "pending"
                  ELSE ""
                  END order_status,
                  od.item_id,sku.sku_name,seg.segment_code,sku_code, od.item_qty,
                  od.item_price_unit AS sku_price, od.return_order_amt AS order_amt, od.item_gst, od.return_order_gst_amt AS order_gst_amt, od.item_value as total_amount
                  FROM cor_order_return_m AS o
                  left join  cor_order_return_d AS od  ON  o.order_return_id = od.order_return_id
                  left join cor_outlet_m ot ON o.outlet_id = ot.outlet_id
                  left join cor_outlet_category_m otc ON ot.outlet_category_id = otc.outlet_category_id
                  left join cor_customer_type_m ct ON ot.customer_type_id = ct.customer_type_id
                  left join cor_mtp_a mtp ON o.order_return__date = mtp.outlet_date AND o.enter_by = mtp.user_id
                  left join cor_beat_m b ON mtp.beat_id = b.beat_id
                  left join cor_dealer_m dl ON ot.dealer_id = dl.dealer_id
                  left join cor_zone_m z ON o.zone_id = z.zone_id
                  left join cor_emp_m e ON o.enter_by = e.emp_id
                  left join cor_emp_m r ON e.reporting_to = r.emp_id
                  left join cor_sku_m sku ON od.item_id = sku.sku_id
                  left join cor_segment_m seg ON sku.segment_id = seg.segment_id
              ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
      async (err, res) => {

        // total = await countTotalRows(`select count(*)
        //AS total  FROM romsondb.cor_outlet_activity_m act,romsondb.cor_sku_m itm ,romsondb.cor_outlet_m outlet ,romsondb.cor_attendance_m att,romsondb.cor_emp_m emp,romsondb.cor_hospital_customer_m cus
        //                               ${queryWhere}`);

        total = await countTotalRows(`
                select count(o.order_return_id) AS total   FROM cor_order_return_m AS o
                left join  cor_order_return_d AS od  ON  o.order_return_id = od.order_return_id
                left join cor_outlet_m ot ON o.outlet_id = ot.outlet_id
                left join cor_outlet_category_m otc ON ot.outlet_category_id = otc.outlet_category_id
                left join cor_customer_type_m ct ON ot.customer_type_id = ct.customer_type_id
                left join cor_mtp_a mtp ON o.order_return__date = mtp.outlet_date AND o.enter_by = mtp.user_id
                left join cor_beat_m b ON mtp.beat_id = b.beat_id
                left join cor_dealer_m dl ON ot.dealer_id = dl.dealer_id
                left join cor_zone_m z ON o.zone_id = z.zone_id
                left join cor_emp_m e ON o.enter_by = e.emp_id
                left join cor_emp_m r ON e.reporting_to = r.emp_id
                left join cor_sku_m sku ON od.item_id = sku.sku_id
                left join cor_segment_m seg ON sku.segment_id = seg.segment_id
          ${queryWhere}`);

        result(total, helper.checkDataRows(err, res));
      });
  }
};




module.exports = report;
