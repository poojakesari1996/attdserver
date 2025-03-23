const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:8091"
// };

// app.use(cors(corsOptions));

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.json()); 


app.use(express.urlencoded({ extended: true })); 








app.get("/", (req, res) => {
  res.json({ message: "Welcome to Romsons World." });
});


require("./admin/routes/admin.index.js")(app);
require("./app/routes/app.index.js")(app);

const PORT = process.env.PORT || 8091;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });


app.listen(8091, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:8091');
});