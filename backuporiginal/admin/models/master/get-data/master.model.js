const sql = require("../../db.js");
const helper = require("../../../helper/helper.js");

// constructor
const master = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all zone>
*/

master.zone = (result) => {

  sql.query(`select zone_id, zone_name from cor_zone_m where deleted_at is null AND status='A'`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};




/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all state>
*/

master.state = (result) => {

  sql.query(`select state_id, state_name from cor_state_m where deleted_at is null AND status='A'`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all city>
*/

master.city = (req, result) => {
  var state_id = req.params.state_id;
  //console.log(`select district_id, district_name from cor_district_m where deleted_at is null AND status='A' AND state_id=${state_id}`)
  sql.query(`select city_id, city_name from cor_city_m where deleted_at is null AND status='A' AND state_id=${state_id} ORDER BY city_name`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all district>
*/

master.district = (req, result) => {
  var state_id = req.params.state_id;

  sql.query(`select district_id, district_name from cor_district_m where deleted_at is null AND status='A' AND state_id=${state_id}`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all area>
*/

master.area = (result) => {

  sql.query(`select area_id, area_name from cor_area_m where deleted_at is null AND status='A'`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all division>
*/

master.division = (result) => {

  sql.query(`select division_id, division_name from cor_division_m where deleted_at is null AND status='A'`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all segment>
*/

master.segment = (result) => {

  sql.query(`select segment_id, segment_code from cor_segment_m where deleted_at is null AND status='A'`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all outlet_category>
*/

master.outlet_category = (result) => {

  sql.query(`select outlet_category_id, outlet_category_name from cor_outlet_category_m where deleted_at is null AND status='A'`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all customer_type>
*/

master.customer_type = (res, result) => {
  var outlet_category_id = res.params.outlet_category_id;
  sql.query(`select customer_type_id, customer_type_name from cor_customer_type_m where outlet_category_id=${outlet_category_id}`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <02-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all Sales Man Users>
*/

master.SalesManUsers = (req, result) => {
  var zone_id = req.params.zone_id;
  sql.query(`select e.emp_id AS beat_assigning_form_id, e.user_name, d.division_name from cor_emp_m AS e
                Left JOIN cor_division_m As d ON e.division = d.division_id
                where  e.zone_id=${zone_id} AND e.deleted_at is null AND e.status='A' 
                ORDER BY  e.user_name`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};

//(e.role=6 OR role=3 OR role=11)   AND


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <03-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all Reporting Users>
*/

master.ReportingUsers = (req, result) => {

  sql.query(`select user_name, emp_id As reporting_id from cor_emp_m 
                where deleted_at is null AND status='A' 
                ORDER BY  user_name`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all designation>
*/

master.designation = (result) => {

  sql.query(`select designation_id, designation_name from cor_designation_m where deleted_at is null AND status='A'`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all role>
*/

master.role = (result) => {

  sql.query(`select role_id, role_name from cor_role_m where deleted_at is null AND status='A'`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all role>
*/

master.Menu= (result) => {

  sql.query(`select menu_id, menu_name from cor_menu_m where deleted_at is null AND status='A'`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all Department>
*/

master.Department = (result) => {

  sql.query(`select department_id, department_name from cor_department_m where deleted_at is null AND status='A'`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all warehouse>
*/

master.Warehouse = (req, result) => {
  //var state_id = req.params.state_id;
  sql.query(`select warehouse_id, warehouse_name from cor_warehouse_m where deleted_at is null AND status='A' ORDER BY warehouse_name`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all beat>
*/

master.Beat = (req, result) => {
  sql.query(`select beat_id, beat_name from cor_beat_m where deleted_at is null AND status='A' 
             ORDER BY beat_name`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};
/*
*@Author:           <Ramesh Kumar>
*@Created On:       <22-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all beatByAddress>
*/
//AND district_id=${district_id} 
master.beatByAddress = (req, result) => {
  var state_id = req.params.state_id;
  var city_id = req.params.city_id;
  var district_id = req.params.district_id;
  sql.query(`select beat_id, beat_name from cor_beat_m where deleted_at is null AND status='A' 
              AND state_id=${state_id}  AND city_id=${city_id}   ORDER BY beat_name`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all zone>
*/

master.Dealer = (req, result) => {
 
  let zone_id = req.params.zone_id;
  let query = zone_id === '0' ? '':` AND zone_id=${zone_id}`;
  sql.query(`select dealer_id, dealer_name from cor_dealer_m where deleted_at is null ${query} AND status='A'
               ORDER BY dealer_name`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <22-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all dealerByAddress>
*/

master.dealerByAddress = (req, result) => {

  var state_id = req.params.state_id;
  var city_id = req.params.city_id;
  var district_id = req.params.district_id;
  //console.log(`select dealer_id, dealer_name from cor_dealer_m where deleted_at is null AND state_id=${state_id}  AND city_id=${city_id}  AND district_id=${district_id}  AND status='A' ORDER BY dealer_name`);
  sql.query(`select dealer_id, dealer_name from cor_dealer_m where deleted_at is null AND state_id=${state_id}  AND city_id=${city_id}  AND district_id=${district_id}  AND status='A' ORDER BY dealer_name`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <13-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all outlets>
*/

master.outlets = (req, result) => {
// sql.query(`select outlet_id, outlet_name from cor_outlet_m where deleted_at is null AND status='A' ORDER BY outlet_name`,
  //var state_id = req.params.state_id;
  sql.query(`select outlet_id, CONCAT(outlet_name," (",beat_name,")") AS outlet_name from cor_outlet_m AS o
              left join cor_beat_m AS b ON o.beat_id= b.beat_id
              where o.deleted_at is null AND o.status='A' ORDER BY outlet_name`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all getUsersByReportingId>
*/

master.getUsersByReportingId = (req, result) => {

  var user = JSON.parse(req.headers.authorization)
  var queryWhere = '';
  if (user.role == 1) {

  }else {

   queryWhere +=  ` AND emp_id in (WITH RECURSIVE subordinate AS (
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

console.log(`select user_name, emp_id AS user_id from cor_emp_m 
where deleted_at is null AND status='A' ${queryWhere}
ORDER BY  emp_id`);

  sql.query(`select user_name, emp_id AS user_id from cor_emp_m 
                where deleted_at is null AND status='A' ${queryWhere}
                ORDER BY  emp_id`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};




/*
*@Author:           <Ramesh Kumar>
*@Created On:       <24-05-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <getMasterCount>
*/

master.getMasterCount = (req, result) => {

  var table = req.params.table;

  sql.query(` select COUNT(status) total, SUM(status ='A') active, SUM(status = 'I') inactive from ${table} where deleted_at is null;`,
    async (err, res) => {
      result(helper.checkDataRow(err, res));
    });
};


master.getOrderCount = (req, result) => {

  var table = req.params.table;

  sql.query(` select  COUNT(status) total, SUM(status = '1') pending, SUM(status ='2') accept , SUM(status = '3') reject  from ${table} where deleted_at is null;`,
    async (err, res) => {
      result(helper.checkDataRow(err, res));
    });
};



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all getUsersByReportingId>
*/

master.getUsersExpenseAdded = (req, result) => {
  var moment = require('moment');
  var exp_date = req.params.exp_date ? moment(req.params.exp_date).format('YYYY-MM'): moment().format('YYYY-MM');
  var user = JSON.parse(req.headers.authorization)
  var queryWhere = '';
  if (user.role == 1) {

  }else {

   queryWhere +=  ` AND emp_id in (WITH RECURSIVE subordinate AS (
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

console.log(`select user_name, emp_id AS user_id from cor_emp_m 
where deleted_at is null AND status='A'
AND emp_id in(select exp_emp_id from cor_expense_d where exp_date like '${exp_date}%' group by exp_emp_id)
 ${queryWhere}
ORDER BY  user_name`);

  sql.query(`select user_name, emp_id AS user_id from cor_emp_m 
                where deleted_at is null AND status='A'
                AND emp_id in(select exp_emp_id from cor_expense_d where exp_date like '${exp_date}%' group by exp_emp_id)
                 ${queryWhere}
                ORDER BY  user_name`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get all getUsersByReportingId>
*/

master.getAllMtpUsers = (req, result) => {

  var user = JSON.parse(req.headers.authorization)
  var query = '';
  if (user.role == 1) {

  }else {

   query +=  ` AND emp_id in (WITH RECURSIVE subordinate AS (
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

console.log(`select user_name, emp_id AS user_id from cor_mtp_a As M  
            Left Join cor_emp_m E M.user_id = E.emp_id
            where deleted_at is null AND status='A'
            ${query} GROUP BY M.user_id
            ORDER BY user_name`);

  sql.query(`select user_name, emp_id AS user_id from cor_mtp_a As M  
              Left Join cor_emp_m E ON M.user_id = E.emp_id
              where E.deleted_at is null AND E.status='A'
              ${query} GROUP BY M.user_id
              ORDER BY user_name`,
    async (err, res) => {
      result(helper.checkDataRows(err, res));
    });
};




master.getAttendanceCount = (req, result) => {

  var table = req.params.table;

  sql.query(` select  COUNT(status) total, SUM(status = '1') pending, SUM(status ='2') accept , SUM(status = '3') reject  from ${table} where deleted_at is null;`,
    async (err, res) => {
      result(helper.checkDataRow(err, res));
    });
};

master.getAttendanceStatusCount = (req, result) => {

  var table = req.params.table;
console.log(`SELECT COUNT(if(if(status = 1, 'P', 'N/A')='P', CASE WHEN status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS Present, COUNT(if(if(holiday_status = 1, 'H', 'N/A')='H', CASE WHEN status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS Holidays, COUNT(if(if(holiday_status = 2, 'W', 'N/A')='W', CASE WHEN status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS Weekends,  COUNT(if(if(leave_status = 2, 'L', 'N/A')='L', CASE WHEN status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS Leaves
FROM cor_attendance_m
WHERE 'punch_date' =  ${helper.date()}`);
  sql.query(`SELECT COUNT(if(if(status = 1, 'P', 'N/A')='P', CASE WHEN status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS Present, COUNT(if(if(holiday_status = 1, 'H', 'N/A')='H', CASE WHEN status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS Holidays, COUNT(if(if(holiday_status = 2, 'W', 'N/A')='W', CASE WHEN status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS Weekends,  COUNT(if(if(leave_status = 2, 'L', 'N/A')='L', CASE WHEN status = 1 THEN 'P' WHEN holiday_status = 2 THEN 'W' WHEN holiday_status = 1 THEN 'H' WHEN leave_status = 2 THEN 'L' ELSE 'N/A' END, null)) AS Leaves
  FROM cor_attendance_m
  WHERE punch_date =  '${helper.date()}'`,
   async (err, res) => {
      result(helper.checkDataRow(err, res));
    });
};



module.exports = master;