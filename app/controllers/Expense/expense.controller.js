const expenseModel = require("../../models/expense/expense.model.js");


exports.ExpenseDate = (req, res) => {
    expenseModel.ExpenseDate(req,(data) => {
    console.log('listAuth -------', data);
    res.send(data);
  });


};

exports.ExpenseSubmitDate = (req, res) => {
  expenseModel.ExpenseSubmitDate(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.Expensedata = (req, res) => {
  expenseModel.Expensedata(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.HqExpense = (req, res) => {
  expenseModel.HqExpense(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.EX_HqExpense = (req, res) => {
  expenseModel.EX_HqExpense(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.Outstation_Expense = (req, res) => {
  expenseModel.Outstation_Expense(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.attchmentUpload = (req, res) => {
  expenseModel.attchmentUpload(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.OtherExpense = (req, res) => {
  expenseModel.OtherExpense(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.medicalcount = (req, res) => {
  expenseModel.medicalcount(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.ExpensesubmitDates = (req, res) => {
  expenseModel.ExpensesubmitDates(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.ExpReports = (req, res) => {
  expenseModel.ExpReports(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};

exports.ReadUploadFiles = (req, res) => {
  expenseModel.ReadUploadFiles(req,(data) => {
  console.log('listAuth -------', data);
  res.send(data);
});


};