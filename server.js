/*
server.js
Initiates MySQL connection and starts backend services.
*/

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const controller = require("./controller");
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require("./routes");
routes(app); // Initiates MySQL connection and defines routes for Express

// Start the backend server
app.listen(port, function() {
    const today = new Date();
    let date = `${today.getFullYear()}/${today.getMonth()}/${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    console.log(`Project Antimony with Node.JS for Backend Services [Version ${process.env.npm_package_version}]`);
    console.log("(c) 2019 Phillmont Muktar. All rights reserved.\n");
    console.log("If app version above is undefined, please start app with 'npm start'.\n");
    console.log(`Bello! Server is now starting and listening on port ${port}...`);
    console.log(`Server is started on server time ${date}`);
    console.log("Smoking is found to double the risk of all-cause and cardiovascular diseases-related mortality.");
    console.log("Any error messages will be printed below.---------------------------------")
});