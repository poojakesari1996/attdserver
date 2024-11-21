const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const designation = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Designation>
*/

designation.listDesignation = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "designation_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";


  var querySearch = '';
  var queryWhere = 'where deleted_at is null';
  var total = 0;

  if (search) {

    columnSearch = [
      'designation_name',
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

  sql.query( `select designation_id as id, designation_name,status from cor_designation_m ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
     // console.log("DesignationModel- listDesignation", res);
      total = await countTotalRows(`select count(*) AS total from cor_designation_m ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get Designation>
*/

designation.getDesignation= (request, result) => {
  console.log('model  ==================', request);
  const id = request.params.id;
  sql.query(`SELECT designation_id as id, designation_name,status FROM cor_designation_m where designation_id='${id}'`,
    (err, res) => {
        
      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Designation>
*/

designation.updateDesignation= (idData,data, result) => {
   
    updateQuery = helper.updateQuery(idData,data,'cor_designation_m') 
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
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Save Designation>
*/

designation.saveDesignation= (data, result) => {
   
  insertQuery = helper.insertQuery(data,'cor_designation_m') 
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
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Designation>
*/

designation.deleteDesignation= (id, result) => {
   
 
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_designation_m WHERE designation_id=${id}`,
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
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Change status Designation>
*/

designation.statusDesignation= (id, result) => {
   
 var data = {
  error:true,
}
var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, designation_id AS id FROM cor_designation_m where designation_id='${id}'`,
  (err, res) => {
    if(res){
      if(res.length >0){
        if(res[0].status == "I"){
          status="A"
        }else{
          status="I"
        }

        sql.query(`UPDATE cor_designation_m SET status='${status}' WHERE designation_id=${id}`,
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
*@Created On:       <06-03-2023>
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




module.exports = designation;
