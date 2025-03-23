const leaveModel = require("../../models/user/leave.model.js");
const helper = require("../../helper/helper.js");



exports.listLeaves = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  leaveModel.listLeaves(req,(countRows,data) => {
 
    //console.log('listLeave -------', data);
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
*@Description:      <get Leave>
*/
exports.getLeave = (req, res) => {
const id = req.params.id;
  leaveModel.getLeave(id, (data) => {

    res.send(data);

  });
};



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Leave>
*/
exports.saveLeave = (req, res) => {
  
  const fields = {
    "leave_name":  req.body.leave_name,
    "head_quater_name":  req.body.head_quater_name,
    "division":  req.body.division_id,
    "phone_number":  req.body.phone_number,
    "email":  req.body.email,
    "designation":  req.body.designation_id,
    "role":  req.body.role_id,
    "zone_id":  req.body.zone_id,
    "reporting_to":  req.body.reporting_id,
    'enter_by': 1,//req.body.leave_id,
    'enter_date': helper.dateTime(),
  }
  leaveModel.saveLeave(fields, (data) => {
    res.send(data);
   
  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Leave>
*/

exports.updateLeave = (req, res) => {

  const id_value = req.params.id;
  idData={
      key:'emp_id',
      value:id_value
  }
  const fields = {
    "leave_name":  req.body.leave_name,
    "head_quater_name":  req.body.head_quater_name,
    "division":  req.body.division_id,
    "phone_number":  req.body.phone_number,
    "email":  req.body.email,
    "designation":  req.body.designation_id,
    "role":  req.body.role_id,
    "zone_id":  req.body.zone_id,
    "reporting_to":  req.body.reporting_id,
    "modify_by":  1, //req.body.leave_id,
    "modify_date":  helper.dateTime(),
  }
  leaveModel.updateLeave(idData,fields, (data) => {
    res.send(data);
   
  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <29-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Leave>
*/
exports.statusLeave = (req, res) => {

  const id_value = req.params.id;
  var user = JSON.parse(req.headers.authorization)
  idData = {
    key: 'id',
    value: id_value
  }
  const fields = {
    'status': req.params.status,
    'approved_by':user.emp_id,
    'approved_date':helper.dateTime(),

  }
  leaveModel.statusLeave(idData, fields, (data) => {
    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <05-07-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete  leave>
*/

exports.deleteLeave = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  leaveModel.updateLeave(idData, fields, (data) => {
    res.send(data);
  });
};



