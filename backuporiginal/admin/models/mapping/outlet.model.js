const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const outlet = function (abc) {
    this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Outlet Table>
*/

outlet.mappingOutletUpdate = (idData, data, result) => {

    updateQuery = helper.updateQuery(idData, data, 'cor_outlet_m')
    console.log('updateQuery  ==================', updateQuery);
    sql.query(updateQuery,
        (err, res) => {
            if (res && res.affectedRows == 1) {
                data = {
                    error: false,
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
*@Created On:       <11-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Change Status Outlet>
*/

outlet.updateAndInsertBeatOutlet = (data, result) => {
//console.log(`SELECT id FROM cor_beat_outlet_a where beat_id='${data.beat_id}' AND outlet_id='${data.outlet_id}' AND deleted_at is NULL`)
    sql.query(`SELECT id FROM cor_beat_outlet_a where outlet_id='${data.outlet_id}' AND deleted_at is NULL`,
        (err, res) => {
            if (res) {
                if (res.length > 0) {
                    updateBeatOutletDeletedAt(res[0].id, data.enter_date,data.enter_by)
                }
            }
        });


    insertQuery = helper.insertQuery(data, 'cor_beat_outlet_a')
    console.log('insertQuery  ==================', insertQuery);
    sql.query(insertQuery,
        (err, res) => {
            if (res && res.affectedRows == 1) {
                resData = {
                    error: false,
                    message: 'Data inserted successfully.'
                }
            } else {
                resData = {
                    error: true,
                    message: err
                }
            }
            result(resData);
        });


};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Beat Outlet Table>
*/

outlet.mappingBeatOutletUpdate = (data, result) => {

    sql.query(`SELECT id FROM cor_beat_outlet_a where outlet_id='${data.outlet_id}' AND deleted_at is NULL`,
        (err, res) => {
            if (res) {
                if (res.length > 0) {
                    result(updateBeatOutletDeletedAt(res[0].id,data.deleted_at, data.deleted_by));
                } else {
                    result({ error: true, message: err });
                }
            }
        });
};


const updateBeatOutletDeletedAt = (id, date, deleted_by) => {

    sql.query(`UPDATE cor_beat_outlet_a SET deleted_at='${date}', deleted_by='${deleted_by}' WHERE id=${id}`,
        (err, res) => {
            return { error: false, message: err };
        });
}

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <22-06-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Outlet>
*/

outlet.listOutlet = (req, result) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 500;
    const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : '';
    const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;

    const start = ((page - 1) * perPage);
    const sort = req.query.sort || "o.beat_id";
    const order = req.query.order || "DESC";
    const search = req.query.search || "";
    const beatId = req.query.beat_id ? req.query.beat_id : 0;
    
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
  
    // if (status) {
    //   queryWhere += ` AND o.status = '${status}'`
    // }
  
    // if (zoneId > 0) {
    //   queryWhere += ` AND b.zone_id = ${zoneId}`
  
    // }
    // if (dealerId > 0) {
    //   queryWhere += ` AND o.dealer_id = ${dealerId}`
    // } 
   
      queryWhere += ` AND o.approved = 1`
      beatId
      queryWhere += ` AND (o.beat_id = ${beatId} ) `
      //queryWhere += ` AND (o.beat_id = ${beatId} OR o.beat_id = '' OR o.beat_id is null ) `
  
  
    if (querySearch) {
      queryWhere += ` AND ${querySearch} `
    }
  
    queryWhere += ` ORDER BY ${sort}  ${order}`
  
  
    console.log(`select o.*, state_name, city_name, district_name, area_name, outlet_category_name, beat_name, customer_type_name from cor_outlet_m AS o 
                  LEFT JOIN cor_state_m AS s ON o.state_id=s.state_id
                  LEFT JOIN cor_city_m AS c ON o.city_id=c.city_id
                  LEFT JOIN cor_district_m AS d ON o.district_id=d.district_id
                  LEFT JOIN cor_area_m AS a ON o.area_id=a.area_id
                  LEFT JOIN cor_outlet_category_m AS oc ON o.outlet_category_id=oc.outlet_category_id
                  LEFT JOIN cor_beat_m AS b ON o.beat_id=b.beat_id
                  LEFT JOIN cor_customer_type_m AS ct ON o.customer_type_id=ct.customer_type_id
                  ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);
  
    sql.query(`select o.*, dealer_name,state_name, city_name, district_name, area_name, outlet_category_name, beat_name, customer_type_name from cor_outlet_m AS o 
                  LEFT JOIN cor_state_m AS s ON o.state_id=s.state_id
                  LEFT JOIN cor_city_m AS c ON o.city_id=c.city_id
                  LEFT JOIN cor_district_m AS d ON o.district_id=d.district_id
                  LEFT JOIN cor_area_m AS a ON o.area_id=a.area_id
                  LEFT JOIN cor_outlet_category_m AS oc ON o.outlet_category_id=oc.outlet_category_id
                  LEFT JOIN cor_beat_m AS b ON o.beat_id=b.beat_id
                  LEFT JOIN cor_customer_type_m AS ct ON o.customer_type_id=ct.customer_type_id
                  LEFT JOIN cor_dealer_m AS dd ON o.dealer_id = dd.dealer_id
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
                                      ${queryWhere}`);
        result(total, helper.checkDataRows(err, res));
      });
  };


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <22-06-2023>
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


module.exports = outlet;
