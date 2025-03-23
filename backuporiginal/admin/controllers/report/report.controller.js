const reportModel = require("../../models/report/report.model.js");
const helper = require("../../helper/helper.js");
//const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <31-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list performanceSummary>
*/
exports.performanceSummary = (req, res) => {


  //const page = req.query.page || 1;
  //const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  reportModel.performanceSummary(req, (data) => {

    //console.log('performanceSummary -------', data);
    // data.payload = helper.pagination(countRows, page, perPage)

    res.send(data);
  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <31-03-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list PerformanceSummary>
*/
exports.listPerformanceSummary = (req, res) => {

  console.log('=======================================================================')
  var user = JSON.parse(req.headers.authorization)
  console.log(user);

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  reportModel.listPerformanceSummary(req, (countRows, data) => {

    //console.log('performanceSummary -------', data);
    data.payload = helper.pagination(countRows, page, perPage)

    res.send(data);
  });
};


//=============================================


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-04-2023>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Day summery>
*/
exports.listDaysummery = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  reportModel.listDaysummery(req, (countRows, data) => {

    //console.log('performanceSummary -------', data);
    data.payload = helper.pagination(countRows, page, perPage)

    res.send(data);
  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <activity List Day summery>
*/

exports.activityListDaysummery = (req, res) => {

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : req.query.items_per_page || 10;
  reportModel.activityListDaysummery(req, (countRows, data) => {

    //console.log('performanceSummary -------', data);
    data.payload = helper.pagination(countRows, page, perPage)

    res.send(data);
  });
};



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Attendance Report>
*/

exports.listAttendanceReport = (req, res) => {

  // var moment = require('moment');

  // console.log(startOfMonth+ " "+endOfMonth);

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 500;
  reportModel.listAttendanceReport(req, (countRows, data) => {

    data.payload = helper.pagination(countRows, page, perPage)

    res.send(data);
  });
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Order Location
*/


exports.listOrderLocation = (req, res) => {

  // var moment = require('moment');

  // console.log(startOfMonth+ " "+endOfMonth);

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 500;
  reportModel.listOrderLocation(req, (countRows, data) => {

    data.payload = helper.pagination(countRows, page, perPage)

    res.send(data);
  });
};



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Sku Order Details>
*/

exports.listSkuOrderDetails = (req, res) => {

  // var moment = require('moment');

  // console.log(startOfMonth+ " "+endOfMonth);

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 500;
  reportModel.listSkuOrderDetails(req, (countRows, data) => {

    data.payload = helper.pagination(countRows, page, perPage)

    res.send(data);
  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <list Expense Details>
*/

exports.listExpenseDetails = (req, res) => {

  // var moment = require('moment');

  // console.log(startOfMonth+ " "+endOfMonth);

  const page = req.query.page || 1;
  const perPage = req.query.filter_items_per_page ? req.query.filter_items_per_page : 500;
  reportModel.listExpenseDetails(req, (countRows, data) => {

    data.payload = helper.pagination(countRows, page, perPage)

    res.send(data);
  });
};

/*
*@Author:           <Ramesh Kumar>
*@Created On:       <>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <expense Report ByUserId>
*/

exports.expenseReportByUserId = (req, res) => {
  const ExcelJS = require('exceljs');
  const fs = require('fs');
  var moment = require('moment');

  reportModel.expenseReportByUserId(req, (empInfo, data) => {

    if (data.error == false) {
      console.log('empInfo', empInfo);
      var data = data.data;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');
      const month = req.query.filter_month ? req.query.filter_month : moment().format("MMMM");
      const year = req.query.filter_year ? req.query.filter_year : moment().format("YYYY");



      // Add important information in the first three rows
      worksheet.getCell('A1').value = `Expense Details for the month of ${month} - ${year}`;
      worksheet.getCell('D1').value = 'NOTE: This report for each individual employee wise for entire/selected month/year.';

      worksheet.getCell('A3').value = 'Name:';
      worksheet.getCell('B3').value = empInfo && empInfo.user_name;
      worksheet.getCell('C3').value = 'Supervisor Name:';
      worksheet.getCell('D3').value = empInfo && empInfo.reporting_name;
      worksheet.getCell('E3').value = 'State:';
      worksheet.getCell('F3').value = empInfo && empInfo.state_name;
      worksheet.getCell('G3').value = ' HQ:';
      worksheet.getCell('H3').value = empInfo && empInfo.Head_Quater_name;

      worksheet.getCell('A4').value = 'Emp. Code:';
      worksheet.getCell('B4').value = empInfo && empInfo.emp_code;
      worksheet.getCell('C4').value = 'Designation:';
      worksheet.getCell('D4').value = empInfo && empInfo.designation_name;
      worksheet.getCell('E4').value = 'Division:';
      worksheet.getCell('F4').value = empInfo && empInfo.division_name;

      worksheet.getCell('A5').value = '';

      // Style the important information cells
      const infoCellStyle1 = {
        font: { bold: true },
        alignment: { vertical: 'middle', horizontal: 'left' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EBEB50' } } // Replace with your desired background color code
      };
      const infoCellStyle2 = {
        font: { bold: false },
        alignment: { vertical: 'middle', horizontal: 'left' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EBEB50' } } // Replace with your desired background color code
      };

      worksheet.getCell('A3').style = infoCellStyle1;
      worksheet.getCell('B3').style = infoCellStyle2;
      worksheet.getCell('C3').style = infoCellStyle1;
      worksheet.getCell('D3').style = infoCellStyle2;
      worksheet.getCell('E3').style = infoCellStyle1;
      worksheet.getCell('F3').style = infoCellStyle2;
      worksheet.getCell('G3').style = infoCellStyle1;
      worksheet.getCell('H3').style = infoCellStyle2;

      worksheet.getCell('A4').style = infoCellStyle1;
      worksheet.getCell('B4').style = infoCellStyle2;
      worksheet.getCell('C4').style = infoCellStyle1;
      worksheet.getCell('D4').style = infoCellStyle2;
      worksheet.getCell('E4').style = infoCellStyle1;
      worksheet.getCell('F4').style = infoCellStyle2;
      worksheet.getCell('G4').style = infoCellStyle1;
      worksheet.getCell('H4').style = infoCellStyle2;

      //const headers = Object.keys(data[0]);
      const headers = ['Date', 'From Place', 'To Place', 'St. Mode', 'T.Mode', 'Distance',
        'TA', 'DA', 'Hotel Exp.', 'Stationery', 'Printing', 'Medical Exp.', 'Postage', 'T. Fooding/Business Meal',
        'T. Meeting', 'Internet', 'Mobile', 'Misc', 'Total', 'Remarks', 'File Attached'
      ];
      // Add column headers
      const headerRow = worksheet.addRow([]);
      //  headerRow.getCell(1).value = ''; // Leave the first cell empty for the important information
      headers.forEach((header, index) => {
        headerRow.getCell(index + 1).value = header; // Start from the second cell for the headers
      });
      headerRow.eachCell((cell) => {
        cell.font = { bold: true },
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '92D050' } // Replace with your desired background color code
          };
      });

      // Add data rows
      // data.forEach((row, index) => {
      //   const rowIndex = index + 2; // Start from the second row
      //   const values = Object.values(row);
      //   worksheet.getRow(rowIndex).values = values;
      // });

      // Add data rows
      var exp_ta = 0;
      var exp_da = 0;
      var exp_hotel_exp = 0;
      var exp_stationery = 0;
      var exp_printing = 0;
      var exp_medical = 0;
      var exp_postage = 0;
      var exp_fooding = 0;
      var exp_t_meeting = 0;
      var exp_internet = 0;
      var exp_mobile = 0;
      var exp_misc = 0;
      var exp_total = 0;


      data.forEach((row) => {

        exp_ta += parseFloat(row.exp_ta ? row.exp_ta : 0);
        exp_da += parseFloat(row.exp_da ? row.exp_da : 0);
        exp_hotel_exp += parseFloat(row.exp_hotel_exp ? row.exp_hotel_exp : 0);
        exp_stationery += parseFloat(row.exp_stationery ? row.exp_stationery : 0);
        exp_printing += parseFloat(row.exp_printing ? row.exp_printing : 0);
        exp_medical += parseFloat(row.exp_medical ? row.exp_medical : 0);
        exp_postage += parseFloat(row.exp_postage ? row.exp_postage : 0);
        exp_fooding += parseFloat(row.exp_fooding ? row.exp_fooding : 0);
        exp_t_meeting += parseFloat(row.exp_t_meeting ? row.exp_t_meeting : 0);
        exp_internet += parseFloat(row.exp_internet ? row.exp_internet : 0);
        exp_mobile += parseFloat(row.exp_mobile ? row.exp_mobile : 0);
        exp_misc += parseFloat(row.exp_misc ? row.exp_misc : 0);
        exp_total += parseFloat(row.exp_total ? row.exp_total : 0);

        worksheet.addRow(Object.values(row));
      });

      const footer = ['GRAND TOTAL', '', '', '', '', '', exp_ta, exp_da, exp_hotel_exp, exp_stationery, exp_printing,
        exp_medical, exp_postage, exp_fooding, exp_t_meeting, exp_internet, exp_mobile, exp_misc, exp_total, '', ''
      ];
      //console.log('footer========',footer);
      // Add column headers
      const footerRow = worksheet.addRow([]);
      //  headerRow.getCell(1).value = ''; // Leave the first cell empty for the important information
      footer.forEach((footer, index) => {
        footerRow.getCell(index + 1).value = footer; // Start from the second cell for the headers
      });
      footerRow.eachCell((cell) => {
        cell.font = { bold: true },
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } }, // Replace with your desired border color code
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          }
      });



      const footerEnd = ['', 'Submit By:', '', '', 'Approved By:', '', '', 'Admin/HR Dept:', '', '',
        '', '', '', '', '', '', '', '',
        '', ''
      ];

      const footerEndRow = worksheet.addRow([]);
      footerEnd.forEach((footerEnd, index) => {
        footerEndRow.getCell(index + 1).value = footerEnd; // Start from the second cell for the headers
      });
      footerEndRow.eachCell((cell) => {
        cell.font = { bold: true }
      });

      const filename = 'query_results.xlsx';

      workbook.xlsx.writeFile(filename)
        .then(() => {
          console.log(`Query results saved to ${filename}`);
          //connection.end(); // Close the MySQL connection
          res.download(filename, (err) => {
            if (err) {
              console.error('Error sending file:', err);
              res.status(500).send('Internal Server Error');
            }

            // Remove the file after download
            fs.unlinkSync(filename);
          });
        })
        .catch((err) => {
          console.error('Error writing file:', err);
        });
    }

    //res.send(data);

  });

};

//const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

// Function to create a PDF
// async function createPDF(data) {
//   //const fs = require('fs');
//   // Create a new PDF document
//   const pdfDoc = await PDFDocument.create();

//   // Add a page to the document
//   const page = pdfDoc.addPage();

//   // Set the font and font size
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const fontSize = 12;

//   // Set the table properties
//   const table = {
//     startX: 50,
//     startY: page.getHeight() - 50,
//     rowHeight: 20,
//     columnGap: 50,
//     cellMargin: 5,
//     color: rgb(0, 0, 0),
//     borderColor: rgb(0, 0, 0)
//   };

//   // Draw table headers
//   let currentY = table.startY;
//   const headers = ['Property', 'Value'];

//   for (const header of headers) {
//     page.drawText(header, { x: table.startX, y: currentY, font, fontSize, color: table.color });
//     currentY -= table.rowHeight;
//   }

//   // Draw table rows
//   for (const [key, value] of Object.entries(data)) {
//     page.drawText(key, { x: table.startX, y: currentY, font, fontSize, color: table.color });
//     page.drawText(value, { x: table.startX + table.columnGap, y: currentY, font, fontSize, color: table.color });

//     page.drawLine({
//       start: { x: table.startX, y: currentY - table.cellMargin },
//       end: { x: table.startX + table.columnGap * 2, y: currentY - table.cellMargin },
//       thickness: 1,
//       color: table.borderColor
//     });

//     currentY -= table.rowHeight;
//   }

//   // Serialize the PDF document to a Uint8Array
//   const pdfBytes = await pdfDoc.save();

//   return pdfBytes;
// }

exports.expensePDFReportByUserId = async (req, res) => {

  const month = req.query.filter_month ? req.query.filter_month : moment().format("MMMM");
  const year = req.query.filter_year ? req.query.filter_year : moment().format("YYYY");
  const userId = req.query.filter_user_id ? req.query.filter_user_id : 123;

  const heading =  `Expense details for the month of ${month} - ${year}`;
  const note =  `NOTE: This report for each individual employee wise for entire/selected month/year.`;
  var tableData = ``;
  var tableHead = `<tr>
                      <th>Date</th>
                      <th>From Place</th>
                      <th>To Place</th>
                      <th>Type</th>
                      <th>Mode</th>
                      <th>Dist</th>
                      <th>TA</th>
                      <th>DA</th>
                      <th>Hotel</th>
                      <th>Stationery</th>
                      <th>Printing</th>
                      <th>Medical</th>
                      <th>Postage</th>
                      <th>Fooding</th>
                      <th>T_Meeting</th>
                      <th>Internet</th>
                      <th>Mobile</th>
                      <th>Misc</th>
                      <th>Total</th>
                      <th>Att.</th>
                      <th>Remarks</th>
                    </tr>
                      `;
    var empDetails = '';
  reportModel.expenseReportByUserId(req, (empInfo, data) => {
    console.log('data.data');
    console.log(empInfo);
    empDetails =`<table>
                        <tbody>
                          <tr style="font-size:12px!important;">
                            <td style="border: 0px!important; text-align:left; font-size:12px!important;">Name: ${empInfo.user_name} (${empInfo.emp_id})</td>
                            <td style="border: 0px!important; text-align:left; font-size:12px!important;">Supervisor Name: ${empInfo.reporting_name} (${empInfo.reporting_to})</td>
                            <td style="border: 0px!important; text-align:left; font-size:12px!important;">State: ${empInfo.state_name}</td>
                            <td style="border: 0px!important; text-align:left; font-size:12px!important;">HQ: ${empInfo.Head_Quater_name}</td>
                          </tr>
                          <tr style="font-size:12px!important;">
                            <td style="border: 0px!important; text-align:left; font-size:12px!important;">Emp Code: ${empInfo.emp_code}</td>
                            <td style="border: 0px!important; text-align:left; font-size:12px!important;">Designation: ${empInfo.designation_name}</td>
                            <td style="border: 0px!important; text-align:left; font-size:12px!important;">Division: ${empInfo.division_name}</td>
                          </tr>
                        </tbody>
                    </table>
    `; 
 
    var total = 0;
    var exp_distance=0;
    var exp_ta=0;
    var exp_da=0;
    var exp_hotel_exp=0;
    var exp_stationery=0;
    var exp_printing=0;
    var exp_medical=0;
    var exp_postage=0;
    var exp_fooding=0;
    var exp_t_meeting=0;
    var exp_internet =0;
    var exp_mobile=0;
    var exp_misc=0;
    if(data.error == false){
      var res = data.data;
      res.forEach((d, index) => {
        total += d.exp_total;
        exp_distance += Number(d.exp_distance);
        exp_ta += Number(d.exp_ta);
        exp_da += Number(d.exp_da);
        exp_hotel_exp += Number(d.exp_hotel_exp);
        exp_stationery += Number(d.exp_stationery);
        exp_printing += Number(d.exp_printing);
        exp_medical += Number(d.exp_medical);
        exp_postage += Number(d.exp_postage);
        exp_fooding += Number(d.exp_fooding);
        exp_t_meeting += Number(d.exp_t_meeting);
        exp_internet  += Number(d.exp_internet);
        exp_mobile += Number(d.exp_mobile);
        exp_misc += Number(d.exp_misc);
        tableData +=`<tr>
                      <td style="text-align:center;">${d.exp_date}</td>
                      <td >${d.exp_from_place}</td>
                      <td>${d.exp_to_place}</td>
                      <td style="text-align:center;">${d.exp_type}</td>
                      <td style="text-align:center;">${d.exp_traval_mode}</td>
                      <td style="text-align:center;">${d.exp_distance}</td>
                      <td style="text-align:center;">${d.exp_ta}</td>
                      <td style="text-align:center;">${d.exp_da}</td>
                      <td style="text-align:center;">${d.exp_hotel_exp}</td>
                      <td style="text-align:center;">${d.exp_stationery}</td>
                      <td style="text-align:center;">${d.exp_printing}</td>
                      <td style="text-align:center;">${d.exp_medical ? d.exp_medical : 0}</td>
                      <td style="text-align:center;">${d.exp_postage ? d.exp_postage : 0}</td>
                      <td style="text-align:center;">${d.exp_fooding?d.exp_fooding:0}</td>
                      <td style="text-align:center;">${d.exp_t_meeting?d.exp_t_meeting:0}</td>
                      <td style="text-align:center;">${d.exp_internet ? d.exp_internet:0}</td>
                      <td style="text-align:center;">${d.exp_mobile?d.exp_mobile:0}</td>
                      <td style="text-align:center;">${d.exp_misc ? d.exp_misc : 0}</td>
                      <td style="text-align:center;">${d.exp_total}</td>
                      <td style="text-align:center;">${d.attachment_flag}</td>
                      <td>${d.exp_remarks}</td>
                     
                  </tr>`;
      });
      
      tableData +=`<tr>
                      <td colspan="5" style="text-align:center">Total amount to claim:</td>
                      <td style="text-align:center">${exp_distance}</td>
                      <td style="text-align:center">${exp_ta}</td>
                      <td style="text-align:center">${exp_da}</td>
                      <td style="text-align:center">${exp_hotel_exp}</td>
                      <td style="text-align:center">${exp_stationery}</td>
                      <td style="text-align:center">${exp_printing}</td>
                      <td style="text-align:center">${exp_medical}</td>
                      <td style="text-align:center">${exp_postage }</td>
                      <td style="text-align:center">${exp_fooding}</td>
                      <td style="text-align:center">${exp_t_meeting}</td>
                      <td style="text-align:center">${exp_internet}</td>
                      <td style="text-align:center">${exp_mobile}</td>
                      <td style="text-align:center">${exp_misc}</td>
                      <td style="text-align:center;">${total}</td>
                  </tr>`;

    }else{
      myTable += `<tr><td>Data not found</td></tr>`;
    }
  });

  const puppeteer = require('puppeteer');

  // Launch a headless browser
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();


 
  
  // Set the HTML content for the PDF
  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            text-align: center;
            margin: 20px 20px 20px 20px;
          }
          table, td, th {
            border: 1px solid;
            font-size:9px;
            }
            td,th{
              padding-top: 4px;
              padding-bottom: 4px;
            }
    
            table {
            width: 100%;
            border-collapse: collapse;
            }
        </style>
      </head>
      <body>
        <div class="container">
        <p style="font-size:9px; text-align:right;">Date: ${new Date().toLocaleDateString()}</p>
        <p style="font-size:13px; font-weight:600">${heading}</p>
        ${empDetails}
        </br>
        <table>
            <tbody>
              ${tableHead}
              ${tableData}
            </tbody>
        </table>
        <br>
        <table>
            <tbody>
              <tr>
                <td style="text-align:left;">Employee Sign:</td>
                <td style="text-align:left;">Reposting Manager Sign:</td>
                <td style="text-align:left;">H.O. Sign</td>
              </tr>
            </tbody>
        </table>
        <p style="font-size:10px;">${note}</p>

        </div>
      </body>
    </html>
  `;

  console.log(htmlContent);
  
  // Set the HTML content and generate the PDF
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf(
                      {
                        landscape: true,
                        format: 'A4', // You can customize the page format if needed
                      }
                      );
  
  // Close the browser
  await browser.close();
  
  
  // Set the response headers for downloading the PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename='+userId+'.pdf');
  
  // Send the PDF as the response
  res.send(pdfBuffer);
  
};


