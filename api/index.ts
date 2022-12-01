require("dotenv").config();
const app = require("express")();
import MainService from "../services/MainService";

app.get("/api", (req, res) => {
    MainService.run();

    res.json({
      message: "You got me"
    })
})

module.exports = app;


