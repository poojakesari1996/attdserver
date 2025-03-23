const districtModel = require("../../models/master/district.model.js");
const helper = require("../../helper/helper.js");


 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list District>
*/
exports.listDistrict = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  districtModel.listDistrict(req,(countRows,data) => {
 
    //console.log('listDistrict -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get District>
*/
exports.getDistrict = (req, res) => {
 
  districtModel.getDistrict(req, (data) => {

    res.send(data);
   
  });
};

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update District>
*/

exports.updateDistrict = (req, res) => {


    const id_value = req.params.id;
    idData={
        key:'district_id',
        value:id_value
    }
    const fields = {
      "district_name":  req.body.district_name,
      "state_id":  req.body.state_id,
      "modify_by":  req.body.user_id,
      "modify_date":  helper.dateTime(),
    }
    districtModel.updateDistrict(idData,fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save District>
*/
  exports.saveDistrict = (req, res) => {
    
    const fields = {
      'district_name': req.body.district_name,
      "state_id":  req.body.state_id,
      'enter_by': 1,
      'enter_date': helper.dateTime(),
    }
    districtModel.saveDistrict(fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status District>
*/
exports.statusDistrict = (req, res) => {

  const id = req.params.id;

  districtModel.statusDistrict(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete District>
*/

exports.deleteDistrict = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'district_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  districtModel.updateDistrict(idData, fields, (data) => {
    res.send(data);
  });
};
  