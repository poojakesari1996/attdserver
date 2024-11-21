const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const beat = function (abc) {
    this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <08-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Beat>
*/

beat.listBeatWithOutletCount = (req, result) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 500;
    const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : "";
    const start = ((page - 1) * perPage);
    const sort = req.query.sort || "outlet_count";
    const order = req.query.order || "DESC";
    const search = req.query.search || "";

    var querySearch = '';
    var queryWhere = 'where b.deleted_at is null';
    var total = 0;

    if (search) {

        columnSearch = [
            'b.beat_name',
            'z.zone_name',
            'd.division_name',
            // 's.segment_code',
            'e.user_name'
        ]
        columnSearch.forEach(item => {
            querySearch += `${item} LIKE '%${search}%' OR `
        });

        if (querySearch) {
            querySearch = `(` + querySearch.slice(0, -4) + `)`
        }
    }

    if (zoneId) {
        queryWhere += ` AND b.zone_id =  ${zoneId} `
    }

    if (querySearch) {
        queryWhere += ` AND ${querySearch} `
    }

    queryWhere += ` ORDER BY ${sort}  ${order}`


    console.log(`select b.*, b.beat_id as id, z.zone_name,e.user_name,e.emp_id,d.division_name, cm.city_name, sm.state_name 
        (select count(outlet_id) from cor_outlet_m as o where o.beat_id = b.beat_id AND o.deleted_at is null AND o.status='A') AS outlet_count
        from cor_beat_m AS b 
        LEFT JOIN cor_zone_m AS z ON b.zone_id=z.zone_id
        LEFT JOIN cor_division_m AS d ON b.division_id=d.division_id 
        LEFT JOIN cor_emp_m AS e ON b.beat_assigning_form_id=e.emp_id
        LEFT JOIN cor_city_m AS cm ON b.city_id=cm.city_id
        LEFT JOIN cor_state_m AS sm ON b.state_id=sm.state_id
        ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);


    sql.query(`select b.*, b.beat_id as id, z.zone_name,e.user_name,e.emp_id,d.division_name, cm.city_name, sm.state_name,
                (select count(outlet_id) from cor_outlet_m as o where o.beat_id = b.beat_id AND o.deleted_at is null AND o.status='A') AS outlet_count
                from cor_beat_m AS b 
              LEFT JOIN cor_zone_m AS z ON b.zone_id=z.zone_id
              LEFT JOIN cor_division_m AS d ON b.division_id=d.division_id 
              LEFT JOIN cor_emp_m AS e ON b.beat_assigning_form_id=e.emp_id
              LEFT JOIN cor_city_m AS cm ON b.city_id=cm.city_id
              LEFT JOIN cor_state_m AS sm ON b.state_id=sm.state_id
             ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
        async (err, res) => {
            // console.log("BeatModel- listBeat", res);
            total = await countTotalRows(`
                    select count(beat_id) AS total  from 
                    (select b.beat_id,
                        (select count(outlet_id) from cor_outlet_m as o where o.beat_id = b.beat_id AND o.deleted_at is null AND o.status='A') AS outlet_count
                         from cor_beat_m AS b 
                        LEFT JOIN cor_zone_m AS z ON b.zone_id=z.zone_id
                        LEFT JOIN cor_division_m AS d ON b.division_id=d.division_id 
                        LEFT JOIN cor_emp_m AS e ON b.beat_assigning_form_id=e.emp_id
                        LEFT JOIN cor_city_m AS cm ON b.city_id=cm.city_id
                        LEFT JOIN cor_state_m AS sm ON b.state_id=sm.state_id
                    ${queryWhere} ) bb`);
            result(total, helper.checkDataRows(err, res));
        });
};





/*
*@Author:           <Ramesh Kumar>
*@Created On:       <08-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List mappingBeatList>
*/

beat.mappingBeatList = (req, result) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_per_page : 100;
    const assignStatus = req.query.filter_assign_status ? req.query.filter_assign_status.toUpperCase() : "";
    const zoneId = req.query.filter_zone_id ? req.query.filter_zone_id : "";
    const start = ((page - 1) * perPage);
    const sort = req.query.sort || "b.beat_id";
    const order = req.query.order || "DESC";
    const search = req.query.search || "";
    const userId = req.query.user_id || "";

    var currentUser = '';
    if (userId) {
        currentUser = ` AND  b.beat_assigning_form_id=${userId}`;
    }

    //console.log("++++++++++++++++++++++++++",user_id);


    //
    var querySearch = '';
    var queryWhere = 'where b.deleted_at is null';
    var total = 0;

    if (search) {

        columnSearch = [
            'b.beat_name',
            'z.zone_name',
            'd.division_name',
            // 's.segment_code',
            'e.user_name'
        ]
        columnSearch.forEach(item => {
            querySearch += `${item} LIKE '%${search}%' OR `
        });

        if (querySearch) {
            querySearch = `(` + querySearch.slice(0, -4) + `)`
        }
    }

    // if (assignStatus==1) {
    //     queryWhere += ` AND (b.beat_assigning_form_id > 0)`
    // }else{
    //     queryWhere += ` AND (b.beat_assigning_form_id is null OR b.beat_assigning_form_id = '')`
    // }

    if (zoneId) {
        queryWhere += ` AND b.zone_id =  ${zoneId} `
    }

    if (querySearch) {
        queryWhere += ` AND ${querySearch} `
    }

    // var groupBy = (` group by b.beat_id `);

    // if (groupBy) {
    //     queryWhere += groupBy;
    // }

    queryWhere += currentUser + ` ORDER BY ${sort}  ${order}`


    //     console.log(`select b.*, b.beat_id as id, z.zone_name,e.user_name,e.emp_id, GROUP_CONCAT(s.segment_code) AS segment_code,d.division_name, cm.city_name, sm.state_name  from cor_beat_m AS b 
    //   LEFT JOIN cor_zone_m AS z ON b.zone_id=z.zone_id
    //   LEFT JOIN cor_division_m AS d ON b.division_id=d.division_id 
    //   LEFT JOIN cor_beat_segment_r AS bs ON b.beat_id=bs.beat_id
    //   LEFT JOIN cor_segment_m AS s ON bs.segment_id=s.segment_id
    //   LEFT JOIN cor_emp_m AS e ON b.beat_assigning_form_id=e.emp_id
    //   LEFT JOIN cor_city_m AS cm ON b.city_id=cm.city_id
    //   LEFT JOIN cor_state_m AS sm ON b.state_id=sm.state_id
    //  ${queryWhere} LIMIT ${perPage} OFFSET ${start}`);
    console.log(`select b.*, b.beat_id as id, z.zone_name,e.user_name,e.emp_id,d.division_name, cm.city_name, sm.state_name  from cor_beat_m AS b 
LEFT JOIN cor_zone_m AS z ON b.zone_id=z.zone_id
LEFT JOIN cor_division_m AS d ON b.division_id=d.division_id 
LEFT JOIN cor_emp_m AS e ON b.beat_assigning_form_id=e.emp_id
LEFT JOIN cor_city_m AS cm ON b.city_id=cm.city_id
LEFT JOIN cor_state_m AS sm ON b.state_id=sm.state_id
${queryWhere} LIMIT ${perPage} OFFSET ${start}`);


    sql.query(`select b.*, b.beat_id as id, z.zone_name,e.user_name,e.emp_id,d.division_name, cm.city_name, sm.state_name  from cor_beat_m AS b 
              LEFT JOIN cor_zone_m AS z ON b.zone_id=z.zone_id
              LEFT JOIN cor_division_m AS d ON b.division_id=d.division_id 
              LEFT JOIN cor_emp_m AS e ON b.beat_assigning_form_id=e.emp_id
              LEFT JOIN cor_city_m AS cm ON b.city_id=cm.city_id
              LEFT JOIN cor_state_m AS sm ON b.state_id=sm.state_id
             ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
        async (err, res) => {
            // console.log("BeatModel- listBeat", res);
            total = await countTotalRows(`
        select count(beat_id) AS total  from 
        (select b.beat_id from cor_beat_m AS b 
        LEFT JOIN cor_zone_m AS z ON b.zone_id=z.zone_id
        LEFT JOIN cor_division_m AS d ON b.division_id=d.division_id
        LEFT JOIN cor_emp_m AS e ON b.beat_assigning_form_id=e.emp_id
        LEFT JOIN cor_city_m AS cm ON b.city_id=cm.city_id
        LEFT JOIN cor_state_m AS sm ON b.state_id=sm.state_id
         ${queryWhere} ) bb`);
            result(total, helper.checkDataRows(err, res));
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
*@Created On:       <20-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Beat>
*/

// beat.listBeat = (req, result) => {

//   //const page = req.query.page || 1;

//   sql.query( `select b.beat_id, b.beat_id as id,b.beat_name,b.division, z.zone_name from cor_beat_m AS b 
//                 LEFT JOIN cor_zone_m AS z ON b.zone_id=z.zone_id 
//                 where b.deleted_at is null`,
//     async (err, res) => {
//      // console.log("BeatModel- listBeat", res);

//       result(helper.checkDataRows(err, res));
//     });
// };











/*================================================================
                    ====user Beat====
==================================================================*/
/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Beat Table>
*/

beat.mappingBeatUpdate = (idData, data, result) => {

    updateQuery = helper.updateQuery(idData, data, 'cor_beat_m')
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
*@Description:      <Change Status Beat>
*/

beat.updateAndInsertBeatBeat = (data, result) => {
    console.log(`SELECT id FROM cor_beat_user_a where beat_id='${data.beat_id}' AND beat_id='${data.beat_id}' AND deleted_at is NULL`)
    sql.query(`SELECT id FROM cor_beat_user_a where beat_id='${data.beat_id}' AND deleted_at is NULL`,
        (err, res) => {
            if (res) {
                if (res.length > 0) {
                    updateBeatUserDeletedAt(res[0].id, data.enter_date, data.enter_by)
                }
            }
        });


    insertQuery = helper.insertQuery(data, 'cor_beat_user_a')
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
*@Description:      <Update Beat User Table>
*/

beat.mappingBeatUserUpdate = (data, result) => {

    sql.query(`SELECT id FROM cor_beat_user_a where beat_id='${data.beat_id}' AND deleted_at is NULL`,
        (err, res) => {
            if (res) {
                if (res.length > 0) {
                    result(updateBeatUserDeletedAt(res[0].id, data.deleted_at, data.deleted_by));
                } else {
                    result({ error: true, message: err });
                }
            }
        });
};


const updateBeatUserDeletedAt = (id, date, deleted_by) => {

    sql.query(`UPDATE cor_beat_user_a SET deleted_at='${date}', deleted_by='${deleted_by}' WHERE id=${id}`,
        (err, res) => {
            return { error: false, message: err };
        });
}

module.exports = beat;