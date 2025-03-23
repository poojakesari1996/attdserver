const outletModel = require("../../models/mapping/outlet.model.js");
const helper = require("../../helper/helper.js");


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <19-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Assign Outlet>
*/

exports.mappingOutletAssign = (req, res) => {

    const beat_id = req.params.beat_id;
    const outlet_id = req.params.outlet_id;
    idData = {
        key: 'outlet_id',
        value: outlet_id
    }
    const fields = {
        "beat_id": req.params.beat_id,
        "modify_by": 1,
        "modify_date": helper.dateTime()
    }
    /*update outlet table*/
    outletModel.mappingOutletUpdate(idData, fields, (data) => {

        // if (data.error === false) {
        //     //update beat_outlet if exist  and insert data beat_outlet table
        //     outletModel.updateAndInsertBeatOutlet({
        //         "beat_id": req.params.beat_id,
        //         "outlet_id": req.params.outlet_id,
        //         'enter_by': 1,
        //         'enter_date': helper.dateTime(),
        //     }, (data1) => {
        //         res.send(data1);
        //     })

        // } else {
        //     res.send(data);
        // }
        res.send(data);
    });
};




/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <07-09-2023>
*@Last Modified:    <>
*@Description:      <Delete Assigned  Outlet>
*/

exports.mappingOutletDeleteAssign = (req, res) => {
    var user = JSON.parse(req.headers.authorization)
    idData = {
        key: 'id',
        value: req.params.outlet_id
    }
    const fields = {
        "beat_id": 0,
        "modify_by":user.emp_id,
        "modify_date": helper.dateTime()
    }

    /*update outlet table*/
    outletModel.mappingOutletUpdate(idData, fields, (data) => {

        // if (data.error === false) {

        //     outletModel.mappingBeatOutletUpdate({
        //         "outlet_id": req.params.outlet_id,
        //         'deleted_by': 1,
        //         'deleted_at': helper.dateTime(),
        //     }, (data) => {
        //         res.send(data);
        //     })
        // }
        res.send(data);
    })

};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <22-06-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Outlet>
*/
exports.listOutlet = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 500;
    outletModel.listOutlet(req, (countRows, data) => {
  
      console.log('listOutlet -------', data);
  
      data.payload = helper.pagination(countRows, page, perPage)
      res.send(data);
    });
  
  
  };
