const masterModel = require("../../../models/master/get-data/master.model.js");
const helper = require("../../../helper/helper.js");


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All Zone>
*/
exports.zone = (req, res) => {
    masterModel.zone((data) => {
        res.json(data);
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All state>
*/
exports.state = (req, res) => {
    masterModel.state((data) => {
        res.json(data);
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All City>
*/
exports.city = (req, res) => {

   // if (typeof req.params.state_id === 'number') {
        masterModel.city(req, (data) => {
            res.json(data);
        });
    // } else {
    //     res.send({
    //         error: true,
    //         msg: 'Invalid Params'
    //     })
    // }
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All district>
*/
exports.district = (req, res) => {
    masterModel.district(req, (data) => {
        res.json(data);
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All area>
*/
exports.area = (req, res) => {
    masterModel.area((data) => {
        res.json(data);
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All division>
*/
exports.division = (req, res) => {
    masterModel.division((data) => {
        res.json(data);
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All segment>
*/
exports.segment = (req, res) => {
    masterModel.segment((data) => {
        res.json(data);
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All outlet_category>
*/
exports.outlet_category = (req, res) => {
    masterModel.outlet_category((data) => {
        res.json(data);
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All customer_type>
*/
exports.customer_type = (req, res) => {
    masterModel.customer_type(req, (data) => {
        res.json(data);
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All Sales Man Users>
*/
exports.SalesManUsers = (req, res) => {
    masterModel.SalesManUsers(req,(data) => {
        res.json(data);
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All Repoting User>
*/
exports.ReportingUsers = (req, res) => {
    masterModel.ReportingUsers(req,(data) => {
        res.json(data);
    });
};



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All Designation>
*/
exports.Designation = (req, res) => {
    masterModel.designation((data) => {
        res.json(data);
    });
  };

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <04-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All Department>
*/
exports.Department = (req, res) => {
    masterModel.Department((data) => {
        res.json(data);
    });
  };



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <17-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All Role>
*/
exports.Role = (req, res) => {
    masterModel.role((data) => {
        res.json(data);
    });
  };

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <20-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All Menu>
*/
exports.Menu = (req, res) => {
    masterModel.Menu((data) => {
        res.json(data);
    });
  };


  



  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All Warehouse>
*/
exports.Warehouse = (req, res) => {
    masterModel.Warehouse(req,(data) => {
        res.json(data);
    });
};


  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All Beat>
*/
exports.Beat = (req, res) => {
    masterModel.Beat(req,(data) => {
        res.json(data);
    });
};


  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <22-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All beatByAddress>
*/
exports.beatByAddress = (req, res) => {
    masterModel.beatByAddress(req,(data) => {
        res.json(data);
    });
};


  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <18-01-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All Dealer>
*/
exports.Dealer = (req, res) => {
    masterModel.Dealer(req,(data) => {
        res.json(data);
    });
};

  /*
*@Author:           <Ramesh Kumar>
*@Created On:       <22-02-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All dealerByAddress>
*/
exports.dealerByAddress = (req, res) => {
    masterModel.dealerByAddress(req,(data) => {
        res.json(data);
    });
};


 /*
*@Author:           <Ramesh Kumar>
*@Created On:       <13-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All outlets>
*/
exports.outlets = (req, res) => {
    masterModel.outlets(req,(data) => {
        res.json(data);
    });
};



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All getUsersByReportingId>
*/
exports.getUsersByReportingId = (req, res) => {
    masterModel.getUsersByReportingId(req,(data) => {
        res.json(data);
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <24-05-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Master Count>
*/
exports.getMasterCount = (req, res) => {
    masterModel.getMasterCount(req,(data) => {
        res.json(data);
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <24505-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <get Order Count>
*/
exports.getOrderCount = (req, res) => {
    masterModel.getOrderCount(req,(data) => {
        res.json(data);
    });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All getUsers for expense>
*/
exports.getUsersExpenseAdded = (req, res) => {
    masterModel.getUsersExpenseAdded(req,(data) => {
        res.json(data);
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <07-09-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Get All MTP assigned user>
*/
exports.getAllMtpUsers = (req, res) => {
    masterModel.getAllMtpUsers(req,(data) => {
        res.json(data);
    });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <17-09-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Attendance Status Count>
*/
exports.getAttendanceStatusCount = (req, res) => {
    masterModel.getAttendanceStatusCount(req,(data) => {
        res.json(data);
    });
};











