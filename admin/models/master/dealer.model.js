const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const dealer = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Dealer>
*/

dealer.listDealer = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "d.dealer_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";

  const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  const divisionId = req.query.filter_division_id ? req.query.filter_division_id : 0;

  var querySearch = '';
 
  var queryWhere = 'where d.deleted_at is null';
  var total = 0;

  if (search) {

    columnSearch = [
      'dv.division_name',
      'w.warehouse_name',
      'd.dealer_id',
      'd.erp_id',
      'd.dealer_name',
      'zm.zone_name',
      'sm.state_name',
      'cm.city_name',
      'dm.district_name',
      'd.address',
      'd.phone_number',
      'd.email',
      'd.tax_number',
      'd.gst_in_number',
      'd.license_number',
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    var queryStatus = ` d.status = '${status}'`
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

  if (zoneId > 0) {
    queryWhere += ` AND d.zone_id = ${zoneId}`
 
  } 
  if (divisionId > 0) {
    queryWhere += ` AND d.division_id = ${divisionId}`
  }

  queryWhere += querySort;

  sql.query( `select d.*, d.dealer_id as id, w.warehouse_id, w.warehouse_name, dv.division_id, dv.division_name, zm.zone_id, zm.zone_name,sm.state_id,sm.state_name,cm.city_id,cm.city_name,dm.district_id, dm.district_name from cor_dealer_m AS d 
              LEFT JOIN cor_division_m AS dv ON d.division_id=dv.division_id
              LEFT JOIN cor_zone_m AS zm ON d.zone_id=zm.zone_id
              LEFT JOIN cor_warehouse_m AS w ON d.warehouse_id=w.warehouse_id
              LEFT JOIN cor_state_m AS sm ON d.state_id=sm.state_id
              LEFT JOIN cor_city_m AS cm ON d.city_id=cm.city_id
              LEFT JOIN cor_district_m AS dm ON d.district_id=dm.district_id
              ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
     // console.log("DealerModel- listDealer", res);
      total = await countTotalRows(`select count(*) AS total from cor_dealer_m AS d 
                                    LEFT JOIN cor_division_m AS dv ON d.division_id=dv.division_id
                                    LEFT JOIN cor_zone_m AS zm ON d.zone_id=zm.zone_id
                                    LEFT JOIN cor_warehouse_m AS w ON d.warehouse_id=w.warehouse_id
                                    LEFT JOIN cor_state_m AS sm ON d.state_id=sm.state_id
                                    LEFT JOIN cor_city_m AS cm ON d.city_id=cm.city_id
                                    LEFT JOIN cor_district_m AS dm ON d.district_id=dm.district_id
                                    ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get Dealer>
*/

dealer.getDealer= (request, result) => {
  console.log('model  ==================', request);
  const id = request.params.id;
  sql.query(`SELECT *, dealer_id AS id FROM cor_dealer_m where dealer_id='${id}'`,
    (err, res) => {
        
      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Dealer>
*/

dealer.updateDealer= (idData,data, result) => {
   
    updateQuery = helper.updateQuery(idData,data,'cor_dealer_m') 
    console.log('updateQuery  ==================', updateQuery);
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
*@Description:      <Save Dealer>
*/

dealer.saveDealer= (data, result) => {
   
  insertQuery = helper.insertQuery(data,'cor_dealer_m') 
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
*@Description:      <delete Dealer>
*/

dealer.deleteDealer= (id, result) => {
   
 
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_dealer_m WHERE dealer_id=${id}`,
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
*@Description:      <Change status Dealer>
*/

dealer.statusDealer= (id, result) => {
   
 var data = {
  error:true,
}
var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, dealer_id AS id FROM cor_dealer_m where dealer_id='${id}'`,
  (err, res) => {
    if(res){
      if(res.length >0){
        if(res[0].status == "I"){
          status="A"
        }else{
          status="I"
        }

        sql.query(`UPDATE cor_dealer_m SET status='${status}' WHERE dealer_id=${id}`,
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


dealer.uploadDealerExcel = (field, result) => {
  var response =  {
    error:false,
    message:'Data inserted successfully.'
  };
  for (const [key, data] of Object.entries(field)) {
    insertQuery = helper.insertQuery(data,'cor_dealer_m') 
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




module.exports = dealer;
