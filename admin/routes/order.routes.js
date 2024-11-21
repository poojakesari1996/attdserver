module.exports = app => {
    const Order = require("../controllers/order/order.controller.js");
    const ReturnOrder = require("../controllers/order/returnOrder.controller.js");
   
  
    var router = require("express").Router();
  
    // Order
    router.get("/listOrder", Order.listOrder);
    router.put("/status/:id/:status", Order.statusOrder);
    router.get("/order/:id/", Order.getOrder);
    router.put("/singleStatus/:id/", Order.singleStatus);

      // Order
      router.get("/listReturnOrder", ReturnOrder.listReturnOrder);
      router.put("/returnOrder/status/:id/:status", ReturnOrder.statusReturnOrder);
      router.get("/returnOrder/:id/", ReturnOrder.getReturnOrder);
      router.put("/returnSingleStatus/:id/", ReturnOrder.returnSingleStatus);
     


    app.use('/admin/v1/order', router);
  };
  