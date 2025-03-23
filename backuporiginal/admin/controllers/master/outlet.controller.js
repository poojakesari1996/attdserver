const outletModel = require("../../models/master/outlet.model.js");
const helper = require("../../helper/helper.js");
const xlsx = require("xlsx");


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Outlet>
*/
exports.listOutlet = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  outletModel.listOutlet(req, (countRows, data) => {

    console.log('listOutlet -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Outlet>
*/
exports.getOutlet = (req, res) => {

  outletModel.getOutlet(req, (data) => {

    res.send(data);

  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Outlet>
*/
exports.saveOutlet = (req, res) => {

  const fields = {
    "outlet_name": req.body.outlet_name,
    "owner_name": req.body.owner_name,
    "email": req.body.email,
    "outlet_category_id": req.body.outlet_category_id,
    "customer_type_id": req.body.customer_type_id,
    "beat_id": req.body.beat_id,
    "state_id": req.body.state_id,
    "city_id": req.body.city_id,
    "district_id": req.body.district_id,
    "dealer_id": req.body.dealer_id,
    "address": req.body.address,
    "phone_number": req.body.phone_number,
    "gst_in_number": req.body.gst_in_number,
    "outlet_lat": req.body.outlet_lat,
    "outlet_long": req.body.outlet_long,
    "total_bed": req.body.total_bed || 0,
    "icu_bed": req.body.icu_bed || 0,
    "ot_bed": req.body.ot_bed || 0,
    'enter_by': 1,//req.body.user_id,
    'enter_date': helper.dateTime(),
  }
  outletModel.saveOutlet(fields, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Outlet>
*/

exports.updateOutlet = (req, res) => {


  const id_value = req.params.id;
  idData = {
    key: 'id',
    value: id_value
  }
  const fields = {

    "outlet_name": req.body.outlet_name,
    "owner_name": req.body.owner_name,
    "email": req.body.email,
    "outlet_category_id": req.body.outlet_category_id,
    "customer_type_id": req.body.customer_type_id,
    "beat_id": req.body.beat_id,
    "state_id": req.body.state_id,
    "city_id": req.body.city_id,
    "district_id": req.body.district_id,
    "dealer_id": req.body.dealer_id,
    "address": req.body.address,
    "phone_number": req.body.phone_number,
    "gst_in_number": req.body.gst_in_number,
    "outlet_lat": req.body.outlet_lat,
    "outlet_long": req.body.outlet_long,
    "total_bed": req.body.total_bed || 0,
    "icu_bed": req.body.icu_bed || 0,
    "ot_bed": req.body.ot_bed || 0,
    "modify_by": 1,//req.body.user_id,
    "modify_date": helper.dateTime(),
  }
  outletModel.updateOutlet(idData, fields, (data) => {
    res.send(data);

  });
};




/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Outlet>
*/
exports.statusOutlet = (req, res) => {

  const id = req.params.id;

  outletModel.statusOutlet(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Outlet>
*/

exports.deleteOutlet = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  outletModel.updateOutlet(idData, fields, (data) => {
    res.send(data);
  });
};



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <approval Outlet >
*/

exports.approvalOutlet = (req, res) => {

  const id_value = req.params.id;
  idData = {
    key: 'id',
    value: id_value
  }
  const fields = {
    "approved": req.params.approval_id,
    "approved_by": 1,//req.body.user_id,
    "modify_date": helper.dateTime(),
  }
  outletModel.updateOutlet(idData, fields, (data) => {
    res.send(data);
  });
};


exports.excelUpload = (req, res) => {

  // console.log("---------------" + JSON.stringify(req.file.filename));
  var result = importExcelData2MySQL(__dirname + '/../../uploads/outlet/' + req.file.filename, res);

  if (result.error == false) {
    outletModel.uploadOutlet(result.data, (data) => {
      res.send(data);
    });
  } else {
    res.send(result);
    console.log(req.file.filename);
  }

  //console.log(req);
}

exports.uploadNewOutlet = (req, res) => {

  const myData =  req.body.data;
 console.log(myData);
 //res.send(myData)
   if (myData.length > 0) {
    outletModel.uploadNewOutlet(myData, (data) => {
       res.send(data);
     });
   } else {
     res.send({'error':true,'message':'Data not find'});
   
    }
 
    //console.log(req);
 }
 exports.checkOutletId = (req, res) => {
  outletModel.checkOutletId(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);

  });
};

exports.uploadNewCustomerOutlet = (req, res) => {

  const myData =  req.body.data;
 console.log(myData);
 //res.send(myData)
   if (myData.length > 0) {
    outletModel.uploadNewCustomerOutlet(myData, (data) => {
       res.send(data);
     });
   } else {
     res.send({'error':true,'message':'Data not find'});
   
    }
 
    //console.log(req);
 }



function importExcelData2MySQL(filePath, res) {

  // console.log('+++++++++++++++++++++++' + filePath);
  var result = { "error": false }
  var workbook = xlsx.readFile(filePath),
    worksheet = workbook.Sheets[workbook.SheetNames[0]],
    range = xlsx.utils.decode_range(worksheet["!ref"]);
  var data = [];
  var error_data = [];
  // (D) IMPORT EXCEL
  for (let row = range.s.r; row <= range.e.r; row++) {

    var outlet_id = worksheet[xlsx.utils.encode_cell({ r: row, c: 1 })];
    var beat_id = worksheet[xlsx.utils.encode_cell({ r: row, c: 2 })];
    var outlet_name = worksheet[xlsx.utils.encode_cell({ r: row, c: 3 })];
    var address = worksheet[xlsx.utils.encode_cell({ r: row, c: 4 })];
    var phone_number = worksheet[xlsx.utils.encode_cell({ r: row, c: 5 })];
    var email = worksheet[xlsx.utils.encode_cell({ r: row, c: 6 })];
    var owner_name    = worksheet[xlsx.utils.encode_cell({ r: row, c: 7 })];
    var customer_type_id = worksheet[xlsx.utils.encode_cell({ r: row, c: 8 })];
    var state_id = worksheet[xlsx.utils.encode_cell({ r: row, c: 9 })];
    var city_id = worksheet[xlsx.utils.encode_cell({ r: row, c: 10 })];
    var district_id = worksheet[xlsx.utils.encode_cell({ r: row, c: 11 })];
    var pin = worksheet[xlsx.utils.encode_cell({ r: row, c: 12 })];
    var outlet_category_id = worksheet[xlsx.utils.encode_cell({ r: row, c: 13 })];
    var approved_by = worksheet[xlsx.utils.encode_cell({ r: row, c: 14 })];
    var approved = worksheet[xlsx.utils.encode_cell({ r: row, c: 15 })];
    var outlet_lat = worksheet[xlsx.utils.encode_cell({ r: row, c: 16 })];
    var outlet_long = worksheet[xlsx.utils.encode_cell({ r: row, c: 17 })];
    var status = worksheet[xlsx.utils.encode_cell({ r: row, c: 18 })];
    var total_bed = worksheet[xlsx.utils.encode_cell({ r: row, c: 19 })];
    var icu_bed = worksheet[xlsx.utils.encode_cell({ r: row, c: 20 })];
    var ot_bed = worksheet[xlsx.utils.encode_cell({ r: row, c: 21 })];
    var dealer_id = worksheet[xlsx.utils.encode_cell({ r: row, c: 22 })];
    var zone_id = worksheet[xlsx.utils.encode_cell({ r: row, c: 23 })];

    if (row == 0) {
      console.log("0-------------00---------------------------------"+outlet_id.v);
    } else {

      if (outlet_id === undefined || 
          beat_id === undefined || 
          outlet_name === undefined|| 
          customer_type_id === undefined|| 
          state_id === undefined|| 
          city_id === undefined|| 
          district_id === undefined|| 
          outlet_category_id === undefined|| 
          approved_by === undefined|| 
          approved === undefined|| 
          status === undefined|| 
          dealer_id === undefined||
          zone_id=== undefined
          ) {

        result = { "error": true, "message": "Blank field not allowed" };
      } else {
        data.push({
          "outlet_id": outlet_id ? outlet_id.v : 0,
          "beat_id": beat_id ? beat_id.v : 0,
          "outlet_name": outlet_name ? outlet_name.v : '',
          "address": address ? address.v : '',
          "phone_number": phone_number ? phone_number.v : '',
          "email": email ? email.v : '',
          "owner_name": owner_name ? owner_name.v : '',
          "customer_type_id": customer_type_id ? customer_type_id.v : 0,
          "state_id": state_id ? state_id.v : 0,
          "city_id": city_id ? city_id.v : 0,
          "district_id": district_id ? district_id.v : 0,
          "pin": pin ? pin.v : 0,
          "outlet_category_id": outlet_category_id ? outlet_category_id.v : 0,
          "approved_by": approved_by ? approved_by.v : 0,
          "approved": approved ? approved.v : 0,
          "outlet_lat": outlet_lat ? outlet_lat.v : 0,
          "outlet_long": outlet_long ? outlet_long.v : 0,
          "status": status ? status.v : 'I',
          "total_bed": total_bed ? total_bed.v : 0,
          "icu_bed": icu_bed ? icu_bed.v : 0,
          "ot_bed": ot_bed ? ot_bed.v : 0,
          "dealer_id": dealer_id ? dealer_id.v : 0,
          "zone_id": zone_id ? zone_id.v : 0,
          "enter_by": 1,
          "enter_date": helper.dateTime()
        });
      }
    }
  }

  if (result.error == true) {
    return result;
  } else {
    return { "error": false, "data": data };
  }


}


