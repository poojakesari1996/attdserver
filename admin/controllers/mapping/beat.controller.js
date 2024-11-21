const beatModel = require("../../models/mapping/beat.model.js");
const helper = require("../../helper/helper.js");

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Beat For Outlet Transfer >
*/
exports.listBeatForOutletTransfer = (req, res) => {


    const page = req.query.page || 1;
    const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 500;

    beatModel.listBeatWithOutletCount(req, (countRows, data) => {
        //console.log('listBeat -------', data);
        data.payload = helper.pagination(countRows, page, perPage)
        res.send(data);
    });

};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Beat>
*/
exports.mappingBeatList = (req, res) => {

    const userID = req.query.user_id || 0;
    console.log("--------------------------------" + userID);
    const page = req.query.page || 1;
    const perPage = req.query.filter_per_page ? req.query.filter_per_page : 100;
    if (userID) {
        beatModel.mappingBeatList(req, (countRows, data) => {

            //console.log('listBeat -------', data);

            data.payload = helper.pagination(countRows, page, perPage)
            res.send(data);
        });
    } else {
        res.send({});
    }



};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Beat>
*/
// exports.mappingBeatList = (req, res) => {

//   beatModel.listBeat(req,(data) => {
//     console.log('listBeat -------', data);
//     res.send(data);
//   });


// };


/*===============================================================================================
                            =========Beat Assigning to User ==========
=================================================================================================*/


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <19-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Assign Beat>
*/

exports.mappingBeatAssign = (req, res) => {

    const user_id = req.params.user_id;
    const beat_id = req.params.beat_id;
    idData = {
        key: 'beat_id',
        value: beat_id
    }
    const fields = {
        "beat_assigning_form_id": user_id,
        "modify_by": 1,
        "modify_date": helper.dateTime()
    }
    /*update beat table*/
    beatModel.mappingBeatUpdate(idData, fields, (data) => {

        // if (data.error === false) {
        //     //update beat_beat if exist  and insert data beat_beat table
        //     beatModel.updateAndInsertBeatBeat({
        //         "beat_id": req.params.beat_id,
        //         "user_id": req.params.user_id,
        //         'enter_by': 1,
        //         'enter_date': helper.dateTime(),
        //     }, (data1) => {
        //         res.send(data1);
        //     })

        // } else {
        //     res.send(data);
        // }
        res.send(data);
    });
};




/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Delete Assigned  Beat>
*/

exports.mappingBeatDeleteAssign = (req, res) => {
    var user = JSON.parse(req.headers.authorization)
    idData = {
        key: 'beat_id',
        value: req.params.beat_id
    }
    const fields = {
        "beat_assigning_form_id": 0,
        "modify_by": user.emp_id,
        "modify_date": helper.dateTime()
    }
    /*update beat table*/
    beatModel.mappingBeatUpdate(idData, fields, (data) => {

        // if (data.error === false) {

        //     beatModel.mappingBeatUserUpdate({
        //         "beat_id": req.params.beat_id,
        //         'deleted_by': 1,
        //         'deleted_at': helper.dateTime(),
        //     }, (data) => {
        //         res.send(data);
        //     })
        // }
        res.send(data);
    })

};