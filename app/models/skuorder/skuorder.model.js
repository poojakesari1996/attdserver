const sql = require("../db.js");

// constructor
const skuorder = function(osbs) {
  this.title = osbs.title;
  this.description = osbs.description;
  this.published = osbs.published;
};


/*
*@Author:           <Anubhav Tripathi>
*@Created On:       <16-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <List Item>
*/


////////item

skuorder.skulist =  (req, result) => {
    sql.query( `SELECT sku.sku_id,sku.sku_name,sku.sku_price,sku.sku_gst,seg.segment_code,sku.sku_gst,divs.division_name, 0 total
    FROM crm_dev_db.cor_sku_m AS sku
    LEFT JOIN crm_dev_db.cor_segment_m AS seg ON sku.segment_id = seg.segment_id
    LEFT JOIN crm_dev_db.cor_division_m AS divs ON sku.division_id = divs.division_id
    where sku.division_id = '${req.body.division}'`,
     (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

///////////filter

  skuorder.ADSskulist =  (req, result) => {
    sql.query( `Select sku.sku_name,sku.sku_price,seg.segment_code,sku.sku_gst, 0 total FROM romsondb.cor_sku_m AS sku
    LEFT JOIN romsondb.cor_segment_m AS seg ON sku.segment_id = seg.segment_id
    where sku.segment_id = '${req.body.segment_id}'`,
     (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  skuorder.EMSskulist =  (req, result) => {
    sql.query( `Select sku.sku_name,sku.sku_price,seg.segment_code,sku.sku_gst, 0 total FROM romsondb.cor_sku_m AS sku
    LEFT JOIN romsondb.cor_segment_m AS seg ON sku.segment_id = seg.segment_id
    where sku.segment_id = '${req.body.segment_id}'`,
     (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  

/////////order

skuorder.orderfilleds =  async(req, results) => {

    const TaskAuto = await OrderAutoNo();  

    let detailQry = `INSERT INTO  crm_dev_db.cor_order_d (order_id, item_id, item_qty,item_price_unit,item_gst,enter_by,enter_date,order_amt,order_gst_amt,item_value,item_discount)
    VALUES`;
  
    let querry = `INSERT INTO crm_dev_db.cor_order_m (
      order_id, 
      order_date, 
      order_time,
      outlet_id,
      phone_no,
      joined_call_id,
      joined_name,
      call_type,
      employee_id,
      enter_by,
      enter_date,
      scheme_discount,
      total_quantity,
      discount_amount,
      zone_id,
      division_m,
      order_lat,
      order_lag,
      dealer_id,
      reporting_to_user_id,
      beat_id
      ) VALUES (${TaskAuto[0]["crm_dev_db.all_auto_no(44)"]},
      curdate(),
      sysdate(),
      '${req.body.outletID}',
      '${req.body.pnumber}',
      '${req.body.joinedid}',
      '${req.body.joinedName}',
      '${req.body.callType}',
      '${req.body.employeeID}',
      '${req.body.enterBy}',
      sysdate(),
      '${req.body.schemdiscount}',
      '${req.body.totalquantity}',
      '${req.body.discountamount}',
      '${req.body.zone}',
      '${req.body.division}',
      '${req.body.lat}',
      '${req.body.lag}',
      '${req.body.dealer_id}',
      '${req.body.reporting_to_user_id}',
      '${req.body.beat_id}'
      );`

  

    sql.query( querry, (err, result) => {
        req.body.detail.map((res, index) => {
          detailQry += `(${TaskAuto[0]["crm_dev_db.all_auto_no(44)"]},
          '${res.sku_id}','${res.itemvalue}','${res.sku_price}',
          '${res.sku_gst}','${req.body.enterBy}',sysdate(),${res.itemvalue}*${res.sku_price},
          (${res.itemvalue}*${res.sku_price}*${res.sku_gst})/100,
          (${res.itemvalue}*${res.sku_price})+((${res.itemvalue}*${res.sku_price}*${res.sku_gst})/100),
          '${req.body.item_discount}')`;
    
          if (index < req.body.detail.length - 1) {
            detailQry += ",";   
          }
        });

        setTimeout(() => {
            sql.query(detailQry, (err, resp) => {
            console.log(result, resp);
            results({ result, resp});
          });
        }, 2000);
    
        //    res.send(result);
       // console.log(querry);
      });
    };

    //////return

    skuorder.orderreturn =  async(req, results) => {

      const ReturnAuto = await ReturnAutoNo();
      console.log(ReturnAuto,"ReturnAuto");

      let detailQry = `INSERT INTO  crm_dev_db.cor_order_return_d (order_return_id, item_id, item_qty,item_price_unit,item_gst,order_return_reason,enter_by,enter_date,return_order_amt,return_order_gst_amt,item_value)
      VALUES`;
    
      let querry = `INSERT INTO crm_dev_db.cor_order_return_m (
        order_return_id, 
        order_return__date, 
        order_return_time,
        outlet_id,
        phone_no,
        employee_id,
        enter_by,
        enter_date,
        scheme_discount,
        total_quantity,
        discount_amount,
        division_m,
        zone_id,
        return_order_lat,
        return_order_lag,
        dealer_id,
        reporting_to_user_id,
        beat_id
        ) VALUES (${ReturnAuto[0]["crm_dev_db.all_auto_no(77)"]},
        curdate(),
        sysdate(),
        '${req.body.outletID}',
        '${req.body.pnumber}',
        '${req.body.employeeID}',
        '${req.body.enterBy}',
        sysdate(),
        '${req.body.schemdiscountreturn}',
        '${req.body.totalquantityreturn}',
        '${req.body.discountamountreturn}',
        '${req.body.division}',
        '${req.body.zone}',
        '${req.body.lat}',
        '${req.body.lag}',
        '${req.body.dealer_id}',
        '${req.body.reporting_to_user_id}',
        '${req.body.beat_id}'
        );`
    
      // console.log(detailQry,"///////////////");
      // console.log(querry, "..............");
    
  
      sql.query( querry, (err, result) => {
        req.body.detail.map((res, index) => {
          detailQry += `(${ReturnAuto[0]["crm_dev_db.all_auto_no(77)"]},
          '${res.itemId}','${res.value}','${res.price}','${res.itmgst}',
            '${res.ITM}','${req.body.enterBy}',sysdate(),
            ${res.value}*${res.price},
            (${res.value}*${res.price}*${res.itmgst})/100,
            (${res.value}*${res.price})+((${res.value}*${res.price}*${res.itmgst})/100))`;
    
          if (index < req.body.detail.length - 1) {
            detailQry += ",";
          }
        });
        console.log(querry,"master");
        setTimeout(() => {
          sql.query(detailQry, (err, resp) => {
            console.log(result, resp);
            results({ result, resp });
          });
        }, 2000);
    
        //    res.send(result);
        console.log(results);
        });
      };

    ////////////scheme

    skuorder.Schememaster =  (req, result) => {
      sql.query( `SELECT scheme_id,scheme_name,for_quantity,division_id,for_amount,start_date_time,end_date_time FROM romsondb.cor_scheme_m where division_id='${req.body.divId}'
      and '${req.body.SchemeDate}' between start_date_time and end_date_time ORDER BY for_quantity DESC`,
       (err, res) => {
        console.log("osbss: ", res);
        if (err) {
          result({ error: true, data: "Something Went Wrong" })
        }
        result({ error: false, data: res })
      });
    };



    ///////hospital

    skuorder.skulisthospital =  (req, result) => {
      sql.query( `SELECT sku.sku_id,sku.sku_name,sku.sku_price,sku.sku_gst,seg.segment_code,sku.sku_gst,divs.division_name, 0 total
      FROM crm_dev_db.cor_sku_m AS sku
      LEFT JOIN crm_dev_db.cor_segment_m AS seg ON sku.segment_id = seg.segment_id
      LEFT JOIN crm_dev_db.cor_division_m AS divs ON sku.division_id = divs.division_id
      where sku.division_id = '${req.body.division}'`,
       (err, res) => {
        console.log("osbss: ", res);
        if (err) {
          result({ error: true, data: "Something Went Wrong" })
        }
        result({ error: false, data: res })
      });
    };


    skuorder.ActivityHospital =  async(req, results) => {

      console.log(req.body,"line 262");

      const ActivityAuto = await ActivityAutoNO();
      console.log(ActivityAuto,"ReturnAuto");

      let detailQry = `INSERT INTO crm_dev_db.cor_outlet_activity_m (activity_id,outlet_id, item_id, enter_by,user_type,remark,follow_up,enter_date,hospital_customer_name,hospital_name,activity_date,zone_id,division_m,act_lat,act_long, joined_name, call_type,joined_call_id)
      VALUES`;
    
  
      sql.query( detailQry, (err, result) => {
        req.body.activitydetails.map((res, index) => {
          detailQry += `(${ActivityAuto[0]["crm_dev_db.all_auto_no(66)"]},"${res.Outletid}",
          "${res.itemId}",
          "${req.body.enterbyy}","${res.custype}","${res.value}", "${res.followup}",
          sysdate(),"${res.customername}","${res.Hosname}",curdate(),"${req.body.zone}",
          "${req.body.div}","${req.body.lat}","${req.body.lag}","${req.body.joinedName}","${req.body.callType}",${req.body.joinedcallid})`;
          if (index < req.body.activitydetails.length - 1) {
            detailQry += ",";
          }
        });
        console.log(detailQry, "/./././././");
  
    sql.query(detailQry, (err, resp) => {
      console.log(result, resp,"Line 285");
      if(err){
        results({error:true,data:"Something Went Wrong"})
      }else{
        results({ error: false, data: "Successfully Submited" });
      }
      
    });
  
        });
      };

    ///////////


    
    function OrderAutoNo() {
        return new Promise((resolve, reject) => {
            sql.query(
            `(select crm_dev_db.all_auto_no(44))`,
            (err, result) => {
              console.log(result);
              resolve(result);
            }
          );
        });
      }

      function ReturnAutoNo() {
        return new Promise((resolve, reject) => {
            sql.query(
            `(select crm_dev_db.all_auto_no(77))`,
            (err, result) => {
              console.log(result);
              resolve(result);
            }
          );
        });
      }

      function ActivityAutoNO() {
        return new Promise((resolve, reject) => {
            sql.query(
            `(select crm_dev_db.all_auto_no(66))`,
            (err, result) => {
              console.log(result);
              resolve(result);
            }
          );
        });
      }

  
module.exports = skuorder;