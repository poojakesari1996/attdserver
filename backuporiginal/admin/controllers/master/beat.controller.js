const beatModel = require("../../models/master/beat.model.js");
const helper = require("../../helper/helper.js");


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Beat>
*/
exports.listBeat = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  beatModel.listBeat(req, (countRows, data) => {

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
*@Description:      <get Beat>
*/
exports.getBeat = (req, res) => {

  beatModel.getBeat(req, (data) => {
  res.send(data);
  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <save Beat>
*/
exports.saveBeat = (req, res) => {
  //console.log(req.body)
  const fields = {
    'beat_name': req.body.beat_name,
    'zone_id': req.body.zone_id,
    'division_id': req.body.division_id,
    'state_id': req.body.state_id,
    'city_id': req.body.city_id,
    'district_id': req.body.district_id,
    //'beat_assigning_form_id': req.body.beat_assigning_form_id,
    'enter_by': 1, //req.body.user_id,
    'enter_date': helper.dateTime(),
  }

  beatModel.saveBeat(fields, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <update Beat>
*/

exports.updateBeat = (req, res) => {

  const beat_id = req.params.id;
  idData = {
    key: 'beat_id',
    value: beat_id
  }
  const fields = {
    'beat_name': req.body.beat_name,
    'zone_id': req.body.zone_id,
    'division_id': req.body.division_id,
    'state_id': req.body.state_id,
    'city_id': req.body.city_id,
    'beat_assigning_form_id': req.body.beat_assigning_form_id,

    "modify_by": 1,//req.body.user_id,
    "modify_date": helper.dateTime(),
  }


  // const segment_id = req.body.segment_id;

  // if (Object.keys(segment_id).length > 0) {

  //   beatModel.deleteBeatSegment = (beat_id, (response) => {
  //     console.log(response)
  //     if (response.error === false) {
  //       for (let i = 0; i < segment_id.segment_ids.length; i++) {

  //         beatModel.insertBeatSegment({
  //           beat_id: beat_id,
  //           segment_id: segment_id.segment_ids[i]
  //         }, (response) => {
  //           //res.send(response);
  //         })

  //       }
  //     }

  //   })

  //   //console.log(segment_id.segment_ids);
  // }

  beatModel.updateBeat(idData, fields, (data) => {
    res.send(data);
  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <16-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <status Beat>
*/
exports.statusBeat = (req, res) => {

  const id = req.params.id;

  beatModel.statusBeat(id, (data) => {
    res.send(data);

  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <delete Beat>
*/

exports.deleteBeat = (req, res) => {

  const id = req.params.id;
  idData = {
    key: 'beat_id',
    value: id
  }
  const fields = {
    "deleted_at": helper.dateTime()
  }
  beatModel.updateBeat(idData, fields, (data) => {
    res.send(data);
  });

};
