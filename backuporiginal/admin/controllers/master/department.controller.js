const departmentModel = require("../../models/master/department.model.js");
const helper = require("../../helper/helper.js");


 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <13-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Department>
*/
exports.listDepartment = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  departmentModel.listDepartment(req,(countRows,data) => {
 
    console.log('listDepartment -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <13-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Department>
*/
exports.getDepartment = (req, res) => {
 
  departmentModel.getDepartment(req, (data) => {

    res.send(data);
   
  });
};

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <13-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Department>
*/

exports.updateDepartment = (req, res) => {


    const id_value = req.params.id;
    idData={
        key:'department_id',
        value:id_value
    }
    const fields = {
      "department_name":  req.body.department_name,
      "modify_by":  1, //req.body.user_id,
      "modify_date":  helper.dateTime(),
    }
    departmentModel.updateDepartment(idData,fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <13-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Department>
*/
  exports.saveDepartment = (req, res) => {
    
    const fields = {
      'department_name': req.body.department_name,
      'enter_by': 1,
      'enter_date': helper.dateTime(),
    }
    departmentModel.saveDepartment(fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <13-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Department>
*/
exports.statusDepartment = (req, res) => {

  const id = req.params.id;

  departmentModel.statusDepartment(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <13-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Department>
*/

exports.deleteDepartment = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'department_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  departmentModel.updateDepartment(idData, fields, (data) => {
    res.send(data);
  });
};
  