
module.exports = app => {

  const mappingOutlet = require("../controllers/mapping/outlet.controller.js");
  const mappingBeat = require("../controllers/mapping/beat.controller.js");
  const mappingMtp = require("../controllers/mapping/mtp.controller.js");
  const mappingUsers = require("../controllers/mapping/user.controller.js");

  const multer = require('multer')


  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try{
            cb(null,"uploads")
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



  // router.post('/uploadfile', upload.single("uploadfile"), (req, res) =>{
  //   //importExcelData2MySQL(__dirname + '/uploads/' + req.file.filename);
  //   console.log(req.file.filename);
  // });


  router.post('/mtp/uploadfile', upload.single("mtp_file"), mappingMtp.mappingMtpExcelUpload);


  // Mapping Outlet
  router.put("/outlet/:beat_id/:outlet_id", mappingOutlet.mappingOutletAssign);
  router.delete("/outlet/:outlet_id", mappingOutlet.mappingOutletDeleteAssign);

  router.get("/outlet/listOutlet", mappingOutlet.listOutlet);

  

  // Mapping Beat
  router.get("/beat/listBeatForOutletTransfer", mappingBeat.listBeatForOutletTransfer);
  router.get("/beat/listBeat", mappingBeat.mappingBeatList);
  


   // Mapping User
   router.put("/user/:user_id/:beat_id", mappingBeat.mappingBeatAssign);
   router.delete("/user/:beat_id", mappingBeat.mappingBeatDeleteAssign);

   //user list
   
   router.get("/user/listUser", mappingUsers.listUsers);

   // Mtp Assign
   router.get("/mtp/listMtp", mappingMtp.mappingMtpList);
   router.delete("/mtp/:id", mappingMtp.deleteMtp);
   router.post("/mtp/uploadMtp", mappingMtp.uploadMTP);

  app.use('/admin/v1/mapping', router);
};
