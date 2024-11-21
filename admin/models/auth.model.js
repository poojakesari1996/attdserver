const sql = require("./db.js");
const helper = require("../helper/helper.js");
var md5 = require('md5');

// constructor
const auth = function (osbs) {
    this.title = osbs.title;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List User>
*/

auth.login = (req, result) => {

    const empmail = req.body.email;
    const empPass = md5(req.body.password);


    sql.query(`SELECT 
    GROUP_CONCAT(menu_id) AS menu_ids,
    MAX(r.role_type) AS role_type, -- Aggregating role_type
    e.emp_id,
    e.name AS fullname,
    e.user_name AS username,
    e.email,
    e.phone_number,
    e.designation,
    e.role,
    e.emp_type,
    e.status,
    e.address,
    e.api_token 
FROM 
    romsondb.cor_emp_m AS e
LEFT JOIN 
    romsondb.cor_permission_m AS p ON e.role = p.role_id 
LEFT JOIN 
    romsondb.cor_role_m AS r ON e.role = r.role_id 
WHERE 
email='${empmail}' AND password = '${empPass}'
GROUP BY
    e.emp_id, e.name, e.user_name, e.email, e.phone_number, e.designation,
    e.role, e.emp_type, e.status, e.address, e.api_token`,
        async (err, res) => {
            data = helper.checkDataRow(err, res);
            if (data.error == false) {
                user_token = helper.generateRandomString(100);
                sql.query(
                    `update cor_emp_m set api_token='${user_token}' where emp_id='${data.data.emp_id}'`,
                    (err, res1) => {


                        result({ ...data.data, api_token: user_token });
                    })
            } else {
                result(data);
            }

        });
};

auth.verifyToken = (req, result) => {
    const api_token = req.body.api_token;
    
    sql.query(`SELECT 
        GROUP_CONCAT(menu_id) AS menu_ids,
        MAX(e.emp_id) AS emp_id,
        MAX(e.name) AS fullname,
        MAX(e.user_name) AS username,
        MAX(e.email) AS email,
        MAX(e.phone_number) AS phone_number,
        MAX(e.designation) AS designation,
        MAX(e.role) AS role,
        MAX(e.emp_type) AS emp_type,
        MAX(e.status) AS status,
        MAX(e.address) AS address,
        MAX(e.api_token) AS api_token 
    FROM 
        cor_emp_m AS e
    LEFT JOIN 
        cor_permission_m AS p ON e.role = p.role_id  
    WHERE 
        e.api_token='${api_token}'`,
    async (err, res) => {
        data = helper.checkDataRow(err, res);
        if (data.error == false) {
            result(data.data);
        } else {
            result(data);
        }
    });
};




module.exports = auth;
