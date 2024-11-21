const cityModel = require("../../models/master/city.model.js");
const helper = require("../../helper/helper.js");


 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list City>
*/
exports.listCity = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  cityModel.listCity(req,(countRows,data) => {
 
    console.log('listCity -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get City>
*/
exports.getCity = (req, res) => {
 
  cityModel.getCity(req, (data) => {

    res.send(data);
   
  });
};

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update City>
*/

exports.updateCity = (req, res) => {


    const id_value = req.params.id;
    idData={
        key:'city_id',
        value:id_value
    }
    const fields = {
      "city_name":  req.body.city_name,
      "state_id":  req.body.state_id,
      "city_type":req.body.city_type,
      "modify_by":  1, //req.body.user_id,
      "modify_date":  helper.dateTime(),
    }
    cityModel.updateCity(idData,fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save City>
*/
  exports.saveCity = (req, res) => {
   //var user = JSON.parse(req.headers.authorization)
    const fields = {
      'city_name': req.body.city_name,
      "state_id":  req.body.state_id,
      "city_type":req.body.city_type,
      'enter_by': 1,
      'enter_date': helper.dateTime(),
    }
    cityModel.saveCity(fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status City>
*/
exports.statusCity = (req, res) => {

  const id = req.params.id;

  cityModel.statusCity(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete City>
*/

exports.deleteCity = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'city_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  cityModel.updateCity(idData, fields, (data) => {
    res.send(data);
  });
};
  