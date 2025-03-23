const dealerModel = require("../../models/master/dealer.model.js");
const helper = require("../../helper/helper.js");


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Dealer>
*/
exports.listDealer = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  dealerModel.listDealer(req, (countRows, data) => {

    console.log('listDealer -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
/*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Dealer>
*/
exports.getDealer = (req, res) => {

  dealerModel.getDealer(req, (data) => {

    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Dealer>
*/

exports.updateDealer = (req, res) => {


  const id_value = req.params.id;
  idData = {
    key: 'dealer_id',
    value: id_value
  }
  const fields = {

    "dealer_name": req.body.dealer_name,
    "division_id": req.body.division_id,
    "warehouse_id": req.body.warehouse_id,
    "zone_id": req.body.zone_id,
    "state_id": req.body.state_id,
    "city_id": req.body.city_id,
    "district_id": req.body.district_id,
    "address": req.body.address,
    "phone_number": req.body.phone_number,
    "email": req.body.email,
    "tax_number": req.body.tax_number,
    "gst_in_number": req.body.gst_in_number,
    "license_number": req.body.license_number,
    "enter_by": 1,//req.body.enter_by,
    "enter_date":  helper.dateTime(),
  }
  dealerModel.updateDealer(idData, fields, (data) => {
    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Dealer>
*/
exports.saveDealer = (req, res) => {

  const fields = {
    "dealer_name": req.body.dealer_name,
    "division_id": req.body.division_id,
    "warehouse_id": req.body.warehouse_id,
    "zone_id": req.body.zone_id,
    "state_id": req.body.state_id,
    "city_id": req.body.city_id,
    "district_id": req.body.district_id,
    "address": req.body.address,
    "phone_number": req.body.phone_number,
    "email": req.body.email,
    "tax_number": req.body.tax_number,
    "gst_in_number": req.body.gst_in_number,
    "license_number": req.body.license_number,
    'enter_by': 1,//req.body.enter_by,
    'enter_date':  helper.dateTime(),
  }
  dealerModel.saveDealer(fields, (data) => {
    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Dealer>
*/
exports.statusDealer = (req, res) => {

  const id = req.params.id;

  dealerModel.statusDealer(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <14-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Dealer>
*/

exports.deleteDealer = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'dealer_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  dealerModel.updateDealer(idData, fields, (data) => {
    res.send(data);
  });
};



exports.uploadDealerExcel = (req, res) => {

  const myData =  req.body.data;
 console.log(myData);
 //res.send(myData)
   if (myData.length > 0) {
    dealerModel.uploadDealerExcel(myData, (data) => {
       res.send(data);
     });
   } else {
     res.send({'error':true,'message':'Data not find'});
   
    }
 
    //console.log(req);
 }