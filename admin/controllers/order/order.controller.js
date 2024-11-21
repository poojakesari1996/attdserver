const orderModel = require("../../models/order/order.model.js");
const helper = require("../../helper/helper.js");

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <12-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Order>
*/

exports.listOrder = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
    orderModel.listOrder(req, (countRows, data) => {

        data.payload = helper.pagination(countRows, page, perPage)
        res.send(data);
    });


};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <26-08-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Single Order Status>
*/


exports.singleStatus = (req, res) => {

  const id_value = req.params.id;

  var user = JSON.parse(req.headers.authorization)
  idData = {
    key: 'order_id',
    value: id_value
  }
  const fields = {
    'status': req.body.status,
    'Approval_By':user.emp_id,
    'Approval_Date':helper.dateTime(),
    'Approval_Remarks':req.body.remarks,
  }
  orderModel.statusOrder(idData, fields, (data) => {
    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <13-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update Order Status>
*/


exports.statusOrder = (req, res) => {

    const id_value = req.params.id;
    var user = JSON.parse(req.headers.authorization)
    idData = {
      key: 'order_id',
      value: id_value
    }
    const fields = {
      'status': req.params.status,
      'Approval_By':user.emp_id,
      'Approval_Date':helper.dateTime(),
      'Approval_Remarks':(req.params.status == 2) ? 'Bulk Approved' : 'Bulk Rejected',
    }
    orderModel.statusOrder(idData, fields, (data) => {
      res.send(data);
  
    });
  };


  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <13-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Order Details>
*/
exports.getOrder = (req, res) => {

  orderModel.getOrderDetails(req, (data) => {

    res.send(data);

  });
};



  




