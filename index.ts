require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

import MainService from "./services/MainService";

app.get("/", (req, res) => {
    MainService.run();
})

app.listen(port, () => {
  console.log("Server is ready to go")
})


