const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const outlet = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Outlet>
*/

outlet.listOutlet = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : '';
  const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  const dealerId = req.query.filter_dealer_id ? req.query.filter_dealer_id : 0;
  const approvalId = req.query.filter_approval_id ? req.query.filter_approval_id : 3;
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";


  var querySearch = '';
  var queryWhere = 'where o.deleted_at is null';
  var total = 0;

  if (search) {

    columnSearch = [
      'o.outlet_name',
      'o.address',
      'o.phone_number',
      'o.gst_in_number',
      'o.owner_name',
      's.state_name',
      'c.city_name',
      'd.district_name',
      // 'area_name', 
      'outlet_category_name',
      'beat_name',
      'customer_type_name'
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    queryWhere += ` AND o.status = '${status}'`
  }

  if (zoneId > 0) {
    queryWhere += ` AND b.zone_id = ${zoneId}`

  }
  // if (dealerId > 0) {
  //   queryWhere += ` AND o.dealer_id = ${dealerId}`
  // } 
  if (approvalId) {
    queryWhere += ` AND o.approved = ${approvalId}`
  }


  if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  }

  queryWhere += ` ORDER BY ${sort}  ${order}`


  console.log(`select o.*, state_name,city_name,z.zone_name,  city_name, district_name, area_name, outlet_category_name, beat_name, customer_type_name 
                from cor_outlet_m AS o 
                LEFT JOIN cor_state_m AS s ON o.state_id=s.state_id
                LEFT JOIN cor_city_m AS c ON o.city_id=c.city_id
                LEFT JOIN cor_district_m AS d ON o.district_id=d.district_id
                LEFT JOIN cor_area_m AS a ON o.area_id=a.area_id
                LEFT JOIN cor_outlet_category_m AS oc ON o.outlet_category_id=oc.outlet_category_id
                LEFT JOIN cor_beat_m AS b ON o.beat_id=b.beat_id
                LEFT JOIN cor_customer_type_m AS ct ON o.customer_type_id=ct.customer_type_id
                LEFT JOIN cor_zone_m AS z ON o.zone_id=z.zone_id
                ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);

  sql.query(`select o.*, dealer_name,state_name,z.zone_name, city_name, district_name, area_name, outlet_category_name, beat_name, customer_type_name from cor_outlet_m AS o 
                LEFT JOIN cor_state_m AS s ON o.state_id=s.state_id
                LEFT JOIN cor_city_m AS c ON o.city_id=c.city_id
                LEFT JOIN cor_district_m AS d ON o.district_id=d.district_id
                LEFT JOIN cor_area_m AS a ON o.area_id=a.area_id
                LEFT JOIN cor_outlet_category_m AS oc ON o.outlet_category_id=oc.outlet_category_id
                LEFT JOIN cor_beat_m AS b ON o.beat_id=b.beat_id
                LEFT JOIN cor_customer_type_m AS ct ON o.customer_type_id=ct.customer_type_id
                LEFT JOIN cor_dealer_m AS dd ON o.dealer_id = dd.dealer_id
                LEFT JOIN cor_zone_m AS z ON o.zone_id=z.zone_id
                ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {

      total = await countTotalRows(`select count(*) AS total from cor_outlet_m AS o 
                                    LEFT JOIN cor_state_m AS s ON o.state_id=s.state_id
                                    LEFT JOIN cor_city_m AS c ON o.city_id=c.city_id
                                    LEFT JOIN cor_district_m AS d ON o.district_id=d.district_id
                                    LEFT JOIN cor_area_m AS a ON o.area_id=a.area_id
                                    LEFT JOIN cor_outlet_category_m AS oc ON o.outlet_category_id=oc.outlet_category_id
                                    LEFT JOIN cor_beat_m AS b ON o.beat_id=b.beat_id
                                    LEFT JOIN cor_customer_type_m AS ct ON o.customer_type_id=ct.customer_type_id
                                    LEFT JOIN cor_dealer_m AS dd ON o.dealer_id = dd.dealer_id
                                    LEFT JOIN cor_zone_m AS z ON o.zone_id=z.zone_id
                                    ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get Outlet>
*/

outlet.getOutlet = (request, result) => {
  console.log('model  ==================', request);
  const id = request.params.id;
  sql.query(`select o.*, state_name, z.zone_name, city_name, district_name, outlet_category_name, beat_name, customer_type_name from cor_outlet_m AS o 
  LEFT JOIN cor_state_m AS s ON o.state_id=s.state_id
  LEFT JOIN cor_city_m AS c ON o.city_id=c.city_id
  LEFT JOIN cor_district_m AS d ON o.district_id=d.district_id
  LEFT JOIN cor_outlet_category_m AS oc ON o.outlet_category_id=oc.outlet_category_id
  LEFT JOIN cor_beat_m AS b ON o.beat_id=b.beat_id
  LEFT JOIN cor_customer_type_m AS ct ON o.customer_type_id=ct.customer_type_id
  LEFT JOIN cor_zone_m AS z ON o.zone_id=z.zone_id
  where id='${id}'`,
    (err, res) => {

      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Outlet>
*/

outlet.updateOutlet = (idData, data, result) => {

  updateQuery = helper.updateQuery(idData, data, 'cor_outlet_m')
  console.log('updateQuery  ==================', updateQuery);
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
          message: err
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
*@Description:      <Save Outlet>
*/

outlet.saveOutlet = (data, result) => {


  insertData = helper.insertFunction(data)

  console.log('insertQuery  ==================', `INSERT INTO cor_outlet_m  (outlet_id,${insertData.keys}) VALUES ((select all_auto_no(33)),(select all_auto_no(33)) AS auto1, ${insertData.values})`);
  sql.query(`INSERT INTO cor_outlet_m (outlet_id,${insertData.keys}) VALUES ( (select all_auto_no('33')), ${insertData.values})`,

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
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Outlet>
*/

outlet.deleteOutlet = (id, result) => {


  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_outlet_m WHERE id=${id}`,
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
*@Description:      <Change status Outlet>
*/

outlet.statusOutlet = (id, result) => {

  var data = {
    error: true,
  }
  var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, outlet_id AS id FROM cor_outlet_m where id='${id}'`,
    (err, res) => {
      if (res) {
        if (res.length > 0) {
          if (res[0].status == "I") {
            status = "A"
          } else {
            status = "I"
          }

          sql.query(`UPDATE cor_outlet_m SET status='${status}' WHERE id=${id}`,
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


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <08-05-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <upload outlet>
*/

outlet.uploadOutlet = (field, result) => {
  var response = {
    error: false,
    message: 'Data inserted successfully.'
  };
  for (const [key, data] of Object.entries(field)) {
    insertQuery = helper.insertQuery(data, 'cor_outlet_m')
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
      });
  }
  result(response);
};

/////////////

outlet.uploadNewOutlet = (field, result) => {
  var response =  {
    error:false,
    message:'Data inserted successfully.'
  };
  for (const [key, data] of Object.entries(field)) {
    insertQuery = helper.insertQuery(data,'cor_outlet_m') 
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


outlet.checkOutletId = (request, result) => {
  console.log('model  ==================', request);
  sql.query(`SELECT outlet_id,outlet_name FROM romsondb.cor_outlet_m`,
  (err, res) => {
    console.log("osbss: ", res);
    if (err) {
      result({ error: true, data: "Something Went Wrong" });
    }
    result(res);
  });
};

outlet.uploadNewCustomerOutlet = (field, result) => {
  var response =  {
    error:false,
    message:'Data inserted successfully.'
  };
  for (const [key, data] of Object.entries(field)) {
    insertQuery = helper.insertQuery(data,'cor_hospital_customer_m') 
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


module.exports = outlet;
