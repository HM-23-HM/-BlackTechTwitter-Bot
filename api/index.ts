require("dotenv").config();
const app = require("express")();

app.get("/api", (req, res) => {
    res.json({
      message: "You got me"
    })
})

module.exports = app;


