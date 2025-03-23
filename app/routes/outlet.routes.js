module.exports = app => {
    const Outlet = require("../controllers/Outlet/outlet.controller");
  
    var router = require("express").Router();
  
   
    // Retrieve all published osbss
    // router.post("/DatewiseOutlet", Outlet.DatewiseOutlet);
    router.post("/dateWiseOutlet", Outlet.dateWiseOutlet);
    router.post("/DatewiseOutlet_data", Outlet.DatewiseOutlet_data);
    router.post("/jioAddress", Outlet.jioAddress);
    router.get("/getAddress", Outlet.getAddress);
    router.post("/countOutlet", Outlet.countOutlet);
    router.post("/SelectedOutlet", Outlet.SelectedOutlet);
    router.post("/Reporting_hierarchy", Outlet.Reporting_hierarchy);
    router.post("/Dealernamelist", Outlet.Dealernamelist);
    router.post("/udateinfo", Outlet.udateinfo);
    router.post("/udatehospitalinfo", Outlet.udatehospitalinfo);
    router.post("/retail_activity", Outlet.retail_activity);
    router.post("/outlet_activity", Outlet.outlet_activity);
    router.post("/hospitalContact", Outlet.hospitalContact);
    router.post("/customeradd", Outlet.customeradd);
    router.post("/validationActivity", Outlet.validationActivity);
    router.post("/updateCustomer", Outlet.updateCustomer);
    router.post("/CustomerDetailShow", Outlet.CustomerDetailShow);
    app.use('/', router);
  };
  