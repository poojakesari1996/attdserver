const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const order = function (abc) {
  this.title = abc.title;

};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Order>
*/

order.listOrder = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "order_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";
  //const status = req.query.status || "";
  const status = req.query.filter_status ? req.query.filter_status : 0;
  const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  const divisionId = req.query.filter_division_id ? req.query.filter_division_id : 0;
  const userId = req.query.filter_user_id ? req.query.filter_user_id : 0;


  var user = JSON.parse(req.headers.authorization)

  var querySearch = '';
  var queryWhere = 'where o.deleted_at is null';
  var total = 0;

  if (user.role == 1) {

  } else {

    queryWhere += ` AND o.employee_id in (WITH RECURSIVE subordinate AS (
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
      'order_id',
      'phone_no',
      'amount',
      'discount_amount',
      'order_date',
      'outlet_name',
      'dealer_name',
      'o.employee_id'
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    queryWhere += ` AND o.status = '${status}'`
  }

  if (querySearch) {
    queryWhere += ` AND ${querySearch}`
  }

  if (zoneId > 0) {
    queryWhere += ` AND o.zone_id = ${zoneId}`

  }
  if (divisionId > 0) {
    queryWhere += ` AND o.division_m= ${divisionId}`
  }
  if (userId > 0) {
    queryWhere += ` AND em.emp_id = ${userId}`
  }

  queryWhere += ` ORDER BY ${sort}  ${order}`

  console.log(`select emp_approval.user_name as approval_name, ou.outlet_name,bt.beat_name,z.zone_name,dv.division_id,dv.division_name,em.emp_id,em.user_name,o.*,o.order_id As id,ou.dealer_id,dealer_name 
  from cor_order_m AS o
  left join cor_outlet_m AS ou ON o.outlet_id=ou.outlet_id
  left join cor_dealer_m AS d ON ou.dealer_id=d.dealer_id
  left join cor_zone_m AS z ON o.zone_id=z.zone_id
  left join cor_division_m AS dv ON o.division_m=dv.division_id
  left join cor_emp_m AS em ON o.employee_id=em.emp_id
  left join cor_beat_m AS bt ON o.beat_id=bt.beat_id
  left join cor_emp_m AS emp_approval ON o.Approval_By=emp_approval.emp_id
 ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);

  sql.query(`select emp_approval.user_name as approval_name, ou.outlet_name,bt.beat_name,z.zone_name,dv.division_id,dv.division_name,em.emp_id,em.user_name,o.*,o.Approval_Remarks as remarks,o.order_id As id,ou.dealer_id,dealer_name,
  (SELECT ROUND(sum(order_gst_amt), 2)  As gst_amount FROM romsondb.cor_order_d where order_id=o.order_id) gst_amt
  from cor_order_m AS o
  left join cor_outlet_m AS ou ON o.outlet_id=ou.outlet_id
  left join cor_dealer_m AS d ON ou.dealer_id=d.dealer_id
  left join cor_zone_m AS z ON o.zone_id=z.zone_id
  left join cor_division_m AS dv ON o.division_m=dv.division_id
  left join cor_emp_m AS em ON o.employee_id=em.emp_id
  left join cor_beat_m AS bt ON o.beat_id=bt.beat_id
  left join cor_emp_m AS emp_approval ON o.Approval_By=emp_approval.emp_id
  ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {

      total = await countTotalRows(`select count(*) AS total from cor_order_m AS o
      left join cor_outlet_m AS ou ON o.outlet_id=ou.outlet_id
      left join cor_dealer_m AS d ON ou.dealer_id=d.dealer_id
      left join cor_zone_m AS z ON o.zone_id=z.zone_id
      left join cor_division_m AS dv ON o.division_m=dv.division_id
      left join cor_emp_m AS em ON o.employee_id=em.emp_id
      left join cor_beat_m AS bt ON o.beat_id=bt.beat_id
      left join cor_emp_m AS emp_approval ON o.Approval_By=emp_approval.emp_id
     ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <13-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Order Status>
*/

order.statusOrder = (idData, data, result) => {

  updateQuery = helper.updateQuery(idData, data, 'cor_order_m')
  console.log('updateQuery  ==================', updateQuery);
  sql.query(updateQuery,
    (err, res) => {

      if (res && res.affectedRows == 1) {
        data = {
          error: false,
          message: 'Order updated successfully.'
        }
      } else {
        data = {
          error: true,
          message: err
        }
      }

      result(data);
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <13-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get Order Detals>  
*/

order.getOrderDetails = (req, result) => {
  // console.log('model  ==================', req);
  var order = [];
  const id = req.params.id;

  sql.query(`select outlet_name,bt.beat_name,o.*,o.order_id As id,dealer_name, ou.phone_number as outlet_phone_number from cor_order_m AS o
   left join cor_outlet_m AS ou ON o.outlet_id=ou.outlet_id
   left join cor_dealer_m AS d ON ou.dealer_id=d.dealer_id
   left join cor_beat_m AS bt ON o.beat_id=bt.beat_id
   where o.order_id='${id}'`,
    (err, res1) => {
      try {
        if (err) {
          console.log(err);
        } else
          if (res1.length > 0) {
            order = res1[0];

            console.log(order);

            sql.query(`SELECT d.order_id AS id,d.order_id , i.sku_name AS item_name, i.sku_code AS item_code, d.item_price_unit,d.item_qty, d.item_discount, d.item_value, d.item_gst, d.order_amt, d.order_taxable_amt, d.order_gst_amt FROM cor_order_d AS d
              LEFT JOIN cor_sku_m AS i ON d.item_id =i.sku_id
              where d.order_id='${id}'`,
              (err, res) => {
                try {
                  if (err) {
                    response = {
                      error: true,
                      message: err.message || "Some error occurred while query run."
                    }
                  } else if (res) {
                    if (res.length > 0) {
                      response = {
                        error: false,
                        data: { ...order, orders: res }
                      }
                    } else {
                      response = {
                        error: true,
                        message: 'Data not found.'
                      }
                    }
                  } else {
                    response = {
                      error: true,
                      message: 'Data not found.'
                    }

                  }

                } catch {
                  response = {
                    error: true,
                    message: err.message || "Some error occurred while query run."
                  }
                }

                result(response);
              });

          }
      } catch {
        response = {
          error: true,
          message: err.message || "Some error occurred while query run."
        }
      }

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


module.exports = order;
