const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const division = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Division>
*/

division.listDivision = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "division_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";


  var querySearch = '';
  var queryWhere = 'where c.deleted_at is null';
  var total = 0;

  if (search) {

    columnSearch = [
      'division_name',
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    var queryStatus = ` c.status = '${status}'`
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

  sql.query( `select division_id as id, c.division_name, c.status from cor_division_m AS c
            ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
     // console.log("DivisionModel- listDivision", res);
      total = await countTotalRows(`select count(division_id) AS total from cor_division_m AS c
       ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get Division>
*/

division.getDivision= (request, result) => {
  console.log('model  ==================', request);
  const id = request.params.id;
  sql.query(`SELECT  c.division_id as id, c.division_name, c.status  FROM cor_division_m AS c
   where c.division_id='${id}' AND deleted_at is null `,
    (err, res) => {
        
      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Division>
*/

division.updateDivision= (idData,data, result) => {
   
    updateQuery = helper.updateQuery(idData,data,'cor_division_m') 
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
            message:err 
          }
        }
           
        result(data);
      });
  };



  
/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Save Division>
*/

division.saveDivision= (data, result) => {
   
  insertQuery = helper.insertQuery(data,'cor_division_m') 
  console.log('insertQuery  ==================', insertQuery);
  sql.query(insertQuery,
    (err, res) => {

      if(res && res.affectedRows==1){
        response = {
          error:false,
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
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Division>
*/

division.deleteDivision= (id, result) => {
   
 
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_division_m WHERE division_id=${id}`,
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
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Change status Division>
*/

division.statusDivision= (id, result) => {
   
 var data = {
  error:true,
}
var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, division_id AS id FROM cor_division_m where division_id='${id}'`,
  (err, res) => {
    if(res){
      if(res.length >0){
        if(res[0].status == "I"){
          status="A"
        }else{
          status="I"
        }

        sql.query(`UPDATE cor_division_m SET status='${status}' WHERE division_id=${id}`,
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
*@Created On:       <07-03-2023>
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




module.exports = division;
