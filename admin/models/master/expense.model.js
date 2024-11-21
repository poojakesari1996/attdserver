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
*@Description:      <List Expense>
*/

expense.listExpense = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "e.exp_master_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";

  var querySearch = '';
  var queryWhere = 'where e.deleted_at is null';
  var total = 0;

  if (search) {

    columnSearch = [
      'r.designation_name',
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    var queryStatus = ` e.status = '${status}'`
  } else {
    var queryStatus = ``
  }

  if (querySearch && queryStatus) {
    queryWhere += ` AND ${querySearch} AND ${queryStatus} `
  } else if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  } else if (queryStatus) {
    queryWhere += ` AND ${queryStatus} `
  } else {
  }

  //var groupBy = (` group by e.exp_master_id `);
  var querySort = ` ORDER BY ${sort}  ${order}`

  queryWhere += querySort;
console.log(`select e.*,e.exp_master_id as id,r.designation_name   from cor_expense_m AS e 
              LEFT JOIN cor_designation_m AS r ON e.designation_id=r.designation_id
 ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);
  sql.query(`select e.*,e.exp_master_id as id,r.designation_name   from cor_expense_m AS e 
            LEFT JOIN cor_designation_m AS r ON e.designation_id=r.designation_id
           ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
      // console.log("ExpenseModel- listExpense", res);
      total = await countTotalRows(`
      select count(e.exp_master_id) AS total from cor_expense_m AS e 
      LEFT JOIN cor_designation_m AS r ON e.designation_id=r.designation_id
       ${queryWhere} `);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get Expense>  
*/

expense.getExpense = (req, result) => {
 // console.log('model  ==================', req);
  const id = req.params.id;
  sql.query(`SELECT *, exp_master_id AS id FROM cor_expense_m where exp_master_id='${id}'`,
    (err, res) => {

      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Expense>
*/

expense.updateExpense = (idData, data, result) => {

  updateQuery = helper.updateQuery(idData, data, 'cor_expense_m')
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
*@Description:      <Save Expense>
*/

expense.saveExpense = (data, result) => {

  insertQuery = helper.insertQuery(data, 'cor_expense_m')
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
*@Description:      <delete Expense>
*/

expense.deleteExpense = (id, result) => {


  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_expense_m WHERE exp_master_id=${id}`,
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
*@Description:      <Change status Expense>
*/

expense.statusExpense = (id, result) => {

  var data = {
    error: true,
  }
  var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, exp_master_id AS id FROM cor_expense_m where exp_master_id='${id}'`,
    (err, res) => {
      if (res) {
        if (res.length > 0) {
          if (res[0].status == "I") {
            status = "A"
          } else {
            status = "I"
          }

          sql.query(`UPDATE cor_expense_m SET status='${status}' WHERE exp_master_id=${id}`,
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
*@Description:      <update Expense Segment Relation>
*/

expense.deleteExpenseSegment = (exp_master_id, result) => {
  console.log(`DELETE FROM cor_expense_segment_r WHERE exp_master_id=${exp_master_id}`);
  sql.query(`DELETE FROM cor_expense_segment_r WHERE exp_master_id=${exp_master_id}`,
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
*@Description:      <insert Expense Segment Relation>
*/

expense.insertExpenseSegment = (data, result) => {

  insertQuery = helper.insertData(data, 'cor_expense_segment_r')
  console.log('insertExpenseSegment  ==================', insertQuery);
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

module.exports = expense;
