const attendanceModel = require("../../models/user/attendance.model.js");
const helper = require("../../helper/helper.js");



exports.listAttendance = (req, res) => {

    const page = req.query.page || 1;
   // const perPage = req.query.items_per_page || 10;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 200;

    attendanceModel.listAttendance(req, (countRows, data) => {
console.log(perPage);
        data.payload = helper.pagination(countRows, page, perPage)
        res.send(data);
    });


};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Week Off>
*/
exports.saveWeekOff = (req, res) => {

    const id = req.params.id;
  
    attendanceModel.saveWeekOff11111111(req, (data) => {
      res.send(data);
    });
  };




