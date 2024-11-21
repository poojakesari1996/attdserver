const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const area = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Area>
*/

area.listArea = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "area_id";
  const order = req.query.order || "ASC";
  const search = req.query.search || "";

  var querySearch = '';
  var queryWhere = 'where a.deleted_at is null';
  var total = 0;

  if (search) {

    columnSearch = [
      'area_name',
      'district_name',
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    var queryStatus = ` a.status = '${status}'`
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

//,c.city_id, c.city_name,s.state_id,s.state_name

  sql.query( `select a.area_id as id, a.area_name, d.district_name, d.district_id, a.status from cor_area_m AS a
              LEFT JOIN cor_district_m AS d ON a.district_id=d.district_id
              ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
     // console.log("AreaModel- listArea", res);
      total = await countTotalRows(`select count(area_id) AS total from cor_area_m AS a
                                    LEFT JOIN cor_district_m AS d ON a.district_id=d.district_id
                                    ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get Area>
*/

area.getArea= (request, result) => {
  console.log('model  ==================', request);
  const id = request.params.id;
  sql.query(`select a.area_id as id, a.area_name, d.district_name, d.district_id, a.status from cor_area_m AS a
              LEFT JOIN cor_district_m AS d ON a.district_id=d.district_id
              where area_id='${id}'`,
    (err, res) => {
        
      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Area>
*/

area.updateArea= (idData,data, result) => {
   
    updateQuery = helper.updateQuery(idData,data,'cor_area_m') 
    //console.log('updateQuery  ==================', updateQuery);
    sql.query(updateQuery,
      (err, res) => {

        if(res && res.affectedRows==1){
          data = {
            error:true,
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
*@Description:      <Save Area>
*/

area.saveArea= (data, result) => {
   
  insertQuery = helper.insertQuery(data,'cor_area_m') 
  console.log('insertQuery  ==================', insertQuery);
  sql.query(insertQuery,
    (err, res) => {

      if(res && res.affectedRows==1){
        data = {
          error:true,
          message:'Data inserted successfully.'
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
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Area>
*/

area.deleteArea= (id, result) => {
   
 
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_area_m WHERE area_id=${id}`,
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
*@Description:      <Change status Area>
*/

area.statusArea= (id, result) => {
   
 var data = {
  error:true,
}
var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, area_id AS id FROM cor_area_m where area_id='${id}'`,
  (err, res) => {
    if(res){
      if(res.length >0){
        if(res[0].status == "I"){
          status="A"
        }else{
          status="I"
        }

        sql.query(`UPDATE cor_area_m SET status='${status}' WHERE area_id=${id}`,
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




module.exports = area;
