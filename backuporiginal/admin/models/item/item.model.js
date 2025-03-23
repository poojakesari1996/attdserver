const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const item = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Item>
*/

item.listItem = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const divisionId = req.query.filter_division_id ? req.query.filter_division_id : 0;
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "i.sku_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";


  var querySearch = '';
  var queryWhere = 'where i.deleted_at is null';
  var total = 0;

  if (search) {

    columnSearch = [
      'sku_name',
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    var queryStatus = ` i.status = '${status}'`
  } else {
    var queryStatus = ``
  }

  if (divisionId > 0) {
    queryWhere += ` AND d.division_id = ${divisionId}`
  }


  var querySort = ` ORDER BY ${sort}  ${order}`

  if (querySearch && queryStatus) {
    queryWhere += ` AND ${querySearch} AND ${queryStatus} `
  } else if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  } else if (queryStatus) {
    queryWhere += ` AND ${queryStatus} `
  } else {
  }
  queryWhere += querySort;



  sql.query(`select i.*, i.sku_id as id, d.division_id, d.division_name, s.segment_id, s.segment_code from cor_sku_m AS i
              LEFT JOIN cor_division_m AS d ON i.division_id = d.division_id
              LEFT JOIN cor_segment_m AS s ON i.segment_id = s.segment_id
              ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
      // console.log("ItemModel- listItem", res);
      total = await countTotalRows(`select count(sku_id) AS total from cor_sku_m AS i
                                    LEFT JOIN cor_division_m AS d ON i.division_id = d.division_id
                                    LEFT JOIN cor_segment_m AS s ON i.segment_id = s.segment_id
                                    ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get Item>
*/

item.getItem = (request, result) => {
  console.log('model  ==================', request);
  const id = request.params.id;
  sql.query(`select i.*, i.sku_id as id from cor_sku_m AS i
              where sku_id='${id}'`,
    (err, res) => {
      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Item>
*/

item.updateItem = (idData, data, result) => {

  updateQuery = helper.updateQuery(idData, data, 'cor_sku_m')
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
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Save Item>
*/

item.saveItem = (data, result) => {

  insertQuery = helper.insertQuery(data, 'cor_sku_m')
  console.log('insertQuery  ==================', insertQuery);
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
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Item>
*/

item.deleteItem = (id, result) => {


  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_sku_m WHERE sku_id=${id}`,
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
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Change status Item>
*/

item.statusItem = (id, result) => {

  var data = {
    error: true,
  }
  var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, sku_id AS id FROM cor_sku_m where sku_id='${id}'`,
    (err, res) => {
      if (res) {
        if (res.length > 0) {
          if (res[0].status == "I") {
            status = "A"
          } else {
            status = "I"
          }

          sql.query(`UPDATE cor_sku_m SET status='${status}' WHERE sku_id=${id}`,
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
*@Created On:       <11-01-2023>
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


item.itemBulkUser = (field, result) => {
  var response =  {
    error:false,
    message:'Data inserted successfully.'
  };
  for (const [key, data] of Object.entries(field)) {
    insertQuery = helper.insertQuery(data,'cor_sku_m') 
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



module.exports = item;
