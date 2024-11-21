const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const scheme = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Scheme>
*/

scheme.listScheme = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "scheme_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";
  const divisionId = req.query.filter_division_id || "";
  


  var querySearch = '';
  var queryWhere = 'where c.deleted_at is null';
  var total = 0;

  if (search) {

    columnSearch = [
      'scheme_name',
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

  if (divisionId) {
    queryWhere += ` AND c.division_id = '${divisionId}'  `
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

  console.log( `select scheme_id as id, c.scheme_name,c.division_id,c.segment_id,d.division_name,s.segment_code AS segment_name, c.status, c.for_amount, c.for_order_value,c.start_date_time,end_date_time 
                from cor_scheme_m AS c
                LEFT JOIN cor_division_m AS d ON c.division_id = d.division_id
                LEFT JOIN cor_segment_m AS s ON c.segment_id = s.segment_id
                ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);


  sql.query( `select scheme_id as id, c.scheme_name,c.division_id,c.segment_id,d.division_name,s.segment_code AS segment_name, c.status, c.for_amount, c.for_order_value,c.start_date_time,end_date_time 
              from cor_scheme_m AS c
              LEFT JOIN cor_division_m AS d ON c.division_id = d.division_id
              LEFT JOIN cor_segment_m AS s ON c.segment_id = s.segment_id
              ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
     // console.log("SchemeModel- listScheme", res);
      total = await countTotalRows(`select count(scheme_id) AS total from cor_scheme_m AS c
       ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get Scheme>
*/

scheme.getScheme= (request, result) => {
  console.log('model  ==================', request);
  const id = request.params.id;
  sql.query(`SELECT  c.scheme_id as id, c.scheme_name,c.division_id,c.segment_id,d.division_name,s.segment_code AS segment_name, c.status, c.for_amount, c.for_order_value,DATE_FORMAT(c.start_date_time, "%Y-%m-%d %H:%i") AS start_date_time,DATE_FORMAT(c.end_date_time, "%Y-%m-%d %H:%i") AS end_date_time  
    FROM cor_scheme_m AS c
    LEFT JOIN cor_division_m AS d ON c.division_id = d.division_id
    LEFT JOIN cor_segment_m AS s ON c.segment_id = s.segment_id
   where c.scheme_id='${id}' AND c.deleted_at is null `,
    (err, res) => {
        
      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Scheme>
*/

scheme.updateScheme= (idData,data, result) => {
   
    updateQuery = helper.updateQuery(idData,data,'cor_scheme_m') 
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
*@Description:      <Save Scheme>
*/

scheme.saveScheme= (data, result) => {
   
  insertQuery = helper.insertQuery(data,'cor_scheme_m') 
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
*@Description:      <delete Scheme>
*/

scheme.deleteScheme= (id, result) => {
   
 
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_scheme_m WHERE scheme_id=${id}`,
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
*@Description:      <Change status Scheme>
*/

scheme.statusScheme= (id, result) => {
   
 var data = {
  error:true,
}
var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, scheme_id AS id FROM cor_scheme_m where scheme_id='${id}'`,
  (err, res) => {
    if(res){
      if(res.length >0){
        if(res[0].status == "I"){
          status="A"
        }else{
          status="I"
        }

        sql.query(`UPDATE cor_scheme_m SET status='${status}' WHERE scheme_id=${id}`,
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




module.exports = scheme;
