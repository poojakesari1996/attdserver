const returnOrderModel = require("../../models/order/returnOrder.model.js");
const helper = require("../../helper/helper.js");

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <20-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List ReturnOrder>
*/

exports.listReturnOrder = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.items_per_page || 10;
    returnOrderModel.listReturnOrder(req, (countRows, data) => {

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


exports.returnSingleStatus = (req, res) => {

  const id_value = req.params.id;

  var user = JSON.parse(req.headers.authorization)
  idData = {
    key: 'order_return_id',
    value: id_value
  }
  const fields = {
    'status': req.body.status,
    'Approval_By':user.emp_id,
    'Approval_Date':helper.dateTime(),
    'Approval_Remarks':req.body.remarks,
  }
  returnOrderModel.statusReturnOrder(idData, fields, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <20-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Update ReturnOrder Status>
*/


exports.statusReturnOrder = (req, res) => {

    const id_value = req.params.id;
    var user = JSON.parse(req.headers.authorization)
    idData = {
      key: 'order_return_id',
      value: id_value
    }
    const fields = {
      'status': req.params.status,
      'Approval_By':user.emp_id,
      'Approval_Date':helper.dateTime(),
      'Approval_Remarks':(req.params.status == 2) ? 'Bulk Approved' : 'Bulk Rejected',
    }
    returnOrderModel.statusReturnOrder(idData, fields, (data) => {
      res.send(data);
    });
  };


  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <20-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get ReturnOrder Details>
*/
exports.getReturnOrder = (req, res) => {

  returnOrderModel.getReturnOrderDetails(req, (data) => {

    res.send(data);

  });
};



  




