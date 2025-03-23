const expenseModel = require("../../models/expense/expenseEntry.model.js");
const helper = require("../../helper/helper.js");


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list ExpenseEntry>
*/
exports.listExpenseEntry = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  expenseModel.listExpenseEntry(req, (countRows, data) => {

    //console.log('listExpenseEntry-------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get ExpenseEntry>
*/
exports.getExpenseEntry = (req, res) => {

  expenseModel.getExpenseEntry(req, (data) => {
    res.send(data);
  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save ExpenseEntry>
*/
exports.saveExpenseEntry = (req, res) => {
  //console.log(req.body)
  const fields = {
    'designation_id': req.body.designation_id,
    'm1_hq_allow': req.body.m1_hq_allow,
    'm1_ex_hq_allow': req.body.m1_ex_hq_allow,
    'm2_hq_allow': req.body.m2_hq_allow,
    'm2_ex_hq_allow': req.body.m2_ex_hq_allow,
    'nm_hq_allow': req.body.nm_hq_allow,
    'nm_ex_hq_allow': req.body.nm_ex_hq_allow,
    'exp_daily_allow': req.body.exp_daily_allow,
    'car_allow': req.body.car_allow,
    'per_km_rate': req.body.per_km_rate,
    'max_km': req.body.max_km,
    'fare_transport': req.body.fare_transport,
    'max_km': req.body.max_km,
    'hotel_exp': req.body.hotel_exp,
    'conveyance': req.body.conveyance,
    'medical': req.body.medical,
    'postage_print_stationary': req.body.postage_print_stationary,
    'team_hospital_food': req.body.team_hospital_food,
    'team_meeting': req.body.team_meeting,
    'internet': req.body.internet,
    'mobile': req.body.mobile,
    'nm_hotel_exp': req.body.nm_hotel_exp,
    'enter_date': helper.dateTime(),
  }

  //console.log(fields);

  expenseModel.saveExpenseEntry(fields, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update ExpenseEntry>
*/

exports.updateExpenseEntry = (req, res) => {

  const exp_master_id = req.params.id;
  idData = {
    key: 'exp_master_id',
    value: exp_master_id
  }
  const fields = {
    'designation_id': req.body.designation_id,
    'm1_hq_allow': req.body.m1_hq_allow,
    'm1_ex_hq_allow': req.body.m1_ex_hq_allow,
    'm2_hq_allow': req.body.m2_hq_allow,
    'm2_ex_hq_allow': req.body.m2_ex_hq_allow,
    'nm_hq_allow': req.body.nm_hq_allow,
    'nm_ex_hq_allow': req.body.nm_ex_hq_allow,
    'exp_daily_allow': req.body.exp_daily_allow,
    'car_allow': req.body.car_allow,
    'per_km_rate': req.body.per_km_rate,
    'max_km': req.body.max_km,
    'fare_transport': req.body.fare_transport,
    'max_km': req.body.max_km,
    'hotel_exp': req.body.hotel_exp,
    'conveyance': req.body.conveyance,
    'medical': req.body.medical,
    'postage_print_stationary': req.body.postage_print_stationary,
    'team_hospital_food': req.body.team_hospital_food,
    'team_meeting': req.body.team_meeting,
    'internet': req.body.internet,
    'mobile': req.body.mobile,
    'nm_hotel_exp': req.body.nm_hotel_exp,
    "modify_by": 1,//req.body.user_id,
    "modify_date": helper.dateTime(),
  }


  // const segment_id = req.body.segment_id;

  // if (Object.keys(segment_id).length > 0) {

  //   expenseModel.deleteExpenseEntrySegment = (expense_id, (response) => {
  //     console.log(response)
  //     if (response.error === false) {
  //       for (let i = 0; i < segment_id.segment_ids.length; i++) {

  //         expenseModel.insertExpenseEntrySegment({
  //           expense_id: expense_id,
  //           segment_id: segment_id.segment_ids[i]
  //         }, (response) => {
  //           //res.send(response);
  //         })

  //       }
  //     }

  //   })

  //   //console.log(segment_id.segment_ids);
  // }

  expenseModel.updateExpenseEntry(idData, fields, (data) => {
    res.send(data);
  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status ExpenseEntry>
*/
exports.statusExpenseEntry = (req, res) => {

  // const id = req.params.id;

  // expenseModel.statusExpenseEntry(id, (data) => {
  //   res.send(data);

  // });


  const exp_master_id = req.params.id;
  idData = {
    key: 'exp_id',
    value: exp_master_id
  }
  const fields = {
    'status': req.params.status_id,
    "modify_by": 1,//req.body.user_id,
    "modify_date": helper.dateTime(),
  }

  console.log(fields);
  expenseModel.updateExpenseEntry(idData, fields, (data) => {
    res.send(data);
  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete ExpenseEntry>
*/

exports.deleteExpenseEntry = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'exp_master_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  expenseModel.updateExpenseEntry(idData, fields, (data) => {
    res.send(data);
  });

};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-07-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get attachment>
*/
exports.getExpenseAttechment = (req, res) => {
  const fs = require('fs');
  const path = require('path');

  const id = req.params.id;
  const url = req.url;

  var data = [];

  fs.access(`${__dirname}./../../../uploads/Ex-attachment/${id}`, function(error) {
    if (error) {
      console.log("Directory does not exist.")
      res.json({error:true,payload:data});
    } else {
      console.log("Directory exists.")
      const folderPath = path.resolve(__dirname, `./../../../uploads/Ex-attachment/${id}`);
      if(folderPath){
        fs.readdir(folderPath, (err, files) => {
          if (err) {
            res.json({error:true,payload:data});
           // console.error(err);
            //res.status(500).json({ error: 'Failed to read folder contents.' });
          } else {
            files.forEach(file => {
             // data.push(`abc/cbbc/${file}`);
              data.push(`https://www.bhaktiphotos.com/wp-content/uploads/2018/04/Mahadev-Bhagwan-Photo-for-Devotee.jpg`);
              console.log(url);
            });
      
            res.json({error:false,payload:data});
          }
        });
      }else{
        res.json([{error:true},{payload:data}]);
      }
    }
  })

  


};


////Anubhav

exports.expenseBulkEntry = (req, res) => {

  const myData =  req.body.data;
 console.log(myData);
 //res.send(myData)
   if (myData.length > 0) {
    expenseModel.expenseBulkEntry(myData, (data) => {
       res.send(data);
     });
   } else {
     res.send({'error':true,'message':'Data not find'});
   
    }
 
    //console.log(req);
 }