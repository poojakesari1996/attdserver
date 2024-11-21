const itemModel = require("../../models/item/item.model.js");
const helper = require("../../helper/helper.js");


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <27-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Item>
*/
exports.listItem = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  itemModel.listItem(req, (countRows, data) => {

    console.log('listItem -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
/*
*@Author:           <Ramesh Kumar>
*@Created On:       <27-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Item>
*/
exports.getItem = (req, res) => {

  itemModel.getItem(req, (data) => {

    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <27-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Item>
*/

exports.updateItem = (req, res) => {


  const id_value = req.params.id;
  idData = {
    key: 'sku_id',
    value: id_value
  }
  const fields = {
    'sku_name': req.body.sku_name,
    'sku_code': req.body.sku_code,
    'hsn_code': req.body.hsn_code,
    'sku_type': req.body.sku_type,
    'sku_mrp': req.body.sku_mrp,
    'sku_price': req.body.sku_price,
    'unit_per_case': req.body.unit_per_case,
    'sku_gst': req.body.sku_gst,
    'sku_cess': req.body.sku_cess,
    'division_id': req.body.division_id,
    'segment_id': req.body.segment_id,
    'base_price': req.body.base_price,
    "modify_by": 1, ///req.body.user_id,
    "modify_date": helper.dateTime(),
  }
  itemModel.updateItem(idData, fields, (data) => {
    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <27-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Item>
*/
exports.saveItem = (req, res) => {

  const fields = {
    'sku_name': req.body.sku_name,
    'sku_code': req.body.sku_code,
    'hsn_code': req.body.hsn_code,
    'sku_type': req.body.sku_type,
    'sku_mrp': req.body.sku_mrp,
    'sku_price': req.body.sku_price,
    'unit_per_case': req.body.unit_per_case,
    'sku_gst': req.body.sku_gst,
    'sku_cess': req.body.sku_cess,
    'division_id': req.body.division_id,
    'segment_id': req.body.segment_id,
    'base_price': req.body.base_price,
    'enter_by': 1, ///req.body.user_id,
    'enter_date': helper.dateTime(),
  }
  itemModel.saveItem(fields, (data) => {
    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <27-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Item>
*/
exports.statusItem = (req, res) => {

  const id = req.params.id;

  itemModel.statusItem(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Item>
*/

exports.deleteItem = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'sku_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  itemModel.updateItem(idData, fields, (data) => {
    res.send(data);
  });
};

///////Anubahv

exports.itemBulkUser = (req, res) => {

  const myData =  req.body.data;
 console.log(myData);
 //res.send(myData)
   if (myData.length > 0) {
    itemModel.itemBulkUser(myData, (data) => {
       res.send(data);
     });
   } else {
     res.send({'error':true,'message':'Data not find'});
   
    }
 
    //console.log(req);
 }