const divisionModel = require("../../models/master/division.model.js");
const helper = require("../../helper/helper.js");


 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Division>
*/
exports.listDivision = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  divisionModel.listDivision(req,(countRows,data) => {
 
    console.log('listDivision -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Division>
*/
exports.getDivision = (req, res) => {
 
  divisionModel.getDivision(req, (data) => {

    res.send(data);
   
  });
};

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Division>
*/

exports.updateDivision = (req, res) => {


    const id_value = req.params.id;
    idData={
        key:'division_id',
        value:id_value
    }
    const fields = {
      "division_name":  req.body.division_name,
      "modify_by":  1, //req.body.user_id,
      "modify_date":  helper.dateTime(),
    }
    divisionModel.updateDivision(idData,fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Division>
*/
  exports.saveDivision = (req, res) => {
    
    const fields = {
      'division_name': req.body.division_name,
      'enter_by': 1,
      'enter_date': helper.dateTime(),
    }
    divisionModel.saveDivision(fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Division>
*/
exports.statusDivision = (req, res) => {

  const id = req.params.id;

  divisionModel.statusDivision(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Division>
*/

exports.deleteDivision = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'division_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  divisionModel.updateDivision(idData, fields, (data) => {
    res.send(data);
  });
};
  