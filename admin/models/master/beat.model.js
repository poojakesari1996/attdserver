const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const beat = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Beat>
*/

beat.listBeat = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "b.beat_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";
  const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  const divisionId = req.query.filter_division_id ? req.query.filter_division_id : 0;

  var querySearch = '';
  var queryWhere = 'where b.deleted_at is null';
  var total = 0;

  if (search) {

    columnSearch = [
      'b.beat_name',
      'z.zone_name',
      'd.division_name',
      's.segment_code',
      'e.user_name'
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  if (status) {
    var queryStatus = ` b.status = '${status}'`
  } else {
    var queryStatus = ``
  }

  if (querySearch && queryStatus) {
    queryWhere += ` AND ${querySearch} AND ${queryStatus} `
  } else if (querySearch) {
    queryWhere += ` AND ${querySearch} `
  } else if (queryStatus) {
    queryWhere += ` AND ${queryStatus} `
  } else {
  }
  if (zoneId > 0) {
    queryWhere += ` AND b.zone_id = ${zoneId}`
 
  } 
  if (divisionId > 0) {
    queryWhere += ` AND b.division_id = ${divisionId}`
  }
  var groupBy = (` group by b.beat_id `);
  var querySort = ` ORDER BY ${sort}  ${order}`

  queryWhere += groupBy + querySort;

  sql.query(`select b.*, b.beat_id as id, z.zone_name,e.user_name,e.emp_id, GROUP_CONCAT(s.segment_code) AS segment_code,d.division_name, cm.city_name, sm.state_name, ds.district_name 
            from cor_beat_m AS b 
            LEFT JOIN cor_zone_m AS z ON b.zone_id=z.zone_id
            LEFT JOIN cor_division_m AS d ON b.division_id=d.division_id 
            LEFT JOIN cor_beat_segment_r AS bs ON b.beat_id=bs.beat_id
            LEFT JOIN cor_segment_m AS s ON bs.segment_id=s.segment_id
            LEFT JOIN cor_emp_m AS e ON b.beat_assigning_form_id=e.emp_id
            LEFT JOIN cor_city_m AS cm ON b.city_id=cm.city_id
            LEFT JOIN cor_state_m AS sm ON b.state_id=sm.state_id
            LEFT JOIN cor_district_m AS ds ON b.district_id=ds.district_id
            

           ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
      // console.log("BeatModel- listBeat", res);
      total = await countTotalRows(`
      select count(beat_id) AS total  from 
      (select b.beat_id from cor_beat_m AS b 
      LEFT JOIN cor_zone_m AS z ON b.zone_id=z.zone_id
      LEFT JOIN cor_division_m AS d ON b.division_id=d.division_id
      LEFT JOIN cor_beat_segment_r AS bs ON b.beat_id=bs.beat_id
      LEFT JOIN cor_segment_m AS s ON bs.segment_id=s.segment_id
      LEFT JOIN cor_emp_m AS e ON b.beat_assigning_form_id=e.emp_id
      LEFT JOIN cor_city_m AS cm ON b.city_id=cm.city_id
      LEFT JOIN cor_state_m AS sm ON b.state_id=sm.state_id
      LEFT JOIN cor_district_m AS ds ON b.district_id=ds.district_id
       ${queryWhere} ) bb`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get Beat>  
*/

beat.getBeat = (req, result) => {
 // console.log('model  ==================', req);
  const id = req.params.id;
  sql.query(`SELECT *, beat_id AS id FROM cor_beat_m where beat_id='${id}'`,
    (err, res) => {

      result(helper.checkDataRow(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Beat>
*/

beat.updateBeat = (idData, data, result) => {

  updateQuery = helper.updateQuery(idData, data, 'cor_beat_m')
  //console.log('updateQuery  ==================', updateQuery);
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
          message: err.message
        }
      }

      result(data);
    });
};




/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Save Beat>
*/

beat.saveBeat = (data, result) => {

  insertQuery = helper.insertQuery(data, 'cor_beat_m')
  console.log('insertQuery  ==================', insertQuery);
  sql.query(insertQuery,
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
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Beat>
*/

beat.deleteBeat = (id, result) => {


  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_beat_m WHERE beat_id=${id}`,
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
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Change status Beat>
*/

beat.statusBeat = (id, result) => {

  var data = {
    error: true,
  }
  var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, beat_id AS id FROM cor_beat_m where beat_id='${id}'`,
    (err, res) => {
      if (res) {
        if (res.length > 0) {
          if (res[0].status == "I") {
            status = "A"
          } else {
            status = "I"
          }

          sql.query(`UPDATE cor_beat_m SET status='${status}' WHERE beat_id=${id}`,
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
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <count Total Rows>
*/

const countTotalRows = (query) => {
  //console.log(query);
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
*@Created On:       <03-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Beat Segment Relation>
*/

beat.deleteBeatSegment = (beat_id, result) => {
  console.log(`DELETE FROM cor_beat_segment_r WHERE beat_id=${beat_id}`);
  sql.query(`DELETE FROM cor_beat_segment_r WHERE beat_id=${beat_id}`,
    (err, res) => {
      if (res && res.affectedRows == 1) {
        response = {
          error: false,
          message: 'Data deleted successfully.'
        }
      } else {
        response = {
          error: true,
          message: err
        }
      }

      result(response);
    });


};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <03-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <insert Beat Segment Relation>
*/

beat.insertBeatSegment = (data, result) => {

  insertQuery = helper.insertData(data, 'cor_beat_segment_r')
  console.log('insertBeatSegment  ==================', insertQuery);
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
      result(response);
    });
}

module.exports = beat;
