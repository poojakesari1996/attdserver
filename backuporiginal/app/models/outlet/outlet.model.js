const sql = require("../db.js");

// constructor
const outlet = function (osbs) {
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


////Retail

outlet.DatewiseOutlet = (req, result) => {
  sql.query(`select outlet_date from romsondb.cor_mtp_a where user_id ='${req.body.empid}' and outlet_date>=curdate() order by outlet_date asc;`,
    (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
};

// outlet.DatewiseOutlet_data = (req, result) => {
//   sql.query(`SELECT m.outlet_date,m.user_id,o.outlet_id,o.outlet_name,o.phone_number,c.customer_type_name,co.outlet_category_name,emp.division,emp.zone_id,o.dealer_id,o.beat_id FROM romsondb.cor_mtp_a AS m
//   LEFT JOIN romsondb.cor_outlet_m AS o ON  m.beat_id = o.beat_id
//   LEFT JOIN romsondb.cor_customer_type_m AS c ON o.customer_type_id = c.customer_type_id
//   LEFT JOIN romsondb.cor_outlet_category_m AS co ON o.outlet_category_id = co.outlet_category_id
//   LEFT JOIN romsondb.cor_emp_m AS emp ON emp.emp_id = m.user_id
//     where m.user_id = '${req.body.empid}' and m.outlet_date= '${req.body.outletdate}' ORDER BY o.outlet_name`,
//     (err, res) => {
//       console.log("osbss: ", res);
//       if (err) {
//         result({ error: true, data: "Something Went Wrong" })
//       }
//       result({ error: false, data: res })
//     });
// };

outlet.DatewiseOutlet_data = (req, result) => {
  let outletDate = req.body.outletdate;
  if (!outletDate) {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
    outletDate = formattedDate; // Use current date if outletdate is not provided
  }
  sql.query(`SELECT m.outlet_date,m.user_id,o.outlet_id,o.outlet_name,o.phone_number,c.customer_type_name,co.outlet_category_name,emp.division,emp.zone_id,o.dealer_id,o.beat_id FROM romsondb.cor_mtp_a AS m
  LEFT JOIN romsondb.cor_outlet_m AS o ON  m.beat_id = o.beat_id
  LEFT JOIN romsondb.cor_customer_type_m AS c ON o.customer_type_id = c.customer_type_id
  LEFT JOIN romsondb.cor_outlet_category_m AS co ON o.outlet_category_id = co.outlet_category_id
  LEFT JOIN romsondb.cor_emp_m AS emp ON emp.emp_id = m.user_id
    where m.user_id = '${req.body.empid}' and m.outlet_date= '${outletDate}' and o.status="A" ORDER BY o.outlet_name`,
    (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
};

// outlet.countOutlet = (req, result) => {
//   sql.query(`SELECT COUNT(*) as Totaloutlet,bm.beat_name FROM romsondb.cor_mtp_a AS m
//     LEFT JOIN romsondb.cor_outlet_m AS o ON  m.beat_id = o.beat_id
//     LEFT JOIN romsondb.cor_customer_type_m AS c ON o.customer_type_id = c.customer_type_id
//     LEFT JOIN romsondb.cor_outlet_category_m AS co ON o.outlet_category_id = co.outlet_category_id
//     LEFT Join romsondb.cor_beat_m as bm on o.beat_id = bm.beat_id
//     where m.user_id = '${req.body.empid}' and m.outlet_date= '${req.body.outletdate}'`,
//     (err, res) => {
//       console.log("osbss: ", res);
//       if (err) {
//         result({ error: true, data: "Something Went Wrong" })
//       }
//       result(res)
//     });
// };


/////i>outletView


outlet.countOutlet = (req, result) => {
  let outletDate = req.body.outletdate;
  if (!outletDate) {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
    outletDate = formattedDate; // Use current date if outletdate is not provided
  }

  sql.query(`SELECT COUNT(*) as Totaloutlet, bm.beat_name FROM romsondb.cor_mtp_a AS m
    LEFT JOIN romsondb.cor_outlet_m AS o ON  m.beat_id = o.beat_id
    LEFT JOIN romsondb.cor_customer_type_m AS c ON o.customer_type_id = c.customer_type_id
    LEFT JOIN romsondb.cor_outlet_category_m AS co ON o.outlet_category_id = co.outlet_category_id
    LEFT JOIN romsondb.cor_beat_m as bm on o.beat_id = bm.beat_id
    WHERE m.user_id = '${req.body.empid}' and m.outlet_date = '${outletDate}' and o.status="A"`,
    (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" });
      }
      result(res);
    });
};


outlet.SelectedOutlet = (req, result) => {
  sql.query(`SELECT 
  o.id,
  o.outlet_id,
  o.beat_id,
  o.outlet_name,
  o.address,
  o.phone_number,
  o.owner_name,
  o.email,
  o.pin,
  o.type,
  o.total_bed,
  o.icu_bed,
  o.ot_bed,
  b.zone_id,
  b.division_id
  FROM romsondb.cor_outlet_m o
  LEFT JOIN romsondb.cor_beat_m b
  ON o.beat_id = b.beat_id where outlet_id = '${req.body.outletID}'`,
    (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ data: res })
    });
};

////ii>updateinfo

outlet.udateinfo = (req, result) => {
  sql.query(`UPDATE romsondb.cor_outlet_m SET email = '${req.body.email}', 
    phone_number = '${req.body.phoneNO}',address = '${req.body.address}'
     WHERE outlet_id='${req.body.outletID}'`,
    (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
};

outlet.udatehospitalinfo = (req, result) => {
  sql.query(`UPDATE romsondb.cor_outlet_m SET email = '${req.body.email}', 
    phone_number = '${req.body.phoneNO}',address = '${req.body.address}',
    icu_bed = '${req.body.icubed}',ot_bed = '${req.body.otbed}',total_bed = '${req.body.totalbed}'
     WHERE outlet_id='${req.body.outletID}'`,
    (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
};

//   iii>Activityretail

outlet.retail_activity = async(req, result) => {
  
  sql.query(`INSERT INTO romsondb.cor_outlet_activity_m (id,outlet_id, remark, enter_by,enter_date,activity_date,zone_id,division_m,act_lat,act_long)
    VALUES ((select romsondb.all_auto_no(66)),'${req.body.outletid}','${req.body.remark}','${req.body.empid}',sysdate(),curdate(),'${req.body.zoneid}','${req.body.divid}','${req.body.lat}','${req.body.lag}')`,
    console.log(`INSERT INTO romsondb.cor_outlet_activity_m (id,outlet_id, remark, enter_by,enter_date,activity_date,zone_id,division_m,act_lat,act_long)
    VALUES ((select romsondb.all_auto_no(66)),'${req.body.outletid}','${req.body.remark}','${req.body.empid}',sysdate(),curdate(),'${req.body.zoneid}','${req.body.divid}','${req.body.lat}','${req.body.lag}')`),
    (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
};


////validationActivity

outlet.validationActivity = async(req, result) => {
  
  sql.query(`select outlet_id,activity_date from romsondb.cor_outlet_activity_m where DATE(enter_date) = CURDATE()`,
    (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
};


/////ho_customer

outlet.hospitalContact = (req, result) => {
  sql.query(`SELECT * FROM romsondb.cor_hospital_customer_m where outlet_id = '${req.body.outletID}'`,
    (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
};

outlet.customeradd = (req, result) => {
 
  sql.query(`INSERT INTO 
    romsondb.cor_hospital_customer_m (
    outlet_id,
    hospital_name,
    customer_name,
    customer_type,
    customer_department,
    customer_designation,
    customer_contact_no,
    email,
    enter_by,
    enter_date)
    VALUES (
    '${req.body.outletID}',
    '${req.body.hospitalname}',
    '${req.body.customername}',
    '${req.body.customertype}',
    '${req.body.customerdpt}',
    '${req.body.customerdesignation}',
    '${req.body.customerPno}',
    '${req.body.email}',
    '${req.body.enterby}',
    sysdate()
     )`,
     console.log(`INSERT INTO 
     romsondb.cor_hospital_customer_m (
     outlet_id,
     hospital_name,
     customer_name,
     customer_type,
     customer_department,
     customer_designation,
     customer_contact_no,
     email,
     enter_by,
     enter_date)
     VALUES (
     '${req.body.outletID}',
     '${req.body.hospitalname}',
     '${req.body.customername}',
     '${req.body.customertype}',
     '${req.body.customerdpt}',
     '${req.body.customerdesignation}',
     '${req.body.customerPno}',
     '${req.body.email}',
     '${req.body.enterby}',
     sysdate()
      )`),
    (err, res) => {
      console.log("osbss: ", res);
      if (!err) {
        result({ msg: "Sucessfully Submit Date", data: res })
      }
      result({ msg: "Something Went Wrong" })
    });
};


outlet.updateCustomer = (req, result) => {
  sql.query(`UPDATE romsondb.cor_hospital_customer_m
  SET email = '${req.body.email}', 
  customer_contact_no = '${req.body.customer_contact_no}'
  WHERE hospital_customer_id = '${req.body.hospital_customer_id}'`,
  
    (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
};

outlet.CustomerDetailShow = (req, result) => {
  sql.query(`SELECT hospital_customer_id,email,customer_contact_no,customer_department FROM 
  romsondb.cor_hospital_customer_m where hospital_customer_id='${req.body.hospital_customer_id}'`,
    (err, res) => {
      console.log("osbss: ", res);
      if (err) {
        result({ error: true, data: "Something Went Wrong" })
      }
      result({ error: false, data: res })
    });
};




function ActivityAutoNo() {
  return new Promise((resolve, reject) => {
      sql.query(
      `(select romsondb.all_auto_no(66))`,
      console.log(`(select romsondb.all_auto_no(66))`),
      (err, result) => {
        console.log(result);
        resolve(result);
      }
    );
  });
}

module.exports = outlet;