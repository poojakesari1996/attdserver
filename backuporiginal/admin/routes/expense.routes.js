module.exports = app => {
    const Expense = require("../controllers/expense/expenseEntry.controller.js");
   
  
    var router = require("express").Router();
  
     // Expense
     router.get("/listExpense", Expense.listExpenseEntry);
     router.get("/expense/:id", Expense.getExpenseEntry);
     router.put("/expense/:id", Expense.updateExpenseEntry);
     router.post("/expense", Expense.saveExpenseEntry);
     router.delete("/expense/:id", Expense.deleteExpenseEntry);
     router.put("/expense/status/:id/:status_id", Expense.statusExpenseEntry);
     router.get("/expenseAttachment/:id", Expense.getExpenseAttechment);
     router.post("/expense/expenseBulkEntry", Expense.expenseBulkEntry);
    app.use('/admin/v1/expense', router);
  };
  