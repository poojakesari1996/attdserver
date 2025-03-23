const roleModel = require("../../models/master/role.model.js");
const helper = require("../../helper/helper.js");


 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Role>
*/
exports.listRole = (req, res) => {

    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  roleModel.listRole(req,(countRows,data) => {
 
    console.log('listRole -------', data);

    data.payload = helper.pagination(countRows, page, perPage)
    res.send(data);
  });


};
 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Role>
*/
exports.getRole = (req, res) => {
 
  roleModel.getRole(req, (data) => {

    res.send(data);
   
  });
};

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Role>
*/

exports.updateRole = (req, res) => {

console.log("=========================controller11111111112====================",req.body);
//res.send('');

    const id_value = req.params.id;
    idData={
        key:'role_id',
        value:id_value
    }
    const fields = {
      "role_name":  req.body.role_name,
      "alias":  req.body.alias,
      "role_type":  req.body.role_type,
      "modify_by":  1, //req.body.user_id,
      "modify_date":  helper.dateTime(),
    }
    roleModel.updateRole(idData,fields, (data) => {

      var menu = req.body.menus;

      console.log(menu);
      roleModel.roleMenuUpdate(id_value, menu)

      res.send(data);
     
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Role>
*/
  exports.saveRole = (req, res) => {

    console.log("=========================controller11111111112====================",req.body);
    
    const fields = {
      'role_name': req.body.role_name,    
      "alias":  req.body.alias,
      "role_type":  req.body.role_type,
      'enter_by': 1,
      'enter_date': helper.dateTime(),
    }
    roleModel.saveRole(fields, (data) => {

      var menus = req.body.menus;
      roleModel.addRoleMenus(data.role_id, menus)
      res.send(data);
     
    });
  };
  
/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Role>
*/
exports.statusRole = (req, res) => {

  const id = req.params.id;

  roleModel.statusRole(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <06-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Role>
*/

exports.deleteRole = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'role_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  roleModel.updateRole(idData, fields, (data) => {
    res.send(data);
  });
};
  