const sql = require("../db.js");
const helper = require("../../helper/helper.js");

// constructor
const role = function (abc) {
  this.title = abc.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Role>
*/

role.listRole = (req, result) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  const status = req.query.filter_status ? req.query.filter_status.toUpperCase() : "";
  const start = ((page - 1) * perPage);
  const sort = req.query.sort || "role_id";
  const order = req.query.order || "DESC";
  const search = req.query.search || "";


  var querySearch = '';
  var queryWhere = 'where c.deleted_at is null';
  var total = 0;

  if (search) {

    columnSearch = [
      'role_name',
      'alias'
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

  sql.query(`select role_id as id, c.role_name,c.alias, c.status from cor_role_m AS c
            ${queryWhere} LIMIT ${perPage} OFFSET ${start}`,
    async (err, res) => {
      // console.log("RoleModel- listRole", res);
      total = await countTotalRows(`select count(role_id) AS total from cor_role_m AS c
       ${queryWhere}`);
      result(total, helper.checkDataRows(err, res));
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get Role>
*/

role.getRole = (request, result) => {

  const id = request.params.id;
   console.log(`SELECT  c.role_id as id, c.role_name,c.role_type, c.status,c.alias,group_concat(p.menu_id) as menu_ids  FROM cor_role_m AS c
  LEFT JOIN cor_permission_m AS p ON c.role_id = p.role_id AND p.role_id=${id}
  where c.role_id='${id}' AND deleted_at is null`);


  
  sql.query(`SELECT  c.role_id as id, c.role_name,c.role_type, c.status,c.alias,group_concat(p.menu_id) as menu_ids  FROM cor_role_m AS c
  LEFT JOIN cor_permission_m AS p ON c.role_id = p.role_id AND p.role_id=${id}
   where c.role_id='${id}' AND deleted_at is null `,
    async (err, res) => {

      try {
        if (err) {
          result({
            error: true,
            message: err.message || "Some error occurred while query run."
          })
        } else if (res) {
          if (res.length > 0) {

            const menu = await checkDataRow1(id);
            const data = res[0];
            result({ error: false, data: { ...data, menu_id: menu } });
          } else {
            result({
              error: true,
              message: 'Data not found.'
            })
          }
        } else {
          result({
            error: true,
            message: 'Data not found.'
          })

        }

      } catch {
        result({
          error: true,
          message: err.message || "Some error occurred while query run."
        })
      }




    });
};


const test = (id) => {

  const query = `select group_concat(menu_id) as menu_id from cor_permission_m  where role_id=${id}`;

  try {
    return new Promise((resolve, reject) => {
      sql.query(
        query,
        (err, res) => {
          if (err) {
            reject(0)
          } else {
            if (res) {
              resolve(res)
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

const checkDataRow1 = (id) => {

  const query = `select M.menu_id, M.menu_name, IF(P.role_id=${id}, "true", "false") AS role_status from cor_menu_m AS M
                LEFT JOIN cor_permission_m AS P ON M.menu_id = P.menu_id AND P.role_id=${id}
                where M.deleted_at is null AND M.status='A'`;

  try {
    return new Promise((resolve, reject) => {
      sql.query(
        query,
        (err, res) => {
          if (err) {
            reject(0)
          } else {
            if (res) {
              resolve(res)
            } else {
              reject(0)
            }
          };
        })
    })
  } catch (error) {
    console.log(error);
  }
  // console.log('sdkjjfsn -------------------------sdkfsd ================oksjkskf==================');
  //       sql.query(`select menu_id, menu_name from cor_menu_m where deleted_at is null AND status='A'`,
  //          (err, res) => {
  //           console.log(res);
  //         //  return res;
  //         });
}

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Role>
*/

role.updateRole = (idData, data, result) => {

  updateQuery = helper.updateQuery(idData, data, 'cor_role_m')
  //console.log('updateQuery  ==================', updateQuery);
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
          message: err.message
        }
      }

      result(data);
    });
};




/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Save Role>
*/

role.saveRole = (data, result) => {

  insertQuery = helper.insertQuery(data, 'cor_role_m')
  console.log('insertQuery  ==================', insertQuery);
  sql.query(insertQuery,
    async (err, res) => {
      if (res && res.affectedRows == 1) {

        response = {
         role_id:res.insertId,
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
};


role.addRoleMenus = (role_id, menu) => {

  try {
    return new Promise((resolve, reject) => {
      menu.add_menus && menu.add_menus.map((menu_id) => {
        const data = {
          'role_id': role_id,
          'menu_id': menu_id
        }
        insertQuery = helper.insertQuery(data, 'cor_permission_m')
        sql.query(insertQuery,
          (err, res) => {
           return  response = {
              error: false,
              message: 'Data inserted successfully.'
            }
          });

        console.log(menu_id);
      })
    })
  } catch (error) {
    console.log(error);
  }
}


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Role>
*/

role.deleteRole = (id, result) => {


  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`DELETE FROM cor_role_m WHERE role_id=${id}`,
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
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Change status Role>
*/

role.statusRole = (id, result) => {

  var data = {
    error: true,
  }
  var status = '';
  //console.log('updateQuery  ==================', updateQuery);
  sql.query(`SELECT *, role_id AS id FROM cor_role_m where role_id='${id}'`,
    (err, res) => {
      if (res) {
        if (res.length > 0) {
          if (res[0].status == "I") {
            status = "A"
          } else {
            status = "I"
          }

          sql.query(`UPDATE cor_role_m SET status='${status}' WHERE role_id=${id}`,
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
*@Created On:       <06-03-2023>
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



role.roleMenuUpdate = (role_id, menu) => {

  //console.log('---------------model-----------------',menu.menu_id);
  sql.query(`delete from cor_permission_m where role_id=${role_id}`,
    async (err, res) => {
      await insertMenus(role_id, menu);
    });
}


const insertMenus = (role_id, menu) => {

  try {
    return new Promise((resolve, reject) => {
      menu.add_menus && menu.add_menus.map((menu_id) => {
        const data = {
          'role_id': role_id,
          'menu_id': menu_id
        }
        insertQuery = helper.insertQuery(data, 'cor_permission_m')
        sql.query(insertQuery,
          (err, res) => {

          });

        console.log(menu_id);
      })
    })
  } catch (error) {
    console.log(error);
  }
}




module.exports = role;
