module.exports = app => {
    const Skuorder = require("../controllers/Skuorder/skuorder.controller");
  
    var router = require("express").Router();
  
   
    // Retrieve all published osbss
    router.post("/skulist", Skuorder.skulist);
    router.post("/ADSskulist", Skuorder.ADSskulist);
    router.post("/EMSskulist", Skuorder.EMSskulist);
    router.post("/orderfilleds", Skuorder.orderfilleds);
    router.post("/orderreturn", Skuorder.orderreturn);
    router.post("/Schememaster", Skuorder.Schememaster);
    router.post("/skulisthospital", Skuorder.skulisthospital);
    router.post("/ActivityHospital", Skuorder.ActivityHospital);
    app.use('/', router);
  };
  