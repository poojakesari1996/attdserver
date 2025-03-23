const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const warehouse = function (abc) {
  this.title = abc.title;

};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Warehouse>
*/

warehouse.listWarehouse = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "warehouse_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";

  var querySearch = '';
  var queryWhere = 'where w.deleted_at is null';
  var total = 0;

  if (search) {

    columnSearch = [
        'w.warehouse_name',
        'w.address',
        'w.email',
        'w.phone_number',
        'w.gst_in_number',
        'zm.zone_name',
        'sm.state_name',
        'cm.city_name',
        'dm.district_name',
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    var queryStatus = ` w.status = '${status}'`
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


  sql.query( `select w.*,warehouse_id as id, zm.zone_id, zm.zone_name,sm.state_id,sm.state_name,cm.city_id,cm.city_name,dm.district_id, dm.district_name from cor_warehouse_m AS w
              LEFT JOIN cor_zone_m AS zm ON w.zone_id=zm.zone_id
              LEFT JOIN cor_state_m AS sm ON w.state_id=sm.state_id
              LEFT JOIN cor_city_m AS cm ON w.city_id=cm.city_id
              LEFT JOIN cor_district_m AS dm ON w.district_id=dm.district_id
            ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
     // console.log("WarehouseModel- listWarehouse", res);
      total = await countTotalRows(`select count(*) AS total from cor_warehouse_m AS w
                                LEFT JOIN cor_zone_m AS zm ON w.zone_id=zm.zone_id
                                LEFT JOIN cor_state_m AS sm ON w.state_id=sm.state_id
                                LEFT JOIN cor_city_m AS cm ON w.city_id=cm.city_id
                                LEFT JOIN cor_district_m AS dm ON w.district_id=dm.district_id
                                    ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <02-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get Warehouse>
*/

warehouse.getWarehouse= (request, result) => {
 // console.log('model  ==================', request);
  const id = request.params.id;
  sql.query(`select w.*, warehouse_id as id, zm.zone_id, zm.zone_name,sm.state_id,sm.state_name,cm.city_id,cm.city_name,dm.district_id, dm.district_name from cor_warehouse_m AS w
            LEFT JOIN cor_zone_m AS zm ON w.zone_id=zm.zone_id
            LEFT JOIN cor_state_m AS sm ON w.state_id=sm.state_id
            LEFT JOIN cor_city_m AS cm ON w.city_id=cm.city_id
            LEFT JOIN cor_district_m AS dm ON w.district_id=dm.district_id
            where warehouse_id='${id}'`,
    (err, res) => {
        
      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Warehouse>
*/

warehouse.updateWarehouse= (idData,data, result) => {
   
    updateQuery = helper.updateQuery(idData,data,'cor_warehouse_m') 
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
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Save Warehouse>
*/

warehouse.saveWarehouse= (data, result) => {
   
  insertQuery = helper.insertQuery(data,'cor_warehouse_m') 
  console.log('insertQuery  ==================', insertQuery);
  sql.query(insertQuery,
    (err, res) => {

      if(res && res.affectedRows==1){
        data = {
          error:false,
          message:'Data inserted successfully.'
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
*@Description:      <delete Warehouse>
*/

warehouse.deleteWarehouse= (id, result) => {
   
 
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_warehouse_m WHERE warehouse_id=${id}`,
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
*@Description:      <Change status Warehouse>
*/

warehouse.statusWarehouse= (id, result) => {
   
 var data = {
  error:true,
}
var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, warehouse_id AS id FROM cor_warehouse_m where warehouse_id='${id}'`,
  (err, res) => {
    if(res){
      if(res.length >0){
        if(res[0].status == "I"){
          status="A"
        }else{
          status="I"
        }

        sql.query(`UPDATE cor_warehouse_m SET status='${status}' WHERE warehouse_id=${id}`,
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

module.exports = warehouse;
