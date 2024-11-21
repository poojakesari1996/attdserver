const areaModel = require("../../models/master/area.model.js");
const helper = require("../../helper/helper.js");


 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <27-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Area>
*/
exports.listArea = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  areaModel.listArea(req,(countRows,data) => {
 
    console.log('listArea -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <27-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Area>
*/
exports.getArea = (req, res) => {
 
  areaModel.getArea(req, (data) => {

    res.send(data);
   
  });
};

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <27-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Area>
*/

exports.updateArea = (req, res) => {


    const id_value = req.params.id;
    idData={
        key:'area_id',
        value:id_value
    }
    const fields = {
      "area_name":  req.body.area_name,
      "modify_by":  req.body.user_id,
      "modify_date":  helper.dateTime(),
    }
    areaModel.updateArea(idData,fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <27-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Area>
*/
  exports.saveArea = (req, res) => {
    
    const fields = {
      'area_name': req.body.area_name,
      'enter_by': req.body.user_id,
      'enter_date': helper.dateTime(),
    }
    areaModel.saveArea(fields, (data) => {
      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <27-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Area>
*/
exports.statusArea = (req, res) => {

  const id = req.params.id;

  areaModel.statusArea(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Area>
*/

exports.deleteArea = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'area_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  areaModel.updateArea(idData, fields, (data) => {
    res.send(data);
  });
};
  