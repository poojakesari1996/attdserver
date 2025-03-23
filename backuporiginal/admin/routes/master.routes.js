
module.exports = app => {

  
  const Warehouse = require("../controllers/master/warehouse.controller.js");
  const Dealer = require("../controllers/master/dealer.controller.js");
  const Zone = require("../controllers/master/zone.controller.js");
  const Beat = require("../controllers/master/beat.controller.js");
  const Outlet = require("../controllers/master/outlet.controller.js");

  const State = require("../controllers/master/state.controller.js");
  const City = require("../controllers/master/city.controller.js");
  const District = require("../controllers/master/district.controller.js");
  const Area = require("../controllers/master/area.controller.js");
  const MasterData = require("../controllers/master/get-data/master.controlller");

  const Designation = require("../controllers/master/designation.controller.js");
  const Role = require("../controllers/master/role.controller.js");
  const Division = require("../controllers/master/division.controller.js");
  const OutletCategory = require("../controllers/master/outletCategory.controller.js");
  const Expense = require("../controllers/master/expense.controller.js");
  const Scheme = require("../controllers/master/scheme.controller.js");
  const OutletCustomer = require("../controllers/master/outletCustomer.controller.js");
  const Department = require("../controllers/master/department.controller.js");

  const multer = require('multer')
 
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try{
            cb(null,"admin/uploads/outlet")
        }catch(e){
            cb(e);
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});
const upload = multer({storage: storage});

var router = require("express").Router();

router.post('/outlet/uploadfile', upload.single("outlet_file"), Outlet.excelUpload);



  // Warehouse
  router.get("/listWarehouse", Warehouse.listWarehouse);
  router.get("/warehouse/:id", Warehouse.getWarehouse);
  router.put("/warehouse/:id", Warehouse.updateWarehouse);
  router.post("/warehouse", Warehouse.saveWarehouse);
  router.delete("/warehouse/:id", Warehouse.deleteWarehouse);
  router.put("/warehouse/status/:id", Warehouse.statusWarehouse);

  // Dealer
  router.get("/listDealer", Dealer.listDealer);
  router.get("/dealer/:id", Dealer.getDealer);
  router.put("/dealer/:id", Dealer.updateDealer);
  router.post("/dealer", Dealer.saveDealer);
  router.delete("/dealer/:id", Dealer.deleteDealer);
  router.put("/dealer/status/:id", Dealer.statusDealer);
  router.post("/dealer/uploadDealerExcel", Dealer.uploadDealerExcel);

  // Zone
  router.get("/listZone", Zone.listZone);
  router.get("/zone/:id", Zone.getZone);
  router.put("/zone/:id", Zone.updateZone);
  router.post("/zone", Zone.saveZone);
  router.delete("/zone/:id", Zone.deleteZone);
  router.put("/zone/status/:id", Zone.statusZone);

  // Beat
  router.get("/listBeat", Beat.listBeat);
  router.get("/beat/:id", Beat.getBeat);
  router.put("/beat/:id", Beat.updateBeat);
  router.post("/beat", Beat.saveBeat);
  router.delete("/beat/:id", Beat.deleteBeat);
  router.put("/beat/status/:id", Beat.statusBeat);

  // Outlet
  router.get("/listOutlet", Outlet.listOutlet);
  router.get("/outlet/:id", Outlet.getOutlet);
  router.put("/outlet/:id", Outlet.updateOutlet);
  router.post("/outlet", Outlet.saveOutlet);
  router.delete("/outlet/:id", Outlet.deleteOutlet);
  router.put("/outlet/status/:id", Outlet.statusOutlet);
  router.put("/outlet/approval/:id/:approval_id", Outlet.approvalOutlet);
  router.post("/outlet/uploadNewOutlet", Outlet.uploadNewOutlet);
  router.post("/outlet/checkOutletId", Outlet.checkOutletId);
  router.post("/outlet/uploadNewCustomerOutlet", Outlet.uploadNewCustomerOutlet);

  // State
  router.get("/listState", State.listState);
  router.get("/state/:id", State.getState);
  router.put("/state/:id", State.updateState);
  router.post("/state", State.saveState);
  router.delete("/state/:id", State.deleteState);
  router.put("/state/status/:id", State.statusState);

  // City
  router.get("/listCity", City.listCity);
  router.get("/city/:id", City.getCity);
  router.put("/city/:id", City.updateCity);
  router.post("/city", City.saveCity);
  router.delete("/city/:id", City.deleteCity);
  router.put("/city/status/:id", City.statusCity);


  //District
  router.get("/listDistrict", District.listDistrict);
  router.get("/district/:id", District.getDistrict);
  router.put("/district/:id", District.updateDistrict);
  router.post("/district", District.saveDistrict);
  router.delete("/district/:id", District.deleteDistrict);
  router.put("/district/status/:id", District.statusDistrict);

  // Area
  router.get("/listArea", Area.listArea);
  router.get("/area/:id", Area.getArea);
  router.put("/area/:id", Area.updateArea);
  router.post("/area", Area.saveArea);
  router.delete("/area/:id", Area.deleteArea);
  router.put("/area/status/:id", Area.statusArea);

  // Designation
  router.get("/listDesignation", Designation.listDesignation);
  router.get("/designation/:id", Designation.getDesignation);
  router.put("/designation/:id", Designation.updateDesignation);
  router.post("/designation", Designation.saveDesignation);
  router.delete("/designation/:id", Designation.deleteDesignation);
  router.put("/designation/status/:id", Designation.statusDesignation);

   // Expense
   router.get("/listExpense", Expense.listExpense);
   router.get("/expense/:id", Expense.getExpense);
   router.put("/expense/:id", Expense.updateExpense);
   router.post("/expense", Expense.saveExpense);
   router.delete("/expense/:id", Expense.deleteExpense);
   router.put("/expense/status/:id", Expense.statusExpense);

  // Role
  router.get("/listRole", Role.listRole);
  router.get("/role/:id", Role.getRole);
  router.put("/role/:id", Role.updateRole);
  router.post("/role", Role.saveRole);
  router.delete("/role/:id", Role.deleteRole);
  router.put("/role/status/:id", Role.statusRole);

  // Division
  router.get("/listDivision", Division.listDivision);
  router.get("/division/:id", Division.getDivision);
  router.put("/division/:id", Division.updateDivision);
  router.post("/division", Division.saveDivision);
  router.delete("/division/:id", Division.deleteDivision);
  router.put("/division/status/:id", Division.statusDivision);



  // OutletCategory
  router.get("/listOutletCategory", OutletCategory.listOutletCategory);
  router.get("/outletCategory/:id", OutletCategory.getOutletCategory);
  router.put("/outletCategory/:id", OutletCategory.updateOutletCategory);
  router.post("/outletCategory", OutletCategory.saveOutletCategory);
  router.delete("/outletCategory/:id", OutletCategory.deleteOutletCategory);
  router.put("/outletCategory/status/:id", OutletCategory.statusOutletCategory);

    // Scheme
    router.get("/listScheme", Scheme.listScheme);
    router.get("/scheme/:id", Scheme.getScheme);
    router.put("/scheme/:id", Scheme.updateScheme);
    router.post("/scheme", Scheme.saveScheme);
    router.delete("/scheme/:id", Scheme.deleteScheme);
    router.put("/scheme/status/:id", Scheme.statusScheme);

    // OutletCustomer
    router.get("/listOutletCustomer", OutletCustomer.listOutletCustomer);
    router.get("/outletCustomer/:id", OutletCustomer.getOutletCustomer);
    router.put("/outletCustomer/:id", OutletCustomer.updateOutletCustomer);
    router.post("/outletCustomer", OutletCustomer.saveOutletCustomer);
    router.delete("/outletCustomer/:id", OutletCustomer.deleteOutletCustomer);
    router.put("/outletCustomer/status/:id", OutletCustomer.statusOutletCustomer);

    // Department
    router.get("/listDepartment", Department.listDepartment);
    router.get("/department/:id", Department.getDepartment);
    router.put("/department/:id", Department.updateDepartment);
    router.post("/department", Department.saveDepartment);
    router.delete("/department/:id", Department.deleteDepartment);
    router.put("/department/status/:id", Department.statusDepartment);
  
    // // Expense
    // router.get("/listExpense", Expense.listExpense);
    // router.get("/division/:id", Expense.getExpense);
    // router.put("/division/:id", Expense.updateExpense);
    // router.post("/division", Expense.saveExpense);
    // router.delete("/division/:id", Expense.deleteExpense);
    // router.put("/division/status/:id", Expense.statusExpense);


  router.get("/get-data/zone", MasterData.zone);
  router.get("/get-data/state", MasterData.state);
  router.get("/get-data/city/:state_id", MasterData.city);
  router.get("/get-data/district/:state_id", MasterData.district);
  router.get("/get-data/area", MasterData.area);
  router.get("/get-data/division", MasterData.division);
  router.get("/get-data/segment", MasterData.segment);
  router.get("/get-data/outlet-category", MasterData.outlet_category);
  router.get("/get-data/customer-type/:outlet_category_id", MasterData.customer_type);
  router.get("/get-data/sales-man-users/:zone_id", MasterData.SalesManUsers);
  router.get("/get-data/reporting-users", MasterData.ReportingUsers);
  router.get("/get-data/designation", MasterData.Designation);
  router.get("/get-data/department", MasterData.Department); 
  router.get("/get-data/role", MasterData.Role);
  router.get("/get-data/menu", MasterData.Menu);
  
  router.get("/get-data/warehouse", MasterData.Warehouse);
  router.get("/get-data/beat", MasterData.Beat);
  router.get("/get-data/beatByAddress/:state_id/:city_id/:district_id", MasterData.beatByAddress);
  router.get("/get-data/dealer/:zone_id", MasterData.Dealer);
  router.get("/get-data/dealerByAddress/:state_id/:city_id/:district_id", MasterData.dealerByAddress);

  router.get("/get-data/outlets", MasterData.outlets);
  router.get("/get-data/getUsersByReportingId", MasterData.getUsersByReportingId);
  router.get("/get-data/getMasterCount/:table", MasterData.getMasterCount);
  router.get("/get-data/getOrderCount/:table", MasterData.getOrderCount);
  router.get("/get-data/getUsersExpenseAdded/:exp_date", MasterData.getUsersExpenseAdded);
  router.get("/get-data/getAllMtpUsers", MasterData.getAllMtpUsers);
  router.get("/get-data/getAttendanceStatusCount", MasterData.getAttendanceStatusCount);

  
  app.use('/admin/v1/master', router);
};
