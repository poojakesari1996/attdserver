const userModel = require("../../models/user/user.model.js");
const helper = require("../../helper/helper.js");

var md5 = require('md5');

exports.listUsers = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  userModel.listUsers(req,(countRows,data) => {
 
    //console.log('listUser -------', data);
    // helper.checkResult(err,data);
    // helper.pagination(total, page, perPage) 
    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });
}


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get User>
*/
exports.getUser = (req, res) => {
const id = req.params.id;
  userModel.getUser(id, (data) => {

    res.send(data);

  });
};



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save User>
*/
exports.saveUser = (req, res) => {
  
  const fields = {
    "user_name":  req.body.user_name,
    "head_quater_name":  req.body.head_quater_name,
    "division":  req.body.division_id,
    "phone_number":  req.body.phone_number,
    "email":  req.body.email,
    "designation":  req.body.designation_id,
    "role":  req.body.role_id,
    "department_id":  req.body.department_id,
    "zone_id":  req.body.zone_id,
    "reporting_to":  req.body.reporting_id,
    "emp_code":  req.body.emp_code,
    "state_id":  req.body.state_id,
    "city_id":  req.body.city_id,
    "dealer_id":  req.body.dealer_id,
    "password": md5(req.body.password),
    'enter_by': 1,//req.body.user_id,
    'enter_date': helper.dateTime(),
  }
  userModel.saveUser(fields, (data) => {
    res.send(data);
   
  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update User>
*/

exports.updateUser = (req, res) => {

  const id_value = req.params.id;
  idData={
      key:'emp_id',
      value:id_value
  }
  const fields = {
    "user_name":  req.body.user_name,
    "head_quater_name":  req.body.head_quater_name,
    "division":  req.body.division_id,
    "phone_number":  req.body.phone_number,
    "email":  req.body.email,
    "designation":  req.body.designation_id,
    "role":  req.body.role_id,
    "department_id":  req.body.department_id,
    "zone_id":  req.body.zone_id,
    "reporting_to":  req.body.reporting_id,
    "state_id":  req.body.state_id,
    "city_id":  req.body.city_id,
    "dealer_id":  req.body.dealer_id,
    "emp_code":  req.body.emp_code,
    "password": md5(req.body.password),
    "modify_by":  1, //req.body.user_id,
    "modify_date":  helper.dateTime(),
  }
  userModel.updateUser(idData,fields, (data) => {
    res.send(data);
   
  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update User>
*/

exports.updateUserPassword = (req, res) => {

  const id_value = req.params.id;
  idData={
      key:'emp_id',
      value:id_value
  }
  const fields = {

    "password": md5(123456),
    "modify_by":  1, //req.body.user_id,
    "modify_date":  helper.dateTime(),
  }
  userModel.updateUser(idData,fields, (data) => {
    res.send(data);
   
  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <29-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status User>
*/
exports.statusUser = (req, res) => {

  const id = req.params.id;
  userModel.statusUser(id, (data) => {
    res.send(data);

  });

};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <23-05-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete User>
*/

exports.deleteUser = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'emp_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  userModel.updateUser(idData, fields, (data) => {
    res.send(data);
  });
};


///Anubhav


exports.uploadBulkUser = (req, res) => {

  const myData =  req.body.data;
 console.log(myData);
 //res.send(myData)
   if (myData.length > 0) {
    userModel.uploadBulkUser(myData, (data) => {
       res.send(data);
     });
   } else {
     res.send({'error':true,'message':'Data not find'});
   
    }
 
    //console.log(req);
 }



