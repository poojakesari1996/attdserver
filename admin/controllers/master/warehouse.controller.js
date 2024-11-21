const warehouseModel = require("../../models/master/warehouse.model.js");
const helper = require("../../helper/helper.js");
const excelToJson = require("convert-excel-to-json");


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Warehouse>
*/
exports.listWarehouse = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  warehouseModel.listWarehouse(req, (countRows, data) => {

    console.log('listWarehouse -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Warehouse>
*/

exports.getWarehouse = (req, res) => {

  warehouseModel.getWarehouse(req, (data) => {

    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Warehouse>
*/
exports.saveWarehouse = (req, res) => {

  const fields = {
    'warehouse_name': req.body.warehouse_name,
    'phone_number': req.body.phone_number,
    'email': req.body.email,
    'gst_in_number': req.body.gst_in_number,
    'address': req.body.address,
    'zone_id': req.body.zone_id,
    'state_id': req.body.state_id,
    'city_id': req.body.city_id,
    'district_id': req.body.district_id,
    'enter_by': 1,//req.body.user_id,
    'enter_date': helper.dateTime(),
  }
  warehouseModel.saveWarehouse(fields, (data) => {
    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Warehouse>
*/

exports.updateWarehouse = (req, res) => {

  const id_value = req.params.id;
  idData = {
    key: 'warehouse_id',
    value: id_value
  }
  const fields = {
    'warehouse_name': req.body.warehouse_name,
    'phone_number': req.body.phone_number,
    'email': req.body.email,
    'gst_in_number': req.body.gst_in_number,
    'address': req.body.address,
    'zone_id': req.body.zone_id,
    'state_id': req.body.state_id,
    'city_id': req.body.city_id,
    'district_id': req.body.district_id,
    "modify_by": 1,// req.body.user_id,
    "modify_date":  helper.dateTime(),
  }
  warehouseModel.updateWarehouse(idData, fields, (data) => {
    res.send(data);

  });
};





/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Warehouse>
*/
exports.statusWarehouse = (req, res) => {

  const id = req.params.id;

  warehouseModel.statusWarehouse(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Warehouse>
*/

exports.deleteWarehouse = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'warehouse_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }

  warehouseModel.updateWarehouse(idData, fields, (data) => {
    res.send(data);
  });
};



