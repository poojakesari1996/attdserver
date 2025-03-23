const sql = require("../db.js");

// constructor
const reports = function(osbs) {
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


//////order

reports.SelectedBeat =  (req, result) => {
    sql.query( `SELECT beat_id,beat_name FROM romsondb.cor_beat_m where beat_assigning_form_id = '${req.body.empID}' order by beat_name`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({data: "Something Went Wrong" })
      }
      result({ data: res })
    });
  };

  reports.SelectOutlet_OrderHistory =  (req, result) => {
    sql.query( `SELECT outlet_id,outlet_name FROM romsondb.cor_outlet_m where beat_id ='${req.body.BeatID}'order by outlet_name`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  reports.OrderHistory_MIS =  (req, result) => {
    sql.query( `SELECT m.order_id, m.order_date , m.order_time, item_id,sum(item_qty) qty , round(sum(item_price_unit),2) unit ,  round(sum(order_amt),2)   taxable_value ,item_gst,round(sum(order_gst_amt),2) gst,
    round(sum(order_amt),2) +round(sum(order_gst_amt),2) tot_amt,itm.sku_name,outlet.outlet_name
    FROM romsondb.cor_order_m m,romsondb.cor_order_d d , romsondb.cor_sku_m itm,romsondb.cor_outlet_m outlet
    where  m.order_id=d.order_id and m.outlet_id=outlet.outlet_id  and m.outlet_id='${req.body.Outletid}' and d.item_id=itm.sku_id and m.order_date between '${req.body.fromDate}' AND '${req.body.toDate}' and m.employee_id='${req.body.enterBy}'
    group by m.order_id, m.order_date,item_id,item_gst;`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };


  reports.Selectdate =  (req, result) => {
    sql.query( `SELECT ol.outlet_name,o.order_time,o.status,o.scheme_discount,o.total_quantity
    FROM romsondb.cor_order_m as o
    LEFT JOIN romsondb.cor_outlet_m as ol
    ON o.outlet_id = ol.outlet_id
    where o.outlet_id = '${req.body.Outletids}'`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  //////acvtivity

  reports.ActivityHistory_MIS =  (req, result) => {
    sql.query( `SELECT sku.sku_name,act.item_id,act.user_type,act.remark,act.follow_up,act.enter_date,act.hospital_customer_name,act.hospital_name
    FROM romsondb.cor_outlet_activity_m as act
    LEFT JOIN romsondb.cor_sku_m as sku
    ON act.item_id = sku.sku_id
    where act.outlet_id = '${req.body.Outletid}' and act.enter_by='${req.body.enterBy}' and act.activity_date between '${req.body.fromDate}' AND '${req.body.toDate}'`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  reports.SelectActivitydate =  (req, result) => {
    sql.query( `SELECT DISTINCT act.enter_date,ol.outlet_name
    FROM romsondb.cor_outlet_activity_m as act
    LEFT JOIN romsondb.cor_outlet_m as ol
    ON act.outlet_id = ol.outlet_id
    where act.outlet_id = '${req.body.Outletids}' and act.enter_by='${req.body.enterBy}'`,
    console.log(`SELECT DISTINCT act.enter_date,ol.outlet_name
    FROM romsondb.cor_outlet_activity_m as act
    LEFT JOIN romsondb.cor_outlet_m as ol
    ON act.outlet_id = ol.outlet_id
    where act.outlet_id = '${req.body.Outletids}' and act.enter_by='${req.body.enterBy}'`), (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  reports.AttendanceHistory =  (req, result) => {
    sql.query( `SELECT punch_date, punch_in, punch_out, leave_status, leave_type, holiday_status, holiday ,concat(CASE WHEN TIMESTAMPDIFF(HOUR, punch_in, punch_out)=0 THEN '00' ELSE TIMESTAMPDIFF(HOUR, punch_in, punch_out) END,':',TIMESTAMPDIFF(MINUTE, punch_in, punch_out)) TOT_HRS FROM romsondb.cor_attendance_m WHERE punch_date between '${req.body.fromDate}' AND '${req.body.toDate}' and enter_by='${req.body.enterBy}'`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };


  /////EOD

  // reports.EodDate =  (req, result) => {
  //   sql.query( `SELECT distinct m.order_date,m.outlet_id,m.total_quantity,m.scheme_discount,outlet.outlet_name,m.order_time FROM romsondb.cor_order_m m , romsondb.cor_outlet_m outlet where DATE(m.order_date) = CURDATE() and m.enter_by = '${req.body.enterBy}' and m.outlet_id=outlet.outlet_id`, (err, res) => {
  //     console.log("osbss: ", res);
  //     if (err) {
  //       result({ error: true, data: "Something Went Wrong" })
  //     }
  //     result({ error: false, data: res })
  //   });
  // };

  reports.EodDate =  (req, result) => {
    sql.query( `SELECT distinct m.outlet_id,outlet.outlet_name,m.total_quantity,m.order_id FROM 
    romsondb.cor_order_m m , romsondb.cor_outlet_m outlet where DATE(m.order_date) = CURDATE() 
    and m.enter_by = '${req.body.enterBy}' and m.outlet_id=outlet.outlet_id`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };


  /////////EodDate After Button Click

  reports.EodDatebutton =  (req, result) => {
    sql.query( `SELECT distinct m.outlet_id,outlet.outlet_name,m.total_quantity,m.order_id FROM 
    romsondb.cor_order_m m , romsondb.cor_outlet_m outlet where m.order_date = '${req.body.enterDate}' 
    and m.enter_by = '${req.body.enterBy}' and m.outlet_id=outlet.outlet_id`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };


  reports.EodOrder =  (req, result) => {
    sql.query( `select m.order_id as m_orderID,m.order_date,m.outlet_id,m.phone_no,m.employee_id,m.total_quantity,m.scheme_discount,
    m.discount_amount,m.enter_by ,d.item_id,d.item_qty,d.item_price_unit,d.item_value,d.item_gst,d.order_amt,
    d.order_gst_amt,itm.sku_name,itm.segment_id,outlet.outlet_name
     FROM romsondb.cor_order_m m,romsondb.cor_order_d d , romsondb.cor_sku_m itm ,romsondb.cor_outlet_m outlet
     WHERE m.order_id=d.order_id and m.outlet_id=outlet.outlet_id and  d.item_id=itm.sku_id and DATE(m.order_date) = CURDATE() and m.enter_by = '${req.body.enterBy}'`,
     console.log(`select m.order_id as m_orderID,m.order_date,m.outlet_id,m.phone_no,m.employee_id,m.total_quantity,m.scheme_discount,
     m.discount_amount,m.enter_by ,d.item_id,d.item_qty,d.item_price_unit,d.item_value,d.item_gst,d.order_amt,
     d.order_gst_amt,itm.sku_name,itm.segment_id,outlet.outlet_name
      FROM romsondb.cor_order_m m,romsondb.cor_order_d d , romsondb.cor_sku_m itm ,romsondb.cor_outlet_m outlet
      WHERE m.order_id=d.order_id and m.outlet_id=outlet.outlet_id and  d.item_id=itm.sku_id and DATE(m.order_date) = CURDATE() and m.enter_by = '${req.body.enterBy}'`), (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  /////buttonCLick

  reports.EodOrderbutton =  (req, result) => {
    sql.query( `select m.order_id as m_orderID,m.order_date,m.outlet_id,m.phone_no,m.employee_id,m.total_quantity,m.scheme_discount,
    m.discount_amount,m.enter_by ,d.item_id,d.item_qty,d.item_price_unit,d.item_value,d.item_gst,d.order_amt,
    d.order_gst_amt,itm.sku_name,itm.segment_id,outlet.outlet_name
     FROM romsondb.cor_order_m m,romsondb.cor_order_d d , romsondb.cor_sku_m itm ,romsondb.cor_outlet_m outlet
     WHERE m.order_id=d.order_id and m.outlet_id=outlet.outlet_id and  d.item_id=itm.sku_id and m.order_date = '${req.body.enterDate}'  and m.enter_by = '${req.body.enterBy}'`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  //////////

  reports.EodDateReturn =  (req, result) => {
    sql.query( `SELECT distinct m.order_return__date,m.outlet_id,outlet.outlet_name,m.order_return_time,m.total_quantity,m.scheme_discount
    FROM romsondb.cor_order_return_m m , romsondb.cor_outlet_m outlet where DATE(m.order_return__date) = CURDATE() 
    and m.enter_by = '${req.body.enterBy}' and m.outlet_id=outlet.outlet_id`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  /////button click

  reports.EodDateReturnbutton =  (req, result) => {
    sql.query( `SELECT distinct m.order_return__date,m.outlet_id,outlet.outlet_name,m.order_return_time,m.total_quantity,m.scheme_discount
    FROM romsondb.cor_order_return_m m , romsondb.cor_outlet_m outlet where m.order_return__date = '${req.body.enterDate}'
    and m.enter_by = '${req.body.enterBy}' and m.outlet_id=outlet.outlet_id`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  reports.EodReturn =  (req, result) => {
    sql.query( `select m.order_return_id as m_return_orderID,m.order_return__date,m.outlet_id,m.phone_no,m.employee_id,m.total_quantity,m.scheme_discount,
    m.discount_amount,m.enter_by ,d.item_id,d.item_qty,d.item_price_unit,d.item_value,d.item_gst,d.return_order_amt,d.order_return_reason,
    d.return_order_gst_amt,itm.sku_name,itm.segment_id,outlet.outlet_name
     FROM romsondb.cor_order_return_m m,romsondb.cor_order_return_d d , romsondb.cor_sku_m itm ,romsondb.cor_outlet_m outlet
     WHERE m.order_return_id=d.order_return_id and m.outlet_id=outlet.outlet_id and  d.item_id=itm.sku_id and DATE(m.order_return__date) = CURDATE() and m.enter_by = '${req.body.enterBy}'`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  ///////////////button click

  reports.EodReturnbutton =  (req, result) => {
    sql.query( `select m.order_return_id as m_return_orderID,m.order_return__date,m.outlet_id,m.phone_no,m.employee_id,m.total_quantity,m.scheme_discount,
    m.discount_amount,m.enter_by ,d.item_id,d.item_qty,d.item_price_unit,d.item_value,d.item_gst,d.return_order_amt,d.order_return_reason,
    d.return_order_gst_amt,itm.sku_name,itm.segment_id,outlet.outlet_name
     FROM romsondb.cor_order_return_m m,romsondb.cor_order_return_d d , romsondb.cor_sku_m itm ,romsondb.cor_outlet_m outlet
     WHERE m.order_return_id=d.order_return_id and m.outlet_id=outlet.outlet_id and  d.item_id=itm.sku_id and m.order_return__date = '${req.body.enterDate}' and m.enter_by = '${req.body.enterBy}'`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  // reports.ActivityData =  (req, result) => {
  //   sql.query( `SELECT * FROM romsondb.cor_outlet_activity_m where DATE(activity_date) = CURDATE() and enter_by = '${req.body.enterBy}'`, (err, res) => {
  //     console.log("osbss: ", res);
  //     if (err) {
  //       result({ error: true, data: "Something Went Wrong" })
  //     }
  //     result({ error: false, data: res })
  //   });
  // };

  ////////////////////////
  reports.ActivityData =  (req, result) => {
    sql.query(`SELECT act.id,itm.sku_name,act.outlet_id,act.item_id,act.enter_by,act.user_type,act.remark,    act.follow_up,act.enter_date,act.hospital_customer_name,act.hospital_name,act.activity_date,act.zone_id,act.division_m,itm.sku_name
    FROM romsondb.cor_outlet_activity_m act
    LEFT JOIN romsondb.cor_sku_m itm ON act.item_id = itm.sku_id
    where  DATE(act.activity_date) = CURDATE() and act.enter_by = '${req.body.enterBy}'`,console.log(`SELECT act.id,itm.sku_name,act.outlet_id,act.item_id,act.enter_by,act.user_type,act.remark,    act.follow_up,act.enter_date,act.hospital_customer_name,act.hospital_name,act.activity_date,act.zone_id,act.division_m,itm.sku_name
    FROM romsondb.cor_outlet_activity_m act
    LEFT JOIN romsondb.cor_sku_m itm ON act.item_id = itm.sku_id
    where  DATE(act.activity_date) = CURDATE() and act.enter_by = '${req.body.enterBy}'`), (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };
  /////////////button click

  reports.ActivityDatabutton =  (req, result) => {
    sql.query( `SELECT act.id,act.outlet_id,act.item_id,act.enter_by,act.user_type,act.remark,
act.follow_up,act.enter_date,act.hospital_customer_name,act.hospital_name,act.activity_date,act.zone_id,act.division_m,itm.sku_name
     FROM romsondb.cor_outlet_activity_m act , romsondb.cor_sku_m itm  where act.item_id=itm.sku_id and act.activity_date = '${req.body.enterDate}' and act.enter_by = '${req.body.enterBy}'`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  // reports.EODActivityDate =  (req, result) => {
  //   sql.query( `SELECT distinct m.outlet_id,m.item_id,m.enter_by,m.user_type,m.remark,m.follow_up,m.activity_date,m.enter_date,m.hospital_customer_name,m.hospital_name,outlet.outlet_name
  //   FROM romsondb.cor_outlet_activity_m m
  //   LEFT JOIN romsondb.cor_outlet_m outlet
  //   ON m.outlet_id = outlet.outlet_id where DATE(m.activity_date) = CURDATE() and m.enter_by = '${req.body.enterBy}'`, (err, res) => {
  //     console.log("osbss: ", res);
  //     if (err) {
  //       result({ error: true, data: "Something Went Wrong" })
  //     }
  //     result({ error: false, data: res })
  //   });
  // };

  reports.EODActivityDate =  (req, result) => {
    sql.query( `SELECT distinct m.outlet_id,outlet.outlet_name
    FROM romsondb.cor_outlet_activity_m m
    LEFT JOIN romsondb.cor_outlet_m outlet
    ON m.outlet_id = outlet.outlet_id where DATE(m.activity_date) = CURDATE() and m.enter_by = '${req.body.enterBy}'`,console.log(`SELECT distinct m.outlet_id,outlet.outlet_name
    FROM romsondb.cor_outlet_activity_m m
    LEFT JOIN romsondb.cor_outlet_m outlet
    ON m.outlet_id = outlet.outlet_id where DATE(m.activity_date) = CURDATE() and m.enter_by = '${req.body.enterBy}'`,), (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };


  /////////button click

  reports.EODActivityDatebutton =  (req, result) => {
    sql.query( `SELECT distinct m.outlet_id,outlet.outlet_name
    FROM romsondb.cor_outlet_activity_m m
    LEFT JOIN romsondb.cor_outlet_m outlet
    ON m.outlet_id = outlet.outlet_id where m.activity_date = '${req.body.enterDate}' and m.enter_by = '${req.body.enterBy}'`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  reports.EODAttendance =  (req, result) => {
    sql.query( `SELECT punch_in , punch_out FROM romsondb.cor_attendance_m where DATE(enter_date) = CURDATE() and emp_id='${req.body.enterBy}'`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  ////button click

  reports.EODAttendancebutton =  (req, result) => {
    sql.query( `SELECT punch_in , punch_out FROM romsondb.cor_attendance_m where punch_date = '${req.body.enterDate}' and emp_id='${req.body.enterBy}'`,console.log(`SELECT punch_in , punch_out FROM romsondb.cor_attendance_m where punch_date = '${req.body.enterDate}' and emp_id='${req.body.enterBy}'`),(err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  reports.EodNotPunchIn =  (req, result) => {
    sql.query( `SELECT punch_date,punch_in,eod,emp_id,attendance_id FROM romsondb.cor_attendance_m where eod = "N" and holiday_status = -1 and leave_status = -1 and status = 1 and emp_id='${req.body.enterBy}' and punch_date  BETWEEN ADDDATE(CURDATE(), -30) AND CURDATE()-1`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  
  reports.EodShareUpdate =  (req, result) => {
    sql.query( `UPDATE romsondb.cor_attendance_m
    SET eod = "Y"
    WHERE punch_date= '${req.body.punchdate}' and emp_id = '${req.body.enterBy}'`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };

  // reports.skuorderwise =  (req, result) => {

  //   sql.query(`select d.order_id,d.item_id ,sku.sku_name , d.item_qty , d.order_amt  from 
  //   romsondb.cor_order_d d , romsondb.cor_sku_m sku  where d.item_id in ${(req.body.skuids)}' and sku.sku_id = d.item_id and d.enter_by='${req.body.enterBy}'`,
  //   console.log(`select d.order_id,d.item_id ,sku.sku_name , d.item_qty , d.order_amt  from 
  //   romsondb.cor_order_d d , romsondb.cor_sku_m sku  where d.item_id in (${req.body.skuids})and sku.sku_id = d.item_id and d.enter_by='${req.body.enterBy}'`), (err, res) => {
  //     console.log("osbss: ", res);
  //     if (err) {
  //       result({ error: true, data: "Something Went Wrong" })
  //     }
  //     result({ error: false, data: res })
  //   });

    
  // };

    
  reports.skuorderwise =  (req, result) => {
    sql.query( `select d.order_id,d.item_id ,sku.sku_name , d.item_qty , d.order_amt  from romsondb.cor_order_d d , romsondb.cor_sku_m sku  where d.item_id in (${req.body.skuids}) and sku.sku_id = d.item_id and d.enter_by='${req.body.enterBy}'`,console.log(`select d.order_id,d.item_id ,sku.sku_name , d.item_qty , d.order_amt  from romsondb.cor_order_d d , romsondb.cor_sku_m sku  where d.item_id in ${(req.body.skuids)} and sku.sku_id = d.item_id and d.enter_by='${req.body.enterBy}'`), (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };
  
  reports.Totalskuorderwise =  (req, result) => {
    sql.query(` select d.item_id ,sku.sku_name , sum(d.item_qty) TotalQTY , sum(d.order_amt) as TotalAMT  from 
    romsondb.cor_order_d d , romsondb.cor_sku_m sku  where d.item_id in (${req.body.skuids}) and sku.sku_id = d.item_id 
    and DATE(d.enter_date) BETWEEN '${req.body.fromdate}' AND '${req.body.todate}' and
    d.enter_by='${req.body.enterBy}' group by  d.item_id ,sku.sku_name;`, (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
  };
  
module.exports = reports;