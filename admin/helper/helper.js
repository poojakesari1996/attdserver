var moment = require('moment');

exports.dateTime = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}
exports.date = () => {
  return moment().format("YYYY-MM-DD");
}

exports.dateFormat = (date) => {
  return moment(date).format( 'YYYY-MM-DD');
}


exports.checkDataRow = (err, result) => {
  if (err) {
    return {
      error: true,
      message: err.message || "Some error occurred while query run."
    }
  } else if (result) {
    if (result.length > 0) {
      return {
        error: false,
        data: result[0]
      }
    } else {
      return {
        error: true,
        message: 'Data not found.'
      }
    }
  } else {
    return {
      error: true,
      message: 'Data not found.'
    }

  }

}

exports.checkDataRows = (err, result) => {
  try {
    if (err) {
      return {
        error: true,
        message: err.message || "Some error occurred while query run."
      }
    } else if (result) {
      if (result.length > 0) {
        return {
          error: false,
          data: result
        }
      } else {
        return {
          error: true,
          message: 'Data not found.'
        }
      }
    } else {
      return {
        error: true,
        message: 'Data not found.'
      }

    }

  } catch {
    return {
      error: true,
      message: err.message || "Some error occurred while query run."
    }
  }

}



/*
*@Author:           <Ramesh Kumar>
*@Created On:       <03-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Function For Pagination>
*/


exports.pagination = (total, page, perPage) => {
  page = parseInt(page);
  var last_page = Math.ceil(total / perPage);

  //console.log(last_page, total, page, perPage)
  var link = [];
  if (last_page > 1 && page > 1) {
    link.push({
      url: page > 1 ? "/?page=" + (page - 1) : null,
      label: "&laquo; Previous",
      active: false,
      page: page - 1
    },
    )
  }

  for (let i = 1; i <= last_page; i++) {
    link.push({
      url: '/?page=' + i,
      label: String(i),
      active: page == i ? true : false,
      page: i
    })
  }

  if (last_page > 1 && last_page > page) {
    link.push(
      {
        url: "/?page=" + page + 1,
        label: "Next &raquo;",
        active: false,
        page: page + 1
      })
  }
  payload = {
    pagination: {
      page: page,
      first_page_url: '/?page=1',
      from: (perPage * (page - 1) + 1),
      last_page: last_page,
      links: link,
      next_page_url: "/?page=" + (page + 1),
      items_per_page: perPage,
      prev_page_url: page > 1 ? "/?page=" + (page - 1) : null,
      to: (perPage * (page - 1)) + 1,
      total: total
    }
  }
  return payload;
}




/*
*@Author:           <Ramesh Kumar>
*@Created On:       <30-12-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Used to to generate random string>
*/

exports.generateRandomString = (myLength) => {
  const chars =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from(
    { length: myLength },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );

  const randomString = randomArray.join("");
  return randomString;
};


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <03-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Function For update Columns>
*/


exports.updateQuery = (id, data, table) => {
  var query = '';
  for (const [key, value] of Object.entries(data)) {
    query += `${key} = '${value}', `
  }
  updateFields = query.slice(0, -2);

  return `update ${table} SET ${updateFields} where ${id.key}='${id.value}'`;
}


/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Insert Query>
*/


exports.insertQuery = (data, table) => {

  var keys = '';
  var values = '';
  for (const [key, value] of Object.entries(data)) {
    if (key) {
      keys += `${key}, `;
    } else {
      continue;
    }
    values += ` '${value ? value : (value == 0) ? 0 : ""}', `
  }
  keys = keys.slice(0, -2);
  values = values.slice(0, -2);

  return `INSERT INTO ${table} (${keys}) VALUES (${values})`;
}

exports.bulkInsertQuery = (data, table) => {

  var keys = '';
  var sqlData = '';
  for (let i = 0; i <= data.length; i++) {
    var values = '';
    if (keys == '') {
      for (const [key, value] of Object.entries(data[i])) {
        if (key) {
          keys += `${key}, `;
        } else {
          continue;
        }
      }
      keys = keys.slice(0, -2);
    } else {
      for (const [key, value] of Object.entries(data[i])) {
        if (key) {
          //keys += `${key}, `;
        } else {
          continue;
        }
        values += ` '${value ? value : (value == 0) ? 0 : ""}', `
      }
      values = values.slice(0, -2);
      sqlData += `(${values}),`
    }
  }
  sqlData = sqlData.slice(0, -1);

  return `INSERT INTO ${table} (${keys}) VALUES ${sqlData}`;
}






/*
*@Author:           <Ramesh Kumar>
*@Created On:       <10-01-2022>
*@Last Modified By: <>
*@Last Modified:    <>
*@Description:      <Insert Query>
*/


exports.insertFunction = (data) => {

  var keys = '';
  var values = '';
  for (const [key, value] of Object.entries(data)) {
    if (key) {
      keys += `${key}, `;
    } else {
      continue;
    }
    values += ` '${value ? value : ""}', `
  }
  keys = keys.slice(0, -2);
  values = values.slice(0, -2);

  return { keys: keys, values: values };
}


