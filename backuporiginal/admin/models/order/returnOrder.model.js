const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const returnOrder = function (abc) {
  this.title = abc.title;

};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List ReturnOrder>
*/

returnOrder.listReturnOrder = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.items_per_page || 10;
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "order_return_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";
  const status = req.query.status || "";


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
      'order_return_id',
      'phone_no',
      'amount',
      'discount_amount',
      //'order_date',
      'outlet_name',
      'dealer_name',

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

  if (status) {
    queryWhere += ` AND status = '${status}'`
  }

  queryWhere += ` ORDER BY ${sort}  ${order}`

  console.log(`select emp_approval.user_name as approval_name, outlet_name,o.*,o.Approval_Remarks as remarks,o.order_return_id As id,dealer_name,ou.dealer_id from cor_order_return_m AS o
      left join cor_outlet_m AS ou ON o.outlet_id=ou.outlet_id
      left join cor_dealer_m AS d ON ou.dealer_id=d.dealer_id
      left join cor_emp_m AS emp_approval ON o.Approval_By=emp_approval.emp_id
      ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);

  sql.query(`select emp_approval.user_name as approval_name, outlet_name,o.*,o.Approval_Remarks as remarks,o.order_return_id As id,dealer_name,ou.dealer_id 
      from cor_order_return_m AS o
      left join cor_outlet_m AS ou ON o.outlet_id=ou.outlet_id
      left join cor_dealer_m AS d ON ou.dealer_id=d.dealer_id
      left join cor_emp_m AS emp_approval ON o.Approval_By=emp_approval.emp_id
      ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {

      total = await countTotalRows(`select count(*) AS total from cor_order_return_m AS o
      left join cor_outlet_m AS ou ON o.outlet_id=ou.outlet_id
      left join cor_dealer_m AS d ON ou.dealer_id=d.dealer_id
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
*@Description:      <Update ReturnOrder Status>
*/

returnOrder.statusReturnOrder = (idData, data, result) => {

  updateQuery = helper.updateQuery(idData, data, 'cor_order_return_m')
  console.log('updateQuery  ==================', updateQuery);
  sql.query(updateQuery,
    (err, res) => {

      if (res && res.affectedRows == 1) {
        data = {
          error: false,
          message: 'ReturnOrder updated successfully.'
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
*@Description:      <Get ReturnOrder Detals>  
*/

returnOrder.getReturnOrderDetails = (req, result) => {
  // console.log('model  ==================', req);
  var order = [];
  const id = req.params.id;

  sql.query(`select outlet_name,o.*,o.order_return_id As id,dealer_name, ou.phone_number as outlet_phone_number from cor_order_return_m AS o
   left join cor_outlet_m AS ou ON o.outlet_id=ou.outlet_id
   left join cor_dealer_m AS d ON ou.dealer_id=d.dealer_id
   where o.order_return_id='${id}'`,
    (err, res1) => {
      try {
        if (err) {
          console.log(err);
        } else
          if (res1.length > 0) {
            order = res1[0];

            console.log(order);

            sql.query(`SELECT d.order_return_id AS id,d.order_return_id ,d.order_return_reason, i.sku_name AS item_name, i.sku_code AS item_code, d.item_price_unit,d.item_qty, d.return_order_amt AS total_quantity, d.item_value AS discount_amount,d.return_order_gst_amt, d.item_gst 
            FROM cor_order_return_d AS d
            LEFT JOIN cor_sku_m AS i ON d.item_id =i.sku_id 
            where d.order_return_id='${id}'`,
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
                        data: {...order, returnOrders: res }
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


module.exports = returnOrder;
