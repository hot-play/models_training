const express = require("express");
const axios = require("axios");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("index");
});

// axios
//     .get("http://localhost:8080/api/v1/person/")
//     .then((response) => {
//         console.log(response);
//     })
//     .catch((error) => {
//         console.log(error);
//     });

app.listen(3000, () => {
    console.log("Listening оn port 3000");
});
