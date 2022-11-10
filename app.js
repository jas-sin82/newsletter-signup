const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config();

//get request
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Signup.html");
});

// post request
app.post("/", (req, res) => {
  const FirstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(FirstName, lastName, email);
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: FirstName,
          LNAME: lastName,
        },
      },
    ],
  };

  //data saved in constant jasonData
  const jsonData = JSON.stringify(data);
  const list_id = process.env.LIST_ID;

  // mailchimp url
  const url = "https://us21.api.mailchimp.com/3.0/lists/" + list_id;

  const api_key = process.env.API_KEY;

  // options
  const option = {
    method: "POST",
    auth: "jas02:" + api_key,
  };

  // https request
  const request = https.request(url, option, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

// post request to failure route
app.post("/failure", (req, res) => {
  res.redirect("/");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on Port 3000");
});
