require("dotenv").config();
const app = require("express")();
// const port = process.env.PORT;

import MainService from "../services/MainService";

app.get("/api", (req, res) => {
    res.json({
      message: "You got me"
    })
    // MainService.run();
})

// app.listen(port, () => {
//   console.log("Server is ready to go")
// })



