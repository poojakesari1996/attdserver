const designationModel = require("../../models/master/designation.model.js");
const helper = require("../../helper/helper.js");


 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Designation>
*/
exports.listDesignation = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  designationModel.listDesignation(req,(countRows,data) => {
 
    console.log('listDesignation -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Designation>
*/
exports.getDesignation = (req, res) => {
 
  designationModel.getDesignation(req, (data) => {

    res.send(data);
   
  });
};

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Designation>
*/

exports.updateDesignation = (req, res) => {


    const id_value = req.params.id;
    idData={
        key:'designation_id',
        value:id_value
    }
    const fields = {
      "designation_name":  req.body.designation_name,
      "modify_by":  1, //req.body.user_id,
      "modify_date":  helper.dateTime(),
    }
    designationModel.updateDesignation(idData,fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Designation>
*/
  exports.saveDesignation = (req, res) => {
    
    const fields = {
      'designation_name': req.body.designation_name,
      'enter_by': 1, // req.body.user_id,
      'enter_date': helper.dateTime(),
    }
    designationModel.saveDesignation(fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Designation>
*/
exports.statusDesignation = (req, res) => {

  const id = req.params.id;

  designationModel.statusDesignation(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Designation>
*/

exports.deleteDesignation = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'designation_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  designationModel.updateDesignation(idData, fields, (data) => {
    res.send(data);
  });
};
  