const outletCustomerModel = require("../../models/master/outletCustomer.model.js");
const helper = require("../../helper/helper.js");


 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list OutletCustomer>
*/
exports.listOutletCustomer = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  outletCustomerModel.listOutletCustomer(req,(countRows,data) => {
 
    //console.log('listOutletCustomer -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get OutletCustomer>
*/
exports.getOutletCustomer = (req, res) => {
 
  outletCustomerModel.getOutletCustomer(req, (data) => {

    res.send(data);
   
  });
};

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update OutletCustomer>
*/

exports.updateOutletCustomer = (req, res) => {

  console.log('==========req.params.id=========',req.params.id);

    const id_value = req.params.id;
    idData={
        key:'hospital_customer_id',
        value:id_value
    }
    const fields = {
      "outlet_id":  req.body.outlet_id,
      "customer_name":  req.body.customer_name,
      "customer_type":  req.body.customer_type,
      "customer_department":  req.body.customer_department,
      "customer_designation":  req.body.customer_designation,
      "customer_catagary":  req.body.customer_catagary,
      "customer_contact_no":  req.body.customer_contact_no,
      "email":  req.body.email,

      "modify_by":  1, //req.body.user_id,
      "modify_date":  helper.dateTime(),
    }
    outletCustomerModel.updateOutletCustomer(idData,fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save OutletCustomer>
*/
  exports.saveOutletCustomer = (req, res) => {
    
    const fields = {
      "outlet_id":  req.body.outlet_id,
      "customer_name":  req.body.customer_name, 
      "customer_type":  req.body.customer_type,
      "customer_department":  req.body.customer_department,
      "customer_designation":  req.body.customer_designation,
      "customer_catagary":  req.body.customer_catagary,
      "customer_contact_no":  req.body.customer_contact_no,
      "email":  req.body.email,
      'enter_by': 1,
      'enter_date': helper.dateTime(),
    }
    outletCustomerModel.saveOutletCustomer(fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status OutletCustomer>
*/
exports.statusOutletCustomer = (req, res) => {

  const id = req.params.id;

  outletCustomerModel.statusOutletCustomer(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <11-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete OutletCustomer>
*/

exports.deleteOutletCustomer = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'hospital_customer_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  outletCustomerModel.updateOutletCustomer(idData, fields, (data) => {
    res.send(data);
  });
};
  