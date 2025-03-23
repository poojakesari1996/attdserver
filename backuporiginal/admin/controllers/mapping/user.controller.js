const userModel = require("../../models/mapping/user.model.js");
const helper = require("../../helper/helper.js");



exports.listUsers = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 100;
  userModel.listUsers(req,(countRows,data) => {
 
    //console.log('listUser -------', data);
    // helper.checkResult(err,data);
    // helper.pagination(total, page, perPage) 
    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });
}
