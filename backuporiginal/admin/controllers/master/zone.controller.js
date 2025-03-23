const zoneModel = require("../../models/master/zone.model.js");
const helper = require("../../helper/helper.js");


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Zone>
*/
exports.listZone = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  zoneModel.listZone(req, (countRows, data) => {

    console.log('listZone -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Zone>
*/
exports.getZone = (req, res) => {

  zoneModel.getZone(req, (data) => {

    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Zone>
*/
exports.saveZone = (req, res) => {

  const fields = {
    'zone_name': req.body.zone_name,
    'enter_by': 1,//req.body.user_id,
    'enter_date': helper.dateTime(),
  }
  zoneModel.saveZone(fields, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Zone>
*/

exports.updateZone = (req, res) => {

  const id_value = req.params.id;
  idData = {
    key: 'zone_id',
    value: id_value
  }
  const fields = {
    "zone_name": req.body.zone_name,
    "modify_by": 1,//req.body.user_id,
    "modify_date": helper.dateTime(),
  }
  zoneModel.updateZone(idData, fields, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Zone>
*/
exports.statusZone = (req, res) => {

  const id = req.params.id;

  zoneModel.statusZone(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Zone>
*/

exports.deleteZone = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'zone_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  zoneModel.updateZone(idData, fields, (data) => {
    res.send(data);
  });
};
