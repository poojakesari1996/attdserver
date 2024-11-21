module.exports = app => {

    require("./user.routes.js")(app);
    require("./auth.routes.js")(app);
    require("./master.routes.js")(app);
    require("./order.routes.js")(app);
    require("./mapping.routes.js")(app);
    require("./item.routes.js")(app);
    require("./setting.routes.js")(app);
    require("./report.routes.js")(app);
    require("./expense.routes.js")(app);

  };