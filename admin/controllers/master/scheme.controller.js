const schemeModel = require("../../models/master/scheme.model.js");
const helper = require("../../helper/helper.js");


 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Scheme>
*/
exports.listScheme = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  schemeModel.listScheme(req,(countRows,data) => {
 
    console.log('listScheme -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Scheme>
*/
exports.getScheme = (req, res) => {
 
  schemeModel.getScheme(req, (data) => {

    res.send(data);
   
  });
};

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Scheme>
*/

exports.updateScheme = (req, res) => {


    const id_value = req.params.id;
    idData={
        key:'scheme_id',
        value:id_value
    }

    const fields = {
      "scheme_name":  req.body.scheme_name,
      "division_id":  req.body.division_id,
      "segment_id":  req.body.segment_id,
      "for_amount":  req.body.for_amount,
      "for_order_value":  req.body.for_order_value,
      "start_date_time":  req.body.start_date_time,
      "end_date_time":  req.body.end_date_time,
      "modify_by":  1, //req.body.user_id,
      "modify_date":  helper.dateTime(),
    }
    schemeModel.updateScheme(idData,fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Scheme>
*/
  exports.saveScheme = (req, res) => {
    
    const fields = {
      "scheme_name":  req.body.scheme_name,
      "division_id":  req.body.division_id,
      "segment_id":  req.body.segment_id,
      "for_amount":  req.body.for_amount,
      "for_order_value":  req.body.for_order_value,
      "start_date_time":  req.body.start_date_time,
      "end_date_time":  req.body.end_date_time,
      'enter_by': 1,
      'enter_date': helper.dateTime(),
    }
    console.log(fields);
    schemeModel.saveScheme(fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Scheme>
*/
exports.statusScheme = (req, res) => {

  const id = req.params.id;

  schemeModel.statusScheme(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Scheme>
*/

exports.deleteScheme = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'scheme_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  schemeModel.updateScheme(idData, fields, (data) => {
    res.send(data);
  });
};
  