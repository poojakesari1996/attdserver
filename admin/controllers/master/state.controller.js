const stateModel = require("../../models/master/state.model.js");
const helper = require("../../helper/helper.js");


 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list State>
*/
exports.listState = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  stateModel.listState(req,(countRows,data) => {
 
    console.log('listState -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get State>
*/
exports.getState = (req, res) => {
 
  stateModel.getState(req, (data) => {

    res.send(data);
   
  });
};

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update State>
*/

exports.updateState = (req, res) => {


    const id_value = req.params.id;
    idData={
        key:'state_id',
        value:id_value
    }
    const fields = {
      "state_name":  req.body.state_name,
      "modify_by":  1, //req.body.user_id,
      "modify_date":  helper.dateTime(),
    }
    stateModel.updateState(idData,fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save State>
*/
  exports.saveState = (req, res) => {
    
    const fields = {
      'state_name': req.body.state_name,
      'enter_by': 1, // req.body.user_id,
      'enter_date': helper.dateTime(),
    }
    stateModel.saveState(fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status State>
*/
exports.statusState = (req, res) => {

  const id = req.params.id;

  stateModel.statusState(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete State>
*/

exports.deleteState = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'state_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  stateModel.updateState(idData, fields, (data) => {
    res.send(data);
  });
};
  