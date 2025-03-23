module.exports = app => {
    const Expense = require("../controllers/Expense/expense.controller");
  
    var router = require("express").Router();
    const multer  = require('multer')
    const fs = require("fs");
    const upload = multer({
      storage:multer.diskStorage({
    destination:function(req,file,cb){
      if (!fs.existsSync("uploads/Ex-attachment/" + req.params.expid)) {
        fs.mkdirSync("uploads/Ex-attachment/" + req.params.expid);
        if (!fs.existsSync(`uploads/Ex-attachment/${req.params.expid}`)) {
          fs.mkdirSync(`uploads/Ex-attachment/${req.params.expid}`);
        }
      } else {
        if (!fs.existsSync(`uploads/Ex-attachment/${req.params.expid}`)) {
          fs.mkdirSync(`uploads/Ex-attachment/${req.params.expid}`);
        }
      }
      cb(null,`uploads/Ex-attachment/${req.params.expid}`)
    },
    filename:function(req,file,cb){
      cb(null,`${Date.now()}-${file.originalname}`)
    }
      })
    }).array("expence_file")
    


  
   
    // Retrieve all published osbss
    router.post("/ExpenseDate", Expense.ExpenseDate);
    router.post("/Expensedata", Expense.Expensedata);
    router.post("/HqExpense", Expense.HqExpense);
    router.post("/EX_HqExpense", Expense.EX_HqExpense);
    router.post("/Outstation_Expense", Expense.Outstation_Expense);
    router.post("/attchmentUpload/:expid",upload,Expense.attchmentUpload);
    router.post("/OtherExpense",Expense.OtherExpense);
    router.post("/medicalcount",Expense.medicalcount);
    router.post("/ExpenseSubmitDate",Expense.ExpenseSubmitDate);
    router.post("/ExpensesubmitDates",Expense.ExpensesubmitDates);
    router.post("/ExpReports",Expense.ExpReports);
    router.get("/ReadUploadFiles/api/files/:folderName/:fileName",Expense.ReadUploadFiles);
    app.use('/', router);
  };
  