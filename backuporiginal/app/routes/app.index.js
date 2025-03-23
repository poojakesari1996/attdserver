module.exports = app =>{
    require("./auth.routes.js")(app);
    require("./dashboard.routes.js")(app);
    require("./attendance.routes.js")(app);
    require("./profile.routes.js")(app);
    require("./outlet.routes.js")(app);
    require("./skuorder.routes.js")(app);
    require("./reports.routes.js")(app);
    require("./expense.routes.js")(app);
}