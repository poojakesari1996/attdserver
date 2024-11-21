const sql = require("../db.js");

// constructor
const profile = function(osbs) {
  this.title = osbs.title;
  this.description = osbs.description;
  this.published = osbs.published;
};


/*
*@Author:           <Anubhav Tripathi>
*@Created On:       <16-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Item>
*/


profile.profiledata =  (req, result) => {
    sql.query( `SELECT user_name,email,phone_number,division,
    Head_Quater_name,enter_date FROM romsondb.cor_emp_m where emp_id = '${req.body.empid}'`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  profile.testServer =  (req, result) => {
    sql.query( `SELECT user_name,email,phone_number,division,
    Head_Quater_name,enter_date FROM romsondb.cor_emp_m`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };


  
module.exports = profile;