const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const state = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List State>
*/

state.listState = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "state_id";
  const order = req.query.order || "ASC";
  const search = req.query.search || "";


  var querySearch = '';
  var queryWhere = 'where deleted_at is null';
  var total = 0;

  if (search) {

    columnSearch = [
      'state_name',
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    var queryStatus = ` status = '${status}'`
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
  } else {
  }
  queryWhere += querySort;

  sql.query( `select state_id as id, state_name,status from cor_state_m ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
     // console.log("StateModel- listState", res);
      total = await countTotalRows(`select count(*) AS total from cor_state_m ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get State>
*/

state.getState= (request, result) => {
  console.log('model  ==================', request);
  const id = request.params.id;
  sql.query(`SELECT state_id as id, state_name,status FROM cor_state_m where state_id='${id}'`,
    (err, res) => {
        
      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update State>
*/

state.updateState= (idData,data, result) => {
   
    updateQuery = helper.updateQuery(idData,data,'cor_state_m') 
    //console.log('updateQuery  ==================', updateQuery);
    sql.query(updateQuery,
      (err, res) => {

        if(res && res.affectedRows==1){
          data = {
            error:false,
            message:'Data updated successfully.'
          }
        }else{
          data = {
            error:true,
            message:err.message 
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
*@Description:      <Save State>
*/

state.saveState= (data, result) => {
   
  insertQuery = helper.insertQuery(data,'cor_state_m') 
  console.log('insertQuery  ==================', insertQuery);
  sql.query(insertQuery,
    (err, res) => {

      if(res && res.affectedRows==1){
        response = {
          error:true,
          message:'Data inserted successfully.'
        }
      }else{
        response = {
          error:true,
          message:err.message 
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
*@Description:      <delete State>
*/

state.deleteState= (id, result) => {
   
 
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_state_m WHERE state_id=${id}`,
    (err, res) => {

      if(res && res.affectedRows==1){
        data = {
          error:false,
          message:'Data deleted successfully.'
        }
      }else{
        data = {
          error:true,
          message:err
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
*@Description:      <Change status State>
*/

state.statusState= (id, result) => {
   
 var data = {
  error:true,
}
var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, state_id AS id FROM cor_state_m where state_id='${id}'`,
  (err, res) => {
    if(res){
      if(res.length >0){
        if(res[0].status == "I"){
          status="A"
        }else{
          status="I"
        }

        sql.query(`UPDATE cor_state_m SET status='${status}' WHERE state_id=${id}`,
        (err, res) => {
    
          if(res && res.affectedRows==1){
            result( {
              error:false,
              message:status =='A' ? 'Data active successfully.' : 'Data inactive successfully.'
            });
          }else{
            result({...data,message: err});
          }    
        });

      }else{
        result({...data,message: err});
      }

    }else{
      result({...data,message: err});
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




module.exports = state;
