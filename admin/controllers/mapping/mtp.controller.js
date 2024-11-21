const mtpModel = require("../../models/mapping/mtp.model.js");
const helper = require("../../helper/helper.js");
const xlsx = require("xlsx");
const e = require("cors");

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Mtp>
*/

exports.mappingMtpList = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  mtpModel.listMtp(req, (countRows, data) => {

   // console.log('listMtp -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
      res.send(data);
    });


};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <17-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save MTP>
*/
exports.saveMtp = (req, res) => {

  const fields = {
    'area_name': req.body.area_name,
    'enter_by': 1,//req.body.user_id,
    'enter_date': helper.dateTime(),
  }


  mtpModel.saveArea(fields, (data) => {
    res.send(data);

  });
};

exports.mappingMtpExcelUpload = (req, res) => {

  console.log(req.file);
  var result = importExcelData2MySQL(__dirname + '/../../../uploads/' + req.file.filename, res);

  if (result.error == false) {
    mtpModel.uploadMtp(result.data, (data) => {
      res.send(data);
    });
  } else {
    res.send(result);
    console.log(req.file.filename);
  }

   //console.log(req);
}


function importExcelData2MySQL(filePath, res) {
  var result = { "error": false }
  var workbook = xlsx.readFile(filePath),
    worksheet = workbook.Sheets[workbook.SheetNames[0]],
    range = xlsx.utils.decode_range(worksheet["!ref"]);
  var data = [];
  // (D) IMPORT EXCEL
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    // (D1) READ CELLS
    var user_id = worksheet[xlsx.utils.encode_cell({ r: row, c: 0 })];
    var beat_id = worksheet[xlsx.utils.encode_cell({ r: row, c: 1 })];
    var outlet_date = worksheet[xlsx.utils.encode_cell({ r: row, c: 2 })];

    if (user_id === undefined || beat_id === undefined || outlet_date === undefined) {
      result = { "error": true, "message": "Blank field not allowed" };
    } else {
      data.push({
        "user_id": user_id.v,
        "beat_id": beat_id.v,
        "outlet_date": helper.dateFormat(outlet_date.w),
        "enter_by": 1,
        "enter_date": helper.dateTime()
      });
    }

  }

  if (result.error == true) {
    return result;
  } else {
    return { "error": false, "data": data };
  }

}

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <15-05-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Mtp>
*/

exports.deleteMtp = (req, res) => {

  const id = req.params.id;

  const fields = {
   // "deleted_at": helper.dateTime()
  }
  mtpModel.deleteMtp(id, (data) => {
    res.send(data);
  });

};


  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-06-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Mtp>
*/

exports.uploadMTP = (req, res) => {

 const myData =  req.body.data;
console.log(myData);
//res.send(myData)
  if (myData.length > 0) {
    mtpModel.uploadMtp(myData, (data) => {
      res.send(data);
    });
  } else {
    res.send({'error':true,'message':'Data not find'});
  
   }

   //console.log(req);
}



