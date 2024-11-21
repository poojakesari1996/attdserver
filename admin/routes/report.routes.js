module.exports = app => {
    const Report = require("../controllers/report/report.controller.js");
   
  
    var router = require("express").Router();
  
    // Report
    router.get("/performanceSummary/:zone_id/:division_id/:current_date", Report.performanceSummary);
    router.get("/listPerformanceSummary", Report.listPerformanceSummary);
    router.get("/listDaysummery", Report.listDaysummery);
    router.get("/activityListDaysummery", Report.activityListDaysummery);
    router.get("/listAttendanceReport", Report.listAttendanceReport);
    router.get("/listSkuOrderDetails", Report.listSkuOrderDetails);
    router.get("/listExpenseDetails", Report.listExpenseDetails);
    router.get("/expenseReportByUserId", Report.expenseReportByUserId);
    router.get("/expensePDFReportByUserId", Report.expensePDFReportByUserId);
    router.get("/listOrderLocation", Report.listOrderLocation);
    
    app.use('/admin/v1/report', router);
  };
  