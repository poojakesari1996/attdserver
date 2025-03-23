const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const mtp = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <20-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Mtp>
*/

// mtp.listMtp = (req, result) => {

//   //const page = req.query.page || 1;

//   sql.query( `select m.id,e.emp_id, m.beat_id,m.outlet_date AS beat_date,m.enter_date, e.user_name,b.beat_name from cor_mtp_a AS m
//                 LEFT JOIN cor_emp_m AS e ON m.user_id=e.emp_id 
//                 LEFT JOIN cor_beat_m AS b ON m.beat_id=b.beat_id 
//                 where b.deleted_at is null`,
//     async (err, res) => {
//      // console.log("MtpModel- listMtp", res);
      
//       result(helper.checkDataRows(err, res));
//     });
// };


mtp.listMtp = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 100;
  const enterDate = req.query.filter_enter_date ? req.query.filter_enter_date : helper.date();
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";

  var division_id = req.query.filter_division_id ? req.query.filter_division_id : 0;
  var zone_id = req.query.filter_zone_id ? req.query.filter_zone_id : 0;
  var user_id = req.query.filter_user_id ? req.query.filter_user_id : 0;

  const startDate = req.query.filter_startdate ? req.query.filter_startdate : helper.date();
  const endDate = req.query.filter_enddate ? req.query.filter_enddate : '';

  // console.log(helper.dateFormat(startDate));
  //    console.log(helper.dateFormat(endDate));

  var querySearch = '';
  var query = 'where m.deleted_at is null ';

  var total = 0;
  if (search) {
    columnSearch = [
        'b.beat_name',
        'e.user_name',
        'd.division_name',
        'z.zone_name'
    ]
    columnSearch.forEach(item => {
      querySearch += `${item} LIKE '%${search}%' OR `
    });

    if (querySearch) {
      querySearch = `(` + querySearch.slice(0, -4) + `)`
    }
  }

  // if (enterDate ) {
  //   query += ` AND m.outlet_date = '${enterDate}'`
  // }

  if(endDate != ''){
 
    query += ` AND m.outlet_date BETWEEN '${helper.dateFormat(startDate)}' AND '${helper.dateFormat(endDate)}' `;
  }else{
    query +=  ` AND m.outlet_date = '${helper.dateFormat(startDate)}' `
  }

  if(division_id >0 ){
    query += ` AND b.division_id =  ${division_id}`;
  }
  if(zone_id > 0){
    query += ` AND e.zone_id =  ${zone_id}`;
  }
  if(user_id > 0){
    query += ` AND m.user_id = ${user_id}`;
  }
  if(querySearch){
    query += ` AND ${querySearch} `;
  }
  query += ` ORDER BY ${sort}  ${order}`


  sql.query( `select m.id,e.emp_id, m.beat_id,m.outlet_date AS beat_date,m.enter_date, e.user_name,b.beat_name, b.division_id, e.zone_id, d.division_name,z.zone_name 
              from cor_mtp_a AS m
              LEFT JOIN cor_emp_m AS e ON m.user_id=e.emp_id 
              LEFT JOIN cor_beat_m AS b ON m.beat_id=b.beat_id 
              left join cor_division_m AS d ON b.division_id = d.division_id
              left join cor_zone_m AS z ON e.zone_id = z.zone_id
            ${query} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
    
      total = await countTotalRows(`select count(*) AS total from cor_mtp_a AS m
                                    LEFT JOIN cor_emp_m AS e ON m.user_id=e.emp_id 
                                    LEFT JOIN cor_beat_m AS b ON m.beat_id=b.beat_id 
                                    left join cor_division_m AS d ON b.division_id = d.division_id
                                    left join cor_zone_m AS z ON e.zone_id = z.zone_id
                                    ${query}`);
      result(total, helper.checkDataRows(err, res));
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





/*
*@Author:           <Ramesh Kumar>
*@Created On:       <28-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <upload Mtp>
*/

mtp.uploadMtp = (field, result) => {
  var response =  {
    error:false,
    message:'Data inserted successfully.'
  };
  for (const [key, data] of Object.entries(field)) {
    insertQuery = helper.insertQuery(data,'cor_mtp_a') 
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

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <15-05-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Mtp>
*/

mtp.deleteMtp= (id, result) => {

  sql.query(`DELETE FROM cor_mtp_a WHERE id=${id}`,
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
  // data = {
  //           error:false,
  //           message:'Data deleted successfully.'
  //         }
  // result(data);
};

mtp.duplicateCheck= async (myData, result)=>{
var output = [];
  var dupData = [];
  var  payload = {
          error: false,
          message: "",
        }

//         for ( var j = 0; j < myData.length ; j++ ) {
//           tVal = myData[j];//some manipulation of someArr[j]
//           (function(data){
//             connection.query( `select user_id from cor_mtp_a where  user_id = ${data.user_id} AND beat_id = ${data.beat_id} AND outlet_date = '${data.outlet_date}'`, function(err, rows, fields) {
//                 if ( err ) {
//                   console.log( err );
//                 } else {
//                   output.push( rows[0].user_id );//push query output to this variable
//                 }
//             });
//           })(tVal);
//      }

// console.log("outputoutputoutput",output);


  /*for (const [key, data] of Object.entries(myData)){
    console.log(`select user_id from cor_mtp_a where  user_id = ${data.user_id} AND beat_id = ${data.beat_id} AND outlet_date = '${data.outlet_date}'`);
    sql.query(`select user_id from cor_mtp_a where  user_id = ${data.user_id} AND beat_id = ${data.beat_id} AND outlet_date = '${data.outlet_date}'`,
      (err, res) => {
        if (err) {
          payload = {
            error: true,
            message: err
          }
        } else {
          console.log(res.length );
          if (res.length > 0) {
            dupData.push({
              user_id:data.user_id,
              beat_id:data.beat_id,
              outlet_date:data.outlet_date
            });
            console.log("----------------",dupData );
          }else{
           
          }
        }
      });
  }*/


// console.log("dupData.length",dupData.length );
//     if(dupData.length > 0){
//       payload = {
//         error: true,
//         message: "Duplicate data find",
//         data: dupData
//       }
//     }

  result(output);
};



/*
async function checkDuplicateData() {
  const dupData = [];

  for (const [key, data] of Object.entries(myData)) {
    const query = `SELECT user_id FROM cor_mtp_a WHERE user_id = ${data.user_id} AND beat_id = ${data.beat_id} AND outlet_date = '${data.outlet_date}'`;

    try {
      const res = await sql.query(query);
      console.log(res.length);

      if (res.length > 0) {
        dupData.push({
          user_id: data.user_id,
          beat_id: data.beat_id,
          outlet_date: data.outlet_date
        });
        console.log("----------------", dupData);
      } else {
        // Handle case where no duplicate data found
      }
    } catch (err) {
      const payload = {
        error: true,
        message: err
      };
      // Handle error case
    }
  }

  // Further processing or returning the duplicate data
  return dupData;
}

checkDuplicateData()
  .then(dupData => {
    // Handle duplicate data here
    console.log("Duplicate Data:", dupData);
  })
  .catch(error => {
    // Handle error here
    console.error("Error:", error);
  });
*/

module.exports = mtp;