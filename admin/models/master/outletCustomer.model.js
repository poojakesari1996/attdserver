const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const outletCustomer = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List OutletCustomer>
*/

outletCustomer.listOutletCustomer = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "hospital_customer_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";
  const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;


  var querySearch = '';
  var queryWhere = 'where c.deleted_at is null ';
  var total = 0;

  if (search) {

    columnSearch = [
      'z.zone_name',
      'o.outlet_name',
      'c.outlet_id',
      'c.customer_name',
      'c.customer_type',
      'c.customer_department',
      'c.customer_designation',
      'c.customer_catagary',
      'c.customer_contact_no',
      'c.email'
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    var queryStatus = `  c.status = '${status}'`
  } else {
    var queryStatus = ``
  }

  
  if (zoneId > 0) {
    queryWhere += ` AND o.zone_id = ${zoneId}`
 
  }

  if (querySearch && queryStatus) {
    queryWhere += ` AND ${querySearch} AND ${queryStatus} `
  } else if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  } else if (queryStatus) {
    queryWhere += ` AND ${queryStatus} `
  } else {
  }

  var querySort = ` ORDER BY ${sort}  ${order}`
  queryWhere += querySort;
console.log(`select c.hospital_customer_id as id,o.outlet_name, c.* from cor_hospital_customer_m AS c
LEFT JOIN cor_outlet_m AS o ON c.outlet_id=o.outlet_id
LEFT JOIN cor_zone_m AS z ON o.zone_id=z.zone_id
${queryWhere} LIMIT ${perPage} OFFSET ${start}`);

  sql.query( `select z.zone_id,z.zone_name,c.hospital_customer_id as id,o.outlet_name, c.* from cor_hospital_customer_m AS c
            LEFT JOIN cor_outlet_m AS o ON c.outlet_id=o.outlet_id
            LEFT JOIN cor_zone_m AS z ON o.zone_id=z.zone_id
            ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
     // console.log("OutletCustomerModel- listOutletCustomer", res);
      total = await countTotalRows(`select count(hospital_customer_id) AS total from cor_hospital_customer_m AS c
                                   LEFT JOIN cor_outlet_m AS o ON c.outlet_id=o.outlet_id
                                   LEFT JOIN cor_zone_m AS z ON o.zone_id=z.zone_id
                                  ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get OutletCustomer>
*/

outletCustomer.getOutletCustomer= (request, result) => {
 // console.log('model  ==================', ``;
  const id = request.params.id;
  sql.query(`SELECT  c.hospital_customer_id as id,c.*  FROM cor_hospital_customer_m AS c
   where c.hospital_customer_id='${id}' AND deleted_at is null `,
    (err, res) => {
        
      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update OutletCustomer>
*/

outletCustomer.updateOutletCustomer= (idData,data, result) => {
   
    updateQuery = helper.updateQuery(idData,data,'cor_hospital_customer_m') 
    console.log('updateQuery  ==================', updateQuery);
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
*@Description:      <Save OutletCustomer>
*/

outletCustomer.saveOutletCustomer= (data, result) => {
   
  insertQuery = helper.insertQuery(data,'cor_hospital_customer_m') 
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
*@Description:      <delete OutletCustomer>
*/

outletCustomer.deleteOutletCustomer= (id, result) => {
   
 
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_hospital_customer_m WHERE hospital_customer_id=${id}`,
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
*@Description:      <Change status OutletCustomer>
*/

outletCustomer.statusOutletCustomer= (id, result) => {
   
 var data = {
  error:true,
}
var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT status FROM cor_hospital_customer_m where hospital_customer_id='${id}'`,
  (err, res) => {
    if(res){
      if(res.length >0){
        if(res[0].status == "I" || res[0].status == null || res[0].status == ''){
          status="A"
        }else{
          status="I"
        }

        sql.query(`UPDATE cor_hospital_customer_m SET status='${status}' WHERE hospital_customer_id=${id}`,
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




module.exports = outletCustomer;
