const outletCategoryModel = require("../../models/master/outletCategory.model.js");
const helper = require("../../helper/helper.js");


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list OutletCategory>
*/
exports.listOutletCategory = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  outletCategoryModel.listOutletCategory(req, (countRows, data) => {

    console.log('listOutletCategory -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get OutletCategory>
*/
exports.getOutletCategory = (req, res) => {

  outletCategoryModel.getOutletCategory(req, (data) => {

    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update OutletCategory>
*/

exports.updateOutletCategory = (req, res) => {


  const id_value = req.params.id;
  idData = {
    key: 'outlet_category_id',
    value: id_value
  }
  const fields = {
    "outlet_category_name": req.body.outlet_category_name,
    "modify_by": 1, //req.body.user_id,
    "modify_date": helper.dateTime(),
  }
  outletCategoryModel.updateOutletCategory(idData, fields, (data) => {
    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save OutletCategory>
*/
exports.saveOutletCategory = (req, res) => {

  const fields = {
    'outlet_category_name': req.body.outlet_category_name,
    'enter_by': 1,
    'enter_date': helper.dateTime(),
  }
  outletCategoryModel.saveOutletCategory(fields, (data) => {
    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status OutletCategory>
*/
exports.statusOutletCategory = (req, res) => {

  const id = req.params.id;

  outletCategoryModel.statusOutletCategory(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete OutletCategory>
*/

exports.deleteOutletCategory = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'outlet_category_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  outletCategoryModel.updateOutletCategory(idData, fields, (data) => {
    res.send(data);
  });
};
