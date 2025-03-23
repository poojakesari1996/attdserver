const expenseModel = require("../../models/master/expense.model.js");
const helper = require("../../helper/helper.js");


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Expense>
*/
exports.listExpense = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  expenseModel.listExpense(req, (countRows, data) => {

    //console.log('listExpense -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Expense>
*/
exports.getExpense = (req, res) => {

  expenseModel.getExpense(req, (data) => {
  res.send(data);
  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Expense>
*/
exports.saveExpense = (req, res) => {
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
    'misc': req.body.misc,
    'team_fooding_exp': req.body.team_fooding_exp,
    'nm_hotel_exp': req.body.nm_hotel_exp,
    'enter_date': helper.dateTime(),
  }

  //console.log(fields);

  expenseModel.saveExpense(fields, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Expense>
*/

exports.updateExpense = (req, res) => {

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
    'misc': req.body.misc,
    'team_fooding_exp': req.body.team_fooding_exp,
    "modify_by": 1,//req.body.user_id,
    "modify_date": helper.dateTime(),
  }


  // const segment_id = req.body.segment_id;

  // if (Object.keys(segment_id).length > 0) {

  //   expenseModel.deleteExpenseSegment = (expense_id, (response) => {
  //     console.log(response)
  //     if (response.error === false) {
  //       for (let i = 0; i < segment_id.segment_ids.length; i++) {

  //         expenseModel.insertExpenseSegment({
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

  expenseModel.updateExpense(idData, fields, (data) => {
    res.send(data);
  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Expense>
*/
exports.statusExpense = (req, res) => {

  const id = req.params.id;

  expenseModel.statusExpense(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <25-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Expense>
*/

exports.deleteExpense = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'exp_master_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  expenseModel.updateExpense(idData, fields, (data) => {
    res.send(data);
  });

};
