report.listAttendanceReport = (req, result) => {
  var moment = require('moment');
  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 500;
  const punchDate = req.query.punch_date || moment().format("YYYY-MM-DD"); // Use a specific date

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

  
  if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  }




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
  queryWhere += ` AND punch_date '${punchDate}'`;
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