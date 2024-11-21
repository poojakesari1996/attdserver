const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const expense = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List ExpenseEntry>
*/

expense.listExpenseEntry = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "exp.exp_date";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";
  var user = JSON.parse(req.headers.authorization);

  var querySearch = '';
  var queryWhere = 'where exp.deleted_at is null';
  var total = 0;


  if (user.role == 1) {

  } else {

    queryWhere += ` AND exp.exp_emp_id in (WITH RECURSIVE subordinate AS (
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
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    queryWhere += ` exp.status = '${status}'`;
  }
  if (querySearch) {
    queryWhere += ` AND ${querySearch}`;
  }

  queryWhere += ` ORDER BY ${sort}  ${order}`;

  console.log(`select emp.user_name,exp.*,exp.exp_id as id,des.designation_id,des.designation_name, dv.division_name,
  (ifnull(exp_distance,0)+ifnull(exp_ta,0)+ifnull(exp_da,0)+ifnull(exp_hotel_exp,0) +ifnull(exp_stationery,0) +
ifnull(exp_printing,0) +ifnull(exp_medical,0) +ifnull(exp_postage,0) +ifnull(exp_fooding,0) +ifnull(exp_t_meeting,0) 
+ifnull(exp_internet,0) +ifnull(exp_mobile,0) 
+ifnull(exp_misc,0) ) exp_total
from cor_expense_d AS exp
LEFT JOIN cor_emp_m AS emp ON exp.exp_emp_id= emp.emp_id
LEFT JOIN cor_designation_m AS des ON emp.designation= des.designation_id
LEFT JOIN cor_division_m AS dv ON exp.exp_division = dv.division_id
            ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);

  sql.query(`select emp.user_name,exp.*,exp.exp_id as id,des.designation_id,des.designation_name, dv.division_name,
            (ifnull(exp_distance,0)+ifnull(exp_ta,0)+ifnull(exp_da,0)+ifnull(exp_hotel_exp,0) +ifnull(exp_stationery,0) +
            ifnull(exp_printing,0) +ifnull(exp_medical,0) +ifnull(exp_postage,0) +ifnull(exp_fooding,0) +ifnull(exp_t_meeting,0) 
            +ifnull(exp_internet,0) +ifnull(exp_mobile,0)+ifnull(exp_misc,0) ) exp_total 
            from cor_expense_d AS exp
            LEFT JOIN cor_emp_m AS emp ON exp.exp_emp_id= emp.emp_id
            LEFT JOIN cor_designation_m AS des ON emp.designation= des.designation_id
            LEFT JOIN cor_division_m AS dv ON exp.exp_division = dv.division_id
           ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
      // console.log("ExpenseEntryModel- listExpenseEntry", res);
      total = await countTotalRows(`
      select count(exp.exp_id) AS total from cor_expense_d AS exp
      LEFT JOIN cor_emp_m AS emp ON exp.exp_emp_id= emp.emp_id
      LEFT JOIN cor_designation_m AS des ON emp.designation= des.designation_id
      LEFT JOIN cor_division_m AS dv ON exp.exp_division = dv.division_id
       ${queryWhere} `);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get ExpenseEntry>  
*/

expense.getExpenseEntry = (req, result) => {
  // console.log('model  ==================', req);
  const id = req.params.id;
  sql.query(`SELECT *, exp_id AS id FROM cor_expense_d where exp_id='${id}'`,
    (err, res) => {

      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update ExpenseEntry>
*/

expense.updateExpenseEntry = (idData, data, result) => {

  updateQuery = helper.updateQuery(idData, data, 'cor_expense_d')
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(updateQuery,
    (err, res) => {

      if (res && res.affectedRows == 1) {
        data = {
          error: true,
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
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Save ExpenseEntry>
*/

expense.saveExpenseEntry = (data, result) => {

  insertQuery = helper.insertQuery(data, 'cor_expense_d')
  console.log('insertQuery  ==================', insertQuery);
  sql.query(insertQuery,
    (err, res) => {

      if (res && res.affectedRows == 1) {
        data = {
          error: true,
          message: 'Data inserted successfully.'
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
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete ExpenseEntry>
*/

expense.deleteExpenseEntry = (id, result) => {


  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_expense_d WHERE exp_id=${id}`,
    (err, res) => {

      if (res && res.affectedRows == 1) {
        data = {
          error: false,
          message: 'Data deleted successfully.'
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
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Change status ExpenseEntry>
*/

expense.statusExpenseEntry = (id, result) => {

  var data = {
    error: true,
  }
  var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, exp_id AS id FROM cor_expense_d where exp_id='${id}'`,
    (err, res) => {
      if (res) {
        if (res.length > 0) {
          if (res[0].status == "I") {
            status = "A"
          } else {
            status = "I"
          }

          sql.query(`UPDATE cor_expense_d SET status='${status}' WHERE exp_id=${id}`,
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






/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <count Total Rows>
*/

const countTotalRows = (query) => {
  //console.log(query);
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
*@Created On:       <03-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update ExpenseEntry Segment Relation>
*/

expense.deleteExpenseEntrySegment = (exp_id, result) => {
  console.log(`DELETE FROM cor_expense_segment_r WHERE exp_id=${exp_id}`);
  sql.query(`DELETE FROM cor_expense_segment_r WHERE exp_id=${exp_id}`,
    (err, res) => {
      if (res && res.affectedRows == 1) {
        response = {
          error: false,
          message: 'Data deleted successfully.'
        }
      } else {
        response = {
          error: true,
          message: err
        }
      }

      result(response);
    });


};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <03-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <insert ExpenseEntry Segment Relation>
*/

expense.insertExpenseEntrySegment = (data, result) => {

  insertQuery = helper.insertData(data, 'cor_expense_segment_r')
  console.log('insertExpenseEntrySegment  ==================', insertQuery);
  sql.query(insertQuery,
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
}

///

expense.expenseBulkEntry = (field, result) => {
  var response = {
    error: false,
    message: 'Data processed successfully.'
  };

  const updatePromises = [];

  for (const [key, data] of Object.entries(field)) {
    const designationId = data.designation_id;
    const checkExistingQuery = `SELECT * FROM cor_expense_m WHERE designation_id = ${designationId}`;

    const updatePromise = new Promise((resolve, reject) => {
      sql.query(checkExistingQuery, (err, existingRows) => {
        if (err) {
          response = {
            error: true,
            message: err.message
          };
          reject(response);
        } else {
          if (existingRows.length === 0) {
            const insertQuery = helper.insertQuery(data, 'cor_expense_m');
            sql.query(insertQuery, (err, res) => {
              if (err) {
                response = {
                  error: true,
                  message: err.message
                };
                reject(response);
              }
              resolve();
            });
          } else {
            const updateQueries = existingRows.map(existingData => {
              let shouldUpdate = false;
              for (const column in data) {
                if (column !== 'designation_id' && existingData[column] !== data[column]) {
                  shouldUpdate = true;
                  break;
                }
              }
              if (shouldUpdate) {
                const updateQuery = `UPDATE cor_expense_m SET ${sql.escape(data)} WHERE designation_id = ${designationId}`;
                return new Promise((resolve, reject) => {
                  sql.query(updateQuery, (err, res) => {
                    if (err) {
                      response = {
                        error: true,
                        message: err.message
                      };
                      reject(response);
                    }
                    resolve();
                  });
                });
              }
            });
            Promise.all(updateQueries)
              .then(() => resolve())
              .catch(errorResponse => reject(errorResponse));
          }
        }
      });
    });

    updatePromises.push(updatePromise);
  }

  Promise.all(updatePromises)
    .then(() => result(response))
    .catch(errorResponse => result(errorResponse));
};




module.exports = expense;
