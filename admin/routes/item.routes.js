module.exports = app => {

  const Item = require("../controllers/item/item.controller.js");


  var router = require("express").Router();


  // Item
  router.get("/listItem", Item.listItem);
  router.get("/item/:id", Item.getItem);
  router.put("/item/:id", Item.updateItem);
  router.post("/item", Item.saveItem);
  router.delete("/item/:id", Item.deleteItem);
  router.put("/item/status/:id", Item.statusItem);
  router.post("/item/itemBulkUser", Item.itemBulkUser);

  
  app.use('/admin/v1/item', router);
};
